use crate::concierge::{self, Concierge};
use actix::prelude::*;
use actix_web_actors::ws::{CloseCode, CloseReason, Message, ProtocolError, WebsocketContext};
use concierge::{Disconnect, IdentifyPackage, IncomingMessage};
use concierge_api_rs::{CloseReason as ConciergeCloseReason, PayloadIn};
use log::{error, warn};
use semver::Version;
use std::time::{Duration, Instant};
use uuid::Uuid;
use actix_web::{web, HttpRequest, HttpResponse, Error};

/// How often heartbeat pings are sent
const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);
/// How long before lack of client response causes a timeout
const CLIENT_TIMEOUT: Duration = Duration::from_secs(10);

pub const SUBPROTOCOL: &str = "ert-concierge";

/// Entry point for our route
pub async fn index(
    req: HttpRequest,
    stream: web::Payload,
    srv: web::Data<Addr<Concierge>>,
) -> Result<HttpResponse, Error> {
    actix_web_actors::ws::start_with_protocols(
        WsConnection {
            uuid: Uuid::nil(),
            last_hb: Instant::now(),
            c_addr: srv.get_ref().clone(),
        },
        &[SUBPROTOCOL],
        &req,
        stream,
    )
}

pub struct WsConnection {
    pub uuid: Uuid,
    pub last_hb: Instant,
    pub c_addr: Addr<Concierge>,
}

impl Actor for WsConnection {
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
impl Handler<concierge::OutgoingMessage> for WsConnection {
    type Result = ();

    fn handle(&mut self, msg: concierge::OutgoingMessage, ctx: &mut Self::Context) {
        ctx.write_raw(msg.0);
    }
}

fn verify_name(name: &str) -> bool {
    name.chars().all(|c| c.is_alphanumeric() || c == '_')
}

fn convert(close_reason: ConciergeCloseReason) -> Option<CloseReason> {
    Some(CloseReason::from((
        CloseCode::Other(close_reason.code),
        close_reason.reason,
    )))
}

/// WebSocket message handler
impl StreamHandler<Result<Message, ProtocolError>> for WsConnection {
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
                            ctx.close(convert(ConciergeCloseReason::BAD_AUTH));
                            ctx.stop();
                            return;
                        }
                        // Check for secret if it is set.
                        if crate::SECRET.is_some() && secret != crate::SECRET {
                            ctx.close(convert(ConciergeCloseReason::BAD_SECRET));
                            ctx.stop();
                            return;
                        }
                        // Check that versioning is allowed.
                        if !crate::min_version_req().matches(&Version::parse(version).unwrap()) {
                            ctx.close(convert(ConciergeCloseReason::BAD_VERSION));
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
                                    Ok(None) => {
                                        ctx.close(convert(ConciergeCloseReason::DUPLICATE_AUTH));
                                        ctx.stop()
                                    }
                                    _ => ctx.stop(),
                                }
                                fut::ready(())
                            })
                            .wait(ctx);
                    }
                    Ok(_) => {
                        ctx.close(convert(ConciergeCloseReason::NO_AUTH));
                    }
                    Err(_) => {
                        ctx.close(convert(ConciergeCloseReason::UNKNOWN));
                    }
                }
            } else {
                ctx.close(convert(ConciergeCloseReason::NO_AUTH));
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
                Message::Text(text) => self.c_addr.do_send(IncomingMessage {
                    uuid: self.uuid,
                    text,
                }),
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

impl WsConnection {
    fn hb(&self, ctx: &mut WebsocketContext<Self>) {
        ctx.run_interval(HEARTBEAT_INTERVAL, |act, ctx| {
            if Instant::now().duration_since(act.last_hb) > CLIENT_TIMEOUT {
                warn!("WS client {} failed heartbeat. Dropping.", act.uuid);
                act.c_addr.do_send(Disconnect { uuid: act.uuid });
                ctx.close(convert(ConciergeCloseReason::HB_FAILED));
                ctx.stop();
                return;
            }
            ctx.ping(&[]);
        });
    }
}
