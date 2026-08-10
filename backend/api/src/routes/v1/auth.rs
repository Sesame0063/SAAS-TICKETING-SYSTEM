use axum::{
    routing::post,
    Router,
};

use crate::{
    handlers::auth,
    state::AppState,
};

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/register", post(auth::register))
        .route("/login", post(auth::login))
        .route("/refresh", post(auth::refresh_token))
        .route("/verify-email", post(auth::verify_email))
        .route("/forgot-password", post(auth::forgot_password))
        .route("/reset-password", post(auth::reset_password))
        .route("/logout", post(auth::logout))
}