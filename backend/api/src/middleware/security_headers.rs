use axum::http::{HeaderValue, header::HeaderName};
use tower_http::set_header::SetResponseHeaderLayer;

pub fn security_headers() -> SetResponseHeaderLayer<HeaderValue> {
    SetResponseHeaderLayer::if_not_present(
        HeaderName::from_static("x-content-type-options"),
        HeaderValue::from_static("nosniff"),
    )
}
