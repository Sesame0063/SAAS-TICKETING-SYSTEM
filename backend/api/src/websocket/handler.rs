use axum::{
    extract::{
        Query, State,
        ws::{Message, WebSocket, WebSocketUpgrade},
    },
    http::{HeaderMap, StatusCode, header::AUTHORIZATION},
    response::{IntoResponse, Response},
};

use futures_util::{SinkExt, StreamExt};
use serde::Deserialize;
use tokio::sync::mpsc;
use tracing::{debug, error, info, warn};
use uuid::Uuid;

#[derive(Deserialize)]
pub struct WebSocketQuery {
    pub token: Option<String>,
}

use crate::{
    state::AppState,
    utils::jwt::Jwt,
    websocket::{ClientMessage, WsEvents, WsMessage},
};

pub async fn websocket_handler(
    ws: WebSocketUpgrade,
    headers: HeaderMap,
    Query(query): Query<WebSocketQuery>,
    State(state): State<AppState>,
) -> Response {
    // =====================================================
    // Authorization Header
    // =====================================================

    let token = if let Some(token) = query.token {
        token
    } else if let Some(auth) = headers.get(AUTHORIZATION).and_then(|v| v.to_str().ok()) {
        auth.strip_prefix("Bearer ").unwrap_or(auth).to_string()
    } else {
        return StatusCode::UNAUTHORIZED.into_response();
    };

    // =====================================================
    // Verify JWT
    // =====================================================

    let claims = match Jwt::verify(&token, &state.settings.jwt.secret) {
        Ok(claims) => claims,
        Err(err) => {
            warn!(
                error = ?err,
                "Invalid websocket JWT"
            );

            return StatusCode::UNAUTHORIZED.into_response();
        }
    };

    if !Jwt::is_access_token(&claims) {
        warn!("Non-access token used for websocket");

        return StatusCode::UNAUTHORIZED.into_response();
    }

    let user_id = match claims.user_id() {
        Ok(id) => id,
        Err(err) => {
            warn!(
                error = ?err,
                "Invalid websocket user id"
            );

            return StatusCode::UNAUTHORIZED.into_response();
        }
    };

    ws.on_upgrade(move |socket| handle_socket(socket, state, user_id))
}

async fn handle_socket(socket: WebSocket, state: AppState, user_id: Uuid) {
    let (mut sender, mut receiver) = socket.split();

    let (tx, mut rx) = mpsc::unbounded_channel::<WsMessage>();

    state.ws_manager.connect(user_id, tx).await;

    let connected_users = state.ws_manager.connected_users_count().await;

    info!(
        user_id = %user_id,
        connected_users = connected_users,
        "WebSocket connected"
    );

    // =====================================================
    // Outgoing Task
    // =====================================================

    let send_task = tokio::spawn(async move {
        while let Some(message) = rx.recv().await {
            match serde_json::to_string(&message) {
                Ok(text) => {
                    if sender.send(Message::Text(text.into())).await.is_err() {
                        warn!("WebSocket sender closed");
                        break;
                    }
                }

                Err(err) => {
                    error!(
                        error = ?err,
                        "Failed to serialize websocket message"
                    );
                }
            }
        }
    });

    // =====================================================
    // Incoming Messages
    // =====================================================

    while let Some(result) = receiver.next().await {
        match result {
            // =============================================
            // TEXT MESSAGE
            // =============================================
            Ok(Message::Text(text)) => {
                let client_message = match serde_json::from_str::<ClientMessage>(&text) {
                    Ok(message) => message,
                    Err(err) => {
                        warn!(
                            user_id = %user_id,
                            error = ?err,
                            "Invalid websocket payload"
                        );
                        continue;
                    }
                };

                match client_message {
                    // =====================================
                    // ROOM EVENTS
                    // =====================================
                    ClientMessage::JoinRoom { ticket_id } => {
                        state.ws_manager.join_room(ticket_id, user_id).await;

                        info!(
                            user_id = %user_id,
                            ticket_id = %ticket_id,
                            "Joined room"
                        );
                    }

                    ClientMessage::LeaveRoom { ticket_id } => {
                        state.ws_manager.leave_room(&ticket_id, &user_id).await;

                        info!(
                            user_id = %user_id,
                            ticket_id = %ticket_id,
                            "Left room"
                        );
                    }

                    // =====================================
                    // TICKET EVENTS
                    // =====================================
                    ClientMessage::TicketUpdated { ticket_id } => {
                        info!(
                            user_id = %user_id,
                            ticket_id = %ticket_id,
                            "Ticket updated"
                        );

                        state
                            .ws_manager
                            .broadcast_to_room(&ticket_id, WsEvents::ticket_updated(ticket_id))
                            .await;
                    }

                    ClientMessage::TicketStatusChanged { ticket_id, status } => {
                        info!(
                            user_id = %user_id,
                            ticket_id = %ticket_id,
                            status = %status,
                            "Ticket status changed"
                        );

                        state
                            .ws_manager
                            .broadcast_to_room(
                                &ticket_id,
                                WsEvents::ticket_status_updated(ticket_id, status),
                            )
                            .await;
                    }

                    // =====================================
                    // COMMENTS
                    // =====================================
                    ClientMessage::Comment { ticket_id, content } => {
                        state
                            .ws_manager
                            .broadcast_to_room(
                                &ticket_id,
                                WsEvents::comment_added(ticket_id, Uuid::new_v4(), content),
                            )
                            .await;
                    }

                    // =====================================
                    // TYPING
                    // =====================================
                    ClientMessage::Typing { ticket_id } => {
                        state
                            .ws_manager
                            .broadcast_to_room(&ticket_id, WsEvents::typing(ticket_id, user_id))
                            .await;
                    }

                    ClientMessage::StopTyping { ticket_id } => {
                        state
                            .ws_manager
                            .broadcast_to_room(
                                &ticket_id,
                                WsMessage {
                                    event: "typing.stop".into(),
                                    payload: serde_json::json!({
                                        "ticket_id": ticket_id,
                                        "user_id": user_id
                                    }),
                                },
                            )
                            .await;
                    }

                    // =====================================
                    // ATTACHMENTS
                    // =====================================
                    ClientMessage::AttachmentUploaded {
                        ticket_id,
                        attachment_id,
                    } => {
                        state
                            .ws_manager
                            .broadcast_to_room(
                                &ticket_id,
                                WsEvents::attachment_uploaded(
                                    ticket_id,
                                    attachment_id,
                                    "attachment".into(),
                                ),
                            )
                            .await;
                    }

                    // =====================================
                    // NOTIFICATIONS
                    // =====================================
                    ClientMessage::NotificationRead { notification_id } => {
                        state
                            .ws_manager
                            .send_to_user(
                                &user_id,
                                WsMessage {
                                    event: "notification.read".into(),
                                    payload: serde_json::json!({
                                        "notification_id": notification_id
                                    }),
                                },
                            )
                            .await;
                    }

                    // =====================================
                    // DASHBOARD
                    // =====================================
                    ClientMessage::RefreshDashboard => {
                        state
                            .ws_manager
                            .send_to_user(&user_id, WsEvents::dashboard_refresh())
                            .await;
                    }

                    // =====================================
                    // KNOWLEDGE BASE
                    // =====================================
                    ClientMessage::KnowledgeBaseUpdated { article_id } => {
                        state
                            .ws_manager
                            .broadcast(WsEvents::knowledge_base_updated(article_id))
                            .await;
                    }

                    // =====================================
                    // PING MESSAGE
                    // =====================================
                    ClientMessage::Ping => {
                        state
                            .ws_manager
                            .send_to_user(
                                &user_id,
                                WsMessage {
                                    event: "pong".into(),
                                    payload: serde_json::json!({
                                        "timestamp": chrono::Utc::now()
                                    }),
                                },
                            )
                            .await;
                    }
                }
            }
            // =============================================
            // WEBSOCKET PING FRAME
            // =============================================
            Ok(Message::Ping(_)) => {
                debug!(
                    user_id = %user_id,
                    "Ping frame received"
                );

                state
                    .ws_manager
                    .send_to_user(
                        &user_id,
                        WsMessage {
                            event: "pong".into(),
                            payload: serde_json::json!({
                                "message": "pong"
                            }),
                        },
                    )
                    .await;
            }

            // =============================================
            // WEBSOCKET PONG FRAME
            // =============================================
            Ok(Message::Pong(_)) => {
                debug!(
                    user_id = %user_id,
                    "Pong frame received"
                );
            }

            // =============================================
            // BINARY FRAME
            // =============================================
            Ok(Message::Binary(_)) => {
                debug!(
                    user_id = %user_id,
                    "Ignoring binary frame"
                );
            }

            // =============================================
            // CLOSE FRAME
            // =============================================
            Ok(Message::Close(frame)) => {
                info!(
                    user_id = %user_id,
                    frame = ?frame,
                    "WebSocket closed"
                );

                break;
            }

            // =============================================
            // RECEIVE ERROR
            // =============================================
            Err(err) => {
                warn!(
                    user_id = %user_id,
                    error = ?err,
                    "WebSocket receive error"
                );

                break;
            }
        }
    }

    // =====================================================
    // CLEANUP
    // =====================================================

    state.ws_manager.disconnect(&user_id).await;

    let connected_users = state.ws_manager.connected_users_count().await;

    info!(
        user_id = %user_id,
        connected_users = connected_users,
        "WebSocket disconnected"
    );

    send_task.abort();
}
