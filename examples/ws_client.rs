//! A simple example of hooking up stdin/stdout to a WebSocket stream.
//!
//! This example will connect to a server specified in the argument list and
//! then forward all data read on stdin to the server, printing out all data
//! received on stdout.
//!
//! Note that this is not currently optimized for performance, especially around
//! buffer management. Rather it's intended to show an example of working with a
//! client.
//!
//! You can use this example together with the `server` example.

use std::env;

use futures::{future, pin_mut, StreamExt, SinkExt};
use tokio::{sync::mpsc::{UnboundedSender, unbounded_channel}, io::{AsyncReadExt, AsyncWriteExt}};
use tokio_tungstenite::{connect_async, tungstenite::protocol::Message};
use anyhow::Result;

#[tokio::main]
async fn main() -> Result<()> {
    // Connect to specific address provided in command arguments, or fall back to default
    let connect_addr = env::args()
        .nth(1)
        .unwrap_or_else(|| "ws://127.0.0.1:8080/ws".to_string());

    // Parse into a Url
    let url = url::Url::parse(&connect_addr).unwrap();

    // This is our channels for messages.
    // rx: (receive) where messages are received
    // tx: (transmit) where we send messages
    let (stdin_tx, mut stdin_rx) = unbounded_channel();

    // Spawn a task for reading from stdin
    tokio::spawn(read_stdin(stdin_tx));

    let (ws_stream, _) = connect_async(url).await.expect("Failed to connect");
    println!("WebSocket handshake has been successfully completed");

    let (mut write, mut read) = ws_stream.split();

    let stdin_to_ws = async {
        while let Some(message) = stdin_rx.next().await {
            write.send(message).await?;
        }
        Ok::<_, anyhow::Error>(())
    };
    let ws_to_stdout = async {
        while let Some(Ok(message)) = read.next().await {
            // println!("Received a message {}\n", message.to_text().unwrap_or("string error"));
            if message.is_close() {
                let mut vec = Vec::new();
                vec.extend_from_slice(b"Disconnecting: ");
                vec.extend_from_slice(message.to_text().map(str::as_bytes).unwrap_or(b"string error"));
                vec.push(b'\n');
                tokio::io::stdout().write_all(&vec).await?;
                tokio::io::stdout().flush().await?;
                break;
            }
            let data = message.into_data();
            tokio::io::stdout().write_all(&data).await?;
            tokio::io::stdout().write(b"\n").await?;
        }
        Ok::<_, anyhow::Error>(())
    };

    pin_mut!(stdin_to_ws, ws_to_stdout);
    future::select(stdin_to_ws, ws_to_stdout).await;
    Ok(())
}

// Our helper method which will read data from stdin and send it along the
// sender provided.
async fn read_stdin(tx: UnboundedSender<Message>) {
    let mut stdin = tokio::io::stdin();
    loop {
        let mut buf = vec![0; 1024];
        let n = match stdin.read(&mut buf).await {
            Err(_) | Ok(0) => break,
            Ok(n) => n,
        };
        buf.truncate(n);
        tx.send(Message::text(String::from_utf8_lossy(&buf))).unwrap();
    }
}