# Websocket Payloads
Packets sent from the client to the Gateway API are encapsulated within a
gateway payload object and must have the proper `operation` set.
### Example
```json
{ "operation": "ABCDEFG", "data": { "foo": "bar" }}
```

## Identify
**This payload must be the first payload sent
within 5 seconds of establishing the socket connection**, else the
connection will be dropped. When the concierge receives this payload, it will check
that the `name` does not conflict with the current namespace (or the connection will
be dropped). If everything goes well, a `HELLO` payload will be sent to the client.
### Structure
```typescript
{
    "operation": "IDENTIFY",
    "name": string
}
```
### Example
```json
{ "operation": "IDENTIFY", "name": "anthony" }
{ "operation": "IDENTIFY", "name": "brendan" }
{ "operation": "IDENTIFY", "name": "simulation" }
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
    "origin": { "name": string, "uuid": string } | undefined,
    "target": { "type": "NAME", "name": string } 
            | { "type": "UUID",  "uuid": string }
            | { "type": "GROUP", "group": string },
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
    "origin": { "name": string, "uuid": string } | undefined,
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
that acts as a file server key.
### Structure
```typescript
{
    "operation": "HELLO",
    "uuid": string
}
```
### Example
```json
{
    "operation": "HELLO",
    "uuid": "73fcc768-d724-47e2-a101-a45298188f47"
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
## Error
Error payload sent upon erroneous conditions encountered by the concierge.
### Structure
```typescript
{
    "operation": "ERROR",
    "code": number, 
    "data": string
}
```
### Example
```json
{
    "operation":"ERROR",
    "code": 420,
    "data": "The cake was a lie."
}
```