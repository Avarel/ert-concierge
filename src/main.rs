mod concierge;
mod clients;
mod payload;

use anyhow::Result;
use concierge::Concierge;
use std::{env, sync::Arc};
use tokio::net::TcpListener;
use log::{info, debug};

const DEFAULT_IP: &str = "127.0.0.1";
const PORT: u16 = 8080;

#[tokio::main]
async fn main() -> Result<()> {
    env_logger::Builder::new()
        .filter_level(log::LevelFilter::Debug)
        .init();

    info!("Starting up the server.");

    let addr = env::args()
        .nth(1)
        .unwrap_or_else(|| format!("{}:{}", DEFAULT_IP, PORT));

    debug!("Attempting to bind the server. (ip: {})", addr);

    // Wrap the server in an atomic ref-counter, to make it safe to work with in between threads.
    let server = Arc::new(Concierge::new());

    // Create the event loop and TCP listener we'll accept connections on.
    let mut listener = TcpListener::bind(&addr)
        .await
        .expect("Failed to bind to address.");
    info!("Listening for new connections. (ip: {})", addr);

    // Listen to new incoming connections.
    while let Ok((stream, addr)) = listener.accept().await {
        // Spawn a separate async task that handles the incoming connection.
        tokio::spawn(server.clone().handle_connection(stream, addr));
    }

    Ok(())
}
