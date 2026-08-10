use axum::{http::Request, middleware::Next, response::Response};

pub async fn logging_middleware(request: Request<axum::body::Body>, next: Next) -> Response {
    let method = request.method().clone();
    let uri = request.uri().clone();

    tracing::info!("{} {}", method, uri);

    let response = next.run(request).await;

    tracing::info!("Completed {} {}", method, uri);

    response
}
