use std::str::FromStr;

use anyhow::{Result, anyhow};
use serde::Deserialize;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Deserialize)]
pub enum Environment {
    Development,
    Testing,
    Production,
}
impl FromStr for Environment {
    type Err = anyhow::Error;

    fn from_str(value: &str) -> Result<Self> {
        match value.to_lowercase().as_str() {
            "development" | "dev" => Ok(Self::Development),
            "testing" | "test" => Ok(Self::Testing),
            "production" | "prod" => Ok(Self::Production),
            _ => Err(anyhow!(
                "Unknown environment '{}'. Expected development, testing or production.",
                value
            )),
        }
    }
}

#[allow(dead_code)]
impl Environment {
    pub fn is_development(self) -> bool {
        matches!(self, Self::Development)
    }

    pub fn is_testing(self) -> bool {
        matches!(self, Self::Testing)
    }

    pub fn is_production(self) -> bool {
        matches!(self, Self::Production)
    }
}
