CREATE INDEX idx_tickets_customer_status
ON tickets(customer_id, status);

CREATE INDEX idx_tickets_assigned_status
ON tickets(assigned_to, status);

CREATE INDEX idx_comments_ticket_created
ON comments(ticket_id, created_at DESC);

CREATE INDEX idx_notifications_user_read
ON notifications(user_id, is_read);

CREATE INDEX idx_history_ticket_created
ON ticket_history(ticket_id, created_at DESC);