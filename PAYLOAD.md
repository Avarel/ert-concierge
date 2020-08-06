# Websocket Payloads

Packets sent from the client to the Gateway API are encapsulated within a
gateway payload object and must have the proper `type` operation set.

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

Clients can use `MESSAGE` payloads to send data to specific targets or entire groups. If a message is sent to a group, then it will be broadcasted to every client subscribed to the group.

The group must first be created using `CREATE_GROUP` before anyone can subscribe to it. The client that created the group is the only client that can delete the group with `DELETE_GROUP`. The group will also be automatically deleted if the owning client leaves the concierge.

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
target client. The `GROUP` target type will broadcast the message to all of the
group's subscribers.

The `data` field is transmitted verbatim.

### Structure

```typescript
{
    "type": "MESSAGE",
    "origin": {
        "name": string,
        "nickname": string,
        "uuid": string,
        "tags": string[],
        "group": {
            "name": string,
            "nickname": string,
            "owner_uuid": string,
            "subscribers": string[]
        },
    } | undefined,
    "target": { "type": "NAME", "name": string }
            | { "type": "UUID", "uuid": string }
            | { "type": "GROUP", "group": string },
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

Subscribe to a group's broadcasts. The group must exist before anyone can subscribe
to it (created using `CREATE_GROUP` payload). All messages sent to the group
will be broadcasted using the `MESSAGE` payload to the subscribers.

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

Unsubscribe from a group's broadcasts.

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

## Group Create

Subscribe to a group's broadcast.

### Structure

```typescript
{
    "type": "GROUP_CREATE",
    "name": string,
    "nickname": string | undefined,
}
```

### Example

```json
{
    "type": "GROUP_CREATE",
    "name": "simulation1_data",
    "nickname": "The First Simulation"
}
```

## Group Delete

Unsubscribe from a group's broadcast. The client that created the group using `CREATE_GROUP` payload is the only client that can delete the group. The group
is also automatically deleted if the owning client disconnects from the concierge.

### Structure

```typescript
{
    "type": "GROUP_DELETE",
    "name": string
}
```

### Example

```json
{
    "type": "GROUP_DELETE",
    "name": "simulation1_data"
}
```

## Fetch Group Information

This payload asks for all the clients of the group specified in the data field.

### Structure

```typescript
{
    "type": "GROUP_FETCH",
    "name": string
}
```

### Example

```json
{
    "type": "GROUP_FETCH",
    "name": "users"
}
```

## Fetch All Groups

This payload asks for all of the groups
registered with the concierge.

### Structure

```typescript
{
    "type": "GROUP_FETCH_ALL"
}
```

## Fetch All Clients

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

## Group Fetch Result

Returns all the client names as an array of strings.

### Structure

```typescript
{
    "type": "GROUP_FETCH_RESULT",
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
    "type": "GROUP_FETCH_RESULT",
    "name": "simulation1_data",
    "nickname": "The First Simulation",
    "owner_uuid": "...",
    "subscribers": ["...", "..."],
    "seq": 155,
}
```

## Group Fetch All Result

This payload lists all of the groups registered with the concierge.

### Structure

```typescript
{
    "type": "GROUP_FETCH_ALL_RESULT",
    "groups": {
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
    "type": "GROUP_FETCH_ALL_RESULT",
    "groups": [
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
-   `SUBSCRIBED`
    -   `name: string`: The name of the group already created.
    -   `nickname: string | undefined`: THe nickname of the group.
    -   `owner_uuid: string`: The UUID of the group's owner.
    -   `subscribers: string[]`: The UUIDs of the subscribers.
-   `UNSUBSCRIBED`
    -   Fired in response to `UNSUBSCRIBE`, `GROUP_DELETE`, and the group being deleted because the owner of the group left the concierge.
    -   **May not have a `seq` field** if the client did not send a `UNSUBSCRIBE` payload (due to the group being deleted by the owner, etc).
    -   `name: string`: The name of the group already created.
    -   `nickname: string | undefined`: THe nickname of the group.
    -   `owner_uuid: string`: The UUID of the group's owner.
    -   `subscribers: string[]`: The UUIDs of the subscribers.
-   `GROUP_CREATED`
    -   Fired in response to `GROUP_CREATE`.
    -   **May not have a `seq` field** if the client did not send a `GROUP_CREATE` payload (fired as a status when someone else creates a group).
    -   `name: string`: The name of the group already created.
    -   `nickname: string | undefined`: THe nickname of the group.
    -   `owner_uuid: string`: The UUID of the group's owner.
    -   `subscribers: string[]`: The UUIDs of the subscribers.
-   `GROUP_DELETED`
    -   Fired in response to `GROUP_DELETE`.
    -   **May not have a `seq` field** if the client did not send a `GROUP_DELETE` payload (fired as a status when someone else deletes a group).
    -   `name: string`: The name of the group already created.
    -   `nickname: string | undefined`: THe nickname of the group.
    -   `owner_uuid: string`: The UUID of the group's owner.
    -   `subscribers: string[]`: The UUIDs of the subscribers.

-   `BAD`
-   `UNSUPORTED`
    -   Fired due to an unsupported payload (ie. concierge receiving a `HELLO` payload).
-   `PROTOCOL`
    -   Fired when server fails to decode, or fails to deserialize data to an accepted format.
    -   `desc: string`: Reason that the server failed to understand the payload.
-   `GROUP_ALREADY_CREATED`
    -   Fired in response to `GROUP_CREATE`.
    -   `name: string`: The name of the group already created.
    -   `nickname: string | undefined`: THe nickname of the group.
    -   `owner_uuid: string`: The UUID of the group's owner.
    -   `subscribers: string[]`: The UUIDs of the subscribers.
-   `NO_SUCH_NAME`
    -   In response to `MESSAGE`.
    -   Fired when the `target` field points to a name, but the name is not found in the namespace.
    -   `name: string`: The name unrecognized by the server.
-   `NO_SUCH_UUID`
    -   In response to `MESSAGE`.
    -   Fired when the `target` fields points to a UUID, but the uuid is not recognized.
    -   `uuid: string`: The UUID unrecognized by the server.
-   `NO_SUCH_GROUP`
    -   In response to `MESSAGE`, `GROUP_DELETE`, `SUBSCRIBE`, `UNSUBSCRIBE`.
    -   Fired when the `target` fields point to a group, but the group is not present in the concierge.
    -   `group: string`: The group unrecognized by the server.
