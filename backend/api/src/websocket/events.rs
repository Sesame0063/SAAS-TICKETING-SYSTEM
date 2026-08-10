use serde_json::json;
use uuid::Uuid;

use super::message::WsMessage;

pub struct WsEvents;

impl WsEvents {
    // ==========================================================
    // Ticket Events
    // ==========================================================

    pub fn ticket_created(ticket_id: Uuid, title: String) -> WsMessage {
        WsMessage {
            event: "ticket.created".into(),
            payload: json!({
                "ticket_id": ticket_id,
                "title": title
            }),
        }
    }

    pub fn ticket_updated(ticket_id: Uuid) -> WsMessage {
        WsMessage {
            event: "ticket.updated".into(),
            payload: json!({
                "ticket_id": ticket_id
            }),
        }
    }

    pub fn ticket_deleted(ticket_id: Uuid) -> WsMessage {
        WsMessage {
            event: "ticket.deleted".into(),
            payload: json!({
                "ticket_id": ticket_id
            }),
        }
    }

    pub fn ticket_assigned(ticket_id: Uuid, agent_id: Uuid) -> WsMessage {
        WsMessage {
            event: "ticket.assigned".into(),
            payload: json!({
                "ticket_id": ticket_id,
                "agent_id": agent_id
            }),
        }
    }

    pub fn ticket_status_updated(ticket_id: Uuid, status: String) -> WsMessage {
        WsMessage {
            event: "ticket.status_updated".into(),
            payload: json!({
                "ticket_id": ticket_id,
                "status": status
            }),
        }
    }

    // ==========================================================
    // Comment Events
    // ==========================================================

    pub fn comment_added(ticket_id: Uuid, comment_id: Uuid, message: String) -> WsMessage {
        WsMessage {
            event: "comment.created".into(),
            payload: json!({
                "ticket_id": ticket_id,
                "comment_id": comment_id,
                "message": message
            }),
        }
    }

    pub fn comment_updated(ticket_id: Uuid, comment_id: Uuid) -> WsMessage {
        WsMessage {
            event: "comment.updated".into(),
            payload: json!({
                "ticket_id": ticket_id,
                "comment_id": comment_id
            }),
        }
    }

    pub fn comment_deleted(ticket_id: Uuid, comment_id: Uuid) -> WsMessage {
        WsMessage {
            event: "comment.deleted".into(),
            payload: json!({
                "ticket_id": ticket_id,
                "comment_id": comment_id
            }),
        }
    }

    // ==========================================================
    // Typing Events
    // ==========================================================

    pub fn typing(ticket_id: Uuid, user_id: Uuid) -> WsMessage {
        WsMessage {
            event: "typing".into(),
            payload: json!({
                "ticket_id": ticket_id,
                "user_id": user_id
            }),
        }
    }

    // ==========================================================
    // Attachment Events
    // ==========================================================

    pub fn attachment_uploaded(
        ticket_id: Uuid,
        attachment_id: Uuid,
        filename: String,
    ) -> WsMessage {
        WsMessage {
            event: "attachment.uploaded".into(),
            payload: json!({
                "ticket_id": ticket_id,
                "attachment_id": attachment_id,
                "filename": filename
            }),
        }
    }

    pub fn attachment_deleted(ticket_id: Uuid, attachment_id: Uuid) -> WsMessage {
        WsMessage {
            event: "attachment.deleted".into(),
            payload: json!({
                "ticket_id": ticket_id,
                "attachment_id": attachment_id
            }),
        }
    }

    // ==========================================================
    // Notification Events
    // ==========================================================

    pub fn notification_created(notification_id: Uuid, title: String) -> WsMessage {
        WsMessage {
            event: "notification.created".into(),
            payload: json!({
                "notification_id": notification_id,
                "title": title
            }),
        }
    }

    // ==========================================================
    // Knowledge Base Events
    // ==========================================================

    pub fn knowledge_base_created(article_id: Uuid) -> WsMessage {
        WsMessage {
            event: "knowledge_base.created".into(),
            payload: json!({
                "article_id": article_id
            }),
        }
    }

    pub fn knowledge_base_updated(article_id: Uuid) -> WsMessage {
        WsMessage {
            event: "knowledge_base.updated".into(),
            payload: json!({
                "article_id": article_id
            }),
        }
    }

    pub fn knowledge_base_deleted(article_id: Uuid) -> WsMessage {
        WsMessage {
            event: "knowledge_base.deleted".into(),
            payload: json!({
                "article_id": article_id
            }),
        }
    }

    // ==========================================================
    // Dashboard
    // ==========================================================

    pub fn dashboard_refresh() -> WsMessage {
        WsMessage {
            event: "dashboard.refresh".into(),
            payload: json!({}),
        }
    }

    // ==========================================================
    // System
    // ==========================================================

    pub fn system(message: String) -> WsMessage {
        WsMessage {
            event: "system".into(),
            payload: json!({
                "message": message
            }),
        }
    }
}
