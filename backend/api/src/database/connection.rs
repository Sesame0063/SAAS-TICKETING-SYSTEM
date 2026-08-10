use std::time::Duration;

use anyhow::Result;
use sqlx::{PgPool, postgres::PgPoolOptions};

use crate::config::Settings;

/// Create and configure the PostgreSQL connection pool.
///
/// This pool is shared across the entire application.
pub async fn connect(settings: &Settings) -> Result<PgPool> {
    println!("========================================");
    println!("Connecting to PostgreSQL...");
    println!("Database: {}", settings.database.url);
    println!("========================================");

    let pool = PgPoolOptions::new()
        // Pool configuration
        .max_connections(settings.database.max_connections)
        .min_connections(settings.database.min_connections)
        // Time to wait before giving up acquiring a connection
        .acquire_timeout(Duration::from_secs(settings.database.connect_timeout))
        // Close idle connections after 10 minutes
        .idle_timeout(Duration::from_secs(600))
        // Recycle connections every 30 minutes
        .max_lifetime(Duration::from_secs(1800))
        // Verify connection before giving it to SQLx
        .test_before_acquire(true)
        // Establish connection
        .connect(&settings.database.url)
        .await?;

    // Verify database connectivity
    sqlx::query("SELECT 1").execute(&pool).await?;

    println!("========================================");
    println!("✅ PostgreSQL connected successfully");
    println!("Max Connections : {}", settings.database.max_connections);
    println!("Min Connections : {}", settings.database.min_connections);
    println!("========================================");

    Ok(pool)
}
