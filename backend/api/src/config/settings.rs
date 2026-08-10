use serde::Deserialize;

use super::environment::Environment;

#[derive(Debug, Clone, Deserialize)]
pub struct Settings {
    pub environment: Environment,
    pub server: ServerSettings,
    pub database: DatabaseSettings,
    pub jwt: JwtSettings,
    pub redis: RedisSettings,
    pub email: EmailSettings,
    pub storage: StorageSettings,
    pub logging: LoggingSettings,
}

#[derive(Debug, Clone, Deserialize)]
pub struct ServerSettings {
    pub name: String,
    pub host: String,
    pub port: u16,
    pub base_url: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct DatabaseSettings {
    pub url: String,

    pub host: String,
    pub port: u16,
    pub name: String,
    pub username: String,
    pub password: String,

    pub max_connections: u32,
    pub min_connections: u32,
    pub connect_timeout: u64,
}

#[derive(Debug, Clone, Deserialize)]
pub struct JwtSettings {
    pub secret: String,
    pub access_token_expiry: u64,
    pub refresh_token_expiry: u64,
}

#[derive(Debug, Clone, Deserialize)]
pub struct RedisSettings {
    pub url: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct EmailSettings {
    pub smtp_host: String,
    pub smtp_port: u16,
    pub username: String,
    pub password: String,
    pub from_address: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct StorageSettings {
    pub upload_directory: String,
    pub max_file_size: u64,
}

#[derive(Debug, Clone, Deserialize)]
pub struct LoggingSettings {
    pub level: String,
}
