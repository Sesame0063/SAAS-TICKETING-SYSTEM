use anyhow::Result;

use crate::{config::Settings, utils::mailer::Mailer};

pub struct EmailService;

impl EmailService {
    pub async fn send_ticket_created(
        settings: &Settings,
        recipient: &str,
        first_name: &str,
        ticket_title: &str,
    ) -> Result<()> {
        let html = format!(
            r#"
<!DOCTYPE html>
<html>
<body style="font-family:Arial,Helvetica,sans-serif;">
<h2>Ticket Created 🎉</h2>

<p>Hello <strong>{}</strong>,</p>

<p>Your ticket has been created successfully.</p>

<p><b>Title:</b> {}</p>

<p>Our support team will review it shortly.</p>

<hr>

<p>{}</p>

</body>
</html>
"#,
            first_name, ticket_title, settings.server.name,
        );

        Self::send(settings, recipient, "Ticket Created Successfully", html).await
    }

    pub async fn send_ticket_assigned(
        settings: &Settings,
        recipient: &str,
        first_name: &str,
        ticket_title: &str,
    ) -> Result<()> {
        let html = format!(
            r#"
<!DOCTYPE html>
<html>
<body style="font-family:Arial,Helvetica,sans-serif;">

<h2>Ticket Assigned 👨‍💻</h2>

<p>Hello <strong>{}</strong>,</p>

<p>You have been assigned a ticket.</p>

<p><b>{}</b></p>

<hr>

<p>{}</p>

</body>
</html>
"#,
            first_name, ticket_title, settings.server.name,
        );

        Self::send(settings, recipient, "Ticket Assigned", html).await
    }

    pub async fn send_ticket_closed(
        settings: &Settings,
        recipient: &str,
        first_name: &str,
        ticket_title: &str,
    ) -> Result<()> {
        let html = format!(
            r#"
<!DOCTYPE html>
<html>
<body style="font-family:Arial,Helvetica,sans-serif;">

<h2>Ticket Closed ✅</h2>

<p>Hello <strong>{}</strong>,</p>

<p>Your ticket has been marked as resolved.</p>

<p><b>{}</b></p>

<hr>

<p>Thank you for using our support platform.</p>

<p>{}</p>

</body>
</html>
"#,
            first_name, ticket_title, settings.server.name,
        );

        Self::send(settings, recipient, "Ticket Closed", html).await
    }

    pub async fn send_verification_email(
        settings: &Settings,
        recipient: &str,
        first_name: &str,
        token: &str,
    ) -> Result<()> {
        let verification_link =
            format!("{}/verify-email?token={}", settings.server.base_url, token);

        let html = format!(
            r#"
<!DOCTYPE html>
<html>
<body style="font-family:Arial,Helvetica,sans-serif;">

<h2>Verify Your Email 📧</h2>

<p>Hello <strong>{}</strong>,</p>

<p>Welcome to {}.</p>

<p>Please verify your email by clicking the button below.</p>

<p style="margin:30px 0;">
<a href="{}"
style="
background:#2563eb;
color:white;
padding:12px 22px;
text-decoration:none;
border-radius:6px;
font-weight:bold;
">
Verify Email
</a>
</p>

<p>If the button doesn't work, use this link:</p>

<p>{}</p>

<p>This link expires in 24 hours.</p>

<hr>

<p>{}</p>

</body>
</html>
"#,
            first_name,
            settings.server.name,
            verification_link,
            verification_link,
            settings.server.name,
        );

        Self::send(settings, recipient, "Verify Your Email", html).await
    }

    pub async fn send_password_reset_email(
        settings: &Settings,
        recipient: &str,
        first_name: &str,
        token: &str,
    ) -> Result<()> {
        let reset_link = format!(
            "{}/reset-password?token={}",
            settings.server.base_url, token
        );

        let html = format!(
            r#"
<!DOCTYPE html>
<html>
<body style="font-family:Arial,Helvetica,sans-serif;">

<h2>Password Reset 🔐</h2>

<p>Hello <strong>{}</strong>,</p>

<p>We received a request to reset your password.</p>

<p style="margin:30px 0;">
<a href="{}"
style="
background:#dc2626;
color:white;
padding:12px 22px;
text-decoration:none;
border-radius:6px;
font-weight:bold;
">
Reset Password
</a>
</p>

<p>If you didn't request this, you can safely ignore this email.</p>

<p>{}</p>

<p>This link expires in 30 minutes.</p>

<hr>

<p>{}</p>

</body>
</html>
"#,
            first_name, reset_link, reset_link, settings.server.name,
        );

        Self::send(settings, recipient, "Reset Password", html).await
    }

    async fn send(settings: &Settings, recipient: &str, subject: &str, html: String) -> Result<()> {
        Mailer::send(
            &settings.email.smtp_host,
            settings.email.smtp_port,
            &settings.email.username,
            &settings.email.password,
            &settings.email.from_address,
            recipient,
            subject,
            html,
        )
        .await
    }
}
