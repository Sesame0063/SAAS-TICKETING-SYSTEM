use anyhow::Result;
use chrono::{Duration, Utc};
use jsonwebtoken::{Algorithm, DecodingKey, EncodingKey, Header, Validation, decode, encode};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    /// User ID
    pub sub: String,

    /// customer / agent / admin
    pub role: String,

    /// access / refresh / verify / reset
    pub token_type: String,

    /// Expiration Time
    pub exp: usize,

    /// Issued At
    pub iat: usize,

    /// Issuer
    pub iss: String,

    /// Audience
    pub aud: String,

    /// JWT ID
    pub jti: String,
}

impl Claims {
    /// Returns the authenticated user's UUID.
    pub fn user_id(&self) -> Result<Uuid, uuid::Error> {
        Uuid::parse_str(&self.sub)
    }
}

pub struct Jwt;

impl Jwt {
    pub fn generate(
        user_id: &str,
        role: &str,
        token_type: &str,
        secret: &str,
        expiry_minutes: i64,
    ) -> Result<String> {
        let now = Utc::now();
        let expiration = now + Duration::minutes(expiry_minutes);

        let claims = Claims {
            sub: user_id.to_string(),
            role: role.to_string(),
            token_type: token_type.to_string(),
            exp: expiration.timestamp() as usize,
            iat: now.timestamp() as usize,
            iss: "saas-ticketing-api".to_string(),
            aud: "saas-ticketing-client".to_string(),
            jti: Uuid::new_v4().to_string(),
        };

        let token = encode(
            &Header::new(Algorithm::HS256),
            &claims,
            &EncodingKey::from_secret(secret.as_bytes()),
        )?;

        Ok(token)
    }

    pub fn verify(token: &str, secret: &str) -> Result<Claims> {
        let mut validation = Validation::new(Algorithm::HS256);

        validation.validate_exp = true;
        validation.set_issuer(&["saas-ticketing-api"]);
        validation.set_audience(&["saas-ticketing-client"]);

        let data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(secret.as_bytes()),
            &validation,
        )?;

        Ok(data.claims)
    }

    pub fn is_access_token(claims: &Claims) -> bool {
        claims.token_type == "access"
    }

    pub fn is_refresh_token(claims: &Claims) -> bool {
        claims.token_type == "refresh"
    }

    pub fn is_email_verification_token(claims: &Claims) -> bool {
        claims.token_type == "verify"
    }

    pub fn is_password_reset_token(claims: &Claims) -> bool {
        claims.token_type == "reset"
    }
}
