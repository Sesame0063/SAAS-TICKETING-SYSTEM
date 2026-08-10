-- Add migration script here
-- Create tickets table

CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,

    status VARCHAR(50) NOT NULL DEFAULT 'Open',
    priority VARCHAR(50) NOT NULL DEFAULT 'Medium',

    customer_id UUID NOT NULL,
    assigned_to UUID,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_ticket_customer
        FOREIGN KEY (customer_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_ticket_agent
        FOREIGN KEY (assigned_to)
        REFERENCES users(id)
        ON DELETE SET NULL
);

CREATE INDEX idx_tickets_customer
ON tickets(customer_id);

CREATE INDEX idx_tickets_assigned
ON tickets(assigned_to);

CREATE INDEX idx_tickets_status
ON tickets(status);

CREATE INDEX idx_tickets_priority
ON tickets(priority);