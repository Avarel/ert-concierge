use crate::concierge::{self, Concierge};
use actix::prelude::*;
use actix_web::{web, Error, HttpRequest, HttpResponse};
use actix_web_actors::ws::{CloseCode, CloseReason, Message, ProtocolError, WebsocketContext};
use concierge::{Disconnect, IdentifyPackage, IncomingMessage};
use concierge_api_rs::{CloseReason as ConciergeCloseReason, PayloadIn};
use log::{error, warn};
use semver::Version;
use std::time::{Duration, Instant};
use uuid::Uuid;

/// How often heartbeat pings are sent.
const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);
/// How long before lack of client response causes a timeout.
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
        ctx.run_later(HEARTBEAT_INTERVAL, |ws, ws_ctx| {
            // If the UUID is still nil after 5 seconds, then the client failed to identify.
            if ws.uuid.is_nil() {
                ws_ctx.close(convert(ConciergeCloseReason::AUTH_FAILED));
                ws_ctx.stop();
                return;
            }
        });
        ctx.run_interval(HEARTBEAT_INTERVAL, |ws, ws_ctx| {
            // If the duration between the current moment and last heartbeat is greater
            // than the timeout threshold, then initiate disconnect.
            if Instant::now().duration_since(ws.last_hb) > CLIENT_TIMEOUT {
                warn!("WS client {} failed heartbeat. Dropping.", ws.uuid);
                // Disconnect the connection from the concierge.
                ws.c_addr.do_send(Disconnect { uuid: ws.uuid });
                // Close the actor.
                ws_ctx.close(convert(ConciergeCloseReason::HB_FAILED));
                ws_ctx.stop();
            } else {
                // Send a ping.
                ws_ctx.ping(&[]);
            }
        });
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

/// Verify that a name has only alphanumeric or underscores characters.
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
                error!("Dropping a session due to protocol error. Error: {}", err);
                ctx.close(Some(CloseReason::from(CloseCode::Protocol)));
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
                        ctx.stop();
                    }
                    Err(_) => {
                        ctx.close(convert(ConciergeCloseReason::UNKNOWN));
                        ctx.stop();
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
                Message::Binary(_) => warn!("Received binary message."),
                Message::Close(reason) => {
                    ctx.close(reason);
                    ctx.stop();
                }
                Message::Continuation(_) => {
                    ctx.close(Some(CloseReason::from(CloseCode::Size)));
                    ctx.stop();
                }
                Message::Nop => (),
            }
        }
    }
}
