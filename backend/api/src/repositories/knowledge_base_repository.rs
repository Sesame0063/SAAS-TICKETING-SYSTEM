use anyhow::Result;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    dto::knowledge_base::{CreateKnowledgeBaseRequest, UpdateKnowledgeBaseRequest},
    entities::KnowledgeBase,
};

pub struct KnowledgeBaseRepository;

impl KnowledgeBaseRepository {
    pub async fn create(
        pool: &PgPool,
        created_by: Uuid,
        request: CreateKnowledgeBaseRequest,
    ) -> Result<KnowledgeBase> {
        let article = sqlx::query_as::<_, KnowledgeBase>(
            r#"
            INSERT INTO knowledge_base
            (title, category, content, created_by)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            "#,
        )
        .bind(request.title)
        .bind(request.category)
        .bind(request.content)
        .bind(created_by)
        .fetch_one(pool)
        .await?;

        Ok(article)
    }

    pub async fn find_all(pool: &PgPool) -> Result<Vec<KnowledgeBase>> {
        let articles = sqlx::query_as::<_, KnowledgeBase>(
            r#"
            SELECT *
            FROM knowledge_base
            ORDER BY created_at DESC
            "#,
        )
        .fetch_all(pool)
        .await?;

        Ok(articles)
    }

    pub async fn find_by_id(pool: &PgPool, article_id: Uuid) -> Result<Option<KnowledgeBase>> {
        let article = sqlx::query_as::<_, KnowledgeBase>(
            r#"
            SELECT *
            FROM knowledge_base
            WHERE id = $1
            "#,
        )
        .bind(article_id)
        .fetch_optional(pool)
        .await?;

        Ok(article)
    }

    pub async fn update(
        pool: &PgPool,
        article_id: Uuid,
        request: UpdateKnowledgeBaseRequest,
    ) -> Result<Option<KnowledgeBase>> {
        let article = sqlx::query_as::<_, KnowledgeBase>(
            r#"
            UPDATE knowledge_base
            SET
                title = $1,
                category = $2,
                content = $3,
                updated_at = NOW()
            WHERE id = $4
            RETURNING *
            "#,
        )
        .bind(request.title)
        .bind(request.category)
        .bind(request.content)
        .bind(article_id)
        .fetch_optional(pool)
        .await?;

        Ok(article)
    }

    pub async fn delete(pool: &PgPool, article_id: Uuid) -> Result<bool> {
        let result = sqlx::query(
            r#"
            DELETE FROM knowledge_base
            WHERE id = $1
            "#,
        )
        .bind(article_id)
        .execute(pool)
        .await?;

        Ok(result.rows_affected() > 0)
    }
}