use anyhow::{Result, anyhow};
use chrono::Utc;
use sqlx::PgPool;
use std::fs;
use uuid::Uuid;

use crate::{
    dto::attachment::AttachmentResponse,
    entities::Attachment,
    repositories::attachment_repository::AttachmentRepository,
    services::audit::AuditService,
    websocket::{ConnectionManager, WsEvents},
};

pub struct AttachmentService;

impl AttachmentService {
    pub async fn create(
        pool: &PgPool,
        ws: &ConnectionManager,
        ticket_id: Uuid,
        uploaded_by: Uuid,
        original_filename: String,
        stored_filename: String,
        mime_type: String,
        file_size: i64,
        file_path: String,
    ) -> Result<AttachmentResponse> {
        tracing::info!(
            ticket_id = %ticket_id,
            uploaded_by = %uploaded_by,
            filename = %original_filename,
            "Uploading attachment"
        );

        let attachment = Attachment {
            id: Uuid::new_v4(),
            ticket_id,
            uploaded_by,
            original_filename,
            stored_filename,
            mime_type,
            file_size,
            file_path,
            created_at: Utc::now(),
        };

        let attachment = AttachmentRepository::create(pool, &attachment).await?;

        AuditService::log(
            pool,
            uploaded_by,
            "UPLOAD_ATTACHMENT".to_string(),
            "Attachment".to_string(),
            attachment.id,
            format!("Uploaded attachment '{}'", attachment.original_filename),
        )
        .await?;

        ws.broadcast(WsEvents::attachment_uploaded(
            attachment.ticket_id,
            attachment.id,
            attachment.original_filename.clone(),
        ))
        .await;

        tracing::info!(
            attachment_id = %attachment.id,
            "Attachment uploaded successfully"
        );

        Ok(AttachmentResponse {
            id: attachment.id,
            ticket_id: attachment.ticket_id,
            uploaded_by: attachment.uploaded_by,
            original_filename: attachment.original_filename,
            stored_filename: attachment.stored_filename,
            mime_type: attachment.mime_type,
            file_size: attachment.file_size,
            created_at: attachment.created_at,
        })
    }

    pub async fn get_ticket_attachments(
        pool: &PgPool,
        ticket_id: Uuid,
    ) -> Result<Vec<AttachmentResponse>> {
        tracing::info!(
            ticket_id = %ticket_id,
            "Fetching attachments"
        );

        let attachments = AttachmentRepository::find_by_ticket(pool, ticket_id).await?;

        tracing::info!(
            ticket_id = %ticket_id,
            total = attachments.len(),
            "Attachments fetched successfully"
        );

        Ok(attachments
            .into_iter()
            .map(|attachment| AttachmentResponse {
                id: attachment.id,
                ticket_id: attachment.ticket_id,
                uploaded_by: attachment.uploaded_by,
                original_filename: attachment.original_filename,
                stored_filename: attachment.stored_filename,
                mime_type: attachment.mime_type,
                file_size: attachment.file_size,
                created_at: attachment.created_at,
            })
            .collect())
    }

    pub async fn delete(
        pool: &PgPool,
        ws: &ConnectionManager,
        attachment_id: Uuid,
        uploaded_by: Uuid,
    ) -> Result<()> {
        tracing::info!(
            attachment_id = %attachment_id,
            uploaded_by = %uploaded_by,
            "Deleting attachment"
        );

        let attachment = AttachmentRepository::find_by_id(pool, attachment_id)
            .await?
            .ok_or_else(|| anyhow!("Attachment not found"))?;

        let deleted = AttachmentRepository::delete(pool, attachment_id, uploaded_by).await?;

        if !deleted {
            return Err(anyhow!("Attachment not found or permission denied"));
        }

        if let Err(err) = fs::remove_file(&attachment.file_path) {
            tracing::warn!(
                error = ?err,
                path = %attachment.file_path,
                "Failed to delete physical file"
            );
        }

        AuditService::log(
            pool,
            uploaded_by,
            "DELETE_ATTACHMENT".to_string(),
            "Attachment".to_string(),
            attachment.id,
            format!("Deleted attachment '{}'", attachment.original_filename),
        )
        .await?;

        ws.broadcast(WsEvents::attachment_deleted(
            attachment.ticket_id,
            attachment.id,
        ))
        .await;

        tracing::info!(
            attachment_id = %attachment_id,
            "Attachment deleted successfully"
        );

        Ok(())
    }
    pub async fn download(pool: &PgPool, attachment_id: Uuid) -> Result<Attachment> {
        tracing::info!(
            attachment_id = %attachment_id,
            "Downloading attachment"
        );

        let attachment = AttachmentRepository::find_by_id(pool, attachment_id)
            .await?
            .ok_or_else(|| anyhow!("Attachment not found"))?;

        tracing::info!(
            attachment_id = %attachment.id,
            filename = %attachment.original_filename,
            "Attachment ready for download"
        );

        Ok(attachment)
    }
}
