use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};

use uuid::Uuid;

use crate::{
    dto::comment::{CommentResponse, CreateCommentRequest, UpdateCommentRequest},
    errors::AppError,
    extractors::auth::AuthenticatedUser,
    services::comment::CommentService,
    state::AppState,
};

pub async fn create_comment(
    Path(ticket_id): Path<Uuid>,
    State(state): State<AppState>,
    AuthenticatedUser(user): AuthenticatedUser,
    Json(payload): Json<CreateCommentRequest>,
) -> Result<Json<CommentResponse>, AppError> {
    let comment = CommentService::create(&state.db, &state.ws_manager, ticket_id, user.id, payload)
        .await
        .map_err(|e| AppError::BadRequest(e.to_string()))?;

    Ok(Json(comment))
}

pub async fn get_comments(
    Path(ticket_id): Path<Uuid>,
    State(state): State<AppState>,
) -> Result<Json<Vec<CommentResponse>>, AppError> {
    let comments = CommentService::get_ticket_comments(&state.db, ticket_id)
        .await
        .map_err(|e| AppError::BadRequest(e.to_string()))?;

    Ok(Json(comments))
}

pub async fn update_comment(
    Path(comment_id): Path<Uuid>,
    State(state): State<AppState>,
    AuthenticatedUser(user): AuthenticatedUser,
    Json(payload): Json<UpdateCommentRequest>,
) -> Result<Json<CommentResponse>, AppError> {
    let comment =
        CommentService::update(&state.db, &state.ws_manager, comment_id, user.id, payload)
            .await
            .map_err(|e| AppError::BadRequest(e.to_string()))?;

    Ok(Json(comment))
}

pub async fn delete_comment(
    Path(comment_id): Path<Uuid>,
    State(state): State<AppState>,
    AuthenticatedUser(user): AuthenticatedUser,
) -> Result<StatusCode, AppError> {
    CommentService::delete(&state.db, &state.ws_manager, comment_id, user.id)
        .await
        .map_err(|e| AppError::NotFound(e.to_string()))?;

    Ok(StatusCode::NO_CONTENT)
}
