use anyhow::Result;
use lettre::{
    AsyncSmtpTransport, AsyncTransport, Message, Tokio1Executor,
    message::{Mailbox, header::ContentType},
    transport::smtp::authentication::Credentials,
};

pub struct Mailer;

impl Mailer {
    pub async fn send(
        smtp_host: &str,
        smtp_port: u16,
        username: &str,
        password: &str,
        from: &str,
        to: &str,
        subject: &str,
        html: String,
    ) -> Result<()> {
        let email = Message::builder()
            .from(from.parse::<Mailbox>()?)
            .to(to.parse::<Mailbox>()?)
            .subject(subject)
            .header(ContentType::TEXT_HTML)
            .body(html)?;

        let credentials = Credentials::new(username.to_string(), password.to_string());

        let mailer = AsyncSmtpTransport::<Tokio1Executor>::relay(smtp_host)?
            .credentials(credentials)
            .port(smtp_port)
            .build();

        mailer.send(email).await?;

        Ok(())
    }
}
