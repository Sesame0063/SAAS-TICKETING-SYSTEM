use anyhow::{Result, bail};

use super::settings::Settings;

pub struct SettingsValidator;

impl SettingsValidator {
    pub fn validate(settings: &Settings) -> Result<()> {
        if settings.server.port == 0 {
            bail!("APP_PORT must be greater than 0");
        }

        if settings.database.max_connections == 0 {
            bail!("DATABASE_MAX_CONNECTIONS must be greater than 0");
        }

        if settings.database.connect_timeout == 0 {
            bail!("DATABASE_CONNECT_TIMEOUT must be greater than 0");
        }

        if settings.jwt.secret.trim().is_empty() {
            bail!("JWT_SECRET cannot be empty");
        }

        if settings.storage.upload_directory.trim().is_empty() {
            bail!("UPLOAD_DIRECTORY cannot be empty");
        }

        if settings.storage.max_file_size == 0 {
            bail!("MAX_FILE_SIZE must be greater than 0");
        }

        Ok(())
    }
}
