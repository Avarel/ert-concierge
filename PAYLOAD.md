# Websocket Payloads

Packets sent from the client to the Gateway API are encapsulated within a
gateway payload object and must have the proper `type` operation set. The working
definition of the payloads can be found in the [API directory](./concierge_api_rs/).

### Example
```typescript
{ 
    "type": "ABCDEFG", ..., 
    "seq": 123 
}
```

### Sequence Numbers

Some payloads have a sequence number attached to them (often statuses or results).
Sequence numbers are based on the `n`-th **text** payload received by the concierge. The `seq` field
thus indicates what this status payload is in response to. If the `seq` field is missing, then it means
that this was a status update due to changes not made by the connecting client.

# Protocol
The connecting client should connect with a `ert-concierge` subprotocol.

Upon connecting, the client must send an appropriate `IDENTIFY` payload within 5 seconds. Otherwise, the connection will be dropped. Any other payload sent during
this period will also immediately drop the connection with either:

-   `4000` UNKOWN: internal server errors.
-   `4002` FATAL_DECODE: server failed to decode; malformed input?
-   `4003` NO_AUTH: a normal payload was sent prior to identification.
-   `4004` AUTH_FAILED: authorization failed due to timeout.
-   `4005` DUPLICATE_AUTH: namespace conflict in the concierge (pick another `name`!).
-   `4006` BAD_SECRET: expected secret does not match gateway secret.
-   `4007` BAD_VERSION: expected version is not compatible with gateway version (update your client).

Successful identification will result in a `HELLO` payload being sent to the client, along with a UUID that acts as the [file server](./FILESYSTEM.md) key.

Clients can use `MESSAGE` payloads to send data to specific targets or entire services. If a message is sent to a service, then it will be broadcasted to every client subscribed to the service.

The service must first be created using `CREATE_SERVICE` before anyone can subscribe to it. The client that created the service is the only client that can delete the service with `DELETE_SERVICE`. The service will also be automatically deleted if the owning client leaves the concierge.

## Identify

**This payload must be the first payload sent
within 5 seconds of establishing the socket connection**, else the
connection will be dropped. When the concierge receives this payload, it will check
that the `name` does not conflict with the current namespace. If everything goes
well, a `HELLO` payload will be sent to the client. The server versioning should
follow semantic versioning.

### Structure

```typescript
{
    "type": "IDENTIFY",
    "name": string,
    "version": string,
    "secret": string
            | undefined,
    "tags": string[] | undefined,
}
```

### Example

```json
{ "type": "IDENTIFY", "name": "anthony", "version": "0.1.0" }
{ "type": "IDENTIFY", "name": "brendan", "version": "0.1.0" }
{ "type": "IDENTIFY", "name": "simulation", "version": "0.1.0" }
```

## Message

These payloads have special fields for targeting
other users or plugins. The `origin` fields are ignored if they are
sent to the concierge, since the identification process happens
per socket. The message is then relayed to the target with an `origin` receipt field
added (overriden by the concierge).

The `target` field must follow one of three possible variants, which are demonstrated
below. The `NAME` and `UUID` target types will directly pass the message to a single
target client. The `data` field is transmitted verbatim.

### Service Target
The `SERIVCE` target type is special. If the owner of a service sends a message to
the service, then it will be broadcasted for everyone subscribed to the service. On the
other hand, subscribers of a service sending a message to the service will only send
the message to the owner of the service.

### Structure

```typescript
{
    "type": "MESSAGE",
    "origin": {
        "name": string,
        "nickname": string,
        "uuid": string,
        "tags": string[],
        "service": {
            "name": string,
            "nickname": string,
            "owner_uuid": string,
            "subscribers": string[]
        },
    } | undefined,
    "target": { "type": "NAME", "name": string }
            | { "type": "UUID", "uuid": string }
            | { "type": "SERVICE", "name": string },
            | { "type": "ALL" },
    "data": any
}
```

### Example

#### Payload to the Concierge

Imagine that a client identifies as `anthony` sends this to the concierge.

```json
{
    "type": "MESSAGE",
    "target": {
        "type": "NAME",
        "name": "brendan",
        "tags": ["babylon"]
    },
    "data": {
        "foo": "bar"
    }
}
```

#### Payload from the Concierge

The user `brendan` will receive this on their end. Notice that they have an `origin` receipt attached.

```json
{
    "type": "MESSAGE",
    "origin": {
        "name": "anthony",
        "uuid": "..."
    },
    "target": {
        "type": "NAME",
        "name": "brendan"
    },
    "data": {
        "foo": "bar"
    }
}
```

## Self Subscribe

Subscribe to a service's broadcasts. The service must exist before anyone can subscribe
to it (created using `SERVICE_CREATE` payload).

### Structure

```typescript
{
    "type": "SELF_SUBSCRIBE",
    "name": string
}
```

### Example

```json
{
    "type": "SELF_SUBSCRIBE",
    "name": "simulation1_data"
}
```

## Self Unsubscribe

Unsubscribe from a service's broadcasts.

### Structure

```typescript
{
    "type": "SELF_UNSUBSCRIBE",
    "name": string
}
```

### Example

```json
{
    "type": "SELF_UNSUBSCRIBE",
    "name": "simulation1_data"
}
```

## Self Set Sequence Number

Set the sequence number counter on the server to the client's
provided number. This can be used to get the server's sequence 
counter back in sync with the client.

### Structure

```typescript
{
    "type": "SELF_SET_SEQ",
    "seq": number
}
```

### Example

```json
{
    "type": "SELF_SET_SEQ",
    "seq": 0
}
```

## Service Create

Create a new service channel on the central server.

### Structure

```typescript
{
    "type": "SERVICE_CREATE",
    "name": string,
    "nickname": string | undefined,
}
```

### Example

```json
{
    "type": "SERVICE_CREATE",
    "name": "simulation1_data",
    "nickname": "The First Simulation"
}
```

## Service Delete

Delete a service channel on the central server. The client that owns the service 
is the only client that can delete the service. The service is also automatically deleted if the owning client disconnects from the concierge.

### Structure

```typescript
{
    "type": "SERVICE_DELETE",
    "name": string
}
```

### Example

```json
{
    "type": "SERVICE_DELETE",
    "name": "simulation1_data"
}
```

## Service Fetch Information

This payload asks for all the clients of the service specified in the data field.

### Structure

```typescript
{
    "type": "SERVICE_FETCH",
    "name": string
}
```

### Example

```json
{
    "type": "SERVICE_FETCH",
    "name": "users"
}
```

## Service Fetch All

This payload asks for all of the services
registered with the concierge.

### Structure

```typescript
{
    "type": "SERVICE_FETCH_ALL"
}
```

## Client Fetch All

This payload asks for all of the clients
connected to the concierge.

### Structure

```typescript
{
    "type": "CLIENT_FETCH_ALL"
}
```

## Self Fetch

This payload asks for the connecting client's
subscriptions.

```typescript
{
    "type": "SELF_FETCH"
}
```

## Hello

This payload is sent upon successful identification.
The payload will also contain a universally unique identifier `uuid`
that acts as a file server key and the version of the server.

### Structure

```typescript
{
    "type": "HELLO",
    "uuid": string,
    "version": string
}
```

### Example

```json
{
    "type": "HELLO",
    "uuid": "73fcc768-d724-47e2-a101-a45298188f47",
    "version": "0.1.0"
}
```

## Service Fetch Result

Returns all the client names as an array of strings.

### Structure

```typescript
{
    "type": "SERVICE_FETCH_RESULT",
    "name": string,
    "nickname": string,
    "owner_uuid": string,
    "subscribers": string[],
    "seq": number,
}
```

### Example

```json
{
    "type": "SERVICE_FETCH_RESULT",
    "name": "simulation1_data",
    "nickname": "The First Simulation",
    "owner_uuid": "...",
    "subscribers": ["...", "..."],
    "seq": 155,
}
```

## Service Fetch All Result

This payload lists all of the services registered with the concierge.

### Structure

```typescript
{
    "type": "SERVICE_FETCH_ALL_RESULT",
    "services": {
        "name": string,
        "nickname": string,
        "owner_uuid": string,
        "subscribers": string[]
    }[],
    "seq": number,
}
```

### Example

```json
{
    "type": "SERVICE_FETCH_ALL_RESULT",
    "services": [
        {
            "name": "simulation1_data",
            "nickname": "The First Simulation",
            "owner_uuid": "...",
            "subscribers": ["...", "..."]
        },
        {
            "name": "simulation2_data",
            "nickname": "The Second Simulation",
            "owner_uuid": "...",
            "subscribers": ["...", "..."]
        }
    ],
    "seq": 155,
}
```

## Client Fetch All Result

```typescript
{
    "type": "CLIENT_FETCH_ALL_RESULT",
    "clients": {
        "name": string,
        "nickname": string,
        "uuid": string,
        "tags": string[],
    }[],
    "seq": number,
}
```

### Example

```json
{
    "type": "CLIENT_FETCH_ALL_RESULT",
    "clients": [
        {
            "name": "simulation1",
            "nickname": "Simulation One",
            "uuid": "...",
            "tags": ["simulation"]
        },
        {
            "name": "simulation2",
            "nickname": "Simulation Two",
            "uuid": "...",
            "tags": ["simulation"]
        },
        {
            "name": "anthony",
            "uuid": "...",
            "tags": ["babylon"]
        },
        {
            "name": "brendan",
            "uuid": "...",
            "tags": ["babylon"]
        }
    ],
    "seq": 155,
}
```

## Self Fetch Result

This payload lists all of the connecting client's subscriptions.

### Example

```typescript
{
    "type": "SELF_FETCH_RESULT",
    "name": string,
    "nickname": string | undefined,
    "uuid": string,
    "tags": string[],
    "subscriptions": string[],
    "seq": number,
}
```

### Example

```json
{
    "type": "SELF_FETCH_RESULT",
    "name": "brendan",
    "nickname": null,
    "uuid": "...",
    "tags": ["babylon"],
    "subscriptions": ["simulation1_data"],
    "seq": 155,
}
```

## Status

Status payload sent by the concierge. May happen for various reasons
such as error response or responses to certain commands.

### Structure

```typescript
{
    "type": "STATUS",
    "code": string /* see status codes */,
    "seq": number | undefined,
    /* ... */
}
```

### Example

```json
{
    "type": "STATUS",
    "code": "OK",
}
```

## Statuses

-   `OK`
-   `MESSAGE_SENT`
    -   Fired in response to `MESSAGE`.
-   `SUBSCRIBED`, `NOT_SUBSCRIBED`, `ALREADY_SUBSCRIBED`
    -   `name: string`: The name of the service already created.
    -   `nickname: string | undefined`: THe nickname of the service.
    -   `owner_uuid: string`: The UUID of the service's owner.
    -   `subscribers: string[]`: The UUIDs of the subscribers.
-   `UNSUBSCRIBED`
    -   Fired in response to `UNSUBSCRIBE`, `SERVICE_DELETE`, and the service being deleted because the owner of the service left the concierge.
    -   **May not have a `seq` field** if the client did not send a `UNSUBSCRIBE` payload (due to the service being deleted by the owner, etc).
    -   `name: string`: The name of the service already created.
    -   `nickname: string | undefined`: THe nickname of the service.
    -   `owner_uuid: string`: The UUID of the service's owner.
    -   `subscribers: string[]`: The UUIDs of the subscribers.
-   `SERVICE_CREATED`
    -   Fired in response to `SERVICE_CREATE`.
    -   **May not have a `seq` field** if the client did not send a `SERVICE_CREATE` payload (fired as a status when someone else creates a service).
    -   `name: string`: The name of the service already created.
    -   `nickname: string | undefined`: THe nickname of the service.
    -   `owner_uuid: string`: The UUID of the service's owner.
    -   `subscribers: string[]`: The UUIDs of the subscribers.
-   `SERVICE_DELETED`
    -   Fired in response to `SERVICE_DELETE`.
    -   **May not have a `seq` field** if the client did not send a `SERVICE_DELETE` payload (fired as a status when someone else deletes a service).
    -   `name: string`: The name of the service already created.
    -   `nickname: string | undefined`: THe nickname of the service.
    -   `owner_uuid: string`: The UUID of the service's owner.
    -   `subscribers: string[]`: The UUIDs of the subscribers.

-   `BAD`
-   `UNSUPORTED`
    -   Fired due to an unsupported payload (ie. concierge receiving a `HELLO` payload).
-   `PROTOCOL`
    -   Fired when server fails to decode, or fails to deserialize data to an accepted format.
    -   `desc: string`: Reason that the server failed to understand the payload.
-   `SERVICE_ALREADY_CREATED`
    -   Fired in response to `SERVICE_CREATE`.
    -   `name: string`: The name of the service already created.
    -   `nickname: string | undefined`: THe nickname of the service.
    -   `owner_uuid: string`: The UUID of the service's owner.
    -   `subscribers: string[]`: The UUIDs of the subscribers.
-   `NO_SUCH_NAME`
    -   In response to `MESSAGE`.
    -   Fired when the `target` field points to a name, but the name is not found in the namespace.
    -   `name: string`: The name unrecognized by the server.
-   `NO_SUCH_UUID`
    -   In response to `MESSAGE`.
    -   Fired when the `target` fields points to a UUID, but the uuid is not recognized.
    -   `uuid: string`: The UUID unrecognized by the server.
-   `NO_SUCH_SERVICE`
    -   In response to `MESSAGE`, `SERVICE_DELETE`, `SUBSCRIBE`, `UNSUBSCRIBE`.
    -   Fired when the `target` fields point to a service, but the service is not present in the concierge.
    -   `service: string`: The service unrecognized by the server.
