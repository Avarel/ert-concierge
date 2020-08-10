mod concierge;
mod fs;
mod ws;

// Listen on every available network interface
pub const SOCKET_ADDR: ([u8; 4], u16) = ([0, 0, 0, 0], 64209);
pub const VERSION: &str = "0.2.0";
pub const MIN_VERSION: &str = "^0.2.0";
pub const SECRET: Option<&str> = None;
pub const SUBPROTOCOL: &str = "ert-concierge";

pub fn min_version_req() -> VersionReq {
    VersionReq::parse(crate::MIN_VERSION).expect("Valid versioning scheme")
}

use std::{net::SocketAddr, time::Instant};

use actix::prelude::*;
use actix_cors::Cors;
use actix_web::{
    http, middleware, web, App, Error, HttpRequest, HttpResponse, HttpServer, Responder,
};
use concierge::Concierge;
use semver::VersionReq;
use uuid::Uuid;
use ws::WsChatSession;

/// Entry point for our route
async fn ws_index(
    req: HttpRequest,
    stream: web::Payload,
    srv: web::Data<Addr<Concierge>>,
) -> Result<HttpResponse, Error> {
    actix_web_actors::ws::start_with_protocols(
        WsChatSession {
            uuid: Uuid::nil(),
            last_hb: Instant::now(),
            c_addr: srv.get_ref().clone(),
        },
        &[SUBPROTOCOL],
        &req,
        stream,
    )
}

async fn index() -> impl Responder {
    "ERT Concierge Root Path"
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    // Setup the logging
    env_logger::Builder::new()
        .filter_level(log::LevelFilter::Debug)
        .init();

    let server = Concierge::new().start();
    HttpServer::new(move || {
        App::new()
            .data(server.clone())
            .service(web::resource("/").route(web::get().to(index)))
            .wrap(middleware::Logger::default())
            .service(web::resource("/ws").route(web::get().to(ws_index)))
            .service(
                web::resource("/fs/{client_name}/{file_name}")
                    .wrap(
                        Cors::new() // <- Construct CORS middleware builder
                            .allowed_methods(vec!["GET", "POST", "DELETE"])
                            .finish(),
                    )
                    .route(web::get().to(fs::get))
                    .route(web::delete().to(fs::delete))
                    .route(web::post().to(fs::multipart_upload)),
            )
    })
    .bind(SocketAddr::from(SOCKET_ADDR))?
    .run()
    .await
}
