pub mod payload;
pub mod status;

use payload::Payload;

/// Payloads where the message data fields are JSON values.
pub type JsonPayload<'a> = Payload<'a, serde_json::Value>;

pub mod close_codes {
    #[allow(dead_code)]
    pub const UNKNOWN: u16 = 4000;
    pub const FATAL_DECODE: u16 = 4002;
    pub const NO_AUTH: u16 = 4003;
    pub const AUTH_FAILED: u16 = 4004;
    pub const DUPLICATE_AUTH: u16 = 4005;
    pub const BAD_SECRET: u16 = 4006;
    pub const BAD_VERSION: u16 = 4007;
}
