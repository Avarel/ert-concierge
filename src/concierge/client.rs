use super::{Concierge, OutgoingMessage, service::Service};
use actix::prelude::*;
use std::{borrow::Cow, collections::HashSet};
use uuid::Uuid;
use concierge_api_rs::info;
use serde::Serialize;

/// A struct holding information regarding the client.
pub struct Client {
    /// Client id.
    pub uuid: Uuid,
    /// Client name.
    pub name: String,
    /// Client nickname.
    pub nickname: Option<String>,
    pub seq: usize,
    /// Client tags.
    pub tags: Vec<String>,
    pub addr: Recipient<OutgoingMessage>,
    /// Groups.
    pub subscriptions: HashSet<String>,
}

impl Client {
    /// Utility method to construct an origin receipt on certain payloads.
    pub fn info(&self) -> info::Client<'_> {
        let tags = self
            .tags
            .iter()
            .map(String::as_str)
            .map(Cow::Borrowed)
            .collect();

        info::Client {
            uuid: self.uuid,
            name: Cow::Borrowed(&self.name),
            nickname: self.nickname.as_deref().map(Cow::Borrowed),
            tags,
        }
    }

    /// Send a payload.
    pub fn send(&self, payload: &impl Serialize) {
        self.send_ws_msg(serde_json::to_string(payload).expect("msg"))
    }

    /// Send a WebSocket message.
    pub fn send_ws_msg(&self, msg: String) {
        self.addr.do_send(OutgoingMessage(msg));
    }

    // pub fn hook<'a, 'c: 'a>(&'a mut self, concierge: &'c mut Concierge) -> ClientController<'a, 'c> {
    //     ClientController {
    //         client: self,
    //         concierge
    //     }
    // }
}

// pub struct ClientController<'a, 'c: 'a> {
//     client: &'a mut Client,
//     concierge: &'c mut Concierge,
// }

// impl ClientController<'_, '_> {
//     /// Attempt to subscribe to a group.
//     ///
//     /// ### Return Result
//     /// If this function returns `None`, it means that no such group exists.
//     ///
//     /// If this function returns `Some`, then it is attached with the group information.
//     /// In addition, there is a boolean indicating if the client subscribed to a new group
//     /// (`true`) or is already subscribed to the group (`false`).
//     pub async fn subscribe(&mut self, group_name: &str) -> Option<(info::Service<'static>, bool)> {
//         if let Some(group) = self.concierge.services.get_mut(group_name) {
//             let result = group.add_subscriber(self.client.uuid);
//             self.client
//                 .subscriptions
//                 .insert(group.name.to_owned());
//             Some((group.info().owned(), result))
//         } else {
//             None
//         }
//     }

//     /// Attempt to unsubscribe from a group.
//     ///
//     /// ### Return Result
//     /// If this function returns `None`, it means that no such group exists.
//     ///
//     /// If this function returns `Some`, then it is attached with the group information.
//     /// In addition, there is a boolean indicating if the client unsubscribed from a group
//     /// (`true`) or was not subscribed to the group in the first place (`false`).
//     pub async fn unsubscribe(&mut self, group_name: &str) -> Option<(info::Service<'static>, bool)> {
//         if let Some(group) = self.concierge.services.get_mut(group_name) {
//             let result = group.remove_subscriber(self.client.uuid);
//             self.client.subscriptions.remove(group_name);
//             Some((group.info().owned(), result))
//         } else {
//             None
//         }
//     }

//     #[allow(dead_code)]
//     /// Get all the the client's current subscription list as informational structs.
//     pub async fn subscription_info(&self) -> Vec<info::Service<'static>> {
//         self.client.subscriptions
//             .iter()
//             .filter_map(|id| self.concierge.services.get(id))
//             .map(|service| service.info())
//             .map(|service_info| service_info.owned())
//             .collect::<Vec<_>>()
//     }

//     /// Create a group if it currently does not exist in the concierge.
//     /// Returns `true` if the group was created.
//     pub async fn try_create_service(
//         &mut self,
//         name: &str,
//         nickname: Option<&str>,
//     ) -> (info::Service<'static>, bool) {
//         if let Some(service) = self.concierge.services.get(name) {
//             (service.info().owned(), false)
//         } else {
//             let service = self.concierge.services.entry(name.to_string()).or_insert(Service::new(
//                 name.to_owned(),
//                 nickname.map(str::to_string),
//                 self.client.uuid,
//             ));
//             (service.info().owned(), true)
//         }
//     }

//     /// Remove a group if a client is the owner of that group.
//     /// Returns `true` if the group was removed.
//     pub async fn try_remove_service(&mut self, group_name: &str) -> Option<Result<Service, info::Service<'static>>> {
//         if let Some(service) = self.concierge.services.get(group_name) {
//             if service.owner_uuid == self.client.uuid {
//                 // Unwrap safety: we just confirmed that the group exist by that key.
//                 return Some(Ok(self.concierge.services.remove(group_name).unwrap()))
//             } else {
//                 return Some(Err(service.info().owned()))
//             }
//         }

//         None
//     }
// }