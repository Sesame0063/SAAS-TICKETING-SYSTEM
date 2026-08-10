use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize)]
pub struct DashboardReportDto {
    pub total_tickets: i64,
    pub open_tickets: i64,
    pub in_progress_tickets: i64,
    pub resolved_tickets: i64,
    pub closed_tickets: i64,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct AgentReportDto {
    pub agent_id: String,
    pub assigned_tickets: i64,
    pub resolved_tickets: i64,
    pub average_resolution_hours: f64,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct CustomerReportDto {
    pub customer_id: String,
    pub total_tickets: i64,
    pub resolved_tickets: i64,
    pub pending_tickets: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TicketTrendDto {
    pub label: String,
    pub value: i64,
}
