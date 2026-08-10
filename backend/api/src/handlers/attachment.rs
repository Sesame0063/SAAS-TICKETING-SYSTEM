use axum::{
    Json,
    extract::{Multipart, Path, State},
    http::StatusCode,
};
use tokio::{fs, io::AsyncWriteExt};
use uuid::Uuid;

use crate::{
    dto::attachment::AttachmentResponse, errors::AppError, extractors::auth::AuthenticatedUser,
    services::attachment::AttachmentService, state::AppState,
};

pub async fn upload_attachment(
    Path(ticket_id): Path<Uuid>,
    State(state): State<AppState>,
    AuthenticatedUser(user): AuthenticatedUser,
    mut multipart: Multipart,
) -> Result<Json<AttachmentResponse>, AppError> {
    let field = multipart
        .next_field()
        .await
        .map_err(|e| AppError::BadRequest(e.to_string()))?
        .ok_or_else(|| AppError::BadRequest("No file uploaded.".to_string()))?;

    let original_filename = field.file_name().unwrap_or("file").to_string();

    let mime_type = field
        .content_type()
        .unwrap_or("application/octet-stream")
        .to_string();

    let data = field
        .bytes()
        .await
        .map_err(|e| AppError::BadRequest(e.to_string()))?;

    let stored_filename = format!("{}_{}", Uuid::new_v4(), original_filename);

    let upload_dir = "./uploads";

    fs::create_dir_all(upload_dir)
        .await
        .map_err(|e| AppError::InternalServerError(e.to_string()))?;

    let file_path = format!("{}/{}", upload_dir, stored_filename);

    let mut file = fs::File::create(&file_path)
        .await
        .map_err(|e| AppError::InternalServerError(e.to_string()))?;

    file.write_all(&data)
        .await
        .map_err(|e| AppError::InternalServerError(e.to_string()))?;

    let attachment = AttachmentService::create(
        &state.db,
        &state.ws_manager,
        ticket_id,
        user.id,
        original_filename,
        stored_filename,
        mime_type,
        data.len() as i64,
        file_path,
    )
    .await
    .map_err(|e| AppError::BadRequest(e.to_string()))?;

    Ok(Json(attachment))
}

pub async fn get_attachments(
    Path(ticket_id): Path<Uuid>,
    State(state): State<AppState>,
    AuthenticatedUser(_user): AuthenticatedUser,
) -> Result<Json<Vec<AttachmentResponse>>, AppError> {
    let attachments = AttachmentService::get_ticket_attachments(&state.db, ticket_id)
        .await
        .map_err(|e| AppError::BadRequest(e.to_string()))?;

    Ok(Json(attachments))
}

pub async fn delete_attachment(
    Path(attachment_id): Path<Uuid>,
    State(state): State<AppState>,
    AuthenticatedUser(user): AuthenticatedUser,
) -> Result<StatusCode, AppError> {
    AttachmentService::delete(&state.db, &state.ws_manager, attachment_id, user.id)
        .await
        .map_err(|e| AppError::NotFound(e.to_string()))?;

    Ok(StatusCode::NO_CONTENT)
}
use axum::response::IntoResponse;

pub async fn download_attachment(
    Path(attachment_id): Path<Uuid>,
    State(state): State<AppState>,
    AuthenticatedUser(_user): AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let attachment = AttachmentService::download(&state.db, attachment_id)
        .await
        .map_err(|e| AppError::NotFound(e.to_string()))?;

    let file = fs::read(&attachment.file_path)
        .await
        .map_err(|e| AppError::InternalServerError(e.to_string()))?;

    Ok((
        [
            (axum::http::header::CONTENT_TYPE, attachment.mime_type),
            (
                axum::http::header::CONTENT_DISPOSITION,
                format!("attachment; filename=\"{}\"", attachment.original_filename),
            ),
        ],
        file,
    ))
}
