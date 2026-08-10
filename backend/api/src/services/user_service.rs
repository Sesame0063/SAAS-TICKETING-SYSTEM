use anyhow::{Result, anyhow};
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    dto::user::UpdateUserRoleRequest, entities::User, repositories::user_repository::UserRepository,
};

pub struct UserService;

impl UserService {
    pub async fn update_role(
        pool: &PgPool,
        user_id: Uuid,
        request: UpdateUserRoleRequest,
    ) -> Result<User> {
        let role = request.role.to_lowercase();

        if role != "customer" && role != "agent" && role != "admin" {
            return Err(anyhow!("Invalid role"));
        }

        let user = UserRepository::update_role(pool, user_id, role)
            .await?
            .ok_or_else(|| anyhow!("User not found"))?;

        Ok(user)
    }
}
