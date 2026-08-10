use axum::{
    Json,
    extract::{Path, State},
};

use uuid::Uuid;

use crate::{
    dto::audit::AuditLogResponse, errors::AppError, services::audit::AuditService, state::AppState,
};

pub async fn get_all_logs(
    State(state): State<AppState>,
) -> Result<Json<Vec<AuditLogResponse>>, AppError> {
    let logs = AuditService::get_all(&state.db)
        .await
        .map_err(|e| AppError::BadRequest(e.to_string()))?;

    Ok(Json(logs))
}

pub async fn get_user_logs(
    Path(user_id): Path<Uuid>,
    State(state): State<AppState>,
) -> Result<Json<Vec<AuditLogResponse>>, AppError> {
    let logs = AuditService::get_user_logs(&state.db, user_id)
        .await
        .map_err(|e| AppError::BadRequest(e.to_string()))?;

    Ok(Json(logs))
}
