pub const MAX_ATTACHMENT_SIZE: usize = 20 * 1024 * 1024;

pub fn validate_size(size: usize) -> bool {
    size <= MAX_ATTACHMENT_SIZE
}
