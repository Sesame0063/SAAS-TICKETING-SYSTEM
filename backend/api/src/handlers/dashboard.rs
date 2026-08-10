use axum::{Json, extract::State, http::StatusCode};

use crate::{
    dto::dashboard::DashboardSummary,
    extractors::{auth::AuthenticatedUser, role_guard::RoleGuard},
    services::dashboard::DashboardService,
    state::AppState,
};

pub async fn dashboard_summary(
    State(state): State<AppState>,
    AuthenticatedUser(user): AuthenticatedUser,
) -> Result<Json<DashboardSummary>, StatusCode> {
    // Only Agents and Admins can access dashboard
    RoleGuard::agent_or_admin(&user)?;

    let summary = DashboardService::summary(&state.db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(summary))
}
