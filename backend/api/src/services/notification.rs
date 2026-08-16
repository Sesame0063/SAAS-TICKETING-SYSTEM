use anyhow::{Result, anyhow};
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    entities::Notification,
    repositories::notification_repository::NotificationRepository,
    websocket::{ConnectionManager, WsMessage},
};

pub struct NotificationService;

impl NotificationService {
    pub async fn create(
        pool: &PgPool,
        user_id: Uuid,
        title: String,
        message: String,
    ) -> Result<Notification> {
        tracing::info!(
            user_id = %user_id,
            title = %title,
            "Creating notification"
        );

        let notification = NotificationRepository::create(pool, user_id, title, message).await?;

        tracing::info!(
            notification_id = %notification.id,
            user_id = %user_id,
            "Notification created successfully"
        );

        Ok(notification)
    }

    pub async fn create_and_notify(
        pool: &PgPool,
        ws: &ConnectionManager,
        user_id: Uuid,
        title: String,
        message: String,
    ) -> Result<Notification> {
        tracing::info!(
            user_id = %user_id,
            title = %title,
            "Creating realtime notification"
        );

        let notification =
            NotificationRepository::create(pool, user_id, title.clone(), message.clone()).await?;

        ws.send_to_user(
            &user_id,
            WsMessage {
                event: "notification.created".to_string(),
                payload: serde_json::json!({
                    "id": notification.id,
                    "user_id": notification.user_id,
                    "title": title,
                    "message": message,
                    "is_read": notification.is_read,
                    "created_at": notification.created_at,
                }),
            },
        )
        .await;

        tracing::info!(
            notification_id = %notification.id,
            user_id = %user_id,
            "Realtime notification sent successfully"
        );

        Ok(notification)
    }

    pub async fn get_user_notifications(pool: &PgPool, user_id: Uuid) -> Result<Vec<Notification>> {
        tracing::info!(
            user_id = %user_id,
            "Fetching notifications"
        );

        let notifications = NotificationRepository::find_by_user(pool, user_id).await?;

        tracing::info!(
            user_id = %user_id,
            total = notifications.len(),
            "Notifications fetched successfully"
        );

        Ok(notifications)
    }

    pub async fn mark_as_read(
        pool: &PgPool,
        notification_id: Uuid,
        user_id: Uuid,
    ) -> Result<Notification> {
        tracing::info!(
            notification_id = %notification_id,
            user_id = %user_id,
            "Marking notification as read"
        );

        let notification = NotificationRepository::mark_as_read(pool, notification_id, user_id)
            .await?
            .ok_or_else(|| anyhow!("Notification not found"))?;

        tracing::info!(
            notification_id = %notification.id,
            user_id = %user_id,
            "Notification marked as read"
        );

        Ok(notification)
    }

    pub async fn delete(pool: &PgPool, notification_id: Uuid, user_id: Uuid) -> Result<()> {
        tracing::info!(
            notification_id = %notification_id,
            user_id = %user_id,
            "Deleting notification"
        );

        let deleted = NotificationRepository::delete(pool, notification_id, user_id).await?;

        if !deleted {
            return Err(anyhow!("Notification not found"));
        }

        tracing::info!(
            notification_id = %notification_id,
            user_id = %user_id,
            "Notification deleted successfully"
        );

        Ok(())
    }
}
