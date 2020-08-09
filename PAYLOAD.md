# Websocket Payloads

Packets sent from the client to the Gateway API are encapsulated within a
gateway payload object and must have the proper `type` operation set. The working
definition of the payloads can be found in the [API directory](./concierge_api_rs/).

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

### Sequence Numbers

Some payloads have a sequence number attached to them (often statuses or results).
Sequence numbers are based on the `n`-th **text** payload received by the concierge. The `seq` field
thus indicates what this status payload is in response to. If the `seq` field is missing, then it means
that this was a status update due to changes not made by the connecting client.

# Payloads to the Server (PayloadIn)
The following payloads represents the types of payloads that the central server
is expected to respond to. All payloads are expected to be tagged with
a `type` field indicating it's nature, with the value being in
SCREAMING_SNAKE_CASE.

```typescript
{ 
    "type": "ABCDEFG",
    ... 
}
```

## Identify
The server expects this payload to be sent within 5 seconds of 
establishing the socket connection, to avoid the connection be dropped.
### Structure
```typescript
{
    "type": "IDENTIFY",
    "name": string, // must be alphanumeric + underscores only
    "nickname": string | undefined,
    "version": string, // should follow semantic versioning
    "tags": string[]
}
```
### Responses
* `HELLO`: Upon successful identification.
* Socket close: Upon unsuccessful identification.

## Self Subscribe
The client sends this to subscribe to a specific service.
Being subscribed to a service means receiving all messages the owner
of the service sends to that service. A client subscribed to a service
can also send a message to the service, which will be relayed to the
owner only.
### Structure
```typescript
{
    "type": "SELF_SUBSCRIBE",
    "service": string
}
```
### Responses
* `INVALID_SERVICE`: The service does not exist by that name.
* `SELF_SUBSCRIBE_RESULT`: See `PayloadOut::SelfSubscribeResult`.

## Self Unsubscribe
The client sends this to unsubscribe from a specific service.
### Structure
```typescript
{
    "type": "SELF_UNSUBSCRIBE",
    "service": string
}
```
### Responses
* `INVALID_SERVICE`: The service does not exist by that name.
* `SELF_UNSUBSCRIBE_RESULT`: See `PayloadOut::SelfUnsubscribeResult`.

## Self Fetch
The client sends this to fetch information about its state
on the central server.
### Structure
```typescript
{
    "type": "SELF_FETCH"
}
```
### Responses
* `SELF_FETCH_RESULT`: See `PayloadOut::SelfFetchResult`.

## Self Set Sequence Number
The client sends this to set the sequence number counter
of the client on the server to the provided number.
### Structure
```typescript
{
    "type": "SELF_SET_SEQ",
    "seq": number
}
```
### Responses
* `OK`: Successfully reset the sequence number.

## Service Create
The client sends this to create a service.
### Structure
```typescript
{
    "type": "SERVICE_CREATE",
    "service": string,
    "nickname": string | undefined
}
```
### Responses
* `SERVICE_CREATE_RESULT`: See `PayloadOut::ServiceCreateResult`.

## Service Delete
The client sends this to create a service.
### Structure
```typescript
{
    "type": "SERVICE_DELETE",
    "service": string
}
```
### Responses
* `INVALID_SERVICE`: The service does not exist by that name.
* `BAD`: The client is not the owner of that service.
* `SERVICE_CREATE_RESULT`: See `PayloadOut::ServiceCreateResult`.

## Service Fetch
The client sends this to fetch information of a specific service.
### Structure
```typescript
{
    "type": "SERVICE_FETCH",
    "service": string
}
```
### Responses
* `INVALID_SERVICE`: The service does not exist by that name.
* `SERVICE_FETCH_RESULT`: See `PayloadOut::ServiceFetchResult`.

## Service Fetch All
The client sends this to fetch information of all services on the server.
### Structure
```typescript
{
    "type": "SERVICE_FETCH_ALL"
}
```
### Responses
* `SERVICE_FETCH_ALL_RESULT`: See `PayloadOut::ServiceFetchAllResult`.

## Client Fetch All
The client sends this to fetch information of all clients on the server.
### Structure
```typescript
{
    "type": "CLIENT_FETCH_ALL"
}
```
### Responses
* `CLIENT_FETCH_ALL_RESULT`: See `PayloadOut::ClientFetchAllResult`.

# Payloads from the Server (PayloadOut)
This represents the types of payloads sent from the server.
All payloads are expected to be tagged with a `type` field indicating
it's nature, with the value being in SCREAMING_SNAKE_CASE.
Many of these payloads are also attached with a sequence number.

In general, payloads from the server will usually be sequenced if they
are in response to a payload from the client. This may not always be
applicable since payloads are sometimes sent automatically and not in
response to an input from the socket.

```typescript
{ 
    "type": "ABCDEFG",
    "seq": 123,
    ... 
}
```

## Ok
Generic OK payload.
### Structure
```typescript
{
    "type": "OK"
}
```

## Bad
Generic BAD payload.
### Structure
```typescript
{
    "type": "BAD"
}
```

## Hello
This server sends this upon successful identification.
The payload will also contain a universally unique identifier
that acts as a file server key. The payload also returns
the server's version.
### Structure
```typescript
{
    "type": "HELLO",
    "uuid": string, // should follow uuid structure (hyphenated)
    "version": string // should follow semantic versioning
}
```

## Self Subscribe Result
The server sends this in response to `SELF_SUBSCRIBE`.
### Structure
```typescript
{
    "type": "SELF_SUBSCRIBE_RESULT",
    "successful": boolean,
    "service": {
        "name": string,
        "nickname": string | undefined,
        "owner_uuid": string, // should be uuid structure
        "subscribers": string[] // array of uuids
    }
}
```
### Notes
The payload contains a `successful` boolean flag that indicates
if a the client subscribed to a new service (true) or is already
subscribed to that service (false).

## Self Unsubscribe Result
The server sends this in response to `SELF_UNSUBSCRIBE`.
### Structure
```typescript
{
    "type": "SELF_UNSUBSCRIBE_RESULT",
    "successful": boolean,
    "service": {
        "name": string,
        "nickname": string | undefined,
        "owner_uuid": string, // should be uuid structure
        "subscribers": string[] // array of uuids
    }
}
```
### Notes
The payload contains a `successful` boolean flag that indicates
if a the client unsubscribed from a service (true) or was not subscribed
to that service (false).

## Self Fetch Result
The server sends this in response to `SELF_FETCH`.
### Structure
```typescript
{
    "type": "SELF_FETCH_RESULT",
    "client": {
        "name": string,
        "nickname": string | undefined,
        "uuid": string, // should be uuid structure
        "tags": string[]
    }
    "subscriptions": {
        "name": string,
        "nickname": string | undefined,
        "owner_uuid": string, // should be uuid structure
        "subscribers": string[] // array of uuids
    }[]
}
```
### Notes
The subscription of the client is available as an array of service
information objects.

## Service Create Result
The server sends this in response to `SERVICE_CREATE`.
The payload contains a `successful` boolean flag that indicates
if a new service was created (true) or a service by that name
already exists (false).
### Structure
```typescript
{
    "type": "SERVICE_CREATE_RESULT",
    "successful": boolean,
    "service": {
        "name": string,
        "nickname": string | undefined,
        "owner_uuid": string, // should be uuid structure
        "subscribers": string[] // array of uuids
    }
}
```
### Notes
If `successful` is true, then this payload is also broadcasted to
every client connected to the server.

## Service Delete Result
The server sends this in response to `SERVICE_DELETE`.
### Structure
```typescript
{
    "type": "SERVICE_DELETE_RESULT",
    "service": {
        "name": string,
        "nickname": string | undefined,
        "owner_uuid": string, // should be uuid structure
        "subscribers": string[] // array of uuids
    }
}
```
### Notes
If this is sent, it means that the service is unambiguously deleted
on the server. This payload is broadcasted to every client connected
to the server.

## Service Fetch Result
The server sends this in response to `SERVICE_FETCH`.
### Structure
```typescript
{
    "type": "SERVICE_FETCH_RESULT",
    "service": {
        "name": string,
        "nickname": string | undefined,
        "owner_uuid": string, // should be uuid structure
        "subscribers": string[] // array of uuids
    }
}
```

## Service Fetch All Result
The server sends this in response to `SERVICE_FETCH_ALL`.
### Structure
```typescript
{
    "type": "SERVICE_FETCH_RESULT",
    "services": {
        "name": string,
        "nickname": string | undefined,
        "owner_uuid": string, // should be uuid structure
        "subscribers": string[] // array of uuids
    }[]
}
```
### Notes
The services are available as an array of service information objects.

## Client Fetch All Result
The server sends this in response to `CLIENT_FETCH_ALL`.
### Structure
```typescript
{
    "type": "CLIENT_FETCH_ALL_RESULT",
    "clients": {
        "name": string,
        "nickname": string | undefined,
        "uuid": string, // should be uuid structure
        "tags": string[]
    }[]
}
```
### Notes
The clients are available as an array of client information objects.

## Client Joined
A payload broadcasted whenever a new client joins.
### Structure
```typescript
{
    "type": "CLIENT_JOINED",
    "client": {
        "name": string,
        "nickname": string | undefined,
        "uuid": string, // should be uuid structure
        "tags": string[]
    }
}
```

## Client Left
A payload broadcasted whenever a client leaves.
### Structure
```typescript
{
    "type": "CLIENT_LEFT",
    "client": {
        "name": string,
        "nickname": string | undefined,
        "uuid": string, // should be uuid structure
        "tags": string[]
    }
}
```

## Service Client Subscribed
A payload broadcasted to the service when a new client subscribes
to the service.
### Structure
```typescript
{
    "type": "SERVICE_CLIENT_SUBSCRIBED",
    "client": {
        "name": string,
        "nickname": string | undefined,
        "uuid": string, // should be uuid structure
        "tags": string[]
    }
    "service": {
        "name": string,
        "nickname": string | undefined,
        "owner_uuid": string, // should be uuid structure
        "subscribers": string[] // array of uuids
    }
}
```
### Notes
Only clients that are subscribed to the service will receive
this payload. The owner must also be subscribed to receive this payload.

## Service Client Unsubscribed
A payload broadcasted to the service when a client unsubscribes
from the service.
### Structure
```typescript
{
    "type": "SERVICE_CLIENT_UNSUBSCRIBED",
    "client": {
        "name": string,
        "nickname": string | undefined,
        "uuid": string, // should be uuid structure
        "tags": string[]
    }
    "service": {
        "name": string,
        "nickname": string | undefined,
        "owner_uuid": string, // should be uuid structure
        "subscribers": string[] // array of uuids
    }
}
```
### Notes
Only clients that are subscribed to the service will receive
this payload. The owner must also be subscribed to receive this payload.

## Error Internal
Internal error payload.
### Structure
```typescript
{
    "type": "ERROR_INTERNAL",
    "desc": string
}
```
## Error Unsupported
Indicates that the "type" of the incoming payload is not supported.
### Structure
```typescript
{
    "type": "ERROR_UNSUPPORTED"
}
```

## Error Protocol
Indicates that the concierge has failed to decode the payload
due to some reason (reported by `serde`).
### Structure
```typescript
{
    "type": "ERROR_PROTOCOL",
    "desc": string
}
```

## Invalid Name
Indicates that no such name exists in the namespace of the conciergee.
### Structure
```typescript
{
    "type": "INVALID_NAME",
    "name": string
}
```

## Invalid Uuid
Indicates that the Uuid is unrecognized by the concierge.
### Structure
```typescript
{
    "type": "INVALID_UUID",
    "uuid": string // should be uuid structure
}
```

## Invalid Service
Indicates that the service name is not registered with the concierge.
### Structure
```typescript
{
    "type": "INVALID_SERVICE",
    "service": string
}
```