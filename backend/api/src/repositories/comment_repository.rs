use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    dto::comment::{CreateCommentRequest, UpdateCommentRequest},
    entities::Comment,
};

pub async fn create(
    pool: &PgPool,
    ticket_id: Uuid,
    user_id: Uuid,
    request: CreateCommentRequest,
) -> Result<Comment, sqlx::Error> {
    sqlx::query_as::<_, Comment>(
        r#"
        INSERT INTO comments
        (
            ticket_id,
            user_id,
            message
        )
        VALUES
        (
            $1,
            $2,
            $3
        )
        RETURNING *
        "#,
    )
    .bind(ticket_id)
    .bind(user_id)
    .bind(request.content)
    .fetch_one(pool)
    .await
}

pub async fn find_by_ticket(pool: &PgPool, ticket_id: Uuid) -> Result<Vec<Comment>, sqlx::Error> {
    sqlx::query_as::<_, Comment>(
        r#"
        SELECT *
        FROM comments
        WHERE ticket_id = $1
        ORDER BY created_at ASC
        "#,
    )
    .bind(ticket_id)
    .fetch_all(pool)
    .await
}

pub async fn find_by_id(pool: &PgPool, comment_id: Uuid) -> Result<Option<Comment>, sqlx::Error> {
    sqlx::query_as::<_, Comment>(
        r#"
        SELECT *
        FROM comments
        WHERE id = $1
        "#,
    )
    .bind(comment_id)
    .fetch_optional(pool)
    .await
}

pub async fn update(
    pool: &PgPool,
    comment_id: Uuid,
    user_id: Uuid,
    request: UpdateCommentRequest,
) -> Result<Option<Comment>, sqlx::Error> {
    sqlx::query_as::<_, Comment>(
        r#"
        UPDATE comments
        SET
            message = $1,
            updated_at = NOW()
        WHERE
            id = $2
            AND user_id = $3
        RETURNING *
        "#,
    )
    .bind(request.content)
    .bind(comment_id)
    .bind(user_id)
    .fetch_optional(pool)
    .await
}

pub async fn delete(pool: &PgPool, comment_id: Uuid, user_id: Uuid) -> Result<bool, sqlx::Error> {
    let result = sqlx::query(
        r#"
        DELETE FROM comments
        WHERE
            id = $1
            AND user_id = $2
        "#,
    )
    .bind(comment_id)
    .bind(user_id)
    .execute(pool)
    .await?;

    Ok(result.rows_affected() > 0)
}
