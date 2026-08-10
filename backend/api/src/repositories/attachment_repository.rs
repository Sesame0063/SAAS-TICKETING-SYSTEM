use anyhow::Result;
use sqlx::PgPool;
use uuid::Uuid;

use crate::entities::Attachment;

pub struct AttachmentRepository;

impl AttachmentRepository {
    pub async fn create(pool: &PgPool, attachment: &Attachment) -> Result<Attachment> {
        let attachment = sqlx::query_as::<_, Attachment>(
            r#"
            INSERT INTO attachments
            (
                id,
                ticket_id,
                uploaded_by,
                original_filename,
                stored_filename,
                mime_type,
                file_size,
                file_path
            )
            VALUES
            (
                $1,$2,$3,$4,$5,$6,$7,$8
            )
            RETURNING *
            "#,
        )
        .bind(attachment.id)
        .bind(attachment.ticket_id)
        .bind(attachment.uploaded_by)
        .bind(&attachment.original_filename)
        .bind(&attachment.stored_filename)
        .bind(&attachment.mime_type)
        .bind(attachment.file_size)
        .bind(&attachment.file_path)
        .fetch_one(pool)
        .await?;

        Ok(attachment)
    }

    pub async fn find_by_ticket(pool: &PgPool, ticket_id: Uuid) -> Result<Vec<Attachment>> {
        let attachments = sqlx::query_as::<_, Attachment>(
            r#"
            SELECT *
            FROM attachments
            WHERE ticket_id = $1
            ORDER BY created_at ASC
            "#,
        )
        .bind(ticket_id)
        .fetch_all(pool)
        .await?;

        Ok(attachments)
    }

    pub async fn find_by_id(pool: &PgPool, attachment_id: Uuid) -> Result<Option<Attachment>> {
        let attachment = sqlx::query_as::<_, Attachment>(
            r#"
            SELECT *
            FROM attachments
            WHERE id = $1
            "#,
        )
        .bind(attachment_id)
        .fetch_optional(pool)
        .await?;

        Ok(attachment)
    }

    pub async fn delete(pool: &PgPool, attachment_id: Uuid, uploaded_by: Uuid) -> Result<bool> {
        let result = sqlx::query(
            r#"
            DELETE FROM attachments
            WHERE
                id = $1
                AND uploaded_by = $2
            "#,
        )
        .bind(attachment_id)
        .bind(uploaded_by)
        .execute(pool)
        .await?;

        Ok(result.rows_affected() > 0)
    }
}
