use anyhow::Result;
use sqlx::PgPool;
use uuid::Uuid;

use crate::repositories::notification_repository::NotificationRepository;

pub struct ReminderJobs;

impl ReminderJobs {
    /// Sends reminders for tickets that have remained Pending
    /// for more than 24 hours.
    pub async fn send_pending_ticket_reminders(pool: &PgPool) -> Result<()> {
        println!("Checking pending tickets...");

        let tickets = sqlx::query_as::<_, (Uuid, String, Option<Uuid>, Uuid)>(
            r#"
            SELECT
                id,
                title,
                assigned_to,
                customer_id
            FROM tickets
            WHERE status = 'Pending'
            AND updated_at < NOW() - INTERVAL '24 hours'
            "#,
        )
        .fetch_all(pool)
        .await?;

        for (ticket_id, title, assigned_to, customer_id) in tickets {
            let message = format!(
                "Your ticket '{}' has been pending for more than 24 hours.",
                title
            );

            if !Self::notification_exists(pool, customer_id, "Pending ticket reminder", &message)
                .await?
            {
                NotificationRepository::create(
                    pool,
                    customer_id,
                    "Pending ticket reminder".to_string(),
                    message,
                )
                .await?;
            }

            if let Some(agent_id) = assigned_to {
                let agent_message = format!(
                    "Ticket '{}' has remained pending for more than 24 hours.",
                    title
                );

                if !Self::notification_exists(
                    pool,
                    agent_id,
                    "Pending ticket reminder",
                    &agent_message,
                )
                .await?
                {
                    NotificationRepository::create(
                        pool,
                        agent_id,
                        "Pending ticket reminder".to_string(),
                        agent_message,
                    )
                    .await?;
                }
            }

            println!(
                "Pending ticket reminder processed: {} ({})",
                ticket_id, title
            );
        }

        Ok(())
    }

    /// Detects SLA violations based on ticket priority.
    ///
    /// SLA thresholds:
    /// Critical -> 4 hours
    /// High     -> 8 hours
    /// Medium   -> 24 hours
    /// Low      -> 48 hours
    pub async fn send_sla_reminders(pool: &PgPool) -> Result<()> {
        println!("Checking SLA violations...");

        let tickets = sqlx::query_as::<_, (Uuid, String, String, Option<Uuid>, Uuid)>(
            r#"
            SELECT
                id,
                title,
                priority,
                assigned_to,
                customer_id
            FROM tickets
            WHERE status NOT IN ('Resolved', 'Closed')
            AND (
                    (LOWER(priority) = 'critical'
                        AND created_at < NOW() - INTERVAL '4 hours')
                OR (LOWER(priority) = 'high'
                        AND created_at < NOW() - INTERVAL '8 hours')
                OR (LOWER(priority) = 'medium'
                        AND created_at < NOW() - INTERVAL '24 hours')
                OR (LOWER(priority) = 'low'
                        AND created_at < NOW() - INTERVAL '48 hours')
            )
            "#,
        )
        .fetch_all(pool)
        .await?;

        for (ticket_id, title, priority, assigned_to, customer_id) in tickets {
            let customer_message = format!(
                "Your {} priority ticket '{}' has exceeded its SLA response time.",
                priority, title
            );

            if !Self::notification_exists(pool, customer_id, "SLA violation", &customer_message)
                .await?
            {
                NotificationRepository::create(
                    pool,
                    customer_id,
                    "SLA violation".to_string(),
                    customer_message,
                )
                .await?;
            }

            if let Some(agent_id) = assigned_to {
                let agent_message = format!(
                    "{} priority ticket '{}' has exceeded its SLA response time.",
                    priority, title
                );

                if !Self::notification_exists(pool, agent_id, "SLA violation", &agent_message)
                    .await?
                {
                    NotificationRepository::create(
                        pool,
                        agent_id,
                        "SLA violation".to_string(),
                        agent_message,
                    )
                    .await?;
                }
            }

            println!(
                "SLA violation processed: {} ({}) [{}]",
                ticket_id, title, priority
            );
        }

        Ok(())
    }

    /// Prevents the five-minute scheduler from creating duplicate
    /// notifications for the same event.
    async fn notification_exists(
        pool: &PgPool,
        user_id: Uuid,
        title: &str,
        message: &str,
    ) -> Result<bool> {
        let exists: bool = sqlx::query_scalar(
            r#"
            SELECT EXISTS (
                SELECT 1
                FROM notifications
                WHERE user_id = $1
                AND title = $2
                AND message = $3
                AND created_at > NOW() - INTERVAL '24 hours'
            )
            "#,
        )
        .bind(user_id)
        .bind(title)
        .bind(message)
        .fetch_one(pool)
        .await?;

        Ok(exists)
    }
}
