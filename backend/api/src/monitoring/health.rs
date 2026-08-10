use anyhow::Result;

pub struct HealthService;

impl HealthService {
    pub async fn check() -> Result<()> {
        tracing::info!("Health check passed");
        Ok(())
    }
}
