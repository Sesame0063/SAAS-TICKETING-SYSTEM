use axum::{
    Json,
    extract::{Path, State},
};

use uuid::Uuid;

use crate::{
    dto::user::UpdateUserRoleRequest,
    entities::User,
    errors::AppError,
    extractors::{auth::AuthenticatedUser, role_guard::RoleGuard},
    services::user_service::UserService,
    state::AppState,
};

pub async fn me(AuthenticatedUser(user): AuthenticatedUser) -> Result<Json<User>, AppError> {
    Ok(Json(user))
}

pub async fn update_role(
    Path(user_id): Path<Uuid>,
    State(state): State<AppState>,
    AuthenticatedUser(user): AuthenticatedUser,
    Json(payload): Json<UpdateUserRoleRequest>,
) -> Result<Json<User>, AppError> {
    // Only admins may update roles
    RoleGuard::admin(&user)
        .map_err(|_| AppError::Forbidden("Admin access required.".to_string()))?;

    let updated_user = UserService::update_role(&state.db, user_id, payload)
        .await
        .map_err(|e| AppError::BadRequest(e.to_string()))?;

    Ok(Json(updated_user))
}
