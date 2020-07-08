// Branded type, it's just a string underneath
export type Uuid = string & { __is_uuid: true };

/**
 * Alias type for primitive types
 * @ignorenaming
 */
type Primitive = undefined | null | boolean | string | number | Function;
/**
 * Type modifier to make all the properties of an object Readonly
 */
export type Immutable<T> = T extends Primitive ? T : T extends Array<infer U> ? ReadonlyArray<U> : DeepImmutable<T>;
/**
 * Type modifier to make all the properties of an object Readonly recursively
 */
export type DeepImmutable<T> = T extends Primitive ? T : T extends Array<infer U> ? DeepImmutableArray<U> : DeepImmutableObject<T>;
/**
 * Type modifier to make object properties readonly.
 */
export type DeepImmutableObject<T> = {
    readonly [K in keyof T]: DeepImmutable<T[K]>;
};

export type DeepImmutableArray<T> = ReadonlyArray<DeepImmutable<T>>;

export interface Origin {
    name: string,
    uuid: Uuid,
    group?: string,
}

export namespace Targets {
    export interface BaseTarget<T extends string> {
        type: T
    }
    export interface TargetName extends BaseTarget<"NAME"> {
        name: string
    }
    export interface TargetUuid extends BaseTarget<"UUID"> {
        uuid: Uuid,
    }
    export interface TargetGroup extends BaseTarget<"GROUP"> {
        group: string
    }
    type TargetAll = BaseTarget<"ALL">;

    export type Target = TargetName | TargetUuid | TargetGroup | TargetAll;
}
export type Target = Targets.Target;

export namespace Payloads {
    export interface BasePayload<T extends string> {
        type: T
    }

    interface GroupField {
        group: string
    }

    export interface Identify extends BasePayload<"IDENTIFY"> {
        name: string,
        version: string,
        secret?: string
    }
    export interface Message<T> extends BasePayload<"MESSAGE"> {
        target: Target,
        origin?: Origin,
        data: T
    }
    export type Subscribe = BasePayload<"SUBSCRIBE"> & GroupField;
    export type Unsubscribe = BasePayload<"UNSUBSCRIBE"> & GroupField;
    export type CreateGroup = BasePayload<"CREATE_GROUP"> & GroupField;
    export type DeleteGroup = BasePayload<"DELETE_GROUP"> & GroupField;
    export type FetchGroupSubs = BasePayload<"FETCH_GROUP_SUB_LIST"> & GroupField;
    export type FetchGroupList = BasePayload<"FETCH_GROUP_LIST">;
    export type FetchClientList = BasePayload<"FETCH_CLIENT_LIST">;
    export type FetchSubList = BasePayload<"FETCH_SUB_LIST">;
    export interface Hello extends BasePayload<"HELLO"> {
        uuid: Uuid,
        version: string
    }
    export interface GroupSubs extends BasePayload<"GROUP_SUB_LIST">, GroupField {
        clients: Origin[]
    }
    export interface GroupList extends BasePayload<"GROUP_LIST"> {
        groups: string[]
    }
    export interface ClientList extends BasePayload<"CLIENT_LIST"> {
        clients: Origin[]
    }
    export interface SubList extends BasePayload<"SUB_LIST"> {
        groups: string[],
    }
    export type ClientJoin = BasePayload<"CLIENT_JOIN"> & Origin;
    export type ClientLeave = BasePayload<"CLIENT_LEAVE"> & Origin;

    namespace Statuses {
        /** These statuses may be sequenced. */ 
        export interface BaseStatus<T extends string> extends BasePayload<"STATUS"> {
            code: T
            seq?: number,
        }
        /** These statuses are always sequenced. */ 
        export interface SequencedStatus<T extends string> extends BaseStatus<T> {
            seq: number,
        }

        export type Ok = SequencedStatus<"OK">;
        export type MessageSent = SequencedStatus<"MESSAGE_SENT">;
        export type Subscribed = SequencedStatus<"SUBSCRIBED"> & GroupField;
        export type Unsubscribed = BaseStatus<"UNSUBSCRIBED"> & GroupField;
        export type GroupCreated = BaseStatus<"GROUP_CREATED">  & GroupField;
        export type GroupDeleted = BaseStatus<"GROUP_DELETED"> & GroupField;
        export type Bad = SequencedStatus<"BAD">;
        export type Unsupported = SequencedStatus<"UNSUPPORTED">;
        export interface Protocol extends SequencedStatus<"PROTOCOL"> {
            desc: string
        }
        export interface GroupAlreadyCreated extends SequencedStatus<"GROUP_ALREADY_CREATED"> {
            group: string
        }
        export interface NoSuchName extends SequencedStatus<"NO_SUCH_NAME"> {
            name: string
        }
        export interface NoSuchUuid extends SequencedStatus<"NO_SUCH_UUID"> {
            uuid: Uuid
        }
        export interface NoSuchGroup extends SequencedStatus<"NO_SUCH_GROUP"> {
            group: string
        }

        export type Status = Ok | MessageSent | Subscribed | Unsubscribed
            | GroupCreated | GroupDeleted | Bad | Unsupported | Protocol
            | GroupAlreadyCreated | NoSuchName | NoSuchUuid | NoSuchGroup;
    }
    export type Status = Statuses.Status;

    export type GenericPayload<M> = Identify | Message<M> | Subscribe | Unsubscribe
        | CreateGroup | DeleteGroup | FetchGroupSubs
        | FetchGroupList | FetchSubList | Hello | GroupSubs | GroupList
        | ClientList | SubList | ClientJoin | ClientLeave | Status;
}
export type GenericPayload<T> = Payloads.GenericPayload<T>;

/**
 * Central connector to the concierge.
 */
export class Client {
    readonly url: string;
    readonly name: string;

    private socket?: WebSocket;
    private version?: string;
    private secret?: string;
    private seq: number = 0;

    reconnect: boolean;
    reconnectInterval: number = 10000;
    uuid!: Uuid;
    handlers: RawHandler[] = [];

    constructor(name: string, url: string, reconnect: boolean = false) {
        this.url = url;
        this.name = name;
        this.reconnect = reconnect;
    }

    connect(version: string, secret?: string) {
        console.info("Trying to connect to ", this.url);
        this.version = version;
        this.secret = secret;
        this.socket = new WebSocket(this.url);
        this.socket.onopen = event => this.onOpen(event);
        this.socket.onmessage = event => this.onReceive(event);
        this.socket.onerror = event => this.onError(event);
        this.socket.onclose = event => this.onClose(event);
    }

    sendJSON(payload: GenericPayload<any>): number {
        if (this.socket == undefined) {
            throw new Error("Socket is not connected")
        }
        this.socket.send(JSON.stringify(payload));
        let tmp = this.seq;
        this.seq += 1;
        return tmp;
    }

    close(code?: number, reason?: string, reconnect: boolean = true) {
        if (this.socket == undefined) {
            throw new Error("Socket is not connected")
        }
        this.socket.close(code, reason);
        if (reconnect) {
            this.tryReconnect();
        } else {
            this.socket = undefined;
            this.version = undefined;
            this.secret = undefined;
        }
    }

    private tryReconnect() {
        if (this.reconnect) {
            console.warn("Connection closed, reconnecting in", this.reconnectInterval, "ms")
            setTimeout(() => {
                this.connect(this.version!, this.secret);
            }, this.reconnectInterval);
        }
    }

    private onOpen(event: Event) {
        for (let handler of this.handlers) {
            handler.onOpen?.(event);
        }
        if (this.version == undefined) {
            throw new Error("Version is undefined")
        }
        console.log("Identifying with version", this.version);
        this.sendJSON({
            type: "IDENTIFY",
            name: this.name,
            version: this.version,
            secret: this.secret
        });
    }

    private onClose(event: CloseEvent) {
        for (let handler of this.handlers) {
            handler.onClose?.(event);
        }
        console.warn(event.code, event.reason);
        this.tryReconnect();
    }

    private onReceive(event: MessageEvent) {
        let data = JSON.parse(event.data) as object;
        if (data.hasOwnProperty("type")) {
            let payload = data as GenericPayload<any>;

            if (payload.type == "HELLO") {
                this.uuid = payload.uuid;
            }

            for (let handler of this.handlers) {
                handler.onReceive?.(payload);
            }
        }
    }

    private onError(event: Event) {
        for (let handler of this.handlers) {
            handler.onError?.(event);
        }
        console.log(event);
    }
}

/**
 * Low level handler for the concierge client. Events from JS sockets are passed
 * directly to this handler.
 */
export interface RawHandler {
    onOpen?(event: Event): void;
    onClose?(event: CloseEvent): void;
    onReceive?(payload: GenericPayload<any>): void;
    onError?(event: Event): void;
}

/**
 * Class that allows for high level interaction with incoming payloads.
 */
export abstract class EventHandler implements RawHandler {
    onReceive(payload: GenericPayload<any>): void {
        switch (payload.type) {
            case "MESSAGE":
                this.onRecvMessage?.(payload);
                break;
            case "HELLO":
                this.onRecvHello?.(payload);
                break;
            case "GROUP_SUB_LIST":
                this.onRecvGroupSubs?.(payload);
                break;
            case "GROUP_LIST":
                this.onRecvGroupList?.(payload);
                break;
            case "CLIENT_LIST":
                this.onRecvClientList?.(payload);
                break;
            case "SUB_LIST":
                this.onRecvSubs?.(payload);
                break;
            case "CLIENT_JOIN":
                this.onRecvClientJoin?.(payload);
                break;
            case "CLIENT_LEAVE":
                this.onRecvClientLeave?.(payload);
                break;
            case "STATUS":
                this.onRecvStatus?.(payload);
                break;
        }
    }

    onRecvMessage?(message: Payloads.Message<any>): void;
    onRecvHello?(hello: Payloads.Hello): void;
    onRecvGroupSubs?(groupSubs: Payloads.GroupSubs): void;
    onRecvGroupList?(groupList: Payloads.GroupList): void;
    onRecvClientList?(clientList: Payloads.ClientList): void;
    onRecvSubs?(subs: Payloads.SubList): void;
    onRecvClientJoin?(clientJoin: Payloads.ClientJoin): void;
    onRecvClientLeave?(clientLeave: Payloads.ClientLeave): void;
    onRecvStatus?(status: Payloads.Status): void;
}

/**
 * Utility class that automatically handles subscription to a specific group.
 */
export abstract class ServiceEventHandler extends EventHandler {
    readonly client: Client;
    protected group: string;

    constructor(client: Client, group: string) {
        super();
        this.client = client;
        this.group = group;
    }

    onClose(_event: CloseEvent) {
        this.onUnsubscribe();
    }

    onRecvHello(_event: Payloads.Hello) {
        this.client.sendJSON({
            type: "FETCH_GROUP_LIST"
        })
    }

    onRecvGroupList(event: Payloads.GroupList) {
        if (event.groups.includes(this.group)) {
            this.subscribe(this.group);
        }
    }

    private subscribe(group: string) {
        this.client.sendJSON({
            type: "SUBSCRIBE",
            group
        });
    }

    /**
     * Called when the handler successfully subscribes to the group.
     */
    abstract onSubscribe(): void;

    /**
     * Called when the handler is unsubscribed from the group.
     */
    abstract onUnsubscribe(): void;

    onRecvStatus(status: Payloads.Status): void {
        switch (status.code) {
            case "NO_SUCH_GROUP":
                if (status.group == this.group) {
                    console.error("Group `", this.group, "` does not exist on concierge.");
                }
                break;
            case "GROUP_DELETED":
                if (status.group == this.group) {
                    console.warn("Group `", this.group, "` has been deleted on the concierge.");
                }
                break;
            case "GROUP_CREATED":
                if (status.group == this.group) {
                    this.subscribe(this.group);
                }
                break;
            case "SUBSCRIBED":
                if (status.group == this.group) {
                    console.log("Subscribed to `", this.group, "`.");
                    this.onSubscribe();
                }
                break;
            case "UNSUBSCRIBED":
                if (status.group == this.group) {
                    console.log("Unsubscribed from `", this.group, "`.");
                    this.onUnsubscribe();
                }
                break;
        }
    }
}