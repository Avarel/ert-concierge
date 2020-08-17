# Tutorial

This can be used as a basic tutorial on how to interact with the central server. This tutorial
leads to the creation of `chat_service`.

## Python Service

### Connection

We first connect to the server using our library of choice:

``` python
async with websockets.connect(uri, subprotocols="ert-concierge") as socket:
```

### Identification

We must immediately send an `IDENTIFY` payload after a successful connection:

``` python
await socket.send(json.dumps({
    "type": "IDENTIFY",
    "name": name,
    "nickname": nickname,
    "version": version,
    "tags": ["service", "chat"]
}))
```

We can then expect that the first payload we receive from the server is the `HELLO` payload.

``` python
hello = json.loads(await socket.recv())
uuid = hello["uuid"]
server_version = hello["version"]
print(f"My uuid is {uuid}. The server version is {server_version}.")
```

### Service Creation

We can create our service by sending a `SERVICE_CREATE` payload.

``` python
await socket.send(json.dumps({
    "type": "SERVICE_CREATE",
    "service": service_name,
    "nickname": service_nickname
}))
```

To receive `SERVICE_CLIENT_SUBSCRIBE` and `SERVICE_CLIENT_UNSUBSCRIBE` , we must
also subscribe to our own service. This is optional if your service does not rely
on that functionality. Service messages will still work fine.

``` python
await socket.send(json.dumps({
    "type": "SELF_SUBSCRIBE",
    "service": service_name
}))
```

### Receiving Messages

Payloads are emitted as text messages through the socket. We can receive messages
through a loop and spawn an async task to handle it concurrently.

``` python
async def recv_loop(socket: websockets.WebSocketClientProtocol):
    async for msg in socket:
        payload = json.loads(msg)
        try:
            await handle_payload(payload, socket)
        except Exception as e:
            print("Uncaught exception", e)

await recv_loop(socket)
```

### Sending Messages

We can send payloads to the server as JSON serialized text messages. In the following
example, we target our own service so that we can broadcast the data to all subscribers.

``` python
await socket.send(json.dumps({
    "type": "MESSAGE",
    "target": {
        "type": "SERVICE",
        "service": service_name
    },
    "data": {
        "type": "TEXT",
        "author": output_name,
        "author_uuid": payload["origin"]["uuid"],
        "text": msg_data["text"]
    }
}))
```

If we only want to broadcast a message to one client, then we can use the following target:

```python
await socket.send(json.dumps({
    "type": "MESSAGE",
    "target": {
        "type": "SERVICE_CLIENT_UUID",
        "service": service_name,
        "uuid": payload["origin"]["uuid"]
    },
    "data": {
        "type": "TEXT",
        "author": "System Message",
        "author_uuid": "0",
        "text": "(Only you can see this!)\nERT Chat Service\nVersion: 0.1"
    }
}))
```

To make our lives easier, we can make a utility method to send messages to the concierge.

```python
async def send_msg(target: Dict[str, str], socket: websockets.WebSocketClientProtocol, data: Dict[str, Any]):
    await socket.send(json.dumps({
        "type": "MESSAGE",
        "target": target,
        "data": data
    }))
```

#### Handling Messages

Each message is a simple JSON message. Their structure is detailed in the specification.

```python
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
```

## BabylonJS Handler

The BabylonJS front-end has utilities written for it that makes handling services
simple as possible. This part uses TypeScript.

### Service Event Handler

The service event handler automatically handles subscription, unsubscription, and
messages from only the service. The basic structure is shown below:

```typescript
/**
 * Utility class that correctly handles subscription and unsubscription from
 * a service group. This class is to be implemented by service handlers.
 * 
 * Multiple service event handlers of the same service is not supported
 * as of the moment, and will likely lead to unwanted behavior.
 */
export abstract class ServiceEventHandler<T> implements RawHandler {
    /** Is this handler subscribed to its service group. */
    get subscribed(): boolean { /* omitted */ }

    /**
     * Construct a service event handler.
     * 
     * @param client The central server client.
     * @param serviceName The name of the service.
     * @param autoSubscribe Should the service event handler subscribe 
     *          as eagerly as possible? This means that it will try to 
     *          subscribe immediately when the client first logs on and 
     *          when the group is created.
     */
    constructor(
        readonly client: Client,
        readonly serviceName: string,
        public autoSubscribe: boolean = true,
    ) { }

    onClose(_: CloseEvent) { /* omitted */ }

    /**
     * Send a message to the service's owner.
     * 
     * @param data The data as a valid JSON object.
     */
    sendToService(data: Readonly<T>) { /* omitted */ }

    /**
     * This override automatically handles the subscription and unsubscription
     * process. It is a good idea to call `super.onReceive` for implementors
     * to benefit from this handler's behavior.
     * 
     * @param payload The payload.
     */
    onReceive(payload: Readonly<Payload.Out>): void { /* omitted */ }


    /** Try to subscribe to the service. */
    subscribe(): void { /* omitted */ }

    /** Try to unsubscribe from the service. */
    unsubscribe(): void { /* omitted */ }

    /** Called when receiving a payload from the service. */
    protected abstract onServiceMessage(payload: Readonly<T>): void;

    /** Called when the handler successfully subscribes to the group. */
    protected abstract onSubscribe(): void;

    /** Called when the handler is unsubscribed from the group. */
    protected abstract onUnsubscribe(): void;
}
```

### Service Specific Utility Methods

We define the two following methods to help us handle the chat functions.
* `chatInstanceUpdateReact` only updates the ReactJSX content if the tab and instance exists.
* `onEnter` is a callback passed into the chat instance to handle input submission.

Note that `Chat.Instance` is purely a ReactJS component that handles basic rendering and input
processing of the chat. The principles of ReactJS will not be covered in this tutorial. For more,
information, visit the [project webpage](https://reactjs.org/).

```typescript
export class ChatService extends ServiceEventHandler<ChatPayload> {
    /* omitted */

    private chatInstanceUpdateReact() {
        if (this.tab && this.chatInstance) {
            this.tab.reactContent = this.chatInstance.render();
        }
    }

    /**
     * Fired on the input being entered.
     * @param text The text in the UI.
     */
    private onEnter(text: string) {
        this.sendToService({ type: "INPUT", text });
    }
}
```

### Handling Service Subscription

Using this utility, we can have it so that we add a tab and create a React instance
when the chat service is detected by overriding the `onSubscribe` method.

```typescript
export class ChatService extends ServiceEventHandler<ChatPayload> {
    /* omitted */

    protected onSubscribe() {
        this.tab = this.tabComponent.addTab(this.serviceName, "Chat");
        this.chatInstance = new Chat.Instance(undefined, text => this.onEnter(text));
        this.chatInstanceUpdateReact();
    }
}
```

### Handling Service Unsubscription

Likewise, we can delete those instances when the the client unsubscribes 
from the service by overriding the `onUnsubscribe` method.

```typescript
export class ChatService extends ServiceEventHandler<ChatPayload> {
    /* omitted */

    protected onUnsubscribe() {
        this.tabComponent.removeTab(this.serviceName);
        this.tab = undefined;
        this.chatInstance = undefined;
    }
}
```

### Handling Service Messages

We can handle messages that we receive from **only** the service 
by overriding the `onServiceMessage` method.

```typescript
export class ChatService extends ServiceEventHandler<ChatPayload> {
    /* omitted */

    protected onServiceMessage(payload: ChatPayload) {
        if (payload.type == "STATUS") {
            this.chatInstance?.addStatus(payload.text);
        } else if (payload.type == "TEXT") {
            this.chatInstance?.addMessage(payload.author, payload.text, payload.author_uuid == this.client.uuid);
        }
        this.chatInstanceUpdateReact();
    }
}
```

And thats it! We now have a working chat client!