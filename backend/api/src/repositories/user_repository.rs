use anyhow::Result;
use sqlx::PgPool;
use uuid::Uuid;

use crate::entities::User;

pub struct UserRepository;

impl UserRepository {
    pub async fn find_by_email(pool: &PgPool, email: &str) -> Result<Option<User>> {
        let user = sqlx::query_as!(
            User,
            r#"
            SELECT
                id,
                first_name,
                last_name,
                email,
                password_hash,
                role,
                is_active,
                is_verified,
                created_at,
                updated_at
            FROM users
            WHERE email = $1
            "#,
            email
        )
        .fetch_optional(pool)
        .await?;

        Ok(user)
    }

    pub async fn find_by_id(pool: &PgPool, id: Uuid) -> Result<Option<User>> {
        let user = sqlx::query_as!(
            User,
            r#"
            SELECT
                id,
                first_name,
                last_name,
                email,
                password_hash,
                role,
                is_active,
                is_verified,
                created_at,
                updated_at
            FROM users
            WHERE id = $1
            "#,
            id
        )
        .fetch_optional(pool)
        .await?;

        Ok(user)
    }

    pub async fn get_users(pool: &PgPool, role: Option<String>) -> Result<Vec<User>> {
        let users = if let Some(role) = role {
            sqlx::query_as::<_, User>(
                r#"
                SELECT *
                FROM users
                WHERE LOWER(role) = LOWER($1)
                ORDER BY created_at DESC
                "#,
            )
            .bind(role)
            .fetch_all(pool)
            .await?
        } else {
            sqlx::query_as::<_, User>(
                r#"
                SELECT *
                FROM users
                ORDER BY created_at DESC
                "#,
            )
            .fetch_all(pool)
            .await?
        };

        Ok(users)
    }

    pub async fn create(pool: &PgPool, user: &User) -> Result<User> {
        let created_user = sqlx::query_as!(
            User,
            r#"
            INSERT INTO users (
                first_name,
                last_name,
                email,
                password_hash,
                role,
                is_active,
                is_verified
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING
                id,
                first_name,
                last_name,
                email,
                password_hash,
                role,
                is_active,
                is_verified,
                created_at,
                updated_at
            "#,
            user.first_name,
            user.last_name,
            user.email,
            user.password_hash,
            user.role,
            user.is_active,
            user.is_verified
        )
        .fetch_one(pool)
        .await?;

        Ok(created_user)
    }

    pub async fn update_role(
        pool: &PgPool,
        user_id: Uuid,
        role: String,
    ) -> Result<Option<User>, sqlx::Error> {
        let user = sqlx::query_as::<_, User>(
            r#"
            UPDATE users
            SET role = $1,
                updated_at = NOW()
            WHERE id = $2
            RETURNING *
            "#,
        )
        .bind(role)
        .bind(user_id)
        .fetch_optional(pool)
        .await?;

        Ok(user)
    }

    pub async fn verify_email(pool: &PgPool, user_id: Uuid) -> Result<Option<User>, sqlx::Error> {
        let user = sqlx::query_as::<_, User>(
            r#"
            UPDATE users
            SET is_verified = TRUE,
                updated_at = NOW()
            WHERE id = $1
            RETURNING *
            "#,
        )
        .bind(user_id)
        .fetch_optional(pool)
        .await?;

        Ok(user)
    }

    pub async fn update_password(
        pool: &PgPool,
        user_id: Uuid,
        password_hash: String,
    ) -> Result<Option<User>, sqlx::Error> {
        let user = sqlx::query_as::<_, User>(
            r#"
            UPDATE users
            SET password_hash = $1,
                updated_at = NOW()
            WHERE id = $2
            RETURNING *
            "#,
        )
        .bind(password_hash)
        .bind(user_id)
        .fetch_optional(pool)
        .await?;

        Ok(user)
    }
}
