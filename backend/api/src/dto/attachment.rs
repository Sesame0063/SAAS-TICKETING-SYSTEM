use chrono::{DateTime, Utc};
use serde::Serialize;
use uuid::Uuid;

#[derive(Debug, Serialize)]
pub struct AttachmentResponse {
    pub id: Uuid,
    pub ticket_id: Uuid,
    pub uploaded_by: Uuid,
    pub original_filename: String,
    pub stored_filename: String,
    pub mime_type: String,
    pub file_size: i64,
    pub created_at: DateTime<Utc>,
}
