use anyhow::{Result, anyhow};
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    dto::knowledge_base::{
        CreateKnowledgeBaseRequest, KnowledgeBaseResponse, UpdateKnowledgeBaseRequest,
    },
    repositories::knowledge_base_repository::KnowledgeBaseRepository,
};

pub struct KnowledgeBaseService;

impl KnowledgeBaseService {
    pub async fn create(
        pool: &PgPool,
        request: CreateKnowledgeBaseRequest,
        created_by: Uuid,
    ) -> Result<KnowledgeBaseResponse> {
        let article = KnowledgeBaseRepository::create(pool, created_by, request).await?;

        Ok(KnowledgeBaseResponse {
            id: article.id,
            title: article.title,
            category: article.category,
            content: article.content,
            created_by: article.created_by,
            created_at: article.created_at,
            updated_at: article.updated_at,
        })
    }

    pub async fn get_all(pool: &PgPool) -> Result<Vec<KnowledgeBaseResponse>> {
        let articles = KnowledgeBaseRepository::find_all(pool).await?;

        Ok(articles
            .into_iter()
            .map(|article| KnowledgeBaseResponse {
                id: article.id,
                title: article.title,
                category: article.category,
                content: article.content,
                created_by: article.created_by,
                created_at: article.created_at,
                updated_at: article.updated_at,
            })
            .collect())
    }

    pub async fn get_by_id(pool: &PgPool, article_id: Uuid) -> Result<KnowledgeBaseResponse> {
        let article = KnowledgeBaseRepository::find_by_id(pool, article_id)
            .await?
            .ok_or_else(|| anyhow!("Article not found"))?;

        Ok(KnowledgeBaseResponse {
            id: article.id,
            title: article.title,
            category: article.category,
            content: article.content,
            created_by: article.created_by,
            created_at: article.created_at,
            updated_at: article.updated_at,
        })
    }

    pub async fn update(
        pool: &PgPool,
        article_id: Uuid,
        request: UpdateKnowledgeBaseRequest,
    ) -> Result<KnowledgeBaseResponse> {
        let article = KnowledgeBaseRepository::update(pool, article_id, request)
            .await?
            .ok_or_else(|| anyhow!("Article not found"))?;

        Ok(KnowledgeBaseResponse {
            id: article.id,
            title: article.title,
            category: article.category,
            content: article.content,
            created_by: article.created_by,
            created_at: article.created_at,
            updated_at: article.updated_at,
        })
    }

    pub async fn delete(pool: &PgPool, article_id: Uuid) -> Result<()> {
        let deleted = KnowledgeBaseRepository::delete(pool, article_id).await?;

        if !deleted {
            return Err(anyhow!("Article not found"));
        }

        Ok(())
    }
}
