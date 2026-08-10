use sqlx::{PgPool, QueryBuilder};
use uuid::Uuid;

use crate::{
    dto::{
        query::TicketQuery,
        ticket::{CreateTicketRequest, UpdateTicketRequest},
    },
    entities::Ticket,
};
pub async fn create(
    pool: &PgPool,
    customer_id: Uuid,
    request: CreateTicketRequest,
) -> Result<Ticket, sqlx::Error> {
    let ticket = sqlx::query_as::<_, Ticket>(
        r#"
        INSERT INTO tickets
        (
            title,
            description,
            status,
            priority,
            customer_id
        )
        VALUES
        (
            $1,
            $2,
            'Open',
            $3,
            $4
        )
        RETURNING *
        "#,
    )
    .bind(request.title)
    .bind(request.description)
    .bind(request.priority)
    .bind(customer_id)
    .fetch_one(pool)
    .await?;

    Ok(ticket)
}

pub async fn find_by_customer(
    pool: &PgPool,
    customer_id: Uuid,
) -> Result<Vec<Ticket>, sqlx::Error> {
    let tickets = sqlx::query_as::<_, Ticket>(
        r#"
        SELECT *
        FROM tickets
        WHERE customer_id = $1
        ORDER BY created_at DESC
        "#,
    )
    .bind(customer_id)
    .fetch_all(pool)
    .await?;

    Ok(tickets)
}

pub async fn find_all(pool: &PgPool) -> Result<Vec<Ticket>, sqlx::Error> {
    let tickets = sqlx::query_as::<_, Ticket>(
        r#"
        SELECT *
        FROM tickets
        ORDER BY created_at DESC
        "#,
    )
    .fetch_all(pool)
    .await?;

    Ok(tickets)
}

pub async fn find_by_id(
    pool: &PgPool,
    ticket_id: Uuid,
    customer_id: Uuid,
) -> Result<Option<Ticket>, sqlx::Error> {
    tracing::debug!(
        ticket_id = %ticket_id,
        customer_id = %customer_id,
        "Fetching ticket from database"
    );

    let ticket = sqlx::query_as::<_, Ticket>(
        r#"
        SELECT *
        FROM tickets
        WHERE id = $1
        AND customer_id = $2
        "#,
    )
    .bind(ticket_id)
    .bind(customer_id)
    .fetch_optional(pool)
    .await?;

    Ok(ticket)
}

pub async fn update(
    pool: &PgPool,
    ticket_id: Uuid,
    customer_id: Uuid,
    request: UpdateTicketRequest,
) -> Result<Option<Ticket>, sqlx::Error> {
    let ticket = sqlx::query_as::<_, Ticket>(
        r#"
        UPDATE tickets
        SET
            title = COALESCE($1, title),
            description = COALESCE($2, description),
            priority = COALESCE($3, priority),
            updated_at = NOW()
        WHERE
            id = $4
            AND customer_id = $5
        RETURNING *
        "#,
    )
    .bind(request.title)
    .bind(request.description)
    .bind(request.priority)
    .bind(ticket_id)
    .bind(customer_id)
    .fetch_optional(pool)
    .await?;

    Ok(ticket)
}

pub async fn delete(
    pool: &PgPool,
    ticket_id: Uuid,
    customer_id: Uuid,
) -> Result<bool, sqlx::Error> {
    let result = sqlx::query(
        r#"
        DELETE FROM tickets
        WHERE id = $1
        AND customer_id = $2
        "#,
    )
    .bind(ticket_id)
    .bind(customer_id)
    .execute(pool)
    .await?;

    Ok(result.rows_affected() > 0)
}

pub async fn assign(
    pool: &PgPool,
    ticket_id: Uuid,
    agent_id: Uuid,
) -> Result<Option<Ticket>, sqlx::Error> {
    let ticket = sqlx::query_as::<_, Ticket>(
        r#"
        UPDATE tickets
        SET
            assigned_to = $1,
            status = 'In Progress',
            updated_at = NOW()
        WHERE id = $2
        RETURNING *
        "#,
    )
    .bind(agent_id)
    .bind(ticket_id)
    .fetch_optional(pool)
    .await?;

    Ok(ticket)
}

pub async fn update_status(
    pool: &PgPool,
    ticket_id: Uuid,
    status: String,
) -> Result<Option<Ticket>, sqlx::Error> {
    let ticket = sqlx::query_as::<_, Ticket>(
        r#"
        UPDATE tickets
        SET
            status = $1,
            updated_at = NOW()
        WHERE id = $2
        RETURNING *
        "#,
    )
    .bind(status)
    .bind(ticket_id)
    .fetch_optional(pool)
    .await?;

    Ok(ticket)
}

/// Advanced Search (implementation coming next)
pub async fn search_by_customer(
    pool: &PgPool,
    customer_id: Uuid,
    query: TicketQuery,
) -> Result<Vec<Ticket>, sqlx::Error> {
    let mut builder = QueryBuilder::new("SELECT * FROM tickets WHERE customer_id = ");

    builder.push_bind(customer_id);

    if let Some(status) = query.status {
        builder.push(" AND status = ");
        builder.push_bind(status);
    }

    if let Some(priority) = query.priority {
        builder.push(" AND priority = ");
        builder.push_bind(priority);
    }

    if let Some(search) = query.search {
        builder.push(" AND (");

        builder.push("title ILIKE ");
        builder.push_bind(format!("%{}%", search));

        builder.push(" OR description ILIKE ");
        builder.push_bind(format!("%{}%", search));

        builder.push(")");
    }

    builder.push(" ORDER BY created_at DESC");

    let tickets = builder.build_query_as::<Ticket>().fetch_all(pool).await?;

    Ok(tickets)
}
