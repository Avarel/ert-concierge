import websockets
import asyncio
import sys
import signal
import json
from types import FrameType, FunctionType
from typing import Any, Dict, cast

# Default to localhost if no cmdline argument is provided
uri = sys.argv[1] if len(sys.argv) >= 2 else "ws://localhost:64209/ws"

# General settings
name = "chat_service"
nickname = "Chat Service Client"
version = "0.2.0"
service_name = "chat_service"
service_nickname = "Chat Service"

# Runtime settings
uuid = None

# Target payload to the service.
service_target = {
    "type": "SERVICE",
    "service": service_name
}

async def send_msg(target: Dict[str, str], socket: websockets.WebSocketClientProtocol, data: Dict[str, Any]):
    """
    Utility method for sending message payloads to a target.
    """
    await socket.send(json.dumps({
        "type": "MESSAGE",
        "target": target,
        "data": data
    }))

async def chat_service():
    """
    Main method for starting the concierge bot.
    """
    global uri
    print("Connecting to the concierge.")
    async with websockets.connect(uri, subprotocols="ert-concierge") as socket:
        global uuid

        # Identify ourself.
        await socket.send(json.dumps({
            "type": "IDENTIFY",
            "name": name,
            "nickname": nickname,
            "version": version,
            "tags": ["service", "chat"]
        }))
        hello = json.loads(await socket.recv())

        # Expect that the first payload return to us is a HELLO payload.
        uuid = hello["uuid"]
        server_version = hello["version"]
        print(f"My uuid is {uuid}. The server version is {server_version}.")

        print("Creating group.")

        # Create our service.
        await socket.send(json.dumps({
            "type": "SERVICE_CREATE",
            "service": service_name,
            "nickname": service_nickname
        }))

        # Subscribe to our own service so we can receive the SERVICE_CLIENT_SUBSCRIBED
        # and SERVICE_CLIENT_UNSUBSCRIBED event payload.
        await socket.send(json.dumps({
            "type": "SELF_SUBSCRIBE",
            "service": service_name
        }))

        print("Starting service.")

        # Start the socket receiving loop.
        await recv_loop(socket)

        print("Disconnecting and stopping service.")


async def recv_loop(socket: websockets.WebSocketClientProtocol):
    """
    Incoming message loop. Nothing very special about it.
    """
    async for msg in socket:
        payload = json.loads(msg)
        try:
            await handle_payload(payload, socket)
        except Exception as e:
            print("Uncaught exception", e)


async def handle_payload(payload: Dict[str, Any], socket: websockets.WebSocketClientProtocol):
    """
    Handle one payload.
    """
    payload_type = payload.get("type")
    
    # Listens to when a client join this chat service.
    if payload_type == "SERVICE_CLIENT_SUBSCRIBED" and payload["service"]["name"] == service_name:
        client_nickname = payload["client"].get("nickname")
        client_name = payload["client"]["name"]
        await send_msg(service_target, socket, {
            "type": "STATUS",
            "text": f"{client_nickname if client_nickname else client_name} joined the chat."
        })
    # Listen to when a client leaves the chat service.
    elif payload_type == "SERVICE_CLIENT_UNSUBSCRIBED" and payload["service"]["name"] == service_name:
        client_nickname = payload["client"].get("nickname")
        client_name = payload["client"]["name"]
        await send_msg(service_target, socket, {
            "type": "STATUS",
            "text": f"{client_nickname if client_nickname else client_name} left the chat."
        })
    # Listen to messages to this service.
    elif payload_type == "MESSAGE" and payload["origin"]["service"]["name"] == service_name:
        client_nickname = payload["origin"].get("nickname")
        client_name = payload["origin"]["name"]
        output_name = client_nickname if client_nickname else client_name
        msg_data = payload["data"]

        # Intercept a `/about` message.
        if msg_data["text"] == "/about":
            await send_msg({
                "type": "SERVICE_CLIENT_UUID",
                "service": service_name,
                "uuid": payload["origin"]["uuid"]
            }, socket, {
                "type": "TEXT",
                "author": "System Message",
                "author_uuid": "0",
                "text": "(Only you can see this!)\nERT Chat Service\nVersion: 0.1"
            })
        # Intercept other messages.
        else:
            await send_msg(service_target, socket, {
                "type": "TEXT",
                "author": output_name,
                "author_uuid": payload["origin"]["uuid"],
                "text": msg_data["text"]
            })


def stop(signal: signal.Signals, frame: FrameType):
    # I want pyright to stop being stupid
    cast(FunctionType, exit)() # equivalent to exit()

signal.signal(signal.SIGINT, stop)

# Start the loop.
asyncio.get_event_loop().run_until_complete(chat_service())

exit(0)