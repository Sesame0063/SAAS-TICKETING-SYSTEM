use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize)]
pub struct TicketHistoryResponse {
    pub id: Uuid,
    pub ticket_id: Uuid,
    pub changed_by: Uuid,
    pub field_name: String,
    pub old_value: Option<String>,
    pub new_value: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateHistoryRequest {
    pub ticket_id: Uuid,
    pub changed_by: Uuid,
    pub field_name: String,
    pub old_value: Option<String>,
    pub new_value: Option<String>,
}
