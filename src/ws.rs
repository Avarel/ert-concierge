use crate::concierge::{self, Concierge};
use actix::prelude::*;
use actix_web_actors::ws::{Message, ProtocolError, WebsocketContext};
use concierge::{Disconnect, IdentifyPackage, IncomingMessage};
use concierge_api_rs::PayloadIn;
use log::{warn, error};
use semver::Version;
use std::time::{Duration, Instant};
use uuid::Uuid;

/// How often heartbeat pings are sent
const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);
/// How long before lack of client response causes a timeout
const CLIENT_TIMEOUT: Duration = Duration::from_secs(10);

pub struct WsChatSession {
    pub uuid: Uuid,
    pub last_hb: Instant,
    pub c_addr: Addr<Concierge>,
}

impl Actor for WsChatSession {
    type Context = WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        self.hb(ctx);
    }

    fn stopping(&mut self, _: &mut Self::Context) -> Running {
        self.c_addr.do_send(Disconnect { uuid: self.uuid });
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
            Err(err) => {
                error!("Dropping session: {}", err);
                ctx.stop();
                return;
            }
            Ok(msg) => msg,
        };

        if self.uuid.is_nil() {
            if let Message::Text(text) = msg {
                match serde_json::from_str::<PayloadIn>(&text) {
                    Ok(PayloadIn::Identify {
                        name,
                        nickname,
                        version,
                        secret,
                        tags,
                    }) => {
                        // Check that name is alphanumeric.
                        if !verify_name(name) {
                            ctx.close(None);
                            ctx.stop();
                            return;
                        }
                        // Check for secret if it is set.
                        if crate::SECRET.is_some() && secret != crate::SECRET {
                            ctx.close(None);
                            ctx.stop();
                            return;
                        }
                        // Check that versioning is allowed.
                        if !crate::min_version_req().matches(&Version::parse(version).unwrap())
                        {
                            ctx.close(None);
                            ctx.stop();
                            return;
                        }
                        // Convert tags to owned.
                        let tags = tags.into_iter().map(str::to_owned).collect();
    
                        self.c_addr
                            .send(IdentifyPackage {
                                name: name.to_owned(),
                                nickname: nickname.map(ToOwned::to_owned),
                                tags,
                                addr: ctx.address().recipient(),
                            })
                            .into_actor(self)
                            .then(|res, act, ctx| {
                                match res {
                                    Ok(Some(res)) => act.uuid = res,
                                    Ok(None) => ctx.stop(),
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
                ctx.close(None);
                ctx.stop();
            }
        } else {
            match msg {
                Message::Ping(msg) => {
                    self.last_hb = Instant::now();
                    ctx.pong(&msg);
                }
                Message::Pong(_) => {
                    self.last_hb = Instant::now();
                }
                Message::Text(text) => {
                    self.c_addr.do_send(IncomingMessage {
                        uuid: self.uuid,
                        text,
                    })
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
}

impl WsChatSession {
    fn hb(&self, ctx: &mut WebsocketContext<Self>) {
        ctx.run_interval(HEARTBEAT_INTERVAL, |act, ctx| {
            if Instant::now().duration_since(act.last_hb) > CLIENT_TIMEOUT {
                warn!("WS client {} failed heartbeat. Dropping.", act.uuid);
                act.c_addr.do_send(Disconnect { uuid: act.uuid });
                ctx.stop();
                return;
            }
            ctx.ping(&[]);
        });
    }
}
