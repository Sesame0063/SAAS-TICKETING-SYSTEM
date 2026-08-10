use anyhow::Result;

pub struct CleanupJobs;

impl CleanupJobs {
    pub async fn remove_temp_uploads() -> Result<()> {
        println!("Cleaning temporary uploads...");

        Ok(())
    }

    pub async fn remove_old_logs() -> Result<()> {
        println!("Cleaning logs...");

        Ok(())
    }
}
