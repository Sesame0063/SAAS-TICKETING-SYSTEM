pub fn validate_page(page: i64) -> bool {
    page > 0
}

pub fn validate_limit(limit: i64) -> bool {
    limit > 0 && limit <= 100
}
