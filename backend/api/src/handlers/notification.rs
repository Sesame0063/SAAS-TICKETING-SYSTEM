use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use uuid::Uuid;

use crate::{
    dto::notification::NotificationResponse, errors::AppError, extractors::auth::AuthenticatedUser,
    services::notification::NotificationService, state::AppState,
};

pub async fn get_notifications(
    State(state): State<AppState>,
    AuthenticatedUser(user): AuthenticatedUser,
) -> Result<Json<Vec<NotificationResponse>>, AppError> {
    let notifications = NotificationService::get_user_notifications(&state.db, user.id)
        .await
        .map_err(|e| AppError::BadRequest(e.to_string()))?;

    Ok(Json(notifications.into_iter().map(Into::into).collect()))
}

pub async fn mark_notification_read(
    Path(notification_id): Path<Uuid>,
    State(state): State<AppState>,
    AuthenticatedUser(user): AuthenticatedUser,
) -> Result<Json<NotificationResponse>, AppError> {
    let notification = NotificationService::mark_as_read(&state.db, notification_id, user.id)
        .await
        .map_err(|e| AppError::NotFound(e.to_string()))?;

    Ok(Json(notification.into()))
}

pub async fn delete_notification(
    Path(notification_id): Path<Uuid>,
    State(state): State<AppState>,
    AuthenticatedUser(user): AuthenticatedUser,
) -> Result<StatusCode, AppError> {
    NotificationService::delete(&state.db, notification_id, user.id)
        .await
        .map_err(|e| AppError::NotFound(e.to_string()))?;

    Ok(StatusCode::NO_CONTENT)
}

pub async fn mark_all_notifications_read(
    State(state): State<AppState>,
    AuthenticatedUser(user): AuthenticatedUser,
) -> Result<StatusCode, AppError> {
    NotificationService::mark_all_notifications_read(&state.db, user.id)
        .await
        .map_err(|e| AppError::BadRequest(e.to_string()))?;

    Ok(StatusCode::OK)
}
