CREATE TABLE ticket_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ticket_id UUID NOT NULL
        REFERENCES tickets(id)
        ON DELETE CASCADE,

    changed_by UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    field_name VARCHAR(100) NOT NULL,

    old_value TEXT,

    new_value TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ticket_history_ticket
ON ticket_history(ticket_id);

CREATE INDEX idx_ticket_history_user
ON ticket_history(changed_by);