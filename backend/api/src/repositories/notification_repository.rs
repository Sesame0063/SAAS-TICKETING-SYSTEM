use anyhow::Result;
use sqlx::PgPool;
use tracing::{debug, info};
use uuid::Uuid;

use crate::entities::Notification;

pub struct NotificationRepository;

impl NotificationRepository {
    pub async fn sla_notification_exists(
        pool: &PgPool,
        user_id: Uuid,
        message: String,
    ) -> Result<bool, sqlx::Error> {
        let exists = sqlx::query_scalar::<_, i64>(
            "SELECT COUNT(*) FROM notifications
             WHERE user_id = impl NotificationRepository {
             AND title = 'SLA violation'
             AND message = $2
             AND is_read = false",
        )
        .bind(user_id)
        .bind(message)
        .fetch_one(pool)
        .await?;

        Ok(exists > 0)
    }

    pub async fn create(
        pool: &PgPool,
        user_id: Uuid,
        title: String,
        message: String,
    ) -> Result<Notification> {
        info!(%user_id, "Creating notification");

        let notification = sqlx::query_as::<_, Notification>(
            r#"
            INSERT INTO notifications
            (user_id, title, message)
            VALUES ($1, $2, $3)
            RETURNING *
            "#,
        )
        .bind(user_id)
        .bind(title)
        .bind(message)
        .fetch_one(pool)
        .await?;

        debug!(notification_id = %notification.id, "Notification created");

        Ok(notification)
    }

    pub async fn find_by_user(pool: &PgPool, user_id: Uuid) -> Result<Vec<Notification>> {
        info!(%user_id, "Fetching notifications");

        let notifications = sqlx::query_as::<_, Notification>(
            r#"
            SELECT *
            FROM notifications
            WHERE user_id = $1
            ORDER BY created_at DESC
            "#,
        )
        .bind(user_id)
        .fetch_all(pool)
        .await?;

        debug!(count = notifications.len(), "Notifications fetched");

        Ok(notifications)
    }

    pub async fn mark_as_read(
        pool: &PgPool,
        notification_id: Uuid,
        user_id: Uuid,
    ) -> Result<Option<Notification>> {
        info!(%notification_id, %user_id, "Marking notification as read");

        let notification = sqlx::query_as::<_, Notification>(
            r#"
            UPDATE notifications
            SET
                is_read = TRUE,
                updated_at = NOW()
            WHERE
                id = $1
                AND user_id = $2
            RETURNING *
            "#,
        )
        .bind(notification_id)
        .bind(user_id)
        .fetch_optional(pool)
        .await?;

        Ok(notification)
    }

    pub async fn mark_all_as_read(pool: &PgPool, user_id: Uuid) -> Result<u64> {
        info!(%user_id, "Marking all notifications as read");

        let result = sqlx::query(
            r#"
            UPDATE notifications
            SET
                is_read = TRUE,
                updated_at = NOW()
            WHERE user_id = $1
              AND is_read = FALSE
            "#,
        )
        .bind(user_id)
        .execute(pool)
        .await?;

        Ok(result.rows_affected())
    }

    pub async fn unread_count(pool: &PgPool, user_id: Uuid) -> Result<i64> {
        let count: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(*)
            FROM notifications
            WHERE user_id = $1
              AND is_read = FALSE
            "#,
        )
        .bind(user_id)
        .fetch_one(pool)
        .await?;

        Ok(count)
    }

    pub async fn delete(pool: &PgPool, notification_id: Uuid, user_id: Uuid) -> Result<bool> {
        info!(%notification_id, %user_id, "Deleting notification");

        let result = sqlx::query(
            r#"
            DELETE FROM notifications
            WHERE
                id = $1
                AND user_id = $2
            "#,
        )
        .bind(notification_id)
        .bind(user_id)
        .execute(pool)
        .await?;

        Ok(result.rows_affected() > 0)
    }
}
