use anyhow::{Result, anyhow};
use chrono::Utc;
use redis::Client;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    config::Settings,
    dto::auth::{AuthResponse, LoginRequest, RegisterRequest},
    entities::User,
    repositories::user_repository::UserRepository,
    services::{audit::AuditService, email::EmailService, redis::RedisService},
    utils::{jwt::Jwt, password::Password},
};

pub struct AuthService;

impl AuthService {
    pub async fn register(
        pool: &PgPool,
        redis: &Client,
        settings: &Settings,
        request: RegisterRequest,
        jwt_secret: &str,
        access_expiry: u64,
        refresh_expiry: u64,
    ) -> Result<AuthResponse> {
        // Check duplicate email
        if UserRepository::find_by_email(pool, &request.email)
            .await?
            .is_some()
        {
            return Err(anyhow!("Email already exists"));
        }

        // Hash password
        let password_hash = Password::hash(&request.password)?;

        // Create user
        let user = User {
            id: Uuid::new_v4(),
            first_name: request.first_name,
            last_name: request.last_name,
            email: request.email,
            password_hash,
            role: "customer".to_string(),
            is_active: true,
            is_verified: false,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        };

        let created_user = UserRepository::create(pool, &user).await?;

        // Verification token
        let verification_token = Jwt::generate(
            &created_user.id.to_string(),
            &created_user.role,
            "verify",
            jwt_secret,
            60 * 24,
        )?;

        // Send email (don't fail registration)
        if let Err(err) = EmailService::send_verification_email(
            settings,
            &created_user.email,
            &created_user.first_name,
            &verification_token,
        )
        .await
        {
            tracing::warn!(
                user_id = %created_user.id,
                email = %created_user.email,
                error = ?err,
                "Failed to send verification email"
            );
        }

        // Generate tokens
        let access_token = Jwt::generate(
            &created_user.id.to_string(),
            &created_user.role,
            "access",
            jwt_secret,
            access_expiry as i64,
        )?;

        let refresh_token = Jwt::generate(
            &created_user.id.to_string(),
            &created_user.role,
            "refresh",
            jwt_secret,
            refresh_expiry as i64,
        )?;

        RedisService::store_refresh_token(
            redis,
            &created_user.id.to_string(),
            &refresh_token,
            refresh_expiry,
        )
        .await?;

        // Audit log
        AuditService::log(
            pool,
            created_user.id,
            "REGISTER".to_string(),
            "USER".to_string(),
            created_user.id,
            format!("User {} registered", created_user.email),
        )
        .await?;

        tracing::info!(
            user_id = %created_user.id,
            email = %created_user.email,
            "User registered successfully"
        );

        Ok(AuthResponse {
            access_token,
            refresh_token,
        })
    }

    pub async fn login(
        pool: &PgPool,
        redis: &Client,
        request: LoginRequest,
        jwt_secret: &str,
        access_expiry: u64,
        refresh_expiry: u64,
    ) -> Result<AuthResponse> {
        let user = UserRepository::find_by_email(pool, &request.email)
            .await?
            .ok_or_else(|| anyhow!("Invalid email or password"))?;

        /*
        if !user.is_verified {
            return Err(anyhow!("Please verify your email first."));
        }
        */

        if !user.is_active {
            return Err(anyhow!("Account has been disabled."));
        }

        let valid = Password::verify(&request.password, &user.password_hash)?;

        if !valid {
            return Err(anyhow!("Invalid email or password"));
        }

        let access_token = Jwt::generate(
            &user.id.to_string(),
            &user.role,
            "access",
            jwt_secret,
            access_expiry as i64,
        )?;

        let refresh_token = Jwt::generate(
            &user.id.to_string(),
            &user.role,
            "refresh",
            jwt_secret,
            refresh_expiry as i64,
        )?;

        RedisService::store_refresh_token(
            redis,
            &user.id.to_string(),
            &refresh_token,
            refresh_expiry,
        )
        .await?;

        AuditService::log(
            pool,
            user.id,
            "LOGIN".to_string(),
            "USER".to_string(),
            user.id,
            format!("User {} logged in", user.email),
        )
        .await?;

        tracing::info!(
            user_id = %user.id,
            email = %user.email,
            "User logged in successfully"
        );

        Ok(AuthResponse {
            access_token,
            refresh_token,
        })
    }

    pub async fn verify_email(pool: &PgPool, token: &str, jwt_secret: &str) -> Result<()> {
        let claims = Jwt::verify(token, jwt_secret)?;

        if !Jwt::is_email_verification_token(&claims) {
            return Err(anyhow!("Invalid verification token."));
        }

        let user_id = Uuid::parse_str(&claims.sub)?;

        UserRepository::verify_email(pool, user_id)
            .await?
            .ok_or_else(|| anyhow!("User not found"))?;

        AuditService::log(
            pool,
            user_id,
            "VERIFY_EMAIL".to_string(),
            "USER".to_string(),
            user_id,
            "Email verified successfully".to_string(),
        )
        .await?;

        tracing::info!(
            user_id = %user_id,
            "Email verified successfully"
        );

        Ok(())
    }

    pub async fn forgot_password(
        pool: &PgPool,
        settings: &Settings,
        email: String,
        jwt_secret: &str,
    ) -> Result<()> {
        if let Some(user) = UserRepository::find_by_email(pool, &email).await? {
            let reset_token =
                Jwt::generate(&user.id.to_string(), &user.role, "reset", jwt_secret, 30)?;

            EmailService::send_password_reset_email(
                settings,
                &user.email,
                &user.first_name,
                &reset_token,
            )
            .await?;

            AuditService::log(
                pool,
                user.id,
                "REQUEST_PASSWORD_RESET".to_string(),
                "USER".to_string(),
                user.id,
                "Password reset requested".to_string(),
            )
            .await?;

            tracing::info!(
                user_id = %user.id,
                email = %user.email,
                "Password reset email sent"
            );
        }

        Ok(())
    }
    pub async fn reset_password(
        pool: &PgPool,
        token: &str,
        new_password: String,
        jwt_secret: &str,
    ) -> Result<()> {
        let claims = Jwt::verify(token, jwt_secret)?;

        if !Jwt::is_password_reset_token(&claims) {
            return Err(anyhow!("Invalid password reset token."));
        }

        let user_id = Uuid::parse_str(&claims.sub)?;

        let password_hash = Password::hash(&new_password)?;

        UserRepository::update_password(pool, user_id, password_hash)
            .await?
            .ok_or_else(|| anyhow!("User not found"))?;

        AuditService::log(
            pool,
            user_id,
            "RESET_PASSWORD".to_string(),
            "USER".to_string(),
            user_id,
            "Password reset successfully".to_string(),
        )
        .await?;

        tracing::info!(
            user_id = %user_id,
            "Password reset successfully"
        );

        Ok(())
    }

    pub async fn refresh_token(
        redis: &Client,
        refresh_token: &str,
        jwt_secret: &str,
        access_expiry: u64,
        refresh_expiry: u64,
    ) -> Result<AuthResponse> {
        let claims = Jwt::verify(refresh_token, jwt_secret)?;

        if !Jwt::is_refresh_token(&claims) {
            return Err(anyhow!("Invalid refresh token."));
        }

        let stored = RedisService::get_refresh_token(redis, &claims.sub).await?;

        match stored {
            Some(token) if token == refresh_token => {}
            _ => return Err(anyhow!("Refresh token is no longer valid")),
        }

        let access_token = Jwt::generate(
            &claims.sub,
            &claims.role,
            "access",
            jwt_secret,
            access_expiry as i64,
        )?;

        let new_refresh_token = Jwt::generate(
            &claims.sub,
            &claims.role,
            "refresh",
            jwt_secret,
            refresh_expiry as i64,
        )?;

        RedisService::store_refresh_token(redis, &claims.sub, &new_refresh_token, refresh_expiry)
            .await?;

        tracing::info!(
            user_id = %claims.sub,
            "Access token refreshed"
        );

        Ok(AuthResponse {
            access_token,
            refresh_token: new_refresh_token,
        })
    }

    pub async fn logout(pool: &PgPool, redis: &Client, user: &User) -> Result<()> {
        RedisService::delete_refresh_token(redis, &user.id.to_string()).await?;

        AuditService::log(
            pool,
            user.id,
            "LOGOUT".to_string(),
            "USER".to_string(),
            user.id,
            format!("User {} logged out", user.email),
        )
        .await?;

        tracing::info!(
            user_id = %user.id,
            email = %user.email,
            "User logged out successfully"
        );

        Ok(())
    }
}
