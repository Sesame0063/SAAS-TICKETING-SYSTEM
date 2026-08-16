use anyhow::{Result, anyhow};
use redis::Client;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    config::Settings,
    dto::{
        history::CreateHistoryRequest,
        query::TicketQuery,
        status::UpdateStatusRequest,
        ticket::{AssignTicketRequest, CreateTicketRequest, TicketResponse, UpdateTicketRequest},
    },
    repositories::{ticket_repository, user_repository::UserRepository},
    services::{
        RedisService, audit::AuditService, email::EmailService, notification::NotificationService,
        ticket_history::TicketHistoryService,
    },
    websocket::{ConnectionManager, WsEvents},
};

fn ticket_cache_key(ticket_id: Uuid) -> String {
    format!("ticket:{ticket_id}")
}

pub struct TicketService;

impl TicketService {
    pub async fn create(
        pool: &PgPool,
        ws: &ConnectionManager,
        settings: &Settings,
        customer_id: Uuid,
        request: CreateTicketRequest,
    ) -> Result<TicketResponse> {
        tracing::info!(
            customer_id = %customer_id,
            title = %request.title,
            "Creating ticket"
        );

        let ticket = ticket_repository::create(pool, customer_id, request).await?;

        if let Ok(Some(customer)) = UserRepository::find_by_id(pool, customer_id).await {
            if let Err(err) = EmailService::send_ticket_created(
                settings,
                &customer.email,
                &customer.first_name,
                &ticket.title,
            )
            .await
            {
                tracing::warn!(
                    customer_id = %customer_id,
                    email = %customer.email,
                    error = ?err,
                    "Failed to send ticket-created email"
                );
            }
        }

        AuditService::log(
            pool,
            customer_id,
            "CREATE_TICKET".to_string(),
            "Ticket".to_string(),
            ticket.id,
            format!("Created ticket '{}'", ticket.title),
        )
        .await?;

        ws.broadcast(WsEvents::ticket_created(ticket.id, ticket.title.clone()))
            .await;

        tracing::info!(
            ticket_id = %ticket.id,
            customer_id = %customer_id,
            "Ticket created successfully"
        );

        Ok(ticket.into())
    }

    pub async fn get_my_tickets(pool: &PgPool, customer_id: Uuid) -> Result<Vec<TicketResponse>> {
        tracing::info!(
            customer_id = %customer_id,
            "Fetching customer tickets"
        );

        let tickets = ticket_repository::find_by_customer(pool, customer_id).await?;

        tracing::info!(
            customer_id = %customer_id,
            total = tickets.len(),
            "Customer tickets fetched successfully"
        );

        Ok(tickets.into_iter().map(Into::into).collect())
    }

    pub async fn search_my_tickets(
        pool: &PgPool,
        customer_id: Uuid,
        query: TicketQuery,
    ) -> Result<Vec<TicketResponse>> {
        tracing::info!(
            customer_id = %customer_id,
            "Searching customer tickets"
        );

        let tickets = ticket_repository::search_by_customer(pool, customer_id, query).await?;

        tracing::info!(
            customer_id = %customer_id,
            total = tickets.len(),
            "Customer ticket search completed"
        );

        Ok(tickets.into_iter().map(Into::into).collect())
    }

    pub async fn get_all_tickets(pool: &PgPool) -> Result<Vec<TicketResponse>> {
        tracing::info!("Fetching all tickets");

        let tickets = ticket_repository::find_all(pool).await?;

        tracing::info!(total = tickets.len(), "All tickets fetched successfully");

        Ok(tickets.into_iter().map(Into::into).collect())
    }

    pub async fn get_ticket_by_id(
        pool: &PgPool,
        redis: &Client,
        ticket_id: Uuid,
        customer_id: Uuid,
    ) -> Result<TicketResponse> {
        tracing::info!(
            ticket_id = %ticket_id,
            customer_id = %customer_id,
            "Fetching ticket"
        );

        let cache_key = ticket_cache_key(ticket_id);

        if let Ok(Some(ticket)) = RedisService::get::<TicketResponse>(redis, &cache_key).await {
            tracing::debug!(
                ticket_id = %ticket_id,
                "Redis cache hit"
            );

            return Ok(ticket);
        }

        tracing::debug!(
            ticket_id = %ticket_id,
            "Redis cache miss"
        );

        let ticket = ticket_repository::find_by_id(pool, ticket_id, customer_id)
            .await?
            .ok_or_else(|| anyhow!("Ticket not found"))?;

        let response: TicketResponse = ticket.into();

        if let Err(err) = RedisService::set(redis, &cache_key, &response, 300).await {
            tracing::warn!(
                ticket_id = %ticket_id,
                error = ?err,
                "Failed to cache ticket"
            );
        }

        tracing::info!(
            ticket_id = %ticket_id,
            "Ticket fetched successfully"
        );

        Ok(response)
    }

    pub async fn update_ticket(
        pool: &PgPool,
        redis: &Client,
        ws: &ConnectionManager,
        ticket_id: Uuid,
        customer_id: Uuid,
        request: UpdateTicketRequest,
    ) -> Result<TicketResponse> {
        tracing::info!(
            ticket_id = %ticket_id,
            customer_id = %customer_id,
            "Updating ticket"
        );

        // Fetch the existing ticket before updating it.
        // This allows us to record exactly what changed.
        let old_ticket = ticket_repository::find_by_id(pool, ticket_id, customer_id)
            .await?
            .ok_or_else(|| anyhow!("Ticket not found"))?;

        // Keep copies because the request will be moved into the repository.
        let new_title = request.title.clone();
        let new_description = request.description.clone();
        let new_priority = request.priority.clone();

        // Update the ticket.
        let ticket = ticket_repository::update(pool, ticket_id, customer_id, request)
            .await?
            .ok_or_else(|| anyhow!("Ticket not found"))?;

        // Record title change.
        if let Some(new_value) = new_title {
            if new_value != old_ticket.title {
                TicketHistoryService::create(
                    pool,
                    CreateHistoryRequest {
                        ticket_id: ticket.id,
                        changed_by: customer_id,
                        field_name: "title".to_string(),
                        old_value: Some(old_ticket.title.clone()),
                        new_value: Some(new_value),
                    },
                )
                .await?;
            }
        }

        // Record description change.
        if let Some(new_value) = new_description {
            if new_value != old_ticket.description {
                TicketHistoryService::create(
                    pool,
                    CreateHistoryRequest {
                        ticket_id: ticket.id,
                        changed_by: customer_id,
                        field_name: "description".to_string(),
                        old_value: Some(old_ticket.description.clone()),
                        new_value: Some(new_value),
                    },
                )
                .await?;
            }
        }

        // Record priority change.
        if let Some(new_value) = new_priority {
            if new_value != old_ticket.priority {
                TicketHistoryService::create(
                    pool,
                    CreateHistoryRequest {
                        ticket_id: ticket.id,
                        changed_by: customer_id,
                        field_name: "priority".to_string(),
                        old_value: Some(old_ticket.priority.clone()),
                        new_value: Some(new_value),
                    },
                )
                .await?;
            }
        }

        // Existing audit log.
        AuditService::log(
            pool,
            customer_id,
            "UPDATE_TICKET".to_string(),
            "Ticket".to_string(),
            ticket.id,
            format!("Updated ticket '{}'", ticket.title),
        )
        .await?;

        // Invalidate Redis cache.
        if let Err(err) = RedisService::delete(redis, &ticket_cache_key(ticket.id)).await {
            tracing::warn!(
                ticket_id = %ticket.id,
                error = ?err,
                "Failed to invalidate Redis cache"
            );
        }

        // Notify WebSocket room.
        ws.broadcast_to_room(&ticket.id, WsEvents::ticket_updated(ticket.id))
            .await;

        tracing::info!(
            ticket_id = %ticket.id,
            "Ticket updated successfully"
        );

        Ok(ticket.into())
    }
    pub async fn delete_ticket(
        pool: &PgPool,
        redis: &Client,
        ws: &ConnectionManager,
        ticket_id: Uuid,
        customer_id: Uuid,
    ) -> Result<()> {
        tracing::info!(
            ticket_id = %ticket_id,
            customer_id = %customer_id,
            "Deleting ticket"
        );

        let deleted = ticket_repository::delete(pool, ticket_id, customer_id).await?;

        if !deleted {
            return Err(anyhow!("Ticket not found"));
        }

        AuditService::log(
            pool,
            customer_id,
            "DELETE_TICKET".to_string(),
            "Ticket".to_string(),
            ticket_id,
            format!("Deleted ticket {}", ticket_id),
        )
        .await?;

        if let Err(err) = RedisService::delete(redis, &ticket_cache_key(ticket_id)).await {
            tracing::warn!(
                ticket_id = %ticket_id,
                error = ?err,
                "Failed to invalidate Redis cache"
            );
        }

        ws.broadcast(WsEvents::ticket_deleted(ticket_id)).await;

        tracing::info!(
            ticket_id = %ticket_id,
            "Ticket deleted successfully"
        );

        Ok(())
    }

    pub async fn assign_ticket(
        pool: &PgPool,
        redis: &Client,
        ws: &ConnectionManager,
        settings: &Settings,
        ticket_id: Uuid,
        request: AssignTicketRequest,
    ) -> Result<TicketResponse> {
        tracing::info!(
            ticket_id = %ticket_id,
            agent_id = %request.agent_id,
            "Assigning ticket"
        );

        let ticket = ticket_repository::assign(pool, ticket_id, request.agent_id)
            .await?
            .ok_or_else(|| anyhow!("Ticket not found"))?;

        if let Ok(Some(agent)) = UserRepository::find_by_id(pool, request.agent_id).await {
            if let Err(err) = EmailService::send_ticket_assigned(
                settings,
                &agent.email,
                &agent.first_name,
                &ticket.title,
            )
            .await
            {
                tracing::warn!(
                    agent_id = %request.agent_id,
                    email = %agent.email,
                    error = ?err,
                    "Failed to send ticket-assigned email"
                );
            }
        }

        AuditService::log(
            pool,
            request.agent_id,
            "ASSIGN_TICKET".to_string(),
            "Ticket".to_string(),
            ticket.id,
            "Assigned ticket".to_string(),
        )
        .await?;

        if let Err(err) = RedisService::delete(redis, &ticket_cache_key(ticket.id)).await {
            tracing::warn!(
                ticket_id = %ticket.id,
                error = ?err,
                "Failed to invalidate Redis cache"
            );
        }

        ws.send_to_user(
            &request.agent_id,
            WsEvents::ticket_assigned(ticket.id, request.agent_id),
        )
        .await;

        ws.send_to_user(
            &ticket.customer_id,
            WsEvents::ticket_assigned(ticket.id, request.agent_id),
        )
        .await;

        if let Err(err) = NotificationService::create_and_notify(
            pool,
            ws,
            request.agent_id,
            "Ticket assigned".to_string(),
            format!("Ticket '{}' has been assigned to you.", ticket.title),
        )
        .await
        {
            tracing::warn!(
                ticket_id = %ticket.id,
                agent_id = %request.agent_id,
                error = ?err,
                "Failed to create agent assignment notification"
            );
        }

        if let Err(err) = NotificationService::create_and_notify(
            pool,
            ws,
            ticket.customer_id,
            "Ticket assigned".to_string(),
            format!(
                "Your ticket '{}' has been assigned to an agent.",
                ticket.title
            ),
        )
        .await
        {
            tracing::warn!(
                ticket_id = %ticket.id,
                customer_id = %ticket.customer_id,
                error = ?err,
                "Failed to create customer assignment notification"
            );
        }

        tracing::info!(
            ticket_id = %ticket.id,
            agent_id = %request.agent_id,
            "Ticket assigned successfully"
        );

        Ok(ticket.into())
    }

    pub async fn update_status(
        pool: &PgPool,
        redis: &Client,
        ws: &ConnectionManager,
        settings: &Settings,
        ticket_id: Uuid,
        request: UpdateStatusRequest,
    ) -> Result<TicketResponse> {
        tracing::info!(
            ticket_id = %ticket_id,
            status = %request.status,
            "Updating ticket status"
        );

        let old_ticket = sqlx::query_as::<_, crate::entities::Ticket>(
            r#"
            SELECT *
            FROM tickets
            WHERE id = $1
            "#,
        )
        .bind(ticket_id)
        .fetch_optional(pool)
        .await?
        .ok_or_else(|| anyhow!("Ticket not found"))?;

        let old_status = old_ticket.status.clone();
        let new_status = request.status.clone();

        let ticket = ticket_repository::update_status(pool, ticket_id, new_status.clone())
            .await?
            .ok_or_else(|| anyhow!("Ticket not found"))?;

        if old_status != ticket.status {
            TicketHistoryService::create(
                pool,
                CreateHistoryRequest {
                    ticket_id: ticket.id,
                    changed_by: ticket.customer_id,
                    field_name: "status".to_string(),
                    old_value: Some(old_status),
                    new_value: Some(ticket.status.clone()),
                },
            )
            .await?;
        }

        if ticket.status == "Closed" || ticket.status == "Resolved" {
            if let Ok(Some(customer)) = UserRepository::find_by_id(pool, ticket.customer_id).await {
                if let Err(err) = EmailService::send_ticket_closed(
                    settings,
                    &customer.email,
                    &customer.first_name,
                    &ticket.title,
                )
                .await
                {
                    tracing::warn!(
                        customer_id = %ticket.customer_id,
                        email = %customer.email,
                        error = ?err,
                        "Failed to send ticket-closed email"
                    );
                }
            }
        }

        AuditService::log(
            pool,
            ticket.customer_id,
            "UPDATE_STATUS".to_string(),
            "Ticket".to_string(),
            ticket.id,
            format!("Changed status to {}", ticket.status),
        )
        .await?;

        if let Err(err) = RedisService::delete(redis, &ticket_cache_key(ticket.id)).await {
            tracing::warn!(
                ticket_id = %ticket.id,
                error = ?err,
                "Failed to invalidate Redis cache"
            );
        }

        ws.broadcast_to_room(
            &ticket.id,
            WsEvents::ticket_status_updated(ticket.id, request.status.clone()),
        )
        .await;

        if let Err(err) = NotificationService::create_and_notify(
            pool,
            ws,
            ticket.customer_id,
            "Ticket status updated".to_string(),
            format!("Your ticket '{}' is now {}.", ticket.title, ticket.status),
        )
        .await
        {
            tracing::warn!(
                ticket_id = %ticket.id,
                customer_id = %ticket.customer_id,
                error = ?err,
                "Failed to create status notification"
            );
        }

        tracing::info!(
            ticket_id = %ticket.id,
            status = %ticket.status,
            "Ticket status updated successfully"
        );

        Ok(ticket.into())
    }
}
