use chrono::{DateTime, Utc};
use serde::Serialize;
use uuid::Uuid;

#[derive(Debug, Serialize)]
pub struct AuditLogResponse {
    pub id: Uuid,
    pub user_id: Uuid,
    pub action: String,
    pub entity: String,
    pub entity_id: Uuid,
    pub description: String,
    pub created_at: DateTime<Utc>,
}
