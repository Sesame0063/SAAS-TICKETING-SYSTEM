use std::sync::atomic::{AtomicU64, Ordering};

pub static REQUEST_COUNTER: AtomicU64 = AtomicU64::new(0);

pub fn increment_requests() {
    REQUEST_COUNTER.fetch_add(1, Ordering::Relaxed);
}

pub fn total_requests() -> u64 {
    REQUEST_COUNTER.load(Ordering::Relaxed)
}
