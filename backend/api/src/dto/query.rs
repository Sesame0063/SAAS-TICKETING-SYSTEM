use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct TicketQuery {
    pub page: Option<i64>,
    pub limit: Option<i64>,

    pub search: Option<String>,

    pub status: Option<String>,
    pub priority: Option<String>,

    pub sort: Option<String>,
    pub order: Option<String>,
}
