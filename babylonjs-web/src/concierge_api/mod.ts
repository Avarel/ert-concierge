import { Uuid, Payload } from "./payloads";
import { RawHandler, ServiceEventHandler } from "./handlers";

/**
 * A waiting point for the client. When an payload with the specific
 * sequence number is returned from the client that matches this waiting
 * point's sequence number, the callback will be executed, the timeoutHandle
 * will be cancelled, and the waiting point will be discarded.
 */
interface EventWaiterPoint {
    readonly seq: number,
    readonly timeoutHandle: number,
    readonly callback: (payload: Readonly<Payload.Out>) => void
}

/**
 * Implementation of a client to the ERT Concierge.
 */
export default class Client {
    /** 
     * Websocket connection. This is present when the client is attempting
     * to connect to or is already connected to the central server.
     * A new instance is spun up on new connection attempts.
     */
    private socket?: WebSocket;
    /**
     * The version of the client that communicates to the central
     * server. The string should generally follow semantic versioning.
     */
    private version?: string;
    /** 
     * The passphrase required to connect to the central
     * server if the server is configured with a secret requirement.
     */
    private secret?: string;
    /**
     * The sequence number that the client keeps track of.
     * The sequence number corresponds to the n-th TEXT socket message
     * sent through the socket connection. This helps the central server
     * respond with results to specific requests. This is used extensively
     * in the callback (waiters) API.
     * 
     * The sequence number of the client on the server can be reset with a
     * specific payload type (SELF_SET_SEQ).
     */
    private seq: number = -1;

    /**
     * The handlers that listen to events and messages emitted through the
     * socket connection. Every handler gets a reference to the same message.
     */
    private readonly handlers: RawHandler[] = [];

    /**
     * Keeps track of event callbacks registered with specific sequence numbers.
     * We use a map for fast lookup. Sequence numbers should not conflict since
     * they are always incremented per payload. If they do conflict, then abuse
     * of SELF_SET_SEQ is likely. Such programs are incredibly degenerate, and
     * we do not care to support it.
     */
    private readonly waiters: Map<number, EventWaiterPoint> = new Map();

    /**
     * Reconnect interval in milliseconds. This dictates the delay in which
     * the client attempts to reconnect after a disconnection.
     */
    reconnectInterval: number = 10000;
    
    /**
     * UUID assigned to the client upon sending the identification payload.
     */
    private _uuid!: Uuid;
    get uuid(): Uuid {
        return this._uuid;
    }

    /**
     * Construct a new client.
     * 
     * @param name Name of the client. Must be alphanumeric/underscores only.
     * @param baseUrl The url of the central server.
     * @param nickname The nickname of the client. Can be any valid UTF-8 string.
     * @param reconnect Should the client reconnect in case of a disconnect?
     */
    constructor(
        readonly name: string,
        readonly baseUrl: string,
        readonly nickname?: string,
        public secure: boolean = false,
        public reconnect: boolean = false
    ) { }

    portOverride?: string;
    wsUrlOverride?: string;
    fsUrlOverride?: string;

    /** Get the websocket URL. */
    get wsUrl(): string {
        const url = new URL("ws", this.wsUrlOverride ? this.wsUrlOverride : this.baseUrl);
        url.protocol = this.secure ? "wss" : "ws";
        if (this.portOverride) {
            url.port = this.portOverride;
        }
        url
        return url.toString();
    }

    /** Get a file url based off the base URL supplied to the client. */
    fileUrl(clientName: string, fileName: string): string {
        const url = new URL(`fs/${clientName}/${fileName}`, this.fsUrlOverride ? this.fsUrlOverride : this.baseUrl);
            url.protocol = this.secure ? "https" : "http";
            if (this.portOverride) {
                url.port = this.portOverride;
            }
            url
            return url.toString();
    }

    /**
     * Connect to the central server.
     * 
     * @param version Version of the client. Should generally follow semantic
     *                versioning.
     * @param secret  Secret passphrase, in case the server is configured to
     *                require it.
     */
    connect(version: string, secret?: string) {
        console.info("Client: Trying to connect to ", this.wsUrl);
        this.version = version;
        this.secret = secret;
        this.socket = new WebSocket(this.wsUrl, "ert-concierge");
        this.socket.onopen = event => this.onOpen(event);
        this.socket.onmessage = event => this.onReceive(event);
        this.socket.onerror = event => this.onError(event);
        this.socket.onclose = event => this.onClose(event);
    }

    /**
     * Send a payload to the server.
     * 
     * @param payload  A payload following the documented JSON format.
     * @param callback A callback can be provided for when the server
     *                 responds to this specific payload. 
     * @returns The sequence number associated with the sent payload.
     */
    sendPayload(
        payload: Readonly<Payload.In>,
        callback?: (payload: Readonly<Payload.Out>) => void
    ): number {
        if (this.socket == undefined) {
            throw new Error("Socket is not connected")
        }
        this.socket.send(JSON.stringify(payload));
        const seq = this.seq;
        this.seq += 1;

        if (callback) {
            const timeoutHandle = window.setTimeout(() => {
                this.waiters.delete(seq);
            }, 5000);
            this.waiters.set(seq, { seq, timeoutHandle, callback });
        }

        return seq;
    }

    /**
     * Asynchronously send a payload to the server.
     * 
     * @param payload A payload following the documented JSON format.
     * @param timeout A time limit for the sever to respond. Default being 10s.
     * @returns The payload result from the server.
     */
    sendPayloadAsync(payload: Readonly<Payload.In>, timeout: number = 10000): Promise<Readonly<Payload.Out>> {
        return new Promise((resolve, reject) => {
            let rejectTimeout = window.setTimeout(() => {
                reject(new Error("Server did not respond to the payload in time."))
            }, timeout);
            this.sendPayload(payload, (result) => {
                window.clearTimeout(rejectTimeout);
                resolve(result);
            })
        })
    }

    /**
     * Close the socket connection and inform the server.
     * 
     * @param code Close code.
     * @param reason Close reason.
     * @param reconnect Should you reconnect after closing?
     */
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

    /**
     * Add an event handler.
     * 
     * @param handler An event handler.
     * @see RawHandler
     */
    addHandler(handler: RawHandler) {
        this.handlers.push(handler);
    }

    /**
     * Remove an event handler by its reference.
     * 
     * @param handler An event handler.
     * @see RawHandler
     */
    removeHandler(handler: RawHandler) {
        for (let i = 0; i < this.handlers.length; i++) {
            if (this.handlers[i] === handler) {
                this.handlers.splice(i, 1);
                i -= 1;
            }
        }
    }

    /**
     * Remove all event handlers.
     */
    clearHandlers() {
        this.handlers.length = 0;
    }

    private tryReconnect() {
        if (this.reconnect) {
            console.warn("Client: Connection closed, reconnecting in", this.reconnectInterval, "ms")
            setTimeout(() => {
                this.connect(this.version!, this.secret);
            }, this.reconnectInterval);
        }
    }

    private onOpen(event: Event) {
        for (const handler of this.handlers) {
            handler.onOpen?.(event);
        }
        if (this.version == undefined) {
            throw new Error("Version is undefined")
        }
        console.log("Client: Identifying with version", this.version);
        this.sendPayload({
            type: "IDENTIFY",
            name: this.name,
            version: this.version,
            secret: this.secret,
            tags: ["babylon"]
        });
    }

    private onClose(event: CloseEvent) {
        for (const handler of this.handlers) {
            handler.onClose?.(event);
        }
        console.warn(event.code, event.reason);
        this.tryReconnect();
    }

    private onReceive(event: MessageEvent) {
        const data = JSON.parse(event.data);
        // Hopeful check that it has a type field.
        if (typeof data == "object" && data.hasOwnProperty("type")) {
            const payload = data as Payload.Out;

            // Special case HELLO.
            if (payload.type == "HELLO") {
                console.log("Assigned uuid", payload.uuid);
                this._uuid = payload.uuid;
                this.seq = 0;
            }

            // Listen for any await points.
            const seq = payload.seq;
            if (seq != undefined) {
                const awaitPoint = this.waiters.get(seq);
                if (awaitPoint) {
                    // Execute the callback and delete the waiter.
                    this.waiters.delete(seq);
                    window.clearTimeout(awaitPoint.timeoutHandle);
                    awaitPoint.callback(payload);
                }
            }

            // Pass to all handlers.
            for (const handler of this.handlers) {
                handler.onReceive?.(payload);
            }
        }
    }

    private onError(event: Event) {
        for (const handler of this.handlers) {
            handler.onError?.(event);
        }
        console.log(event);
    }
}

export { Uuid, Payload, RawHandler, ServiceEventHandler };