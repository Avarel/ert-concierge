// mod concierge;

// use concierge::{Concierge, FsError};
// use log::{debug, info};
// use semver::VersionReq;
// use std::{net::SocketAddr, sync::Arc};
use tokio::runtime::Builder;
// use uuid::Uuid;
// use warp::{http::Method, hyper::header, multipart::FormData, path::Tail, Filter};

// // isten on every available network interface
// pub const SOCKET_ADDR: ([u8; 4], u16) = ([0, 0, 0, 0], 64209);
// pub const VERSION: &str = "0.2.0";
// pub const MIN_VERSION: &str = "^0.2.0";
// pub const SECRET: Option<&str> = None;
// pub const SUBPROTOCOL: &str = "ert-concierge";

// pub const FS_KEY_HEADER: &str = "x-fs-key";

// pub fn min_version_req() -> VersionReq {
//     VersionReq::parse(crate::MIN_VERSION).expect("Valid versioning scheme")
// }

mod server;

// use actix::{Actor, StreamHandler};
// use actix_web::{web, App, Error, HttpRequest, HttpResponse, HttpServer};
// use actix_web_actors::ws;

  
use std::time::{Duration, Instant};

use actix::*;
use actix_web::{web, App, Error, HttpRequest, HttpResponse, HttpServer};
use actix_web_actors::ws;
use uuid::Uuid;

/// How often heartbeat pings are sent
const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);
/// How long before lack of client response causes a timeout
const CLIENT_TIMEOUT: Duration = Duration::from_secs(10);

/// Entry point for our route
async fn chat_route(
    req: HttpRequest,
    stream: web::Payload,
    srv: web::Data<Addr<server::Concierge>>,
) -> Result<HttpResponse, Error> {
    ws::start(
        WsChatSession {
            id: Uuid::nil(),
            hb: Instant::now(),
            room: "Main".to_owned(),
            name: None,
            addr: srv.get_ref().clone(),
        },
        &req,
        stream,
    )
}

struct WsChatSession {
    /// unique session id
    id: Uuid,
    /// Client must send ping at least once per 10 seconds (CLIENT_TIMEOUT),
    /// otherwise we drop connection.
    hb: Instant,
    /// joined room
    room: String,
    /// peer name
    name: Option<String>,
    /// Chat server
    addr: Addr<server::Concierge>,
}

impl Actor for WsChatSession {
    type Context = ws::WebsocketContext<Self>;

    /// Method is called on actor start.
    /// We register ws session with ChatServer
    fn started(&mut self, ctx: &mut Self::Context) {
        // we'll start heartbeat process on session start.
        self.hb(ctx);

        // register self in chat server. `AsyncContext::wait` register
        // future within context, but context waits until this future resolves
        // before processing any other events.
        // HttpContext::state() is instance of WsChatSessionState, state is shared
        // across all routes within application
        let addr = ctx.address();
        self.addr
            .send(server::Connect {
                addr: addr.recipient(),
            })
            .into_actor(self)
            .then(|res, act, ctx| {
                match res {
                    Ok(res) => act.id = res,
                    // something is wrong with chat server
                    _ => ctx.stop(),
                }
                fut::ready(())
            })
            .wait(ctx);
    }

    fn stopping(&mut self, _: &mut Self::Context) -> Running {
        // notify chat server
        self.addr.do_send(server::Disconnect { id: self.id });
        Running::Stop
    }
}

/// Handle messages from chat server, we simply send it to peer websocket
impl Handler<server::Message> for WsChatSession {
    type Result = ();

    fn handle(&mut self, msg: server::Message, ctx: &mut Self::Context) {
        ctx.text(msg.0);
    }
}

/// WebSocket message handler
impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for WsChatSession {
    fn handle(
        &mut self,
        msg: Result<ws::Message, ws::ProtocolError>,
        ctx: &mut Self::Context,
    ) {
        let msg = match msg {
            Err(_) => {
                ctx.stop();
                return;
            }
            Ok(msg) => msg,
        };

        println!("WEBSOCKET MESSAGE: {:?}", msg);
        match msg {
            ws::Message::Ping(msg) => {
                self.hb = Instant::now();
                ctx.pong(&msg);
            }
            ws::Message::Pong(_) => {
                self.hb = Instant::now();
            }
            ws::Message::Text(text) => {
                let m = text.trim();
                // we check for /sss type of messages
                if m.starts_with('/') {
                    let v: Vec<&str> = m.splitn(2, ' ').collect();
                    match v[0] {
                        // "/list" => {
                        //     // Send ListRooms message to chat server and wait for
                        //     // response
                        //     println!("List rooms");
                        //     self.addr
                        //         .send(server::ListRooms)
                        //         .into_actor(self)
                        //         .then(|res, _, ctx| {
                        //             match res {
                        //                 Ok(rooms) => {
                        //                     for room in rooms {
                        //                         ctx.text(room);
                        //                     }
                        //                 }
                        //                 _ => println!("Something is wrong"),
                        //             }
                        //             fut::ready(())
                        //         })
                        //         .wait(ctx)
                        //     // .wait(ctx) pauses all events in context,
                        //     // so actor wont receive any new messages until it get list
                        //     // of rooms back
                        // }
                        "/join" => {
                            if v.len() == 2 {
                                self.room = v[1].to_owned();
                                self.addr.do_send(server::Join {
                                    id: self.id,
                                    name: self.room.clone(),
                                });

                                ctx.text("joined");
                            } else {
                                ctx.text("!!! room name is required");
                            }
                        }
                        "/name" => {
                            if v.len() == 2 {
                                self.name = Some(v[1].to_owned());
                            } else {
                                ctx.text("!!! name is required");
                            }
                        }
                        _ => ctx.text(format!("!!! unknown command: {:?}", m)),
                    }
                } else {
                    let msg = if let Some(ref name) = self.name {
                        format!("{}: {}", name, m)
                    } else {
                        m.to_owned()
                    };
                    // send message to chat server
                    self.addr.do_send(server::ClientMessage {
                        id: self.id,
                        msg,
                        room: self.room.clone(),
                    })
                }
            }
            ws::Message::Binary(_) => println!("Unexpected binary"),
            ws::Message::Close(reason) => {
                ctx.close(reason);
                ctx.stop();
            }
            ws::Message::Continuation(_) => {
                ctx.stop();
            }
            ws::Message::Nop => (),
        }
    }
}

impl WsChatSession {
    /// helper method that sends ping to client every second.
    ///
    /// also this method checks heartbeats from client
    fn hb(&self, ctx: &mut ws::WebsocketContext<Self>) {
        ctx.run_interval(HEARTBEAT_INTERVAL, |act, ctx| {
            // check client heartbeats
            if Instant::now().duration_since(act.hb) > CLIENT_TIMEOUT {
                // heartbeat timed out
                println!("Websocket Client heartbeat failed, disconnecting!");

                // notify chat server
                act.addr.do_send(server::Disconnect { id: act.id });

                // stop actor
                ctx.stop();

                // don't try to send a ping
                return;
            }

            ctx.ping(b"");
        });
    }
}


fn main() {
    // Setup the logging
    env_logger::Builder::new()
        .filter_level(log::LevelFilter::Debug)
        .init();

    // Setup the runtime
    let mut runtime = Builder::new()
        .threaded_scheduler()
        .enable_all()
        .build()
        .unwrap();
    runtime.block_on(serve())
}

async fn serve() {
    // HttpServer::new(|| App::new().route("/ws/", web::get().to(index)))
    //     .bind("127.0.0.1:8088").unwrap()
    //     .run()
    //     .await.unwrap()
}

// async fn serve() {
//     info!("Starting up the server.");

//     // Wrap the server in an atomic ref-counter, to make it safe to work with in between threads.
//     let concierge = Arc::new(Concierge::new());

//     let addr = SocketAddr::from(SOCKET_ADDR);

//     let ws_route = {
//         let concierge = concierge.clone();
//         warp::get()
//             .and(warp::path("ws"))
//             .and(warp::addr::remote())
//             .and(warp::ws())
//             .map(move |addr: Option<SocketAddr>, ws: warp::ws::Ws| {
//                 debug!("Incoming TCP connection. (ip: {:?})", addr);
//                 let concierge = concierge.clone();
//                 ws.on_upgrade(move |websocket| async move {
//                     concierge.handle_socket_conn(websocket, addr).await
//                 })
//             })
//             .map(|reply| {
//                 warp::reply::with_header(
//                     reply,
//                     header::SEC_WEBSOCKET_PROTOCOL.as_str(),
//                     SUBPROTOCOL,
//                 )
//             })
//     };

//     let fs_download_route = {
//         let concierge = concierge.clone();
//         warp::get()
//             .and(warp::path("fs"))
//             .and(warp::path::param::<String>())
//             .and(warp::path::tail())
//             .and(warp::header::<Uuid>(FS_KEY_HEADER))
//             .and_then(move |name: String, path: Tail, auth: Uuid| {
//                 let concierge = concierge.clone();
//                 async move {
//                     concierge
//                         .fs_conn()
//                         .handle_file_get(name, auth, path.as_str())
//                         .await
//                         .map_err(FsError::rejection)
//                 }
//             })
//     };

//     // Binary upload
//     let fs_upload_route = {
//         let concierge = concierge.clone();
//         warp::put()
//             .and(warp::path("fs"))
//             .and(warp::path::param::<String>())
//             .and(warp::path::tail())
//             .and(warp::header::<Uuid>(FS_KEY_HEADER))
//             // 2mb upload limit
//             .and(warp::body::content_length_limit(1024 * 1024 * 2))
//             .and(warp::body::aggregate())
//             .and_then(move |name: String, tail: Tail, auth: Uuid, stream| {
//                 let concierge = concierge.clone();
//                 async move {
//                     concierge
//                         .fs_conn()
//                         .handle_file_put(name, auth, tail.as_str(), stream)
//                         .await
//                         .map_err(FsError::rejection)
//                 }
//             })
//     };

//     // Form upload
//     let fs_upload_multipart_route = {
//         let concierge = concierge.clone();
//         warp::post()
//             .and(warp::path("fs"))
//             .and(warp::path::param::<String>())
//             .and(warp::path::tail())
//             .and(warp::header::<Uuid>(FS_KEY_HEADER))
//             .and(warp::multipart::form())
//             .and_then(
//                 move |name: String, tail: Tail, auth: Uuid, data: FormData| {
//                     let concierge = concierge.clone();
//                     async move {
//                         concierge
//                             .fs_conn()
//                             .handle_file_put_multipart(name, auth, tail.as_str(), data)
//                             .await
//                             .map_err(FsError::rejection)
//                     }
//                 },
//             )
//     };

//     let fs_delete_route = {
//         warp::delete()
//             .and(warp::path("fs"))
//             .and(warp::path::param::<String>())
//             .and(warp::path::tail())
//             .and(warp::header::<Uuid>(FS_KEY_HEADER))
//             .and_then(move |name: String, tail: Tail, auth: Uuid| {
//                 let concierge = concierge.clone();
//                 async move {
//                     concierge
//                         .fs_conn()
//                         .handle_file_delete(name, auth, tail.as_str())
//                         .await
//                         .map_err(FsError::rejection)
//                 }
//             })
//     };

//     let routes = ws_route
//         .or(fs_download_route.or(fs_delete_route))
//         .or(fs_upload_route.or(fs_upload_multipart_route))
//         .with(
//             warp::cors()
//                 .allow_any_origin()
//                 .allow_methods(&[Method::POST, Method::GET, Method::DELETE])
//                 .allow_header(FS_KEY_HEADER)
//                 .allow_header("*"),
//         );

//     warp::serve(routes)
//         // .tls()
//         // .cert_path("./tls/cert.pem")
//         // .key_path("./tls/key.rsa")
//         .run(addr)
//         .await;
// }
