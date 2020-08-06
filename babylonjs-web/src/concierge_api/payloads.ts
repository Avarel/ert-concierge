// Branded type, it's just a string underneath
export type Uuid = string & { readonly __is_uuid: true };

export interface ClientPayload {
    readonly name: string,
    readonly nickname?: string,
    readonly uuid: Uuid,
    readonly tags: ReadonlyArray<string>,
}

export interface Origin extends ClientPayload {
    readonly group?: GroupPayload,
}

export interface GroupPayload {
    readonly name: string,
    readonly nickname?: string,
    readonly owner_uuid: Uuid,
    readonly subscribers: ReadonlyArray<Uuid>
}

export module Targets {
    export interface BaseTarget<T extends string> {
        readonly type: T
    }
    export interface TargetName extends BaseTarget<"NAME"> {
        readonly name: string
    }
    export interface TargetUuid extends BaseTarget<"UUID"> {
        readonly uuid: Uuid,
    }
    export interface TargetGroup extends BaseTarget<"GROUP"> {
        readonly group: string
    }
    type TargetAll = BaseTarget<"ALL">;

    export type Target = TargetName | TargetUuid | TargetGroup | TargetAll;
}
export type Target = Targets.Target;

export interface BasePayload<T extends string> {
    readonly type: T
}

interface GroupField {
    readonly group: string
}

interface GroupField2 {
    readonly name: string
}

export module Payload {
    export interface Identify extends BasePayload<"IDENTIFY"> {
        readonly name: string,
        readonly version: string,
        readonly secret?: string,
        readonly tags?: ReadonlyArray<string>,
    }
    export interface Message<T> extends BasePayload<"MESSAGE"> {
        readonly target: Target,
        readonly origin?: Origin,
        readonly data: T
    }
    export type SelfSubscribe = BasePayload<"SELF_SUBSCRIBE"> & GroupField2;
    export type SelfUnsubscribe = BasePayload<"SELF_UNSUBSCRIBE"> & GroupField2;
    export type GroupCreate = BasePayload<"GROUP_CREATE"> & GroupField2;
    export type GroupDelete = BasePayload<"GROUP_DELETE"> & GroupField2;
    export type GroupFetch = BasePayload<"GROUP_FETCH"> & GroupField2;
    export type GroupFetchAll = BasePayload<"GROUP_FETCH_ALL">;
    export type ClientFetchAll = BasePayload<"CLIENT_FETCH_ALL">;
    export type SelfFetch = BasePayload<"SELF_FETCH">;
    export interface Hello extends BasePayload<"HELLO"> {
        readonly uuid: Uuid,
        readonly version: string
    }
    export type GroupFetchResult = BasePayload<"GROUP_FETCH_RESULT"> & GroupPayload;
    export interface GroupFetchAllResult extends BasePayload<"GROUP_FETCH_ALL_RESULT"> {
        readonly groups: ReadonlyArray<GroupPayload>
    }
    export interface ClientFetchAllResult extends BasePayload<"CLIENT_FETCH_ALL_RESULT"> {
        readonly clients: ReadonlyArray<ClientPayload>
    }
    export interface SelfFetchResult extends BasePayload<"SELF_FETCH_RESULT">, ClientPayload {
        readonly subscriptions: ReadonlyArray<GroupPayload>,
    }

    export module StatusPayload {
        /** These statuses may be sequenced. */ 
        export interface BaseStatus<T extends string> extends BasePayload<"STATUS"> {
            readonly code: T
            readonly seq?: number,
        }
        /** These statuses are always sequenced. */ 
        export interface SequencedStatus<T extends string> extends BaseStatus<T> {
            readonly seq: number,
        }
    
        export type ClientJoined = BaseStatus<"CLIENT_JOINED"> & ClientPayload;
        export type ClientLeft = BaseStatus<"CLIENT_LEFT"> & ClientPayload;
        export type Ok = SequencedStatus<"OK">;
        export type MessageSent = SequencedStatus<"MESSAGE_SENT">;
        export type Subscribed = SequencedStatus<"SUBSCRIBED"> & GroupField;
        export type Unsubscribed = BaseStatus<"UNSUBSCRIBED"> & GroupField;
        export type GroupCreated = BaseStatus<"GROUP_CREATED">  & GroupField;
        export type GroupDeleted = BaseStatus<"GROUP_DELETED"> & GroupField;
        export type Bad = SequencedStatus<"BAD">;
        export type Unsupported = SequencedStatus<"UNSUPPORTED">;
        export interface Protocol extends SequencedStatus<"PROTOCOL"> {
            readonly desc: string
        }
        export type GroupAlreadyCreated = SequencedStatus<"GROUP_ALREADY_CREATED"> & GroupField;
        export interface NoSuchName extends SequencedStatus<"NO_SUCH_NAME"> {
            readonly name: string
        }
        export interface NoSuchUuid extends SequencedStatus<"NO_SUCH_UUID"> {
            readonly uuid: Uuid
        }
        export type NoSuchGroup = SequencedStatus<"NO_SUCH_GROUP"> & GroupField;
    
        export type Status = Ok | MessageSent | Subscribed | Unsubscribed
            | GroupCreated | GroupDeleted | Bad | Unsupported | Protocol
            | GroupAlreadyCreated | NoSuchName | NoSuchUuid | NoSuchGroup
            | ClientJoined | ClientLeft;
    }
    export type Status = StatusPayload.Status;
    
    export type GenericPayload<M> = Identify | Message<M> | SelfSubscribe | SelfUnsubscribe
        | GroupCreate | GroupDelete | GroupFetch | ClientFetchAll
        | GroupFetchAll | SelfFetch | Hello | GroupFetchResult | GroupFetchAllResult
        | ClientFetchAllResult | SelfFetchResult | Status;
}

export type GenericPayload<M> = Payload.GenericPayload<M>;

export default Payload;