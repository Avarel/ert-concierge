use crate::payload::Payload;
use anyhow::Result;
use futures::{future, pin_mut};
use std::time::Duration;
use tokio::time::delay_for;
use tokio_tungstenite::tungstenite::protocol::Message;
use ws::WsClient;

mod ws {
    use crate::{payload::Payload, SOCKET_ADDR};
    use futures::{SinkExt, StreamExt};
    use std::net::SocketAddr;
    use tokio::net::TcpStream;
    use tokio_tungstenite::{tungstenite::protocol::Message, WebSocketStream};

    pub type WebSocket = WebSocketStream<TcpStream>;

    pub struct WsClient {
        ws_stream: WebSocket,
    }
    
    impl WsClient {
        pub async fn connect_local() -> Self {
            Self::connect(&local_url()).await
        }

        pub async fn connect(connect_addr: &str) -> Self {
            let (ws_stream, _) = tokio_tungstenite::connect_async(connect_addr)
                .await
                .expect("Failed to connect");
            Self { ws_stream }
        }
    
        pub async fn send_message(&mut self, payload: Payload<'_>) {
            self.send_text(serde_json::to_string(&payload).unwrap()).await
        }
    
        pub async fn expect_message(&mut self) -> Message {
            self.ws_stream
                .next()
                .await
                .expect("No payload")
                .expect("Protocol error")
        }

        pub async fn expect_string(&mut self) -> String {
            self.expect_message().await.to_string()
        }
    
        pub fn into_inner(self) -> WebSocket {
            self.ws_stream
        }

        pub async fn close(&mut self) {
            self.ws_stream.close(None).await.expect("Failed to close stream")
        }

        pub async fn send_text(&mut self, string: impl ToString) {
            self.ws_stream
                .send(Message::Text(string.to_string()))
                .await
                .unwrap();
        }
    
        pub async fn recv_hello(&mut self) -> bool {
            let string = self.expect_string().await;
            if let Payload::Hello { .. } = serde_json::from_str::<Payload>(&string).unwrap() {
                true
            } else {
                false
            }
        }
    }

    pub fn local_url() -> String {
        let addr = SocketAddr::from(SOCKET_ADDR);
        format!("ws://{}/ws", addr)
    }
}

fn identify(string: &str) -> Payload<'_> {
    Payload::Identify { name: string, version: crate::VERSION, secret: None }
}

#[tokio::test]
async fn basic_identification() -> Result<()> {
    let ref mut ws = WsClient::connect_local().await;

    ws.send_message(identify("a")).await;
    let result = ws.recv_hello().await;

    ws.close().await;

    assert!(result, "No hello");
    Ok(())
}

#[tokio::test]
async fn duplicate_identificaiton() -> Result<()> {
    let ref mut ws_1 = WsClient::connect_local().await;
    let ref mut ws_2 = WsClient::connect_local().await;
    ws_1.send_message(identify("b")).await;
    delay_for(Duration::from_millis(50)).await;
    ws_2.send_message(identify("b")).await;

    if let Message::Close(_) = ws_2.expect_message().await {
        assert!(ws_1.recv_hello().await);
        ws_1.close().await;
        Ok(())
    } else {
        ws_1.close().await;
        ws_2.close().await;
        panic!("WS did not close")
    }
}

#[tokio::test]
async fn duplicate_identificaiton_concurrent() -> Result<()> {
    let ref mut ws_1 = WsClient::connect_local().await;
    let ref mut ws_2 = WsClient::connect_local().await;

    {
        let send1 = ws_1.send_message(identify("c"));
        let send2 = ws_2.send_message(identify("c"));
        pin_mut!(send1, send2);
        future::join(send1, send2).await;
    }

    if let Message::Close(_) = ws_2.expect_message().await {
        assert!(ws_1.recv_hello().await);
        ws_1.close().await;
        Ok(())
    } else if let Message::Close(_) = ws_1.expect_message().await {
        assert!(ws_2.recv_hello().await);
        ws_2.close().await;
        Ok(())
    } else {
        ws_1.close().await;
        ws_2.close().await;
        panic!("WS did not close")
    }
}
