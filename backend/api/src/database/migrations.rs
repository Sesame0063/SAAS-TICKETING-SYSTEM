use anyhow::Result;
use sqlx::{Executor, PgPool};

pub async fn run(pool: &PgPool) -> Result<()> {
    // ==========================================================
    // EXTENSIONS
    // ==========================================================

    pool.execute(
        r#"
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
"#,
    )
    .await?;

    // ==========================================================
    // USERS
    // ==========================================================

    pool.execute(
        r#"
CREATE TABLE IF NOT EXISTS users
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,

    email TEXT NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    role TEXT NOT NULL
        CHECK (
            role IN
            (
                'customer',
                'agent',
                'admin'
            )
        )
        DEFAULT 'customer',

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
"#,
    )
    .await?;

    pool.execute(
        r#"
CREATE INDEX IF NOT EXISTS idx_users_email
ON users(email);
"#,
    )
    .await?;

    // ==========================================================
    // TICKETS
    // ==========================================================

    pool.execute(
        r#"
CREATE TABLE IF NOT EXISTS tickets
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title TEXT NOT NULL,

    description TEXT NOT NULL,

    status TEXT NOT NULL
        CHECK
        (
            status IN
            (
                'Open',
                'In Progress',
                'Pending',
                'Resolved',
                'Closed'
            )
        )
        DEFAULT 'Open',

    priority TEXT NOT NULL
        CHECK
        (
            priority IN
            (
                'Low',
                'Medium',
                'High',
                'Critical'
            )
        ),

    customer_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    assigned_to UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
"#,
    )
    .await?;

    pool.execute(
        r#"
CREATE INDEX IF NOT EXISTS idx_ticket_customer
ON tickets(customer_id);
"#,
    )
    .await?;

    pool.execute(
        r#"
CREATE INDEX IF NOT EXISTS idx_ticket_assigned
ON tickets(assigned_to);
"#,
    )
    .await?;

    pool.execute(
        r#"
CREATE INDEX IF NOT EXISTS idx_ticket_status
ON tickets(status);
"#,
    )
    .await?;

    pool.execute(
        r#"
CREATE INDEX IF NOT EXISTS idx_ticket_priority
ON tickets(priority);
"#,
    )
    .await?;

    pool.execute(
        r#"
CREATE INDEX IF NOT EXISTS idx_ticket_created
ON tickets(created_at DESC);
"#,
    )
    .await?;

    // ==========================================================
    // COMMENTS
    // ==========================================================

    pool.execute(
        r#"
CREATE TABLE IF NOT EXISTS comments
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ticket_id UUID NOT NULL
        REFERENCES tickets(id)
        ON DELETE CASCADE,

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    message TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
"#,
    )
    .await?;

    pool.execute(
        r#"
CREATE INDEX IF NOT EXISTS idx_comment_ticket
ON comments(ticket_id);
"#,
    )
    .await?;

    // ==========================================================
    // ATTACHMENTS
    // ==========================================================

    pool.execute(
        r#"
CREATE TABLE IF NOT EXISTS attachments
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ticket_id UUID NOT NULL
        REFERENCES tickets(id)
        ON DELETE CASCADE,

    uploaded_by UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    original_filename TEXT NOT NULL,

    stored_filename TEXT NOT NULL,

    mime_type TEXT NOT NULL,

    file_size BIGINT NOT NULL,

    file_path TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
"#,
    )
    .await?;

    pool.execute(
        r#"
CREATE INDEX IF NOT EXISTS idx_attachment_ticket
ON attachments(ticket_id);
"#,
    )
    .await?;

    // ==========================================================
    // AUDIT LOGS
    // ==========================================================

    pool.execute(
        r#"
CREATE TABLE IF NOT EXISTS audit_logs
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    action TEXT NOT NULL,

    entity TEXT NOT NULL,

    entity_id UUID NOT NULL,

    description TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
"#,
    )
    .await?;

    pool.execute(
        r#"
CREATE INDEX IF NOT EXISTS idx_audit_user
ON audit_logs(user_id);
"#,
    )
    .await?;

    pool.execute(
        r#"
CREATE INDEX IF NOT EXISTS idx_audit_created
ON audit_logs(created_at DESC);
"#,
    )
    .await?;

    // ==========================================================
    // TICKET TAGS
    // ==========================================================

    pool.execute(
        r#"
CREATE TABLE IF NOT EXISTS ticket_tags
(
    ticket_id UUID NOT NULL
        REFERENCES tickets(id)
        ON DELETE CASCADE,

    tag TEXT NOT NULL,

    PRIMARY KEY(ticket_id, tag)
);
"#,
    )
    .await?;

    // ==========================================================
    // TICKET HISTORY
    // ==========================================================

    pool.execute(
        r#"
CREATE TABLE IF NOT EXISTS ticket_history
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ticket_id UUID NOT NULL
        REFERENCES tickets(id)
        ON DELETE CASCADE,

    changed_by UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    field_name TEXT NOT NULL,

    old_value TEXT,

    new_value TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
"#,
    )
    .await?;

    pool.execute(
        r#"
CREATE INDEX IF NOT EXISTS idx_ticket_history_ticket
ON ticket_history(ticket_id);
"#,
    )
    .await?;

    // ==========================================================
    // NOTIFICATIONS
    // ==========================================================

    pool.execute(
        r#"
CREATE TABLE IF NOT EXISTS notifications
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    title TEXT NOT NULL,

    message TEXT NOT NULL,

    is_read BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
"#,
    )
    .await?;

    pool.execute(
        r#"
CREATE INDEX IF NOT EXISTS idx_notifications_user
ON notifications(user_id);
"#,
    )
    .await?;

    // ==========================================================
    // KNOWLEDGE BASE
    // ==========================================================

    pool.execute(
        r#"
CREATE TABLE IF NOT EXISTS knowledge_base
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title TEXT NOT NULL,

    content TEXT NOT NULL,

    created_by UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
"#,
    )
    .await?;

    // ==========================================================
    // SAVED SEARCHES
    // ==========================================================

    pool.execute(
        r#"
CREATE TABLE IF NOT EXISTS saved_searches
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    name TEXT NOT NULL,

    query TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
"#,
    )
    .await?;
    // ==========================================================
    // REFRESH TOKENS
    // ==========================================================

    pool.execute(
        r#"
CREATE TABLE IF NOT EXISTS refresh_tokens
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    token TEXT NOT NULL UNIQUE,

    expires_at TIMESTAMPTZ NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
"#,
    )
    .await?;

    pool.execute(
        r#"
CREATE INDEX IF NOT EXISTS idx_refresh_token_user
ON refresh_tokens(user_id);
"#,
    )
    .await?;

    // ==========================================================
    // PASSWORD RESET TOKENS
    // ==========================================================

    pool.execute(
        r#"
CREATE TABLE IF NOT EXISTS password_reset_tokens
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    token TEXT NOT NULL UNIQUE,

    expires_at TIMESTAMPTZ NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
"#,
    )
    .await?;

    pool.execute(
        r#"
CREATE INDEX IF NOT EXISTS idx_password_reset_user
ON password_reset_tokens(user_id);
"#,
    )
    .await?;

    // ==========================================================
    // EMAIL VERIFICATION TOKENS
    // ==========================================================

    pool.execute(
        r#"
CREATE TABLE IF NOT EXISTS email_verification_tokens
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    token TEXT NOT NULL UNIQUE,

    expires_at TIMESTAMPTZ NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
"#,
    )
    .await?;

    pool.execute(
        r#"
CREATE INDEX IF NOT EXISTS idx_email_verification_user
ON email_verification_tokens(user_id);
"#,
    )
    .await?;

    println!("✅ Database schema initialized successfully.");

    Ok(())
}
