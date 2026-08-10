use axum::http::StatusCode;

use crate::{entities::User, utils::roles};

pub struct RoleGuard;

impl RoleGuard {
    pub fn customer(user: &User) -> Result<(), StatusCode> {
        if user.role == roles::CUSTOMER {
            Ok(())
        } else {
            Err(StatusCode::FORBIDDEN)
        }
    }

    pub fn agent(user: &User) -> Result<(), StatusCode> {
        if user.role == roles::AGENT {
            Ok(())
        } else {
            Err(StatusCode::FORBIDDEN)
        }
    }

    pub fn admin(user: &User) -> Result<(), StatusCode> {
        if user.role == roles::ADMIN {
            Ok(())
        } else {
            Err(StatusCode::FORBIDDEN)
        }
    }

    pub fn agent_or_admin(user: &User) -> Result<(), StatusCode> {
        if user.role == roles::AGENT || user.role == roles::ADMIN {
            Ok(())
        } else {
            Err(StatusCode::FORBIDDEN)
        }
    }
}
