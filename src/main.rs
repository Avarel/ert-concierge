#![deny(clippy::correctness)]
#![warn(clippy::style)]
#![warn(clippy::complexity)]
#![warn(clippy::perf)]
#![warn(clippy::cargo)]

mod clients;
mod concierge;

// Only compile this module for tests.
#[cfg(test)]
mod tests;

use concierge::{Concierge, Group};
use log::{debug, info};
use semver::VersionReq;
use std::{net::SocketAddr, sync::Arc};
use tokio::runtime::Builder;
use uuid::Uuid;
use warp::{http::Method, hyper::header, multipart::FormData, path::Tail, Filter};

// isten on every available network interface
pub const SOCKET_ADDR: ([u8; 4], u16) = ([0, 0, 0, 0], 64209);
pub const VERSION: &str = "0.1.1";
pub const MIN_VERSION: &str = "^0.1.0";
pub const SECRET: Option<&str> = None;
pub const SUBPROTOCOL: &str = "ert-concierge";

pub const FS_KEY_HEADER: &str = "x-fs-key";

pub fn min_version_req() -> VersionReq {
    VersionReq::parse(crate::MIN_VERSION).expect("Valid versioning scheme")
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
    runtime.block_on(setup())
}

async fn setup() {
    // Wrap the server in an atomic ref-counter, to make it safe to work with in between threads.
    let concierge = Arc::new(Concierge::new());

    // Create a chat group
    let chat_name = "chat".to_owned();
    concierge
        .groups
        .write()
        .await
        .insert(chat_name.to_owned(), Group::new(chat_name, Some("Chat Channel".to_string()), Uuid::nil()));

    serve(concierge).await
}

async fn serve(concierge: Arc<Concierge>) {
    info!("Starting up the server.");

    let addr = SocketAddr::from(SOCKET_ADDR);

    let ws_route = {
        let concierge = concierge.clone();
        warp::get()
            .and(warp::path("ws"))
            .and(warp::addr::remote())
            .and(warp::ws())
            .map(move |addr: Option<SocketAddr>, ws: warp::ws::Ws| {
                debug!("Incoming TCP connection. (ip: {:?})", addr);
                let concierge = concierge.clone();
                ws.on_upgrade(move |websocket| async move {
                    concierge.handle_socket_conn(websocket, addr).await
                })
            })
            .map(|reply| {
                warp::reply::with_header(
                    reply,
                    header::SEC_WEBSOCKET_PROTOCOL.as_str(),
                    SUBPROTOCOL,
                )
            })
    };

    let fs_download_route = {
        let concierge = concierge.clone();
        warp::get()
            .and(warp::path("fs"))
            .and(warp::path::param::<String>())
            .and(warp::path::tail())
            .and(warp::header::<Uuid>(FS_KEY_HEADER))
            .and_then(move |name: String, path: Tail, auth: Uuid| {
                let concierge = concierge.clone();
                async move { concierge.handle_file_get(name, auth, path.as_str()).await }
            })
    };

    // Binary upload
    let fs_upload_route = {
        let concierge = concierge.clone();
        warp::put()
            .and(warp::path("fs"))
            .and(warp::path::param::<String>())
            .and(warp::path::tail())
            .and(warp::header::<Uuid>(FS_KEY_HEADER))
            // 2mb upload limit
            .and(warp::body::content_length_limit(1024 * 1024 * 2))
            .and(warp::body::aggregate())
            .and_then(move |name: String, tail: Tail, auth: Uuid, stream| {
                let concierge = concierge.clone();
                async move {
                    concierge
                        .handle_file_put(name, auth, tail.as_str(), stream)
                        .await
                }
            })
    };

    // Form upload
    let fs_upload_multipart_route = {
        let concierge = concierge.clone();
        warp::post()
            .and(warp::path("fs"))
            .and(warp::path::param::<String>())
            .and(warp::path::tail())
            .and(warp::header::<Uuid>(FS_KEY_HEADER))
            .and(warp::multipart::form())
            .and_then(
                move |name: String, tail: Tail, auth: Uuid, data: FormData| {
                    let concierge = concierge.clone();
                    async move {
                        concierge
                            .handle_file_put_multipart(name, auth, tail.as_str(), data)
                            .await
                    }
                },
            )
    };

    let fs_delete_route = {
        warp::delete()
            .and(warp::path("fs"))
            .and(warp::path::param::<String>())
            .and(warp::path::tail())
            .and(warp::header::<Uuid>(FS_KEY_HEADER))
            .and_then(move |name: String, tail: Tail, auth: Uuid| {
                let concierge = concierge.clone();
                async move {
                    concierge
                        .handle_file_delete(name, auth, tail.as_str())
                        .await
                }
            })
    };

    let routes = ws_route
        .or(fs_download_route.or(fs_delete_route))
        .or(fs_upload_route.or(fs_upload_multipart_route))
        .with(
            warp::cors()
                .allow_any_origin()
                .allow_methods(&[Method::POST, Method::GET, Method::DELETE])
                .allow_header(FS_KEY_HEADER)
                .allow_header("*"),
        );

    warp::serve(routes)
        // .tls()
        // .cert_path("./tls/cert.pem")
        // .key_path("./tls/key.rsa")
        .run(addr)
        .await;
}
