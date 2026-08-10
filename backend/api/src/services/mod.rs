pub mod attachment;
pub mod audit;
pub mod auth;
pub mod comment;
pub mod dashboard;
pub mod email;
pub mod knowledge_base;
pub mod notification;
pub mod redis;
pub mod report;
pub mod search;
pub mod ticket;
pub mod ticket_history;
pub mod user_service;

pub use knowledge_base::KnowledgeBaseService;
pub use redis::RedisService;
