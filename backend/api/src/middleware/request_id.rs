use axum::http::header::HeaderName;
use tower_http::request_id::{MakeRequestUuid, PropagateRequestIdLayer, SetRequestIdLayer};

pub fn request_id_layers() -> (SetRequestIdLayer<MakeRequestUuid>, PropagateRequestIdLayer) {
    let header = HeaderName::from_static("x-request-id");

    (
        SetRequestIdLayer::new(header.clone(), MakeRequestUuid),
        PropagateRequestIdLayer::new(header),
    )
}
