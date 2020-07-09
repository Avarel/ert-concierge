# Websocket Payloads
Packets sent from the client to the Gateway API are encapsulated within a
gateway payload object and must have the proper `operation` set.
### Example
```typescript
{ "operation": "ABCDEFG", ... }
```

# Protocol
Upon connecting, the client must send an appropriate `IDENTIFY` payload within 5 seconds. Otherwise, the connection will be dropped. Any other payload sent during
this period will also immediately drop the connection with either:
* `4000` UNKOWN: internal server errors.
* `4002` FATAL_DECODE: server failed to decode; malformed input?
* `4003` NO_AUTH: a normal payload was sent prior to identification.
* `4004` AUTH_FAILED: authorization failed due to timeout.
* `4005` DUPLICATE_AUTH: namespace conflict in the concierge (pick another `name`!).
* `4006` BAD_SECRET: expected secret does not match gateway secret.
* `4007` BAD_VERSION: expected version is not compatible with gateway version (update your client).

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
    "operation": "IDENTIFY",
    "name": string,
    "version": string,
    "secret": string 
            | undefined,
}
```
### Example
```json
{ "operation": "IDENTIFY", "name": "anthony", "version": "0.1.0" }
{ "operation": "IDENTIFY", "name": "brendan", "version": "0.1.0" }
{ "operation": "IDENTIFY", "name": "simulation", "version": "0.1.0" }
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
    "operation": "MESSAGE",
    "origin": { "name": string, "uuid": string }
            | undefined,
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
    "operation": "MESSAGE",
    "target": {
        "type":"NAME", 
        "name": "brendan"
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
    "operation": "MESSAGE",
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
## Subscribe
Subscribe to a group's broadcasts. The group must exist before anyone can subscribe
to it (created using `CREATE_GROUP` payload). All messages sent to the group
will be broadcasted using the `MESSAGE` payload to the subscribers.
### Structure
```typescript
{
    "operation": "SUBSCRIBE",
    "group": string
}
```
### Example
```json
{
    "operation": "SUBSCRIBE",
    "group": "simulation1_data"
}
```
## Unsubscribe
Unsubscribe from a group's broadcasts.
### Structure
```typescript
{
    "operation": "UNSUBSCRIBE",
    "group": string
}
```
### Example
```json
{
    "operation": "UNSUBSCRIBE",
    "group": "simulation1_data"
}
```
## Broadcast
Broadcast to every client connected to the concierge.
### Structure
```typescript
{
    "operation": "BROADCAST",
    "origin": { "name": string, "uuid": string }
            | undefined,
    "data": any
}
```
### Example
#### Payload to the Concierge
Imagine that a client identifies as `anthony` sends this to the concierge.
```json
{
    "operation": "BROADCAST",
    "data": {
        "foo": "bar"
    }
}
```
### Payload from the Concierge
The client `brendan` (and any other clients) will receive this on their end.
```json
{
    "operation": "BROADCAST",
    "origin": { 
        "name": "anthony", 
        "uuid": "..."
    },
    "data": {
        "foo": "bar"
    }
}
```
## Create Group
Subscribe to a group's broadcast.
### Structure
```typescript
{
    "operation": "CREATE_GROUP",
    "group": string
}
```
### Example
```json
{
    "operation": "CREATE_GROUP",
    "group": "simulation1_data"
}
```
## Delete Group
Unsubscribe from a group's broadcast. The client that created the group using `CREATE_GROUP` payload is the only client that can delete the group. The group
is also automatically deleted if the owning client disconnects from the concierge.
### Structure
```typescript
{
    "operation": "DELETE_GROUP",
    "group": string
}
```
### Example
```json
{
    "operation": "DELETE_GROUP",
    "group": "simulation1_data"
}
```
## Fetch Group Subscribers
This payload asks for all the clients of the group specified in the data field.
### Structure
```typescript
{
    "operation": "FETCH_GROUP_SUBS",
    "group": string
}
```
### Example
```json
{
    "operation": "FETCH_GROUP_SUBS",
    "group": "users"
}
```
## Fetch Group List
This payload asks for all of the groups
registered with the concierge.
### Structure
```typescript
{
    "operation": "FETCH_GROUP_LIST"
}
```
## Fetch Client List
This payload asks for all of the clients
connected to the concierge.
### Structure
```typescript
{
    "operation": "FETCH_CLIENT_LIST"
}
```
## Fetch Subscriptions
This payload asks for the connecting client's
subscriptions.
```typescript
{
    "operation": "FETCH_SUBS"
}
```
## Hello
This payload is sent upon successful identification.
The payload will also contain a universally unique identifier `uuid`
that acts as a file server key and the version of the server.
### Structure
```typescript
{
    "operation": "HELLO",
    "uuid": string,
    "version": string
}
```
### Example
```json
{
    "operation": "HELLO",
    "uuid": "73fcc768-d724-47e2-a101-a45298188f47",
    "version": "0.1.0"
}
```
## Group Subscribers List
Returns all the client names as an array of strings.
### Structure
```typescript
{
    "operation": "GROUP_SUBS",
    "group": string,
    "clients": Array<{ "name": string, "uuid": string }>
}
```
### Example
```json
{
    "operation": "GROUP_SUBS",
    "group": "plugins",
    "clients":[
        {
            "name": "simulation1",
            "uuid": "..."
        },
        {
            "name": "simulation2",
            "uuid": "..."
        }
    ]
}
```
## Group List
This payload lists all of the groups registered with the concierge.
### Structure
```typescript
{
    "operation": "GROUP_LIST",
    "groups": Array<string>
}
```
### Example
```json
{
    "operation": "GROUP_LIST",
    "groups": [
        "simulation1",
        "simulation2"
    ]
}
```
## Client List
```typescript
{
    "operation": "CLIENT_LIST",
    "clients": Array<{ "name": string, "uuid": string }>
}
```
### Example
```json
{
    "operation": "CLIENT_LIST",
    "clients": [
        {
            "name":"simulation1",
            "uuid":"..."
        },
        {
            "name":"simulation2",
            "uuid":"..."
        },
        {
            "name":"anthony",
            "uuid":"..."
        },
        {
            "name":"brendan",
            "uuid":"..."
        }
    ]
}
```
## Subscriptions
This payload lists all of the connecting client's subscriptions.
### Example
```typescript
{
    "operation": "SUBS",
    "groups": Array<string>
}
```
### Example
```json
{
    "operation": "SUBS",
    "groups": [
        "simulation1"
    ]
}
```
## Client Join
A payload broadcasted whenever a new client joins. This is not
emitted to newly joining clients.
### Structure
```typescript
{
    "operation": "CLIENT_JOIN",
    "name": string,
    "uuid": string
}
```
### Example
```json
{ "operation": "CLIENT_JOIN", "name": "anthony", "uuid": "..." }
{ "operation": "CLIENT_JOIN", "name": "simulation", "uuid": "..." }
```
## Client Leave
A payload broadcasted whenever a new client leaves. This is not
emitted to leaving clients.
### Structure
```typescript
{
    "operation": "CLIENT_LEAVE",
    "name": string,
    "uuid": string
}
```
### Example
```json
{ "operation": "CLIENT_LEAVE", "name": "anthony", "uuid": "..." }
{ "operation": "CLIENT_LEAVE", "name": "simulation", "uuid": "..." }
```
## Status
Status payload sent by the concierge. May happen for various reasons
such as error response or responses to certain commands.
### Structure
```typescript
{
    "operation": "STATUS",
    "code": string /* see status codes */,
    "seq": number | undefined,
    /* ... */
}
```
### Example
```json
{
    "operation": "STATUS",
    "code": "OK",
    "seq": 329
}
```
#### Status Codes
Unless indicated otherwise, these statuses always have a sequence number attached to them.
Sequence numbers are based on the `n`-th **text** payload received by the concierge. The `seq` field
thus indicates what this status payload is in response to. If the `seq` field is missing, then it means
that this was a status update due to changes not made by the connecting client.
* `OK`
* `MESSAGE_SENT`
    * Fired in response to `MESSAGE`.
* `SUBSCRIBED`
    * `group: string`: The group the client subscribed to.
* `UNSUBSCRIBED`
    * Fired in response to `UNSUBSCRIBE`, `DELETE_GROUP`, and the group being deleted because the owner of the group left the concierge.
    * **May not have a `seq` field** if the client did not send a `UNSUBSCRIBE` payload (due to the group being deleted by the owner, etc).
    * `group: string`: The group the client unsubscribed from.
* `CREATED_GROUP` 
    * Fired in response to `CREATE_GROUP`.
    * **May not have a `seq` field** if the client did not send a `CREATE_GROUP` payload (fired as a status when someone else creates a group).
    * `group: string`: The group created;
* `DELETED_GROUP`
    * Fired in response to `DELETE_GROUP`.
    * **May not have a `seq` field** if the client did not send a `DELETE_GROUP` payload (fired as a status when someone else deletes a group).
    * `group: string`: The group deleted.

* `BAD`
* `UNSUPORTED`
    * Fired due to an unsupported payload (ie. concierge receiving a `HELLO` payload).
* `PROTOCOL` 
    * Fired when server fails to decode, or fails to deserialize data to an accepted format.
    * `desc: string`: Reason that the server failed to understand the payload.
* `GROUP_ALREADY_CREATED` 
    * In response to `CREATE_GROUP`.
    * Fired in response to `CREATE_GROUP`.
    * `group: string`: The name of the group already created.
* `NO_SUCH_NAME`
    * In response to `MESSAGE`.
    * Fired when the `target` field points to a name, but the name is not found in the namespace.
    * `name: string`: The name unrecognized by the server.
* `NO_SUCH_UUID`
    * In response to `MESSAGE`.
    * Fired when the `target` fields points to a UUID, but the uuid is not recognized.
    * `uuid: string`: The UUID unrecognized by the server.
* `NO_SUCH_GROUP` 
    * In response to `MESSAGE`, `DELETE_GROUP`, `SUBSCRIBE`, `UNSUBSCRIBE`.
    * Fired when the `target` fields point to a group, but the group is not present in the concierge.
    * `group: string`: The group unrecognized by the server.