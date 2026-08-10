use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::entities::Ticket;

#[derive(Debug, Deserialize)]
pub struct CreateTicketRequest {
    pub title: String,
    pub description: String,
    pub priority: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateTicketRequest {
    pub title: Option<String>,
    pub description: Option<String>,
    pub priority: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TicketResponse {
    pub id: Uuid,
    pub title: String,
    pub description: String,
    pub status: String,
    pub priority: String,
    pub customer_id: Uuid,
    pub assigned_to: Option<Uuid>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct AssignTicketRequest {
    pub agent_id: Uuid,
}

impl From<Ticket> for TicketResponse {
    fn from(ticket: Ticket) -> Self {
        Self {
            id: ticket.id,
            title: ticket.title,
            description: ticket.description,
            status: ticket.status,
            priority: ticket.priority,
            customer_id: ticket.customer_id,
            assigned_to: ticket.assigned_to,
            created_at: ticket.created_at,
            updated_at: ticket.updated_at,
        }
    }
}
