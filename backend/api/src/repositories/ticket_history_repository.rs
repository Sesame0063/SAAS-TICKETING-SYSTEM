use sqlx::PgPool;
use uuid::Uuid;

use crate::{dto::history::CreateHistoryRequest, entities::TicketHistory};

pub async fn create(
    pool: &PgPool,
    request: CreateHistoryRequest,
) -> Result<TicketHistory, sqlx::Error> {
    let history = sqlx::query_as::<_, TicketHistory>(
        r#"
        INSERT INTO ticket_history
        (
            ticket_id,
            changed_by,
            field_name,
            old_value,
            new_value
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5
        )
        RETURNING *
        "#,
    )
    .bind(request.ticket_id)
    .bind(request.changed_by)
    .bind(request.field_name)
    .bind(request.old_value)
    .bind(request.new_value)
    .fetch_one(pool)
    .await?;

    Ok(history)
}

pub async fn find_by_ticket(
    pool: &PgPool,
    ticket_id: Uuid,
) -> Result<Vec<TicketHistory>, sqlx::Error> {
    let history = sqlx::query_as::<_, TicketHistory>(
        r#"
        SELECT *
        FROM ticket_history
        WHERE ticket_id = $1
        ORDER BY created_at DESC
        "#,
    )
    .bind(ticket_id)
    .fetch_all(pool)
    .await?;

    Ok(history)
}
