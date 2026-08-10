use serde::{Deserialize, Serialize};
use serde_json::Value;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WsMessage {
    pub event: String,
    pub payload: Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ClientMessage {
    // ============================
    // Room
    // ============================
    JoinRoom {
        ticket_id: Uuid,
    },

    LeaveRoom {
        ticket_id: Uuid,
    },

    // ============================
    // Ticket
    // ============================
    TicketUpdated {
        ticket_id: Uuid,
    },

    TicketStatusChanged {
        ticket_id: Uuid,
        status: String,
    },

    // ============================
    // Comments
    // ============================
    Comment {
        ticket_id: Uuid,
        content: String,
    },

    // ============================
    // Typing
    // ============================
    Typing {
        ticket_id: Uuid,
    },

    StopTyping {
        ticket_id: Uuid,
    },

    // ============================
    // Attachments
    // ============================
    AttachmentUploaded {
        ticket_id: Uuid,
        attachment_id: Uuid,
    },

    // ============================
    // Notifications
    // ============================
    NotificationRead {
        notification_id: Uuid,
    },

    // ============================
    // Dashboard
    // ============================
    RefreshDashboard,

    // ============================
    // Knowledge Base
    // ============================
    KnowledgeBaseUpdated {
        article_id: Uuid,
    },

    // ============================
    // Ping
    // ============================
    Ping,
}
