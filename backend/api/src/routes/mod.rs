use axum::{
    Router, middleware,
    routing::{delete, get, patch, post, put},
};

use crate::{
    handlers::{
        attachment::{delete_attachment, download_attachment, get_attachments, upload_attachment},
        audit::{get_all_logs, get_user_logs},
        auth::{
            forgot_password, login, logout, refresh_token, register, reset_password, verify_email,
        },
        comment::{create_comment, delete_comment, get_comments, update_comment},
        dashboard::dashboard_summary,
        health::health,
        knowledge_base::{
            create as create_article, delete as delete_article, get_all as get_all_articles,
            get_by_id as get_article, update as update_article,
        },
        notification::{
            delete_notification, get_notifications, mark_all_notifications_read,
            mark_notification_read,
        },
        report::{agent_report, customer_report, dashboard_report, export_csv, export_pdf},
        ticket::{
            assign_ticket, create_ticket, delete_ticket, get_all_tickets, get_my_tickets,
            get_ticket, search_my_tickets, update_ticket, update_ticket_status,
        },
        ticket_history::get_ticket_history,
        user::{change_password, get_users, me, update_profile, update_role},
    },
    middleware::{
        auth::auth,
        compression::compression_layer,
        cors::cors_layer,
        logging::logging_middleware,
        rate_limit::body_limit_layer,
        request_id::request_id_layers,
        role::{admin_only, agent_or_admin},
        security_headers::security_headers,
        timeout::timeout_layer,
    },
    state::AppState,
    websocket::handler::websocket_handler,
};

pub fn create_router(state: AppState) -> Router {
    // ==========================================================
    // CUSTOMER / AUTHENTICATED ROUTES
    // ==========================================================

    let protected = Router::new()
        .route("/me", get(me).put(update_profile))
        .route("/me/password", put(change_password))
        .route("/tickets", post(create_ticket))
        .route("/tickets", get(get_my_tickets))
        .route("/tickets/search", get(search_my_tickets))
        .route("/tickets/{ticket_id}", get(get_ticket))
        .route("/tickets/{ticket_id}", put(update_ticket))
        .route("/tickets/{ticket_id}", delete(delete_ticket))
        .route("/tickets/{ticket_id}/history", get(get_ticket_history))
        .route("/tickets/{ticket_id}/comments", post(create_comment))
        .route("/tickets/{ticket_id}/comments", get(get_comments))
        .route("/comments/{comment_id}", put(update_comment))
        .route("/comments/{comment_id}", delete(delete_comment))
        .route("/tickets/{ticket_id}/attachments", post(upload_attachment))
        .route("/tickets/{ticket_id}/attachments", get(get_attachments))
        .route("/attachments/{attachment_id}", delete(delete_attachment))
        .route(
            "/attachments/{attachment_id}/download",
            get(download_attachment),
        )
        .route("/notifications", get(get_notifications))
        .route(
            "/notifications/read-all",
            patch(mark_all_notifications_read),
        )
        .route(
            "/notifications/{notification_id}/read",
            patch(mark_notification_read),
        )
        .route(
            "/notifications/{notification_id}",
            delete(delete_notification),
        )
        .route("/logout", post(logout))
        .route_layer(middleware::from_fn_with_state(state.clone(), auth));

    // ==========================================================
    // WEBSOCKET ROUTES
    // ==========================================================

    let websocket_routes = Router::new().route("/ws", get(websocket_handler));

    // ==========================================================
    // AGENT + ADMIN ROUTES
    // ==========================================================

    let agent_routes = Router::new()
        .route("/admin/tickets", get(get_all_tickets))
        .route("/tickets/{ticket_id}/assign", patch(assign_ticket))
        .route("/tickets/{ticket_id}/status", patch(update_ticket_status))
        .route("/knowledge-base", post(create_article))
        .route("/knowledge-base/{article_id}", put(update_article))
        .route("/knowledge-base/{article_id}", delete(delete_article))
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            agent_or_admin,
        ))
        .route_layer(middleware::from_fn_with_state(state.clone(), auth));

    // ==========================================================
    // ADMIN ONLY ROUTES
    // ==========================================================

    let report_routes = Router::new()
        .route("/users", get(get_users))
        .route("/dashboard/summary", get(dashboard_summary))
        .route("/reports/dashboard", get(dashboard_report))
        .route("/reports/agents", get(agent_report))
        .route("/reports/customers", get(customer_report))
        .route("/reports/export/csv", get(export_csv))
        .route("/reports/export/pdf", get(export_pdf))
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            agent_or_admin,
        ))
        .route_layer(middleware::from_fn_with_state(state.clone(), auth));

    let admin_routes = Router::new()
        .route("/audit", get(get_all_logs))
        .route("/audit/{user_id}", get(get_user_logs))
        .route("/users/{user_id}/role", patch(update_role))
        .route_layer(middleware::from_fn_with_state(state.clone(), admin_only))
        .route_layer(middleware::from_fn_with_state(state.clone(), auth));

    // ==========================================================
    // PUBLIC ROUTES
    // ==========================================================

    let public = Router::new()
        .route("/health", get(health))
        .route("/register", post(register))
        .route("/login", post(login))
        .route("/auth/refresh", post(refresh_token))
        .route("/verify-email", post(verify_email))
        .route("/forgot-password", post(forgot_password))
        .route("/reset-password", post(reset_password))
        .route("/knowledge-base", get(get_all_articles))
        .route("/knowledge-base/{article_id}", get(get_article));

    let (set_request_id, propagate_request_id) = request_id_layers();

    Router::new()
        .nest(
            "/api/v1",
            public
                .merge(websocket_routes)
                .merge(protected)
                .merge(agent_routes)
                .merge(report_routes)
                .merge(admin_routes)
                .merge(search::router()),
        )
        .with_state(state)
        .layer(middleware::from_fn(logging_middleware))
        .layer(set_request_id)
        .layer(propagate_request_id)
        .layer(cors_layer())
        .layer(security_headers())
        .layer(body_limit_layer())
        .layer(timeout_layer())
        .layer(compression_layer())
}

pub mod search;
