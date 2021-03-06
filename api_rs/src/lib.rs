pub mod payload;
pub mod info;
pub mod message;

pub use payload::{PayloadIn, PayloadOut};
pub use message::{PayloadMessage, Target};
pub use info::{Client, Service, Origin};

use std::borrow::Cow;

/// Identification used by services.
///
/// For now, they are identified by names.
pub type ServiceId<'a> = &'a str;

/// Close reasons, as used by the central server.
pub struct CloseReason<'a> {
    pub code: u16,
    pub reason: Cow<'a, str>,
}

impl<'a> CloseReason<'a> {
    #[allow(dead_code)]
    /// Unknown reason
    pub const UNKNOWN: CloseReason<'static> = CloseReason::new_const(4000, "Unknown reason");
    /// Failed to critical payload
    pub const FATAL_DECODE: CloseReason<'static> = CloseReason::new_const(4002, "Failed to critical payload");
    /// No identification payload sent
    pub const NO_AUTH: CloseReason<'static> = CloseReason::new_const(4003, "No identification payload sent");
    /// Authorization failed
    pub const AUTH_FAILED: CloseReason<'static> = CloseReason::new_const(4004, "Authorization failed");
    /// Duplicate name in namespace
    pub const DUPLICATE_AUTH: CloseReason<'static> = CloseReason::new_const(4005, "Duplicate name in namespace");
    /// Secret mismatch
    pub const BAD_SECRET: CloseReason<'static> = CloseReason::new_const(4006, "Secret mismatch");
    /// Version mismatch
    pub const BAD_VERSION: CloseReason<'static> = CloseReason::new_const(4007, "Version mismatch");
    /// Name must be alphanumeric
    pub const BAD_AUTH: CloseReason<'static> = CloseReason::new_const(4008, "Name must be alphanumeric");
    /// Heartbeat failed
    pub const HB_FAILED: CloseReason<'static> = CloseReason::new_const(4009, "Heartbeat failed");
    
    const fn new_const(code: u16, reason: &'static str) -> Self {
        Self { code, reason: Cow::Borrowed(reason) }
    }

    pub fn new(code: u16, reason: impl Into<Cow<'a, str>>) -> Self {
        Self { code, reason: reason.into() }
    }

    pub fn with_reason(&self, reason: impl Into<Cow<'a, str>>) -> Self {
        Self::new(self.code, reason)
    }

    pub fn as_tuple(self) -> (u16, Cow<'a, str>) {
        (self.code, self.reason)
    }
}