#![deny(clippy::correctness)]
#![warn(clippy::style)]
#![warn(clippy::complexity)]
#![warn(clippy::perf)]
#![warn(clippy::cargo)]

mod clients;
mod concierge;
mod payload;

// Only compile this module for tests.
#[cfg(test)]
mod tests;

use anyhow::Result;
use concierge::Concierge;
use log::{debug, error, info};
use std::{net::SocketAddr, sync::Arc};
use uuid::Uuid;
use warp::{path::Tail, Filter};

// Local host
pub const IP: [u8; 4] = [127, 0, 0, 1];
pub const WS_PORT: u16 = 8080;

// Internal error for the warp framework
#[derive(Debug)]
struct InternalConciergeError(anyhow::Error);
impl warp::reject::Reject for InternalConciergeError {}
fn internal_concierge_error(err: anyhow::Error) -> warp::Rejection {
    warp::reject::custom(InternalConciergeError(err))
}

#[tokio::main]
async fn main() -> Result<()> {
    env_logger::Builder::new()
        .filter_level(log::LevelFilter::Debug)
        .init();

    // Wrap the server in an atomic ref-counter, to make it safe to work with in between threads.
    let concierge = Arc::new(Concierge::new());

    info!("Starting up the server.");

    let addr = SocketAddr::from((IP, WS_PORT));

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
                    if let Err(err) = concierge.handle_socket_conn(websocket, addr).await {
                        error!("Error: {}", err);
                    }
                })
            })
    };

    let fs_download_route = {
        let concierge = concierge.clone();
        warp::get()
            .and(warp::path("fs"))
            .and(warp::path::tail())
            .and(warp::header::<Uuid>("Authorization"))
            .and_then(move |path: Tail, auth: Uuid| {
                let server = concierge.clone();
                async move {
                    server
                        .handle_file_get(auth, path.as_str())
                        .await
                        .map_err(internal_concierge_error)
                }
            })
    };

    let fs_upload_route = {
        let concierge = concierge.clone();
        warp::put()
            .and(warp::path("fs"))
            .and(warp::path::tail())
            .and(warp::header::<Uuid>("Authorization"))
            .and(warp::body::stream())
            .and_then(move |path: Tail, auth: Uuid, stream| {
                let server = concierge.clone();
                async move {
                    server
                        .handle_file_put(auth, path.as_str(), stream)
                        .await
                        .map_err(internal_concierge_error)
                }
            })
    };

    let fs_delete_route = {
        warp::delete()
            .and(warp::path("fs"))
            .and(warp::path::tail())
            .and(warp::header::<Uuid>("Authorization"))
            .and_then(move |path: Tail, auth: Uuid| {
                let server = concierge.clone();
                async move {
                    server
                        .handle_file_delete(auth, path.as_str())
                        .await
                        .map_err(internal_concierge_error)
                }
            })
    };

    let routes = ws_route
        .or(fs_download_route)
        .or(fs_upload_route)
        .or(fs_delete_route);

    warp::serve(routes).run(addr).await;

    Ok(())
}
