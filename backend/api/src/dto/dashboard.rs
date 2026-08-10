use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct DashboardSummary {
    pub total_tickets: i64,
    pub open_tickets: i64,
    pub in_progress_tickets: i64,
    pub pending_tickets: i64,
    pub resolved_tickets: i64,
    pub closed_tickets: i64,
    pub total_customers: i64,
    pub total_agents: i64,
}
