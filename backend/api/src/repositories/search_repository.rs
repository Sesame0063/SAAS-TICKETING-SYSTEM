use anyhow::Result;
use sqlx::PgPool;

use crate::{
    dto::search::{SearchQuery, SearchResponse, SearchResult},
    entities::{knowledge_base::KnowledgeBase, ticket::Ticket, user::User},
};

pub struct SearchRepository;

impl SearchRepository {
    pub async fn search(pool: &PgPool, query: SearchQuery) -> Result<SearchResponse> {
        let page = query.page.unwrap_or(1).max(1);
        let limit = query.limit.unwrap_or(10).clamp(1, 100);
        let offset = (page - 1) * limit;

        let keyword = format!("%{}%", query.q);

        let mut results = Vec::new();
        let mut total: i64 = 0;

        match query.search_type.as_deref() {
            Some("ticket") => {
                total = sqlx::query_scalar(
                    r#"
                    SELECT COUNT(*)
                    FROM tickets
                    WHERE title ILIKE $1
                       OR description ILIKE $1
                    "#,
                )
                .bind(&keyword)
                .fetch_one(pool)
                .await?;

                let tickets = sqlx::query_as::<_, Ticket>(
                    r#"
                    SELECT *
                    FROM tickets
                    WHERE title ILIKE $1
                       OR description ILIKE $1
                    ORDER BY updated_at DESC
                    LIMIT $2 OFFSET $3
                    "#,
                )
                .bind(&keyword)
                .bind(limit)
                .bind(offset)
                .fetch_all(pool)
                .await?;

                for ticket in tickets {
                    results.push(SearchResult::Ticket {
                        id: ticket.id,
                        title: ticket.title,
                        description: ticket.description,
                        status: ticket.status,
                    });
                }
            }

            Some("user") => {
                total = sqlx::query_scalar(
                    r#"
                    SELECT COUNT(*)
                    FROM users
                    WHERE first_name ILIKE $1
                       OR last_name ILIKE $1
                       OR email ILIKE $1
                    "#,
                )
                .bind(&keyword)
                .fetch_one(pool)
                .await?;

                let users = sqlx::query_as::<_, User>(
                    r#"
                    SELECT *
                    FROM users
                    WHERE first_name ILIKE $1
                       OR last_name ILIKE $1
                       OR email ILIKE $1
                    ORDER BY created_at DESC
                    LIMIT $2 OFFSET $3
                    "#,
                )
                .bind(&keyword)
                .bind(limit)
                .bind(offset)
                .fetch_all(pool)
                .await?;

                for user in users {
                    results.push(SearchResult::User {
                        id: user.id,
                        email: user.email,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        role: user.role,
                    });
                }
            }

            Some("knowledge_base") => {
                total = sqlx::query_scalar(
                    r#"
                    SELECT COUNT(*)
                    FROM knowledge_base
                    WHERE title ILIKE $1
                       OR content ILIKE $1
                    "#,
                )
                .bind(&keyword)
                .fetch_one(pool)
                .await?;

                let articles = sqlx::query_as::<_, KnowledgeBase>(
                    r#"
                    SELECT *
                    FROM knowledge_base
                    WHERE title ILIKE $1
                       OR content ILIKE $1
                    ORDER BY updated_at DESC
                    LIMIT $2 OFFSET $3
                    "#,
                )
                .bind(&keyword)
                .bind(limit)
                .bind(offset)
                .fetch_all(pool)
                .await?;

                for article in articles {
                    results.push(SearchResult::KnowledgeBase {
                        id: article.id,
                        title: article.title,
                        content: article.content,
                    });
                }
            }

            _ => {}
        }

        Ok(SearchResponse {
            query: query.q,
            page,
            limit,
            total: total as usize,
            results,
        })
    }
}
