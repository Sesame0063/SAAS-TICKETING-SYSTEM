use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Attachment {
    pub id: Uuid,
    pub ticket_id: Uuid,
    pub uploaded_by: Uuid,
    pub original_filename: String,
    pub stored_filename: String,
    pub mime_type: String,
    pub file_size: i64,
    pub file_path: String,
    pub created_at: DateTime<Utc>,
}
