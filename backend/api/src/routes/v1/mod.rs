use axum::{
    routing::{delete, get, patch, post, put},
    Router,
};

use crate::{
    handlers::{
        attachment::{
            delete_attachment,
            download_attachment,
            get_attachments,
            upload_attachment,
        },
        auth::{
            forgot_password,
            login,
            logout,
            refresh_token,
            register,
            reset_password,
            verify_email,
        },
        comment::{
            create_comment,
            delete_comment,
            get_comments,
            update_comment,
        },
        health::health,
        notification::{
            delete_notification,
            get_notifications,
            mark_notification_read,
        },
        report::{
            agent_report,
            customer_report,
            dashboard_report,
            export_csv,
            export_pdf,
        },
        ticket::{
            assign_ticket,
            create_ticket,
            delete_ticket,
            get_all_tickets,
            get_my_tickets,
            get_ticket,
            update_ticket,
            update_ticket_status,
        },
        ticket_history::get_ticket_history,
        user::me,
    },
    routes::audit,
    state::AppState,
};

pub fn routes() -> Router<AppState> {
    Router::new()

        // ==========================================================
        // Health
        // ==========================================================
        .route("/health", get(health))

        // ==========================================================
        // Authentication
        // ==========================================================
        .route("/register", post(register))
        .route("/login", post(login))
        .route("/refresh", post(refresh_token))
        .route("/verify-email", post(verify_email))
        .route("/forgot-password", post(forgot_password))
        .route("/reset-password", post(reset_password))
        .route("/logout", post(logout))

        // ==========================================================
        // Current User
        // ==========================================================
        .route("/me", get(me))

        // ==========================================================
        // Customer Tickets
        // ==========================================================
        .route(
            "/tickets",
            post(create_ticket)
                .get(get_my_tickets),
        )
        .route(
            "/tickets/{ticket_id}",
            get(get_ticket)
                .put(update_ticket)
                .delete(delete_ticket),
        )
        .route(
            "/tickets/{ticket_id}/history",
            get(get_ticket_history),
        )

        // ==========================================================
        // Admin / Agent Ticket Management
        // ==========================================================
        .route("/admin/tickets", get(get_all_tickets))
        .route(
            "/tickets/{ticket_id}/assign",
            patch(assign_ticket),
        )
        .route(
            "/tickets/{ticket_id}/status",
            patch(update_ticket_status),
        )

        // ==========================================================
        // Comments
        // ==========================================================
        .route(
            "/tickets/{ticket_id}/comments",
            post(create_comment)
                .get(get_comments),
        )
        .route(
            "/comments/{comment_id}",
            put(update_comment)
                .delete(delete_comment),
        )

        // ==========================================================
        // Attachments
        // ==========================================================
        .route(
            "/tickets/{ticket_id}/attachments",
            post(upload_attachment)
                .get(get_attachments),
        )
        .route(
            "/attachments/{attachment_id}",
            delete(delete_attachment),
        )
        .route(
            "/attachments/{attachment_id}/download",
            get(download_attachment),
        )

        // ==========================================================
        // Notifications
        // ==========================================================
        .route(
            "/notifications",
            get(get_notifications),
        )
        .route(
            "/notifications/{notification_id}/read",
            patch(mark_notification_read),
        )
        .route(
            "/notifications/{notification_id}",
            delete(delete_notification),
        )

        // ==========================================================
        // Reports
        // ==========================================================
        .route("/reports/dashboard", get(dashboard_report))
        .route("/reports/agents", get(agent_report))
        .route("/reports/customers", get(customer_report))
        .route("/reports/export/csv", get(export_csv))
        .route("/reports/export/pdf", get(export_pdf))

        // ==========================================================
        // Audit
        // ==========================================================
        .nest("", audit::routes())
}