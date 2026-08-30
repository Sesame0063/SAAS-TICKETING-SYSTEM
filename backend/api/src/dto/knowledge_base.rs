use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Deserialize)]
pub struct CreateKnowledgeBaseRequest {
    pub title: String,
    pub category: String,
    pub content: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateKnowledgeBaseRequest {
    pub title: String,
    pub category: String,
    pub content: String,
}

#[derive(Debug, Serialize)]
pub struct KnowledgeBaseResponse {
    pub id: Uuid,
    pub title: String,
    pub category: String,
    pub content: String,
    pub created_by: Uuid,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
}
