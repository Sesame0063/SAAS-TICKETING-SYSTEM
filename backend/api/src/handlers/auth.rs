use axum::{
    Json,
    extract::{Extension, State},
};

use crate::{
    dto::auth::{
        AuthResponse, ForgotPasswordRequest, LoginRequest, MessageResponse, RefreshTokenRequest,
        RegisterRequest, ResetPasswordRequest, VerifyEmailRequest,
    },
    entities::User,
    errors::AppError,
    services::auth::AuthService,
    state::AppState,
};

pub async fn register(
    State(state): State<AppState>,
    Json(payload): Json<RegisterRequest>,
) -> Result<Json<AuthResponse>, AppError> {
    let response = AuthService::register(
        &state.db,
        &state.redis,
        &state.settings,
        payload,
        &state.settings.jwt.secret,
        state.settings.jwt.access_token_expiry,
        state.settings.jwt.refresh_token_expiry,
    )
    .await
    .map_err(|e| AppError::BadRequest(e.to_string()))?;

    Ok(Json(response))
}

pub async fn login(
    State(state): State<AppState>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<AuthResponse>, AppError> {
    let response = AuthService::login(
        &state.db,
        &state.redis,
        payload,
        &state.settings.jwt.secret,
        state.settings.jwt.access_token_expiry,
        state.settings.jwt.refresh_token_expiry,
    )
    .await
    .map_err(|e| AppError::Unauthorized(e.to_string()))?;

    Ok(Json(response))
}

pub async fn refresh_token(
    State(state): State<AppState>,
    Json(payload): Json<RefreshTokenRequest>,
) -> Result<Json<AuthResponse>, AppError> {
    let response = AuthService::refresh_token(
        &state.redis,
        &payload.refresh_token,
        &state.settings.jwt.secret,
        state.settings.jwt.access_token_expiry,
        state.settings.jwt.refresh_token_expiry,
    )
    .await
    .map_err(|e| AppError::Unauthorized(e.to_string()))?;

    Ok(Json(response))
}

pub async fn verify_email(
    State(state): State<AppState>,
    Json(payload): Json<VerifyEmailRequest>,
) -> Result<Json<MessageResponse>, AppError> {
    AuthService::verify_email(&state.db, &payload.token, &state.settings.jwt.secret)
        .await
        .map_err(|e| AppError::BadRequest(e.to_string()))?;

    Ok(Json(MessageResponse {
        message: "Email verified successfully.".into(),
    }))
}

pub async fn forgot_password(
    State(state): State<AppState>,
    Json(payload): Json<ForgotPasswordRequest>,
) -> Result<Json<MessageResponse>, AppError> {
    AuthService::forgot_password(
        &state.db,
        &state.settings,
        payload.email,
        &state.settings.jwt.secret,
    )
    .await
    .map_err(|e| AppError::BadRequest(e.to_string()))?;

    Ok(Json(MessageResponse {
        message: "If the email exists, a reset link has been sent.".into(),
    }))
}

pub async fn reset_password(
    State(state): State<AppState>,
    Json(payload): Json<ResetPasswordRequest>,
) -> Result<Json<MessageResponse>, AppError> {
    AuthService::reset_password(
        &state.db,
        &payload.token,
        payload.new_password,
        &state.settings.jwt.secret,
    )
    .await
    .map_err(|e| AppError::BadRequest(e.to_string()))?;

    Ok(Json(MessageResponse {
        message: "Password reset successfully.".into(),
    }))
}

pub async fn logout(
    State(state): State<AppState>,
    Extension(user): Extension<User>,
) -> Result<Json<MessageResponse>, AppError> {
    AuthService::logout(&state.db, &state.redis, &user)
        .await
        .map_err(|e| AppError::BadRequest(e.to_string()))?;

    Ok(Json(MessageResponse {
        message: "Logged out successfully.".into(),
    }))
}
