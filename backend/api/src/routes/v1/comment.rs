use axum::{
    routing::{delete, get, post, put},
    Router,
};

use crate::{
    handlers::comment,
    state::AppState,
};

pub fn routes() -> Router<AppState> {
    Router::new()
        .route(
            "/tickets/:ticket_id/comments",
            post(comment::create)
                .get(comment::list),
        )
        .route(
            "/comments/:comment_id",
            put(comment::update)
                .delete(comment::delete),
        )
}