use anyhow::{Result, anyhow};
use argon2::{
    Argon2,
    password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString, rand_core::OsRng},
};

pub struct Password;

impl Password {
    pub fn hash(password: &str) -> Result<String> {
        let salt = SaltString::generate(&mut OsRng);

        let hash = Argon2::default()
            .hash_password(password.as_bytes(), &salt)
            .map_err(|e| anyhow!(e.to_string()))?
            .to_string();

        Ok(hash)
    }

    pub fn verify(password: &str, password_hash: &str) -> Result<bool> {
        let parsed_hash = PasswordHash::new(password_hash).map_err(|e| anyhow!(e.to_string()))?;

        Ok(Argon2::default()
            .verify_password(password.as_bytes(), &parsed_hash)
            .is_ok())
    }
}
