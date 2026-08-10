use anyhow::Result;
use sqlx::PgPool;
use uuid::Uuid;

use crate::entities::audit_log::AuditLog;

pub struct AuditRepository;

impl AuditRepository {
    pub async fn create(pool: &PgPool, audit: &AuditLog) -> Result<AuditLog> {
        Ok(sqlx::query_as::<_, AuditLog>(
            r#"
                INSERT INTO audit_logs
                (
                    id,
                    user_id,
                    action,
                    entity,
                    entity_id,
                    description
                )
                VALUES
                (
                    $1, $2, $3, $4, $5, $6
                )
                RETURNING *
                "#,
        )
        .bind(audit.id)
        .bind(audit.user_id)
        .bind(&audit.action)
        .bind(&audit.entity)
        .bind(audit.entity_id)
        .bind(&audit.description)
        .fetch_one(pool)
        .await?)
    }

    pub async fn find_by_user(pool: &PgPool, user_id: Uuid) -> Result<Vec<AuditLog>> {
        Ok(sqlx::query_as::<_, AuditLog>(
            r#"
                SELECT *
                FROM audit_logs
                WHERE user_id = $1
                ORDER BY created_at DESC
                "#,
        )
        .bind(user_id)
        .fetch_all(pool)
        .await?)
    }

    pub async fn find_all(pool: &PgPool) -> Result<Vec<AuditLog>> {
        Ok(sqlx::query_as::<_, AuditLog>(
            r#"
                SELECT *
                FROM audit_logs
                ORDER BY created_at DESC
                "#,
        )
        .fetch_all(pool)
        .await?)
    }
}
