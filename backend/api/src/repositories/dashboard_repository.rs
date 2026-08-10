use anyhow::Result;
use sqlx::PgPool;

use crate::dto::dashboard::DashboardSummary;

pub struct DashboardRepository;

impl DashboardRepository {
    pub async fn summary(pool: &PgPool) -> Result<DashboardSummary> {
        let total_tickets: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM tickets")
            .fetch_one(pool)
            .await?;

        let open_tickets: i64 =
            sqlx::query_scalar("SELECT COUNT(*) FROM tickets WHERE status = 'Open'")
                .fetch_one(pool)
                .await?;

        let in_progress_tickets: i64 =
            sqlx::query_scalar("SELECT COUNT(*) FROM tickets WHERE status = 'In Progress'")
                .fetch_one(pool)
                .await?;

        let pending_tickets: i64 =
            sqlx::query_scalar("SELECT COUNT(*) FROM tickets WHERE status = 'Pending'")
                .fetch_one(pool)
                .await?;

        let resolved_tickets: i64 =
            sqlx::query_scalar("SELECT COUNT(*) FROM tickets WHERE status = 'Resolved'")
                .fetch_one(pool)
                .await?;

        let closed_tickets: i64 =
            sqlx::query_scalar("SELECT COUNT(*) FROM tickets WHERE status = 'Closed'")
                .fetch_one(pool)
                .await?;

        let total_customers: i64 =
            sqlx::query_scalar("SELECT COUNT(*) FROM users WHERE role = 'customer'")
                .fetch_one(pool)
                .await?;

        let total_agents: i64 =
            sqlx::query_scalar("SELECT COUNT(*) FROM users WHERE role = 'agent'")
                .fetch_one(pool)
                .await?;

        Ok(DashboardSummary {
            total_tickets,
            open_tickets,
            in_progress_tickets,
            pending_tickets,
            resolved_tickets,
            closed_tickets,
            total_customers,
            total_agents,
        })
    }
}
