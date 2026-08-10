use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Deserialize)]
pub struct SearchQuery {
    pub q: String,
    pub search_type: Option<String>,
    pub page: Option<i64>,
    pub limit: Option<i64>,
}

#[derive(Debug, Serialize)]
pub struct SearchResponse {
    pub query: String,
    pub page: i64,
    pub limit: i64,
    pub total: usize,
    pub results: Vec<SearchResult>,
}

#[derive(Debug, Serialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum SearchResult {
    Ticket {
        id: Uuid,
        title: String,
        description: String,
        status: String,
    },
    User {
        id: Uuid,
        email: String,
        first_name: String,
        last_name: String,
    },
    KnowledgeBase {
        id: Uuid,
        title: String,
        content: String,
    },
}
