use axum::{
    extract::{Request, State},
    http::StatusCode,
    middleware::Next,
    response::Response,
};

use crate::{entities::User, state::AppState, utils::roles};

pub async fn admin_only(
    State(_state): State<AppState>,
    request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let user = request
        .extensions()
        .get::<User>()
        .ok_or(StatusCode::UNAUTHORIZED)?;

    if user.role != roles::ADMIN {
        return Err(StatusCode::FORBIDDEN);
    }

    Ok(next.run(request).await)
}

pub async fn agent_only(
    State(_state): State<AppState>,
    request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let user = request
        .extensions()
        .get::<User>()
        .ok_or(StatusCode::UNAUTHORIZED)?;

    if user.role != roles::AGENT {
        return Err(StatusCode::FORBIDDEN);
    }

    Ok(next.run(request).await)
}

pub async fn customer_only(
    State(_state): State<AppState>,
    request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let user = request
        .extensions()
        .get::<User>()
        .ok_or(StatusCode::UNAUTHORIZED)?;

    if user.role != roles::CUSTOMER {
        return Err(StatusCode::FORBIDDEN);
    }

    Ok(next.run(request).await)
}

pub async fn agent_or_admin(
    State(_state): State<AppState>,
    request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let user = request
        .extensions()
        .get::<User>()
        .ok_or(StatusCode::UNAUTHORIZED)?;

    if user.role != roles::AGENT && user.role != roles::ADMIN {
        return Err(StatusCode::FORBIDDEN);
    }

    Ok(next.run(request).await)
}
