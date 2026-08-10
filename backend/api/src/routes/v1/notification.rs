use axum::{
    routing::{delete, get, patch},
    Router,
};

use crate::{
    handlers::notification::{
        delete_notification,
        get_notifications,
        mark_notification_read,
    },
    state::AppState,
};

pub fn routes() -> Router<AppState> {
    Router::new()
        .route(
            "/notifications",
            get(get_notifications),
        )
        .route(
            "/notifications/{notification_id}/read",
            patch(mark_notification_read),
        )
        .route(
            "/notifications/{notification_id}",
            delete(delete_notification),
        )
}