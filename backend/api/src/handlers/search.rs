use axum::{
    Json,
    extract::{Query, State},
};

use crate::{dto::search::SearchQuery, services::search::SearchService, state::AppState};

pub async fn search(
    State(state): State<AppState>,
    Query(query): Query<SearchQuery>,
) -> Json<serde_json::Value> {
    match SearchService::search(&state.db, query).await {
        Ok(result) => Json(serde_json::json!(result)),
        Err(err) => Json(serde_json::json!({
            "success": false,
            "error": err.to_string()
        })),
    }
}
