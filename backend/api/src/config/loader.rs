use std::env;

use anyhow::{Context, Result};

use super::{builder::SettingsBuilder, settings::Settings};

pub struct SettingsLoader;

impl SettingsLoader {
    pub fn load() -> Result<Settings> {
        let environment = env::var("APP_ENV").unwrap_or_else(|_| "development".to_string());

        let env_file = match environment.as_str() {
            "production" | "prod" => ".env.production",
            "testing" | "test" => ".env.test",
            _ => ".env",
        };

        dotenvy::from_filename(env_file).with_context(|| format!("Failed to load {}", env_file))?;

        SettingsBuilder::build()
    }
}
