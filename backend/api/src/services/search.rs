use anyhow::{Result, anyhow};
use sqlx::PgPool;

use crate::{
    dto::search::{SearchQuery, SearchResponse},
    repositories::search_repository::SearchRepository,
};

pub struct SearchService;

impl SearchService {
    pub async fn search(pool: &PgPool, query: SearchQuery) -> Result<SearchResponse> {
        let search_term = query.q.trim();

        if search_term.is_empty() {
            return Err(anyhow!("Search query cannot be empty"));
        }

        let page = query.page.unwrap_or(1);

        if page < 1 {
            return Err(anyhow!("Page must be greater than or equal to 1"));
        }

        let limit = query.limit.unwrap_or(10);

        if !(1..=100).contains(&limit) {
            return Err(anyhow!("Limit must be between 1 and 100"));
        }

        tracing::info!(
            query = %search_term,
            search_type = ?query.search_type,
            page,
            limit,
            "Executing global search"
        );

        SearchRepository::search(
            pool,
            SearchQuery {
                q: search_term.to_string(),
                search_type: query.search_type,
                page: Some(page),
                limit: Some(limit),
            },
        )
        .await
    }

    pub async fn health_check() -> Result<()> {
        Ok(())
    }
}
