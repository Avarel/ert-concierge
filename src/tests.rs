use crate::payload::Payload;
use anyhow::Result;
use tokio::time::delay_for;
use tokio_tungstenite::tungstenite::protocol::Message;
use std::time::Duration;
use futures::{pin_mut, future};

mod ws {
    use crate::{IP, WS_PORT, payload::Payload};
    use futures::{SinkExt, StreamExt};
    use std::net::SocketAddr;
    use tokio::net::TcpStream;
    use tokio_tungstenite::{connect_async, tungstenite::protocol::Message, WebSocketStream};

    pub type WebSocket = WebSocketStream<TcpStream>;

    pub async fn connect() -> WebSocket {
        let addr = SocketAddr::from((IP, WS_PORT));
        let connect_addr = format!("ws://{}/ws", addr);
        let url = url::Url::parse(&connect_addr).unwrap();

        connect_async(url)
            .await
            .expect("Failed to connect to socket")
            .0
    }

    pub async fn expect_message(ws_stream: &mut WebSocket) -> Message {
        ws_stream
            .next()
            .await
            .expect("No payload")
            .expect("Protocol error")
    }

    pub async fn expect_string(ws_stream: &mut WebSocket) -> String {
        expect_message(ws_stream).await.to_string()
    }

    pub async fn send_text(ws_stream: &mut WebSocket, string: impl ToString) {
        ws_stream
            .send(Message::Text(string.to_string()))
            .await
            .unwrap();
    }

    pub async fn recv_hello(ws_stream: &mut WebSocket) -> bool {
        let string = expect_string(ws_stream).await;
        if let Payload::Hello { .. } = serde_json::from_str::<Payload>(&string).unwrap() {
            true
        } else {
            false
        }
    }
}

fn identify(string: &str) -> String {
    serde_json::to_string(&Payload::Identify { name: string }).unwrap()
}

#[tokio::test]
async fn basic_identification() -> Result<()> {
    let ref mut ws_stream = ws::connect().await;

    ws::send_text(ws_stream, identify("a")).await;
    let result = ws::recv_hello(ws_stream).await;

    ws_stream.close(None).await?;

    assert!(result, "No hello");
    Ok(())
}

#[tokio::test]
async fn duplicate_identificaiton() -> Result<()> {
    let ref mut ws_stream_1 = ws::connect().await;
    let ref mut ws_stream_2 = ws::connect().await;
    ws::send_text(ws_stream_1, identify("b")).await;
    delay_for(Duration::from_millis(50)).await;
    ws::send_text(ws_stream_2, identify("b")).await;

    if let Message::Close(_) = ws::expect_message(ws_stream_2).await {
        assert!(ws::recv_hello(ws_stream_1).await);
        ws_stream_1.close(None).await?;
        Ok(())
    } else {
        ws_stream_1.close(None).await?;
        ws_stream_2.close(None).await?;
        panic!("WS did not close")
    }
}
