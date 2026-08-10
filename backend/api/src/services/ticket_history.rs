use anyhow::Result;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    dto::history::{CreateHistoryRequest, TicketHistoryResponse},
    repositories::ticket_history_repository,
};

pub struct TicketHistoryService;

impl TicketHistoryService {
    pub async fn create(
        pool: &PgPool,
        request: CreateHistoryRequest,
    ) -> Result<TicketHistoryResponse> {
        let history = ticket_history_repository::create(pool, request).await?;

        Ok(TicketHistoryResponse {
            id: history.id,
            ticket_id: history.ticket_id,
            changed_by: history.changed_by,
            field_name: history.field_name,
            old_value: history.old_value,
            new_value: history.new_value,
            created_at: history.created_at,
        })
    }

    pub async fn get_ticket_history(
        pool: &PgPool,
        ticket_id: Uuid,
    ) -> Result<Vec<TicketHistoryResponse>> {
        let history = ticket_history_repository::find_by_ticket(pool, ticket_id).await?;

        Ok(history
            .into_iter()
            .map(|item| TicketHistoryResponse {
                id: item.id,
                ticket_id: item.ticket_id,
                changed_by: item.changed_by,
                field_name: item.field_name,
                old_value: item.old_value,
                new_value: item.new_value,
                created_at: item.created_at,
            })
            .collect())
    }
}
