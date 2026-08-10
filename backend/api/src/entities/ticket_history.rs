use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct TicketHistory {
    pub id: Uuid,

    pub ticket_id: Uuid,

    pub changed_by: Uuid,

    pub field_name: String,

    pub old_value: Option<String>,

    pub new_value: Option<String>,

    pub created_at: DateTime<Utc>,
}
