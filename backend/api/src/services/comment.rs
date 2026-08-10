use anyhow::{Result, anyhow};
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    dto::comment::{CommentResponse, CreateCommentRequest, UpdateCommentRequest},
    repositories::comment_repository,
    services::audit::AuditService,
    websocket::{ConnectionManager, WsEvents},
};

pub struct CommentService;

impl CommentService {
    pub async fn create(
        pool: &PgPool,
        ws: &ConnectionManager,
        ticket_id: Uuid,
        user_id: Uuid,
        request: CreateCommentRequest,
    ) -> Result<CommentResponse> {
        tracing::info!(
            ticket_id = %ticket_id,
            user_id = %user_id,
            "Creating comment"
        );

        let comment = comment_repository::create(pool, ticket_id, user_id, request).await?;

        AuditService::log(
            pool,
            user_id,
            "CREATE_COMMENT".to_string(),
            "Comment".to_string(),
            comment.id,
            format!("Added comment to ticket {}", ticket_id),
        )
        .await?;

        ws.broadcast_to_room(
            &comment.ticket_id,
            WsEvents::comment_added(comment.ticket_id, comment.id, comment.message.clone()),
        )
        .await;

        tracing::info!(
            comment_id = %comment.id,
            "Comment created successfully"
        );

        Ok(CommentResponse {
            id: comment.id,
            ticket_id: comment.ticket_id,
            user_id: comment.user_id,
            content: comment.message,
            created_at: comment.created_at,
            updated_at: comment.updated_at,
        })
    }
    pub async fn get_ticket_comments(
        pool: &PgPool,
        ticket_id: Uuid,
    ) -> Result<Vec<CommentResponse>> {
        tracing::info!(
            ticket_id = %ticket_id,
            "Fetching comments"
        );

        let comments = comment_repository::find_by_ticket(pool, ticket_id).await?;

        tracing::info!(
            ticket_id = %ticket_id,
            total = comments.len(),
            "Comments fetched successfully"
        );

        Ok(comments
            .into_iter()
            .map(|comment| CommentResponse {
                id: comment.id,
                ticket_id: comment.ticket_id,
                user_id: comment.user_id,
                content: comment.message,
                created_at: comment.created_at,
                updated_at: comment.updated_at,
            })
            .collect())
    }

    pub async fn update(
        pool: &PgPool,
        ws: &ConnectionManager,
        comment_id: Uuid,
        user_id: Uuid,
        request: UpdateCommentRequest,
    ) -> Result<CommentResponse> {
        tracing::info!(
            comment_id = %comment_id,
            user_id = %user_id,
            "Updating comment"
        );

        let comment = comment_repository::update(pool, comment_id, user_id, request)
            .await?
            .ok_or_else(|| anyhow!("Comment not found"))?;

        AuditService::log(
            pool,
            user_id,
            "UPDATE_COMMENT".to_string(),
            "Comment".to_string(),
            comment.id,
            format!("Updated comment {}", comment.id),
        )
        .await?;

        ws.broadcast_to_room(
            &comment.ticket_id,
            WsEvents::comment_updated(comment.ticket_id, comment.id),
        )
        .await;

        tracing::info!(
            comment_id = %comment.id,
            "Comment updated successfully"
        );

        Ok(CommentResponse {
            id: comment.id,
            ticket_id: comment.ticket_id,
            user_id: comment.user_id,
            content: comment.message,
            created_at: comment.created_at,
            updated_at: comment.updated_at,
        })
    }
    pub async fn delete(
        pool: &PgPool,
        ws: &ConnectionManager,
        comment_id: Uuid,
        user_id: Uuid,
    ) -> Result<()> {
        tracing::info!(
            comment_id = %comment_id,
            user_id = %user_id,
            "Deleting comment"
        );

        // Get the comment first so we know which ticket to notify.
        let comment = comment_repository::find_by_id(pool, comment_id)
            .await?
            .ok_or_else(|| anyhow!("Comment not found"))?;

        let deleted = comment_repository::delete(pool, comment_id, user_id).await?;

        if !deleted {
            return Err(anyhow!("Comment not found"));
        }

        AuditService::log(
            pool,
            user_id,
            "DELETE_COMMENT".to_string(),
            "Comment".to_string(),
            comment_id,
            format!("Deleted comment {}", comment_id),
        )
        .await?;

        ws.broadcast_to_room(
            &comment.ticket_id,
            WsEvents::comment_deleted(comment.ticket_id, comment.id),
        )
        .await;

        tracing::info!(
            comment_id = %comment_id,
            "Comment deleted successfully"
        );

        Ok(())
    }
}
