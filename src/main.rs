mod clients;
mod concierge;
mod payload;
mod util;

// Only compile this module for tests.
#[cfg(test)]
mod tests;

use anyhow::Result;
use concierge::Concierge;
use log::{debug, error, info};
use std::{net::SocketAddr, sync::Arc};
use warp::{path::Tail, Filter};
use uuid::Uuid;

// Local host
pub const IP: [u8; 4] = [127, 0, 0, 1];
pub const WS_PORT: u16 = 8080;

#[tokio::main]
async fn main() -> Result<()> {
    env_logger::Builder::new()
        .filter_level(log::LevelFilter::Debug)
        .init();

    // Wrap the server in an atomic ref-counter, to make it safe to work with in between threads.
    let server = Arc::new(Concierge::new());

    info!("Starting up the server.");

    let addr = SocketAddr::from((IP, WS_PORT));

    let socket_route = {
        let server = server.clone();
        warp::path("ws")
            .and(warp::addr::remote())
            .and(warp::ws())
            .map(move |addr: Option<SocketAddr>, ws: warp::ws::Ws| {
                debug!("Incoming TCP connection. (ip: {:?})", addr);
                let server = server.clone();
                ws.on_upgrade(move |websocket| async move {
                    if let Err(err) = server.handle_socket_conn(websocket, addr).await {
                        error!("Error: {}", err);
                    }
                })
            })
    };

    let fs_route = {
        warp::path("fs")
            .and(warp::path::tail())
            .and(warp::header::optional::<Uuid>("Authorization"))
            .and_then(move |path: Tail, _: Option<Uuid>| {
                let path = path.as_str().to_string();
                println!("{}",path);
                let server = server.clone();
                async move {
                    server.handle_file_request(path).await.map_err(|_| warp::reject())
                }
            })
    };

    let routes = warp::get().and(socket_route).or(fs_route);

    warp::serve(routes).run(addr).await;

    Ok(())
}
