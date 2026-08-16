mod config;
mod database;
mod dto;
mod entities;
mod errors;
mod extractors;
mod handlers;
mod jobs;
mod middleware;
mod monitoring;
mod repositories;
mod response;
mod routes;
mod services;
mod state;
mod utils;
mod validation;
mod websocket;

use anyhow::Result;
use axum::serve;
use redis::Client;
use tokio::{
    net::TcpListener,
    time::{Duration, interval},
};

use config::{SettingsLoader, SettingsValidator};
use database::connection;
use routes::create_router;
use state::AppState;

#[tokio::main]
async fn main() -> Result<()> {
    // Load configuration
    let settings = SettingsLoader::load()?;

    // Validate configuration
    SettingsValidator::validate(&settings)?;

    // PostgreSQL
    let db = connection::connect(&settings).await?;

    // Redis
    let redis = Client::open(settings.redis.url.as_str())?;

    // Shared application state
    let app_state = AppState {
        db,
        redis,
        settings: settings.clone(),
        ws_manager: websocket::ConnectionManager::new(),
    };

    // Background Scheduler
    let scheduler_state = app_state.clone();

    tokio::spawn(async move {
        let mut timer = interval(Duration::from_secs(300));

        loop {
            timer.tick().await;

            if let Err(error) = jobs::reminder_jobs::ReminderJobs::send_pending_ticket_reminders(
                &scheduler_state.db,
            )
            .await
            {
                tracing::error!(
                    error = %error,
                    "Pending ticket reminder job failed"
                );
            }

            if let Err(error) =
                jobs::reminder_jobs::ReminderJobs::send_sla_reminders(&scheduler_state.db).await
            {
                tracing::error!(
                    error = %error,
                    "SLA reminder job failed"
                );
            }
        }
    });

    // Build Router
    let app = create_router(app_state);

    println!(
        "{} started successfully in {:?} mode.",
        settings.server.name, settings.environment
    );

    let address = format!("{}:{}", settings.server.host, settings.server.port);

    println!("Listening on http://{}", address);

    let listener = TcpListener::bind(&address).await?;

    serve(listener, app).await?;

    Ok(())
}
