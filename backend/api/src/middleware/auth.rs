use axum::{
    body::Body,
    extract::State,
    http::{Request, StatusCode, header::AUTHORIZATION},
    middleware::Next,
    response::Response,
};

use crate::{
    repositories::user_repository::UserRepository, services::redis::RedisService, state::AppState,
    utils::jwt::Jwt,
};

pub async fn auth(
    State(state): State<AppState>,
    mut request: Request<Body>,
    next: Next,
) -> Result<Response, StatusCode> {
    // ==========================================================
    // Authorization Header
    // ==========================================================

    let auth_header = request
        .headers()
        .get(AUTHORIZATION)
        .and_then(|value| value.to_str().ok())
        .ok_or(StatusCode::UNAUTHORIZED)?;

    let token = auth_header
        .strip_prefix("Bearer ")
        .ok_or(StatusCode::UNAUTHORIZED)?;

    // ==========================================================
    // Verify JWT
    // ==========================================================

    let claims = Jwt::verify(token, &state.settings.jwt.secret).map_err(|err| {
        tracing::warn!(
            error = ?err,
            "Invalid JWT"
        );

        StatusCode::UNAUTHORIZED
    })?;

    if !Jwt::is_access_token(&claims) {
        tracing::warn!("Refresh token used as access token");

        return Err(StatusCode::UNAUTHORIZED);
    }

    // ==========================================================
    // Redis Blacklist
    // ==========================================================

    let blacklisted = RedisService::is_blacklisted(&state.redis, token)
        .await
        .map_err(|err| {
            tracing::error!(
                error = ?err,
                "Redis blacklist lookup failed"
            );

            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    if blacklisted {
        tracing::warn!("Blacklisted token attempted authentication");

        return Err(StatusCode::UNAUTHORIZED);
    }

    // ==========================================================
    // User ID
    // ==========================================================

    let user_id = claims.user_id().map_err(|err| {
        tracing::warn!(
            error = ?err,
            "Invalid user id inside JWT"
        );

        StatusCode::UNAUTHORIZED
    })?;

    // ==========================================================
    // Load User
    // ==========================================================

    let user = UserRepository::find_by_id(&state.db, user_id)
        .await
        .map_err(|err| {
            tracing::error!(
                error = ?err,
                "Database error while loading authenticated user"
            );

            StatusCode::INTERNAL_SERVER_ERROR
        })?
        .ok_or(StatusCode::UNAUTHORIZED)?;

    // ==========================================================
    // Ensure Active
    // ==========================================================

    if !user.is_active {
        tracing::warn!(
            user_id = %user.id,
            "Inactive account attempted authentication"
        );

        return Err(StatusCode::FORBIDDEN);
    }

    // ==========================================================
    // Store Authenticated User
    // ==========================================================

    request.extensions_mut().insert(user.clone());
    request.extensions_mut().insert(user.id);
    request.extensions_mut().insert(user.role.clone());

    tracing::debug!(
        user_id = %user.id,
        role = %user.role,
        "Authenticated request"
    );

    Ok(next.run(request).await)
}
