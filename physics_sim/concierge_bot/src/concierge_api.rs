use serde::{Deserialize, Serialize};
use uuid::Uuid;

pub type GroupId<'a> = &'a str;

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(tag = "type", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Payload<'a, T> {
    Identify {
        name: &'a str,
        version: &'a str,
        secret: Option<&'a str>,
    },
    Message {
        origin: Option<Origin<'a>>,
        target: Target<'a>,
        data: T,
    },
    CreateGroup {
        group: GroupId<'a>,
    },
    DeleteGroup {
        group: GroupId<'a>,
    },
    Hello {
        uuid: Uuid,
        version: &'a str
    },
    Status {
        code: &'a str
    },
}

/// An origin receipt for certain payloads.
#[derive(Serialize, Deserialize, Copy, Clone, Debug)]
pub struct Origin<'a> {
    pub name: &'a str,
    pub uuid: Uuid,
}

#[derive(Serialize, Deserialize, Copy, Clone, Debug)]
#[serde(tag = "type", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Target<'a> {
    /// Target a client name.
    Name { name: &'a str },
    /// Target a client Uuid.
    Uuid { uuid: Uuid },
    /// Target a group name.
    Group { group: GroupId<'a> },
    /// Target every client connected to the concierge.
    All
}