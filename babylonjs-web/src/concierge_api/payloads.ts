// Branded type, it's just a string underneath
export type Uuid = string & { readonly __is_uuid: true };

export interface ClientPayload {
    readonly name: string,
    readonly nickname?: string,
    readonly uuid: Uuid,
    readonly tags: ReadonlyArray<string>,
}

export interface Origin extends ClientPayload {
    readonly group?: string,
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
    export type Subscribe = BasePayload<"SUBSCRIBE"> & GroupField;
    export type Unsubscribe = BasePayload<"UNSUBSCRIBE"> & GroupField;
    export type CreateGroup = BasePayload<"GROUP_CREATE"> & GroupField;
    export type DeleteGroup = BasePayload<"GROUP_DELETE"> & GroupField;
    export type FetchGroupSubs = BasePayload<"FETCH_GROUP_SUBSCRIBERS"> & GroupField;
    export type FetchGroupList = BasePayload<"FETCH_GROUPS">;
    export type FetchClientList = BasePayload<"FETCH_CLIENTS">;
    export type FetchSubList = BasePayload<"FETCH_SUBSCRIPTIONS">;
    export interface Hello extends BasePayload<"HELLO"> {
        readonly uuid: Uuid,
        readonly version: string
    }
    export interface GroupSubscriptions extends BasePayload<"GROUP_SUBSCRIBERS">, GroupField {
        readonly clients: ReadonlyArray<ClientPayload>
    }
    export interface GroupList extends BasePayload<"GROUPS"> {
        readonly groups: ReadonlyArray<string>
    }
    export interface ClientList extends BasePayload<"CLIENTS"> {
        readonly clients: ReadonlyArray<ClientPayload>
    }
    export interface Subscriptions extends BasePayload<"SUBSCRIPTIONS"> {
        readonly groups: ReadonlyArray<string>,
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
    
    export type GenericPayload<M> = Identify | Message<M> | Subscribe | Unsubscribe
        | CreateGroup | DeleteGroup | FetchGroupSubs | FetchClientList
        | FetchGroupList | FetchSubList | Hello | GroupSubscriptions | GroupList
        | ClientList | Subscriptions | Status;
}

export type GenericPayload<M> = Payload.GenericPayload<M>;

export default Payload;