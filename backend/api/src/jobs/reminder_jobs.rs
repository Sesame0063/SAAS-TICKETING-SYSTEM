use anyhow::Result;

pub struct ReminderJobs;

impl ReminderJobs {
    pub async fn send_pending_ticket_reminders() -> Result<()> {
        println!("Checking pending tickets...");

        Ok(())
    }

    pub async fn send_sla_reminders() -> Result<()> {
        println!("Checking SLA violations...");

        Ok(())
    }
}
