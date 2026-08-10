use std::{env, str::FromStr};

use anyhow::{Context, Result};

use super::{
    environment::Environment,
    settings::{
        DatabaseSettings, EmailSettings, JwtSettings, LoggingSettings, RedisSettings,
        ServerSettings, Settings, StorageSettings,
    },
};

pub struct SettingsBuilder;

impl SettingsBuilder {
    pub fn build() -> Result<Settings> {
        Ok(Settings {
            environment: Environment::from_str(&get_required::<String>("APP_ENV")?)?,

            server: ServerSettings {
                name: get_required("APP_NAME")?,
                host: get_required("APP_HOST")?,
                port: get_required::<u16>("APP_PORT")?,
                base_url: get_required("APP_BASE_URL")?,
            },

            database: DatabaseSettings {
                url: get_required("DATABASE_URL")?,

                host: get_required("DATABASE_HOST")?,
                port: get_required::<u16>("DATABASE_PORT")?,
                name: get_required("DATABASE_NAME")?,
                username: get_required("DATABASE_USERNAME")?,
                password: get_required("DATABASE_PASSWORD")?,

                max_connections: get_required::<u32>("DATABASE_MAX_CONNECTIONS")?,
                min_connections: get_required::<u32>("DATABASE_MIN_CONNECTIONS")?,
                connect_timeout: get_required::<u64>("DATABASE_CONNECT_TIMEOUT")?,
            },

            jwt: JwtSettings {
                secret: get_required("JWT_SECRET")?,
                access_token_expiry: get_required::<u64>("JWT_ACCESS_TOKEN_EXPIRY")?,
                refresh_token_expiry: get_required::<u64>("JWT_REFRESH_TOKEN_EXPIRY")?,
            },

            redis: RedisSettings {
                url: get_required("REDIS_URL")?,
            },

            email: EmailSettings {
                smtp_host: get_required("SMTP_HOST")?,
                smtp_port: get_required::<u16>("SMTP_PORT")?,
                username: get_required("SMTP_USERNAME")?,
                password: get_required("SMTP_PASSWORD")?,
                from_address: get_required("SMTP_FROM_ADDRESS")?,
            },

            storage: StorageSettings {
                upload_directory: get_required("UPLOAD_DIRECTORY")?,
                max_file_size: get_required::<u64>("MAX_FILE_SIZE")?,
            },

            logging: LoggingSettings {
                level: get_required("LOG_LEVEL")?,
            },
        })
    }
}

fn get_required<T>(key: &str) -> Result<T>
where
    T: FromStr,
    T::Err: std::fmt::Display,
{
    let value =
        env::var(key).with_context(|| format!("Missing required environment variable: {}", key))?;

    value
        .parse::<T>()
        .map_err(|e| anyhow::anyhow!("Invalid value for {}: {}", key, e))
}
