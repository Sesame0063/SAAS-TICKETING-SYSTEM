use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::entities::Notification;

#[derive(Debug, Deserialize)]
pub struct CreateNotificationRequest {
    pub title: String,
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct NotificationResponse {
    pub id: Uuid,

    pub user_id: Uuid,

    pub title: String,

    pub message: String,

    pub is_read: bool,

    pub created_at: DateTime<Utc>,

    pub updated_at: DateTime<Utc>,
}

impl From<Notification> for NotificationResponse {
    fn from(notification: Notification) -> Self {
        Self {
            id: notification.id,
            user_id: notification.user_id,
            title: notification.title,
            message: notification.message,
            is_read: notification.is_read,
            created_at: notification.created_at,
            updated_at: notification.updated_at,
        }
    }
}
