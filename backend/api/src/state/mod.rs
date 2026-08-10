use redis::Client;
use sqlx::PgPool;

use crate::{config::Settings, websocket::ConnectionManager};

#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
    pub redis: Client,
    pub settings: Settings,
    pub ws_manager: ConnectionManager,
}
