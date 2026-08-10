use axum::{Router, routing::get};

use crate::{handlers::search::search, state::AppState};

pub fn router() -> Router<AppState> {
    Router::new().route("/search", get(search))
}
