// Branded type, it's just a string underneath
export type Uuid = string & { readonly __is_uuid: never };

interface GroupField {
    readonly name: string
}

export module Payload {
    export module Info {
        export interface Client {
            readonly name: string,
            readonly nickname?: string,
            readonly uuid: Uuid,
            readonly tags: ReadonlyArray<string>,
        }
        
        export interface Origin extends Client {
            readonly group?: Group,
        }
        
        export interface Group {
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
        
            export type Any = TargetName | TargetUuid | TargetGroup | TargetAll;
        }
    }

    export interface Base<T extends string> {
        readonly type: T,
        readonly seq?: number,
    }
     
    export interface Identify extends Base<"IDENTIFY"> {
        readonly name: string,
        readonly nickname?: string,
        readonly version: string,
        readonly secret?: string,
        readonly tags?: ReadonlyArray<string>,
    }
    export interface Message<T> extends Base<"MESSAGE"> {
        readonly target: Info.Targets.Any,
        readonly origin?: Info.Origin,
        readonly data: T
    }
    export type SelfSubscribe = Base<"SELF_SUBSCRIBE"> & GroupField;
    export type SelfUnsubscribe = Base<"SELF_UNSUBSCRIBE"> & GroupField;
    export interface SelfSetSeq extends Base<"SELF_SET_SEQ"> {
        readonly seq: number,
    }
    export interface GroupCreate extends Base<"GROUP_CREATE"> {
        readonly name: string,
        readonly nickname?: string,
    }
    export type GroupDelete = Base<"GROUP_DELETE"> & GroupField;
    export type GroupFetch = Base<"GROUP_FETCH"> & GroupField;
    export type GroupFetchAll = Base<"GROUP_FETCH_ALL">;
    export type ClientFetchAll = Base<"CLIENT_FETCH_ALL">;
    export type SelfFetch = Base<"SELF_FETCH">;
    export interface Hello extends Base<"HELLO"> {
        readonly uuid: Uuid,
        readonly version: string
    }
    export type GroupFetchResult = Base<"GROUP_FETCH_RESULT"> & Info.Group;
    export interface GroupFetchAllResult extends Base<"GROUP_FETCH_ALL_RESULT"> {
        readonly groups: ReadonlyArray<Info.Group>
    }
    export interface ClientFetchAllResult extends Base<"CLIENT_FETCH_ALL_RESULT"> {
        readonly clients: ReadonlyArray<Info.Client>
    }
    export interface SelfFetchResult extends Base<"SELF_FETCH_RESULT">, Info.Client {
        readonly subscriptions: ReadonlyArray<Info.Client>,
    }

    export module Status {
        /** These statuses may be sequenced. */ 
        export interface BaseStatus<T extends string> extends Base<"STATUS"> {
            readonly code: T
        }
    
        export type ClientJoined = BaseStatus<"CLIENT_JOINED"> & Info.Client;
        export type ClientLeft = BaseStatus<"CLIENT_LEFT"> & Info.Client;
        export type Ok = BaseStatus<"OK">;
        export type MessageSent = BaseStatus<"MESSAGE_SENT">;
        export type Subscribed = BaseStatus<"SELF_SUBSCRIBED"> & Info.Group;
        export type AlreadySubscribed = BaseStatus<"SELF_ALREADY_SUBSCRIBED"> & Info.Group;
        export type NotSubscribed = BaseStatus<"SELF_NOT_SUBSCRIBED"> & Info.Group;
        export type Unsubscribed = BaseStatus<"SELF_UNSUBSCRIBED"> & Info.Group;
        export type GroupCreated = BaseStatus<"GROUP_CREATED">  & Info.Group;
        export type GroupDeleted = BaseStatus<"GROUP_DELETED"> & Info.Group;
        export type Bad = BaseStatus<"BAD">;
        export type Unsupported = BaseStatus<"UNSUPPORTED">;
        export interface Protocol extends BaseStatus<"PROTOCOL"> {
            readonly desc: string
        }
        export type GroupAlreadyCreated = BaseStatus<"GROUP_ALREADY_CREATED"> & Info.Group;
        export interface NoSuchName extends BaseStatus<"NO_SUCH_NAME"> {
            readonly name: string
        }
        export interface NoSuchUuid extends BaseStatus<"NO_SUCH_UUID"> {
            readonly uuid: Uuid
        }
        export type NoSuchGroup = BaseStatus<"NO_SUCH_GROUP"> & GroupField;
    
        export type Any = Ok | MessageSent | Subscribed | Unsubscribed
            | GroupCreated | GroupDeleted | Bad | Unsupported | Protocol
            | GroupAlreadyCreated | NoSuchName | NoSuchUuid | NoSuchGroup
            | ClientJoined | ClientLeft;
    }
    
    export type Any<M> = Identify | Message<M> | SelfSubscribe | SelfUnsubscribe
        | GroupCreate | GroupDelete | GroupFetch | ClientFetchAll
        | GroupFetchAll | SelfFetch | Hello | GroupFetchResult | GroupFetchAllResult
        | ClientFetchAllResult | SelfFetchResult | Status.Any;
}

export default Payload;