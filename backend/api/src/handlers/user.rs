use axum::{
    Json,
    extract::{Path, Query, State},
};
use serde::Deserialize;
use uuid::Uuid;

use crate::{
    dto::user::{
        ChangePasswordRequest, UpdateProfileRequest, UpdateUserRoleRequest, UserResponseDto,
    },
    entities::User,
    errors::AppError,
    extractors::{auth::AuthenticatedUser, role_guard::RoleGuard},
    services::user_service::UserService,
    state::AppState,
};

#[derive(Deserialize)]
pub struct UserQuery {
    pub role: Option<String>,
}

// ==========================================================
// GET /me
// ==========================================================
pub async fn me(
    AuthenticatedUser(user): AuthenticatedUser,
) -> Result<Json<UserResponseDto>, AppError> {
    Ok(Json(UserResponseDto {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        is_verified: user.is_verified,
        created_at: user.created_at,
        updated_at: user.updated_at,
    }))
}

// ==========================================================
// PUT /me
// ==========================================================
pub async fn update_profile(
    State(state): State<AppState>,
    AuthenticatedUser(user): AuthenticatedUser,
    Json(payload): Json<UpdateProfileRequest>,
) -> Result<Json<UserResponseDto>, AppError> {
    let updated = UserService::update_profile(&state.db, user.id, payload).await?;

    Ok(Json(UserResponseDto {
        id: updated.id,
        first_name: updated.first_name,
        last_name: updated.last_name,
        email: updated.email,
        role: updated.role,
        is_active: updated.is_active,
        is_verified: updated.is_verified,
        created_at: updated.created_at,
        updated_at: updated.updated_at,
    }))
}

// ==========================================================
// PUT /me/password
// ==========================================================
pub async fn change_password(
    State(state): State<AppState>,
    AuthenticatedUser(user): AuthenticatedUser,
    Json(payload): Json<ChangePasswordRequest>,
) -> Result<Json<serde_json::Value>, AppError> {
    if let Err(err) = UserService::change_password(&state.db, user.id, payload).await {
        return Err(AppError::Unauthorized(err.to_string()));
    }

    Ok(Json(serde_json::json!({
        "message": "Password changed successfully."
    })))
}

// ==========================================================
// GET /users
// ==========================================================
pub async fn get_users(
    State(state): State<AppState>,
    Query(query): Query<UserQuery>,
    AuthenticatedUser(user): AuthenticatedUser,
) -> Result<Json<Vec<User>>, AppError> {
    RoleGuard::agent_or_admin(&user)
        .map_err(|_| AppError::Forbidden("Agent or Admin access required.".into()))?;

    let users = UserService::get_users(&state.db, query.role).await?;

    Ok(Json(users))
}

// ==========================================================
// PATCH /users/{id}/role
// ==========================================================
pub async fn update_role(
    Path(user_id): Path<Uuid>,
    State(state): State<AppState>,
    AuthenticatedUser(user): AuthenticatedUser,
    Json(payload): Json<UpdateUserRoleRequest>,
) -> Result<Json<User>, AppError> {
    RoleGuard::admin(&user).map_err(|_| AppError::Forbidden("Admin access required.".into()))?;

    let updated_user = UserService::update_role(&state.db, user_id, payload)
        .await
        .map_err(|e| AppError::BadRequest(e.to_string()))?;

    Ok(Json(updated_user))
}
