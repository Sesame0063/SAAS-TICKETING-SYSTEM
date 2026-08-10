-- Add migration script here
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ticket_id UUID NOT NULL
        REFERENCES tickets(id)
        ON DELETE CASCADE,

    uploaded_by UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    original_filename VARCHAR(255) NOT NULL,

    stored_filename VARCHAR(255) NOT NULL,

    mime_type VARCHAR(100) NOT NULL,

    file_size BIGINT NOT NULL,

    file_path TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_attachments_ticket
ON attachments(ticket_id);

CREATE INDEX idx_attachments_uploaded_by
ON attachments(uploaded_by);