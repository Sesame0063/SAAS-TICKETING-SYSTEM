use axum::{Json, extract::State};

use crate::{errors::AppError, services::report::ReportService, state::AppState};

pub async fn dashboard_report(
    State(state): State<AppState>,
) -> Result<Json<serde_json::Value>, AppError> {
    let report = ReportService::dashboard_report(&state.db).await?;

    Ok(Json(serde_json::json!(report)))
}

pub async fn agent_report(
    State(state): State<AppState>,
) -> Result<Json<serde_json::Value>, AppError> {
    let report = ReportService::agent_report(&state.db).await?;

    Ok(Json(serde_json::json!(report)))
}

pub async fn customer_report(
    State(state): State<AppState>,
) -> Result<Json<serde_json::Value>, AppError> {
    let report = ReportService::customer_report(&state.db).await?;

    Ok(Json(serde_json::json!(report)))
}

pub async fn export_csv(
    State(state): State<AppState>,
) -> Result<Json<serde_json::Value>, AppError> {
    let path = ReportService::export_csv(&state.db).await?;

    Ok(Json(serde_json::json!({
        "success": true,
        "file": path
    })))
}

pub async fn export_pdf(
    State(state): State<AppState>,
) -> Result<Json<serde_json::Value>, AppError> {
    let path = ReportService::export_pdf(&state.db).await?;

    Ok(Json(serde_json::json!({
        "success": true,
        "file": path
    })))
}
