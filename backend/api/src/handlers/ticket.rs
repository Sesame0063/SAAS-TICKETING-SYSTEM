use axum::{
    Json,
    extract::{Path, Query, State},
    http::StatusCode,
};
use uuid::Uuid;

use crate::{
    dto::{
        query::TicketQuery,
        status::UpdateStatusRequest,
        ticket::{AssignTicketRequest, CreateTicketRequest, TicketResponse, UpdateTicketRequest},
    },
    errors::AppError,
    extractors::{auth::AuthenticatedUser, role_guard::RoleGuard},
    services::ticket::TicketService,
    state::AppState,
};

pub async fn create_ticket(
    State(state): State<AppState>,
    AuthenticatedUser(user): AuthenticatedUser,
    Json(payload): Json<CreateTicketRequest>,
) -> Result<Json<TicketResponse>, AppError> {
    let ticket = TicketService::create(
        &state.db,
        &state.ws_manager,
        &state.settings,
        user.id,
        payload,
    )
    .await
    .map_err(|e| AppError::BadRequest(e.to_string()))?;

    Ok(Json(ticket))
}

pub async fn get_my_tickets(
    State(state): State<AppState>,
    AuthenticatedUser(user): AuthenticatedUser,
) -> Result<Json<Vec<TicketResponse>>, AppError> {
    let tickets = TicketService::get_my_tickets(&state.db, user.id)
        .await
        .map_err(|e| AppError::BadRequest(e.to_string()))?;

    Ok(Json(tickets))
}

pub async fn search_my_tickets(
    State(state): State<AppState>,
    AuthenticatedUser(user): AuthenticatedUser,
    Query(query): Query<TicketQuery>,
) -> Result<Json<Vec<TicketResponse>>, AppError> {
    let tickets = TicketService::search_my_tickets(&state.db, user.id, query)
        .await
        .map_err(|e| AppError::BadRequest(e.to_string()))?;

    Ok(Json(tickets))
}

pub async fn get_all_tickets(
    State(state): State<AppState>,
    AuthenticatedUser(user): AuthenticatedUser,
) -> Result<Json<Vec<TicketResponse>>, AppError> {
    RoleGuard::agent_or_admin(&user)
        .map_err(|_| AppError::Forbidden("Access denied".into()))?;

    let tickets = TicketService::get_all_tickets(&state.db)
        .await
        .map_err(|e| AppError::BadRequest(e.to_string()))?;

    Ok(Json(tickets))
}

pub async fn get_ticket(
    Path(ticket_id): Path<Uuid>,
    State(state): State<AppState>,
    AuthenticatedUser(user): AuthenticatedUser,
) -> Result<Json<TicketResponse>, AppError> {
    let ticket = TicketService::get_ticket_by_id(
        &state.db,
        &state.redis,
        ticket_id,
        user.id,
    )
    .await
    .map_err(|e| AppError::NotFound(e.to_string()))?;

    Ok(Json(ticket))
}

pub async fn update_ticket(
    Path(ticket_id): Path<Uuid>,
    State(state): State<AppState>,
    AuthenticatedUser(user): AuthenticatedUser,
    Json(payload): Json<UpdateTicketRequest>,
) -> Result<Json<TicketResponse>, AppError> {
    let ticket = TicketService::update_ticket(
        &state.db,
        &state.redis,
        &state.ws_manager,
        ticket_id,
        user.id,
        payload,
    )
    .await
    .map_err(|e| AppError::BadRequest(e.to_string()))?;

    Ok(Json(ticket))
}

pub async fn delete_ticket(
    Path(ticket_id): Path<Uuid>,
    State(state): State<AppState>,
    AuthenticatedUser(user): AuthenticatedUser,
) -> Result<StatusCode, AppError> {
    TicketService::delete_ticket(
        &state.db,
        &state.redis,
        &state.ws_manager,
        ticket_id,
        user.id,
    )
    .await
    .map_err(|e| AppError::NotFound(e.to_string()))?;

    Ok(StatusCode::NO_CONTENT)
}

pub async fn assign_ticket(
    Path(ticket_id): Path<Uuid>,
    State(state): State<AppState>,
    AuthenticatedUser(user): AuthenticatedUser,
    Json(payload): Json<AssignTicketRequest>,
) -> Result<Json<TicketResponse>, AppError> {
    RoleGuard::agent_or_admin(&user)
        .map_err(|_| AppError::Forbidden("Access denied".into()))?;

    let ticket = TicketService::assign_ticket(
        &state.db,
        &state.redis,
        &state.ws_manager,
        &state.settings,
        ticket_id,
        payload,
    )
    .await
    .map_err(|e| AppError::BadRequest(e.to_string()))?;

    Ok(Json(ticket))
}

pub async fn update_ticket_status(
    Path(ticket_id): Path<Uuid>,
    State(state): State<AppState>,
    AuthenticatedUser(user): AuthenticatedUser,
    Json(payload): Json<UpdateStatusRequest>,
) -> Result<Json<TicketResponse>, AppError> {
    RoleGuard::agent_or_admin(&user)
        .map_err(|_| AppError::Forbidden("Access denied".into()))?;

    let ticket = TicketService::update_status(
        &state.db,
        &state.redis,
        &state.ws_manager,
        &state.settings,
        ticket_id,
        payload,
    )
    .await
    .map_err(|e| AppError::BadRequest(e.to_string()))?;

    Ok(Json(ticket))
}
