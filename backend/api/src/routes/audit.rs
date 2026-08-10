use axum::{
    routing::get,
    Router,
};

use crate::{
    handlers::audit::{
        get_all_logs,
        get_user_logs,
    },
    state::AppState,
};

pub fn routes() -> Router<AppState> {

    Router::new()
        .route("/audit", get(get_all_logs))
        .route("/audit/{user_id}", get(get_user_logs))
}