use anyhow::Error as AnyhowError;
use argon2::password_hash::Error as PasswordHashError;
use axum::{
    Json,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use jsonwebtoken::errors::Error as JwtError;
use serde::Serialize;
use sqlx::Error as SqlxError;

#[derive(Debug)]
pub enum AppError {
    BadRequest(String),
    Unauthorized(String),
    Forbidden(String),
    NotFound(String),
    Conflict(String),
    InternalServerError(String),
}

#[derive(Serialize)]
struct ErrorResponse {
    success: bool,
    error: String,
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            AppError::BadRequest(msg) => (StatusCode::BAD_REQUEST, msg),
            AppError::Unauthorized(msg) => (StatusCode::UNAUTHORIZED, msg),
            AppError::Forbidden(msg) => (StatusCode::FORBIDDEN, msg),
            AppError::NotFound(msg) => (StatusCode::NOT_FOUND, msg),
            AppError::Conflict(msg) => (StatusCode::CONFLICT, msg),
            AppError::InternalServerError(msg) => (StatusCode::INTERNAL_SERVER_ERROR, msg),
        };

        (
            status,
            Json(ErrorResponse {
                success: false,
                error: message,
            }),
        )
            .into_response()
    }
}

impl From<SqlxError> for AppError {
    fn from(error: SqlxError) -> Self {
        AppError::InternalServerError(error.to_string())
    }
}

impl From<AnyhowError> for AppError {
    fn from(error: AnyhowError) -> Self {
        AppError::InternalServerError(error.to_string())
    }
}

impl From<JwtError> for AppError {
    fn from(error: JwtError) -> Self {
        AppError::Unauthorized(error.to_string())
    }
}

impl From<PasswordHashError> for AppError {
    fn from(error: PasswordHashError) -> Self {
        AppError::InternalServerError(error.to_string())
    }
}
