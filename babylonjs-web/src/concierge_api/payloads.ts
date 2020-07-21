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

export interface ClientPayload {
    name: string,
    uuid: Uuid,
    tags: string[],
}

export interface Origin extends ClientPayload {
    group?: string,
}

export module Targets {
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

export interface BasePayload<T extends string> {
    type: T
}

interface GroupField {
    group: string
}

export module Payload {
    export interface Identify extends BasePayload<"IDENTIFY"> {
        name: string,
        version: string,
        secret?: string,
        tags?: string[],
    }
    export interface Message<T> extends BasePayload<"MESSAGE"> {
        target: Target,
        origin?: Origin,
        data: T
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
        uuid: Uuid,
        version: string
    }
    export interface GroupSubscriptions extends BasePayload<"GROUP_SUBSCRIBERS">, GroupField {
        clients: ClientPayload[]
    }
    export interface GroupList extends BasePayload<"GROUPS"> {
        groups: string[]
    }
    export interface ClientList extends BasePayload<"CLIENTS"> {
        clients: ClientPayload[]
    }
    export interface Subscriptions extends BasePayload<"SUBSCRIPTIONS"> {
        groups: string[],
    }

    export module StatusPayload {
        /** These statuses may be sequenced. */ 
        export interface BaseStatus<T extends string> extends BasePayload<"STATUS"> {
            code: T
            seq?: number,
        }
        /** These statuses are always sequenced. */ 
        export interface SequencedStatus<T extends string> extends BaseStatus<T> {
            seq: number,
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