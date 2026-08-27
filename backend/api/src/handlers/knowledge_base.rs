use axum::{
    Json,
    extract::{Extension, Path, State},
};
use uuid::Uuid;

use crate::{
    dto::knowledge_base::{
        CreateKnowledgeBaseRequest, KnowledgeBaseResponse, UpdateKnowledgeBaseRequest,
    },
    entities::User,
    errors::AppError,
    response::ApiResponse,
    services::KnowledgeBaseService,
    state::AppState,
};

pub async fn create(
    State(state): State<AppState>,
    Extension(user): Extension<User>,
    Json(request): Json<CreateKnowledgeBaseRequest>,
) -> Result<Json<ApiResponse<KnowledgeBaseResponse>>, AppError> {
    // TODO:
    // Replace user.id with the authenticated user's ID
    // once JWT authentication is fully integrated.
    let article = KnowledgeBaseService::create(&state.db, request, user.id).await?;

    Ok(Json(ApiResponse::success(article)))
}

pub async fn get_all(
    State(state): State<AppState>,
) -> Result<Json<ApiResponse<Vec<KnowledgeBaseResponse>>>, AppError> {
    let articles = KnowledgeBaseService::get_all(&state.db).await?;

    Ok(Json(ApiResponse::success(articles)))
}

pub async fn get_by_id(
    State(state): State<AppState>,
    Path(article_id): Path<Uuid>,
) -> Result<Json<ApiResponse<KnowledgeBaseResponse>>, AppError> {
    let article = KnowledgeBaseService::get_by_id(&state.db, article_id).await?;

    Ok(Json(ApiResponse::success(article)))
}

pub async fn update(
    State(state): State<AppState>,
    Path(article_id): Path<Uuid>,
    Json(request): Json<UpdateKnowledgeBaseRequest>,
) -> Result<Json<ApiResponse<KnowledgeBaseResponse>>, AppError> {
    let article = KnowledgeBaseService::update(&state.db, article_id, request).await?;

    Ok(Json(ApiResponse::success(article)))
}

pub async fn delete(
    State(state): State<AppState>,
    Path(article_id): Path<Uuid>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    KnowledgeBaseService::delete(&state.db, article_id).await?;

    Ok(Json(ApiResponse::success(
        "Knowledge base article deleted successfully",
    )))
}
