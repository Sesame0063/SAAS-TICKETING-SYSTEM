use anyhow::Result;
use redis::{AsyncCommands, Client};
use serde::{Serialize, de::DeserializeOwned};

pub struct RedisService;

impl RedisService {
    pub async fn set<T>(client: &Client, key: &str, value: &T, ttl: u64) -> Result<()>
    where
        T: Serialize,
    {
        let mut conn = client.get_multiplexed_async_connection().await?;

        let json = serde_json::to_string(value)?;

        let _: () = conn.set_ex(key, json, ttl.try_into().unwrap()).await?;

        Ok(())
    }

    pub async fn get<T>(client: &Client, key: &str) -> Result<Option<T>>
    where
        T: DeserializeOwned,
    {
        let mut conn = client.get_multiplexed_async_connection().await?;

        let value: Option<String> = conn.get(key).await?;

        match value {
            Some(json) => Ok(Some(serde_json::from_str::<T>(&json)?)),
            None => Ok(None),
        }
    }

    pub async fn delete(client: &Client, key: &str) -> Result<()> {
        let mut conn = client.get_multiplexed_async_connection().await?;

        let _: () = conn.del(key).await?;

        Ok(())
    }

    pub async fn exists(client: &Client, key: &str) -> Result<bool> {
        let mut conn = client.get_multiplexed_async_connection().await?;

        let exists: bool = conn.exists(key).await?;

        Ok(exists)
    }

    pub async fn delete_pattern(client: &Client, pattern: &str) -> Result<()> {
        let mut conn = client.get_multiplexed_async_connection().await?;

        let keys: Vec<String> = conn.keys(pattern).await?;

        if !keys.is_empty() {
            let _: () = conn.del(keys).await?;
        }

        Ok(())
    }

    // ==========================================================
    // Authentication Helpers
    // ==========================================================

    pub async fn store_refresh_token(
        client: &Client,
        user_id: &str,
        refresh_token: &str,
        ttl: u64,
    ) -> Result<()> {
        let key = format!("refresh:{user_id}");

        Self::set(client, &key, &refresh_token.to_string(), ttl).await
    }

    pub async fn get_refresh_token(client: &Client, user_id: &str) -> Result<Option<String>> {
        let key = format!("refresh:{user_id}");

        Self::get::<String>(client, &key).await
    }

    pub async fn delete_refresh_token(client: &Client, user_id: &str) -> Result<()> {
        let key = format!("refresh:{user_id}");

        Self::delete(client, &key).await
    }

    pub async fn blacklist_access_token(client: &Client, token: &str, ttl: u64) -> Result<()> {
        let key = format!("blacklist:{token}");

        Self::set(client, &key, &true, ttl).await
    }

    pub async fn is_blacklisted(client: &Client, token: &str) -> Result<bool> {
        let key = format!("blacklist:{token}");

        Self::exists(client, &key).await
    }
}
