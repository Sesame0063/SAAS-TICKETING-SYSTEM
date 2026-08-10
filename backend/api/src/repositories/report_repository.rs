use anyhow::Result;
use sqlx::PgPool;

use crate::dto::report::{AgentReportDto, CustomerReportDto, DashboardReportDto};

pub struct ReportRepository;

impl ReportRepository {
    // ==========================================================
    // Dashboard Report
    // ==========================================================

    pub async fn dashboard(pool: &PgPool) -> Result<DashboardReportDto> {
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

        let resolved_tickets: i64 =
            sqlx::query_scalar("SELECT COUNT(*) FROM tickets WHERE status = 'Resolved'")
                .fetch_one(pool)
                .await?;

        let closed_tickets: i64 =
            sqlx::query_scalar("SELECT COUNT(*) FROM tickets WHERE status = 'Closed'")
                .fetch_one(pool)
                .await?;

        Ok(DashboardReportDto {
            total_tickets,
            open_tickets,
            in_progress_tickets,
            resolved_tickets,
            closed_tickets,
        })
    }

    // ==========================================================
    // Agent Report
    // ==========================================================

    pub async fn agent_report(pool: &PgPool) -> Result<Vec<AgentReportDto>> {
        let reports = sqlx::query_as::<_, AgentReportDto>(
            r#"
            SELECT
                COALESCE(assigned_to::TEXT,'Unassigned') AS agent_id,
                COUNT(*) AS assigned_tickets,
                COUNT(*) FILTER (WHERE status='Resolved') AS resolved_tickets,
                0.0::DOUBLE PRECISION AS average_resolution_hours
            FROM tickets
            GROUP BY assigned_to
            ORDER BY assigned_tickets DESC
            "#,
        )
        .fetch_all(pool)
        .await?;

        Ok(reports)
    }

    // ==========================================================
    // Customer Report
    // ==========================================================

    pub async fn customer_report(pool: &PgPool) -> Result<Vec<CustomerReportDto>> {
        let reports = sqlx::query_as::<_, CustomerReportDto>(
            r#"
            SELECT
                customer_id::TEXT AS customer_id,
                COUNT(*) AS total_tickets,
                COUNT(*) FILTER (WHERE status='Resolved') AS resolved_tickets,
                COUNT(*) FILTER (WHERE status<>'Resolved') AS pending_tickets
            FROM tickets
            GROUP BY customer_id
            ORDER BY total_tickets DESC
            "#,
        )
        .fetch_all(pool)
        .await?;

        Ok(reports)
    }
}
