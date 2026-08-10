use anyhow::Result;
use chrono::Utc;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    dto::audit::AuditLogResponse, entities::audit_log::AuditLog,
    repositories::audit_repository::AuditRepository,
};

pub struct AuditService;

impl AuditService {
    pub async fn log(
        pool: &PgPool,
        user_id: Uuid,
        action: String,
        entity: String,
        entity_id: Uuid,
        description: String,
    ) -> Result<()> {
        let audit = AuditLog {
            id: Uuid::new_v4(),
            user_id,
            action,
            entity,
            entity_id,
            description,
            created_at: Utc::now(),
        };

        AuditRepository::create(pool, &audit).await?;

        Ok(())
    }

    pub async fn get_all(pool: &PgPool) -> Result<Vec<AuditLogResponse>> {
        let logs = AuditRepository::find_all(pool).await?;

        Ok(logs
            .into_iter()
            .map(|log| AuditLogResponse {
                id: log.id,
                user_id: log.user_id,
                action: log.action,
                entity: log.entity,
                entity_id: log.entity_id,
                description: log.description,
                created_at: log.created_at,
            })
            .collect())
    }

    pub async fn get_user_logs(pool: &PgPool, user_id: Uuid) -> Result<Vec<AuditLogResponse>> {
        let logs = AuditRepository::find_by_user(pool, user_id).await?;

        Ok(logs
            .into_iter()
            .map(|log| AuditLogResponse {
                id: log.id,
                user_id: log.user_id,
                action: log.action,
                entity: log.entity,
                entity_id: log.entity_id,
                description: log.description,
                created_at: log.created_at,
            })
            .collect())
    }
}
