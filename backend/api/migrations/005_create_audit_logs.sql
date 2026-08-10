CREATE TABLE audit_logs
(
    id UUID PRIMARY KEY,

    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    action TEXT NOT NULL,

    entity TEXT NOT NULL,

    entity_id UUID NOT NULL,

    description TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_user
ON audit_logs(user_id);

CREATE INDEX idx_audit_entity
ON audit_logs(entity);

CREATE INDEX idx_audit_entity_id
ON audit_logs(entity_id);