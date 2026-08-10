use anyhow::Result;
use sqlx::PgPool;

use crate::{
    dto::dashboard::DashboardSummary, repositories::dashboard_repository::DashboardRepository,
};

pub struct DashboardService;

impl DashboardService {
    pub async fn summary(pool: &PgPool) -> Result<DashboardSummary> {
        DashboardRepository::summary(pool).await
    }
}
