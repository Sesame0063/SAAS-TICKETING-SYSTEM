use anyhow::Result;

pub struct EmailJobs;

impl EmailJobs {
    pub async fn send_ticket_created(
        email: String,
        _first_name: String,
        title: String,
    ) -> Result<()> {
        println!("Sending email to {} for ticket {}", email, title);

        Ok(())
    }
}
