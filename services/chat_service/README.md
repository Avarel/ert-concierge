# ERT / Chat Service

Simple reference implementation of a reactive chat service.

## Dependencies

### With Pipenv (recommended)

This command will install the files using the Pipfile.

``` bash
pipenv install
```

### Without Pipenv

This command will install the dependencies required globally.

``` bash
python3 -m pip install websockets asyncio requests
```

## Running the Service

### With Pipenv (recommended)

``` bash
pipenv run python3 chat_bot.py [optional server address]
```

### Without Pipenv

You must have `websockets`  `asyncio`  `requests` installed as global packages to proceed.

``` bash
python3 chat_service.py [optional server address]
```

## Tutorial

This can be used as a basic tutorial on how to interact with the central server.

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

Payloads are emitted as text messages through the socket.

``` python
async for msg in socket:
    payload = json.loads(msg)
    try:
        await handle_payload(payload, socket)
    except Exception as e:
        print("Uncaught exception", e)
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

``` python
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
