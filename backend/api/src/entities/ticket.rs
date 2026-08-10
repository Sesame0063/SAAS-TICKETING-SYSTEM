use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Ticket {
    pub id: Uuid,

    pub title: String,

    pub description: String,

    pub status: String,

    pub priority: String,

    pub customer_id: Uuid,

    pub assigned_to: Option<Uuid>,

    pub created_at: DateTime<Utc>,

    pub updated_at: DateTime<Utc>,
}
