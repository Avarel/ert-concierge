use crate::concierge::{self, Concierge};
use actix::prelude::*;
use actix_web_actors::ws::{Message, ProtocolError, WebsocketContext};
use concierge::IdentifyPackage;
use concierge_api_rs::PayloadIn;
use semver::Version;
use std::time::{Duration, Instant};
use uuid::Uuid;

/// How often heartbeat pings are sent
const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);
/// How long before lack of client response causes a timeout
const CLIENT_TIMEOUT: Duration = Duration::from_secs(10);

pub struct WsChatSession {
    /// unique session id
    pub uuid: Uuid,
    /// Client must send ping at least once per 10 seconds (CLIENT_TIMEOUT),
    /// otherwise we drop connection.
    pub last_hb: Instant,
    /// Chat server
    pub concierge_addr: Addr<Concierge>,
}

impl Actor for WsChatSession {
    type Context = WebsocketContext<Self>;

    /// Method is called on actor start.
    /// We register ws session with ChatServer
    fn started(&mut self, ctx: &mut Self::Context) {
        // we'll start heartbeat process on session start.
        self.hb(ctx);
    }

    fn stopping(&mut self, _: &mut Self::Context) -> Running {
        // notify chat server
        self.concierge_addr
            .do_send(concierge::Disconnect { uuid: self.uuid });
        Running::Stop
    }
}

/// Handle messages from chat server, we simply send it to peer websocket
impl Handler<concierge::OutgoingMessage> for WsChatSession {
    type Result = ();

    fn handle(&mut self, msg: concierge::OutgoingMessage, ctx: &mut Self::Context) {
        ctx.text(msg.0);
    }
}

fn verify_name(name: &str) -> bool {
    name.chars().all(|c| c.is_alphanumeric() || c == '_')
}

/// WebSocket message handler
impl StreamHandler<Result<Message, ProtocolError>> for WsChatSession {
    fn handle(&mut self, msg: Result<Message, ProtocolError>, ctx: &mut Self::Context) {
        let msg = match msg {
            Err(_) => {
                ctx.stop();
                return;
            }
            Ok(msg) => msg,
        };

        match msg {
            Message::Ping(msg) => {
                self.last_hb = Instant::now();
                ctx.pong(&msg);
            }
            Message::Pong(_) => {
                self.last_hb = Instant::now();
            }
            Message::Text(text) => {
                if self.uuid.is_nil() {
                    match serde_json::from_str::<PayloadIn>(&text) {
                        Ok(PayloadIn::Identify {
                            name,
                            nickname,
                            version,
                            secret,
                            tags,
                        }) => {
                            // // name must be alphanumeric
                            if !verify_name(name) {
                                ctx.close(None);
                                ctx.stop();
                                return;
                            }
                            // // check for secret
                            if secret != crate::SECRET {
                                ctx.close(None);
                                ctx.stop();
                                return;
                            }
                            // // check that version matches (might need some work)
                            if !crate::min_version_req().matches(&Version::parse(version).unwrap())
                            {
                                ctx.close(None);
                                ctx.stop();
                                return;
                            }
                            // // Convert the tags to owned
                            let tags = tags.iter().map(|s| s.to_string()).collect();

                            self.concierge_addr
                                .send(IdentifyPackage {
                                    name: name.to_owned(),
                                    nickname: nickname.map(ToOwned::to_owned),
                                    tags,
                                    addr: ctx.address().recipient(),
                                })
                                .into_actor(self)
                                .then(|res, act, ctx| {
                                    match res {
                                        Ok(res) => act.uuid = res,
                                        _ => ctx.stop(),
                                    }
                                    fut::ready(())
                                })
                                .wait(ctx);
                        }
                        Ok(_) => {
                            ctx.close(None);
                        }
                        Err(_) => {
                            ctx.close(None);
                        }
                    }
                } else {
                    self.concierge_addr.do_send(concierge::IncomingMessage {
                        uuid: self.uuid,
                        text,
                    })
                }
            }
            Message::Binary(_) => println!("Unexpected binary"),
            Message::Close(reason) => {
                ctx.close(reason);
                ctx.stop();
            }
            Message::Continuation(_) => {
                ctx.stop();
            }
            Message::Nop => (),
        }
    }
}

impl WsChatSession {
    /// helper method that sends ping to client every second.
    ///
    /// also this method checks heartbeats from client
    fn hb(&self, ctx: &mut WebsocketContext<Self>) {
        ctx.run_interval(HEARTBEAT_INTERVAL, |act, ctx| {
            // check client heartbeats
            if Instant::now().duration_since(act.last_hb) > CLIENT_TIMEOUT {
                // heartbeat timed out
                println!("Websocket Client heartbeat failed, disconnecting!");

                // notify chat server
                act.concierge_addr
                    .do_send(concierge::Disconnect { uuid: act.uuid });

                // stop actor
                ctx.stop();

                // don't try to send a ping
                return;
            }

            ctx.ping(b"");
        });
    }
}
