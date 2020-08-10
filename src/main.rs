mod concierge;
mod fs;
mod ws;

use actix::prelude::*;
use actix_cors::Cors;
use actix_files::Files;
use actix_web::{middleware, web, App, HttpServer, Responder};
use concierge::Concierge;
use semver::VersionReq;
use std::net::SocketAddr;

// Listen on every available network interface
pub const SOCKET_ADDR: ([u8; 4], u16) = ([0, 0, 0, 0], 64209);
pub const VERSION: &str = "0.2.0";
pub const MIN_VERSION: &str = "^0.2.0";
pub const SECRET: Option<&str> = None;

pub fn min_version_req() -> VersionReq {
    VersionReq::parse(crate::MIN_VERSION).expect("Valid versioning scheme")
}

async fn index() -> impl Responder {
    format!(
        "ERT Concierge 2020\nPort: {}\n Version: {}\n Minimum Version:{}",
        SOCKET_ADDR.1, VERSION, MIN_VERSION
    )
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    env_logger::Builder::new()
        .filter_level(log::LevelFilter::Debug)
        .init();

    let server = Concierge::new().start();
    HttpServer::new(move || {
        App::new()
            .data(server.clone())
            .service(
                Files::new("/babylonjs", "./babylonjs-web/dist")
                    .show_files_listing()
                    .use_last_modified(true),
            )
            .service(web::resource("/").route(web::get().to(index)))
            .wrap(middleware::Logger::default())
            .service(web::resource("/ws").route(web::get().to(ws::index)))
            .service(
                web::resource("/fs/{client_name}/{file_name}")
                    .wrap(
                        Cors::new()
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
