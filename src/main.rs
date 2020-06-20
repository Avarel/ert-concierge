mod clients;
mod concierge;
mod payload;

use anyhow::Result;
use concierge::Concierge;
use std::{net::SocketAddr, sync::Arc};

use hyper::Body;
use log::{debug, error, info};
use tokio::fs::File;
use tokio_util::codec::{BytesCodec, FramedRead};
use warp::http::Response;
use warp::Filter;

// Local host
const IP: [u8; 4] = [127, 0, 0, 1];
const WS_PORT: u16 = 8080;

struct FileResponse(File);

impl warp::Reply for FileResponse {
    fn into_response(self) -> warp::reply::Response {
        let stream = FramedRead::new(self.0, BytesCodec::new());
        let res = Response::builder()
            .header("Content-Disposition", "attachment; filename=\"file.txt\"")
            .body(Body::wrap_stream(stream))
            .unwrap();
        res
    }
}

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
                    if let Err(err) = server.handle_new_socket(websocket, addr).await {
                        error!("Error: {}", err);
                    }
                })
            })
    };

    let fs_route = {
        warp::path("wow")
            .and(warp::header::<String>("Authorization"))
            .and_then(move |_: String| {
                let server = server.clone();
                async move {
                    server.clients.len(); // dummy variable
                    if let Ok(file) = File::open("./Cargo.toml").await {
                        let stream = FramedRead::new(file, BytesCodec::new());
                        let res = Response::builder()
                            .header("Content-Disposition", "attachment; filename=\"file.txt\"")
                            .body(Body::wrap_stream(stream))
                            .unwrap();
                        Ok(res)
                    } else {
                        Err(warp::reject::not_found())
                    }
                }
            })
    };

    let routes = warp::get().and(socket_route).or(fs_route);

    warp::serve(routes).run(addr).await;

    Ok(())
}
