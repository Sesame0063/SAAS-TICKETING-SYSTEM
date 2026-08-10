use std::{
    collections::{HashMap, HashSet},
    sync::Arc,
};

use tokio::sync::{RwLock, mpsc};
use uuid::Uuid;

use super::message::WsMessage;

pub type ClientSender = mpsc::UnboundedSender<WsMessage>;

#[derive(Clone)]
pub struct ConnectionManager {
    connections: Arc<RwLock<HashMap<Uuid, ClientSender>>>,
    rooms: Arc<RwLock<HashMap<Uuid, HashSet<Uuid>>>>,
}

impl ConnectionManager {
    pub fn new() -> Self {
        Self {
            connections: Arc::new(RwLock::new(HashMap::new())),
            rooms: Arc::new(RwLock::new(HashMap::new())),
        }
    }

    // =====================================================
    // Connection Management
    // =====================================================

    pub async fn connect(&self, user_id: Uuid, sender: ClientSender) {
        self.connections.write().await.insert(user_id, sender);
    }

    pub async fn disconnect(&self, user_id: &Uuid) {
        self.connections.write().await.remove(user_id);

        self.leave_all_rooms(user_id).await;
    }

    pub async fn is_connected(&self, user_id: &Uuid) -> bool {
        self.connections.read().await.contains_key(user_id)
    }

    // =====================================================
    // Room Management
    // =====================================================

    pub async fn join_room(&self, ticket_id: Uuid, user_id: Uuid) {
        let mut rooms = self.rooms.write().await;

        rooms
            .entry(ticket_id)
            .or_insert_with(HashSet::new)
            .insert(user_id);
    }

    pub async fn leave_room(&self, ticket_id: &Uuid, user_id: &Uuid) {
        let mut rooms = self.rooms.write().await;

        if let Some(room) = rooms.get_mut(ticket_id) {
            room.remove(user_id);

            if room.is_empty() {
                rooms.remove(ticket_id);
            }
        }
    }

    pub async fn leave_all_rooms(&self, user_id: &Uuid) {
        let mut rooms = self.rooms.write().await;

        rooms.retain(|_, users| {
            users.remove(user_id);
            !users.is_empty()
        });
    }

    // =====================================================
    // Messaging
    // =====================================================

    pub async fn send_to_user(&self, user_id: &Uuid, message: WsMessage) {
        let connections = self.connections.read().await;

        if let Some(sender) = connections.get(user_id) {
            let _ = sender.send(message);
        }
    }

    pub async fn broadcast(&self, message: WsMessage) {
        let mut disconnected = Vec::new();

        {
            let connections = self.connections.read().await;

            for (user_id, sender) in connections.iter() {
                if sender.send(message.clone()).is_err() {
                    disconnected.push(*user_id);
                }
            }
        }

        for user_id in disconnected {
            self.disconnect(&user_id).await;
        }
    }

    pub async fn broadcast_to_room(&self, ticket_id: &Uuid, message: WsMessage) {
        let users = {
            let rooms = self.rooms.read().await;

            rooms.get(ticket_id).cloned().unwrap_or_default()
        };

        let mut disconnected = Vec::new();

        {
            let connections = self.connections.read().await;

            for user_id in users {
                if let Some(sender) = connections.get(&user_id)
                    && sender.send(message.clone()).is_err()
                {
                    disconnected.push(user_id);
                }
            }
        }

        for user_id in disconnected {
            self.disconnect(&user_id).await;
        }
    }

    // =====================================================
    // Statistics
    // =====================================================

    pub async fn connected_users_count(&self) -> usize {
        self.connections.read().await.len()
    }

    pub async fn room_size(&self, ticket_id: &Uuid) -> usize {
        self.rooms
            .read()
            .await
            .get(ticket_id)
            .map(|users| users.len())
            .unwrap_or(0)
    }

    pub async fn total_rooms(&self) -> usize {
        self.rooms.read().await.len()
    }
}
