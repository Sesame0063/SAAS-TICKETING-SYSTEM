use tower_http::limit::RequestBodyLimitLayer;

pub fn body_limit_layer() -> RequestBodyLimitLayer {
    RequestBodyLimitLayer::new(10 * 1024 * 1024)
}
