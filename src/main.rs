mod clients;
mod concierge;
mod payload;

use anyhow::Result;
use concierge::Concierge;
use std::{net::SocketAddr, sync::Arc};
use tokio::{fs::File, net::TcpListener};

use log::{debug, error, info};
use tokio_util::codec::{BytesCodec, FramedRead};

use futures::{future, pin_mut};
use hyper::{body::HttpBody, Body, Method, Request, Response, Server, service::Service};
use hyper::{
    header::HeaderValue,
    service::{make_service_fn, service_fn},
    StatusCode,
};
use std::convert::Infallible;

// Local host
const IP: [u8; 4] = [127, 0, 0, 1];
const FS_PORT: u16 = 8000;
const WS_PORT: u16 = 8080;

#[tokio::main]
async fn main() -> Result<()> {
    env_logger::Builder::new()
        .filter_level(log::LevelFilter::Debug)
        .init();

    // Wrap the server in an atomic ref-counter, to make it safe to work with in between threads.
    let server = Arc::new(Concierge::new());

    let fs_server = fs_server(server.clone());
    let ws_server = ws_server(server);

    pin_mut!(fs_server, ws_server);

    future::select(fs_server, ws_server).await;
    Ok(())
}


async fn fs_server(server: Arc<Concierge>) -> Result<()> {
    info!("Starting up the file server.");

    let addr = SocketAddr::from((IP, FS_PORT));

    // async fn handle(req: Request<Body>) -> Result<Response<Body>> {
    //     fn not_found() -> Response<Body> {
    //         Response::builder()
    //             .status(StatusCode::NOT_FOUND)
    //             .body("Not Found".into())
    //             .unwrap()
    //     }

    //     match req.method() {
    //         &Method::GET => {
    //             if let Ok(file) = File::open("./Cargo.toml").await {
    //                 let stream = FramedRead::new(file, BytesCodec::new());
    //                 let res = Response::builder()
    //                     .header("Content-Disposition", "attachment; filename=\"file.txt\"")
    //                     .body(Body::wrap_stream(stream))
    //                     .unwrap();
    //                 Ok(res)
    //             } else {
    //                 Ok(not_found())
    //             }
    //         }
    //         &Method::POST => {
    //             let mut body = req.into_body();
    //             // check headers
    //             // open file
    //             while let Some(result) = body.data().await {
    //                 let chunk = result?;
    //                 // append to file
    //                 // enforce a size limit
    //             }
    //             // mark the file as "fully uploaded"
    //             Ok(Response::builder()
    //                 .status(StatusCode::CREATED)
    //                 .body("Ok".into())
    //                 .unwrap())
    //         }
    //         _ => Ok(Response::new(Body::from("200 GOOD"))),
    //     }
    // }

    debug!("Attempting to bind the server. (ip: {})", addr);

    let make_service = make_service_fn(move |_| {
        let server = server.clone();

        async move {
            Ok::<_, anyhow::Error>(service_fn(move |_req| {
                let wtf =  server.clients.len();
                async move { Ok::<_, anyhow::Error>(Response::new(Body::from(format!("Request #{}", wtf)))) }
            }))
        }
    });

    // A MakeService to handle each connection
    let server = Server::bind(&addr).serve(make_service);

    info!("Listening for new connections. (ip: {})", addr);

    if let Err(e) = server.await {
        error!("server error: {}", e);
    }

    Ok(())
}

async fn ws_server(server: Arc<Concierge>) -> Result<()> {
    info!("Starting up the socket server.");

    let addr = SocketAddr::from((IP, WS_PORT));

    debug!("Attempting to bind the server. (ip: {})", addr);

    // Create the event loop and TCP listener we'll accept connections on.
    let mut listener = TcpListener::bind(&addr)
        .await
        .expect("Failed to bind to address.");
    info!("Listening for new connections. (ip: {})", addr);

    // Listen to new incoming connections.
    while let Ok((stream, addr)) = listener.accept().await {
        // Spawn a separate async task that handles the incoming connection.
        tokio::spawn(server.clone().handle_new_socket(stream, addr));
    }

    Ok(())
}
