use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct User {
    pub id: Uuid,

    pub first_name: String,
    pub last_name: String,

    pub email: String,

    pub password_hash: String,

    pub role: String,

    pub is_active: bool,
    pub is_verified: bool,

    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
