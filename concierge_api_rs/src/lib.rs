pub mod payload;
pub mod status;

use payload::Payload;

/// Payloads where the message data fields are JSON values.
pub type JsonPayload<'a> = Payload<'a, serde_json::Value>;

pub mod close_codes {
    pub struct CloseReason {
        pub code: u16,
        pub reason: &'static str,
    }

    impl CloseReason {
        pub const fn new(code: u16, reason: &'static str) -> Self {
            Self { code, reason }
        }
    }

    #[allow(dead_code)]
    pub const UNKNOWN: CloseReason = CloseReason::new(4000, "Unknown reason");
    pub const FATAL_DECODE: CloseReason = CloseReason::new(4002, "Failed to critical payload");
    pub const NO_AUTH: CloseReason = CloseReason::new(4003, "No identification payload sent");
    pub const AUTH_FAILED: CloseReason = CloseReason::new(4004, "Authorization failed");
    pub const DUPLICATE_AUTH: CloseReason = CloseReason::new(4005, "Duplicate name in namespace");
    pub const BAD_SECRET: CloseReason = CloseReason::new(4006, "Secret mismatch");
    pub const BAD_VERSION: CloseReason = CloseReason::new(4007, "Version mismatch");
    pub const BAD_AUTH: CloseReason = CloseReason::new(4008, "Name must be alphanumeric");
}
