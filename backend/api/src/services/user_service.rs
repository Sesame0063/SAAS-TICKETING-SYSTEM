use anyhow::{Result, anyhow};
use argon2::Argon2;
use argon2::password_hash::{
    PasswordHash, PasswordHasher, PasswordVerifier, SaltString, rand_core::OsRng,
};
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    dto::user::{ChangePasswordRequest, UpdateProfileRequest, UpdateUserRoleRequest},
    entities::User,
};

pub struct UserService;

impl UserService {
    // ==========================================================
    // Get users (existing)
    // ==========================================================
    pub async fn get_users(pool: &PgPool, role: Option<String>) -> Result<Vec<User>> {
        let users = if let Some(role) = role {
            sqlx::query_as::<_, User>(
                "SELECT * FROM users WHERE LOWER(role)=LOWER($1) ORDER BY created_at DESC",
            )
            .bind(role)
            .fetch_all(pool)
            .await?
        } else {
            sqlx::query_as::<_, User>("SELECT * FROM users ORDER BY created_at DESC")
                .fetch_all(pool)
                .await?
        };

        Ok(users)
    }

    // ==========================================================
    // Update role (existing)
    // ==========================================================
    pub async fn update_role(
        pool: &PgPool,
        user_id: Uuid,
        payload: UpdateUserRoleRequest,
    ) -> Result<User> {
        let user = sqlx::query_as::<_, User>(
            r#"
            UPDATE users
            SET role = $1,
                updated_at = NOW()
            WHERE id = $2
            RETURNING *
            "#,
        )
        .bind(payload.role.to_lowercase())
        .bind(user_id)
        .fetch_one(pool)
        .await?;

        Ok(user)
    }

    // ==========================================================
    // Update profile (NEW)
    // ==========================================================
    pub async fn update_profile(
        pool: &PgPool,
        user_id: Uuid,
        payload: UpdateProfileRequest,
    ) -> Result<User> {
        let user = sqlx::query_as::<_, User>(
            r#"
            UPDATE users
            SET first_name = $1,
                last_name = $2,
                updated_at = NOW()
            WHERE id = $3
            RETURNING *
            "#,
        )
        .bind(payload.first_name)
        .bind(payload.last_name)
        .bind(user_id)
        .fetch_one(pool)
        .await?;

        Ok(user)
    }

    // ==========================================================
    // Change password (NEW)
    // ==========================================================
    pub async fn change_password(
        pool: &PgPool,
        user_id: Uuid,
        payload: ChangePasswordRequest,
    ) -> Result<()> {
        let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
            .bind(user_id)
            .fetch_one(pool)
            .await?;

        let parsed_hash =
            PasswordHash::new(&user.password_hash).map_err(|e| anyhow!(e.to_string()))?;
        let argon2 = Argon2::default();

        argon2
            .verify_password(payload.current_password.as_bytes(), &parsed_hash)
            .map_err(|_| anyhow!("Current password is incorrect"))?;

        let salt = SaltString::generate(&mut OsRng);

        let new_hash = argon2
            .hash_password(payload.new_password.as_bytes(), &salt)
            .map_err(|e| anyhow!(e.to_string()))?
            .to_string();

        sqlx::query(
            r#"
            UPDATE users
            SET password_hash = $1,
                updated_at = NOW()
            WHERE id = $2
            "#,
        )
        .bind(new_hash)
        .bind(user_id)
        .execute(pool)
        .await?;

        Ok(())
    }
}
