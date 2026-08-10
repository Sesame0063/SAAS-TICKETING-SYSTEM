use axum::{
    extract::FromRequestParts,
    http::{StatusCode, header::AUTHORIZATION, request::Parts},
};

use crate::{
    entities::User, repositories::user_repository::UserRepository, state::AppState, utils::jwt::Jwt,
};

pub struct AuthenticatedUser(pub User);

impl FromRequestParts<AppState> for AuthenticatedUser {
    type Rejection = StatusCode;

    fn from_request_parts(
        parts: &mut Parts,
        state: &AppState,
    ) -> impl std::future::Future<Output = Result<Self, Self::Rejection>> + Send {
        let state = state.clone();

        let authorization = parts
            .headers
            .get(AUTHORIZATION)
            .and_then(|v| v.to_str().ok())
            .map(str::to_string);

        async move {
            // ==========================================================
            // Authorization Header
            // ==========================================================

            let authorization = authorization.ok_or(StatusCode::UNAUTHORIZED)?;

            let token = authorization
                .strip_prefix("Bearer ")
                .ok_or(StatusCode::UNAUTHORIZED)?;

            // ==========================================================
            // Verify JWT
            // ==========================================================

            let claims = Jwt::verify(token, &state.settings.jwt.secret).map_err(|err| {
                tracing::warn!(
                    error = ?err,
                    "JWT verification failed"
                );

                StatusCode::UNAUTHORIZED
            })?;

            if !Jwt::is_access_token(&claims) {
                tracing::warn!("Refresh token used as access token");

                return Err(StatusCode::UNAUTHORIZED);
            }

            // ==========================================================
            // Parse User ID
            // ==========================================================

            let user_id = claims.user_id().map_err(|err| {
                tracing::warn!(
                    error = ?err,
                    "Invalid UUID inside JWT"
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

            tracing::debug!(
                user_id = %user.id,
                role = %user.role,
                "Authenticated user extracted"
            );

            Ok(AuthenticatedUser(user))
        }
    }
}
