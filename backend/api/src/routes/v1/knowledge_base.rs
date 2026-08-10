use axum::{
    routing::{delete, get, post, put},
    Router,
};

use crate::{
    handlers::knowledge_base::{
        create,
        delete as delete_article,
        get_all,
        get_by_id,
        update,
    },
    state::AppState,
};

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/knowledge-base", get(get_all))
        .route("/knowledge-base", post(create))
        .route("/knowledge-base/{article_id}", get(get_by_id))
        .route("/knowledge-base/{article_id}", put(update))
        .route("/knowledge-base/{article_id}", delete(delete_article))
}