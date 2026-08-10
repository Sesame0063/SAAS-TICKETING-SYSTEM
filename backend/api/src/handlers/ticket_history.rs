use axum::{
    Json,
    extract::{Path, State},
};
use uuid::Uuid;

use crate::{
    dto::history::TicketHistoryResponse, errors::AppError, extractors::auth::AuthenticatedUser,
    services::ticket_history::TicketHistoryService, state::AppState,
};

pub async fn get_ticket_history(
    Path(ticket_id): Path<Uuid>,
    State(state): State<AppState>,
    AuthenticatedUser(_): AuthenticatedUser,
) -> Result<Json<Vec<TicketHistoryResponse>>, AppError> {
    let history = TicketHistoryService::get_ticket_history(&state.db, ticket_id)
        .await
        .map_err(|e| AppError::BadRequest(e.to_string()))?;

    Ok(Json(history))
}
