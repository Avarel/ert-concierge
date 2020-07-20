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

use anyhow::Result;
use concierge::{Concierge, Group};
use log::{debug, info};
use std::{net::SocketAddr, sync::Arc};
use tokio::runtime::Builder;
use uuid::Uuid;
use warp::{hyper::header, path::Tail, Filter, multipart::FormData};

// isten on every available network interface
pub const SOCKET_ADDR: ([u8; 4], u16) = ([0, 0, 0, 0], 64209);
pub const VERSION: &str = "0.1.0";
pub const SECRET: Option<&str> = None;
pub const SUBPROTOCOL: &str = "ert-concierge";

fn main() -> Result<()> {
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

async fn setup() -> Result<()> {
    // Wrap the server in an atomic ref-counter, to make it safe to work with in between threads.
    let concierge = Arc::new(Concierge::new());

    // Create a chat group
    let chat_name = "chat".to_owned();
    concierge
        .groups
        .write()
        .await
        .insert(chat_name.to_owned(), Group::new(chat_name, Uuid::nil()));

    serve(concierge).await
}

async fn serve(concierge: Arc<Concierge>) -> Result<()> {
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
            // Enable in 0.2.0
            // .map(|reply| {
            //     warp::reply::with_header(
            //         reply,
            //         header::SEC_WEBSOCKET_PROTOCOL.as_str(),
            //         SUBPROTOCOL,
            //     )
            // });
    };

    let fs_download_route = {
        let concierge = concierge.clone();
        warp::get()
            .and(warp::path("fs"))
            .and(warp::path::param::<String>())
            .and(warp::path::tail())
            .and(warp::header::<Uuid>(header::AUTHORIZATION.as_str()))
            .and_then(move |name: String, path: Tail, auth: Uuid| {
                let concierge = concierge.clone();
                async move { concierge.handle_file_get(name, auth, path.as_str()).await }
            })
    };

    let fs_upload_route = {
        let concierge = concierge.clone();
        warp::put()
            .and(warp::path("fs"))
            .and(warp::path::param::<String>())
            .and(warp::path::tail())
            .and(warp::header::<Uuid>(header::AUTHORIZATION.as_str()))
            // 2mb upload limit
            .and(warp::body::content_length_limit(20971520))
            .and(warp::body::aggregate())
            .and_then(move |name: String, path: Tail, auth: Uuid, stream| {
                let concierge = concierge.clone();
                async move {
                    concierge
                        .handle_file_put(name, auth, path.as_str(), stream)
                        .await
                }
            })
    };

    let fs_upload_multipart_route = {
        let concierge = concierge.clone();
        warp::put()
            .and(warp::path("fs"))
            .and(warp::path::param::<String>())
            .and(warp::path::tail())
            .and(warp::header::<Uuid>(header::AUTHORIZATION.as_str()))
            .and(warp::multipart::form())
            .and_then(move |name: String, path: Tail, auth: Uuid, data: FormData| {
                let concierge = concierge.clone();
                async move {
                    concierge
                        .handle_file_put_multipart(name, auth, path.as_str(), data)
                        .await
                }
            })
    };

    let fs_delete_route = {
        warp::delete()
            .and(warp::path("fs"))
            .and(warp::path::param::<String>())
            .and(warp::path::tail())
            .and(warp::header::<Uuid>(header::AUTHORIZATION.as_str()))
            .and_then(move |name: String, path: Tail, auth: Uuid| {
                let concierge = concierge.clone();
                async move {
                    concierge
                        .handle_file_delete(name, auth, path.as_str())
                        .await
                }
            })
    };

    let routes = ws_route
        .or(fs_download_route)
        .or(fs_upload_route)
        .or(fs_upload_multipart_route)
        .or(fs_delete_route);

    warp::serve(routes)
        // .tls()
        // .cert_path("./tls/cert.pem")
        // .key_path("./tls/key.rsa")
        .run(addr)
        .await;

    Ok(())
}
