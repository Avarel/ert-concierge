/** Branded string that is assumed to be a valid UUID. */
export type Uuid = string & { readonly __is_uuid: never };

export module Payload {
    interface ServiceField {
        readonly name: string
    }

    export module Info {
        export interface Client {
            readonly name: string,
            readonly nickname?: string,
            readonly uuid: Uuid,
            readonly tags: ReadonlyArray<string>,
        }
        
        export interface Origin extends Client {
            readonly service?: Service,
        }
        
        export interface Service {
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
            export interface TargetService extends BaseTarget<"SERVICE"> {
                readonly service: string
            }
            export interface TargetServiceClientUuid extends BaseTarget<"SERVICE_CLIENT_UUID"> {
                readonly service: string,
                readonly uuid: Uuid,
            }
            type TargetAll = BaseTarget<"ALL">;
        
            export type Any = TargetName | TargetUuid | TargetService | TargetServiceClientUuid | TargetAll;
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
    export type SelfSubscribe = Base<"SELF_SUBSCRIBE"> & ServiceField;
    export type SelfUnsubscribe = Base<"SELF_UNSUBSCRIBE"> & ServiceField;
    export interface SelfSetSeq extends Base<"SELF_SET_SEQ"> {
        readonly seq: number,
    }
    export interface ServiceCreate extends Base<"SERVICE_CREATE"> {
        readonly name: string,
        readonly nickname?: string,
    }
    export type ServiceDelete = Base<"SERVICE_DELETE"> & ServiceField;
    export type ServiceFetch = Base<"SERVICE_FETCH"> & ServiceField;
    export type ServiceFetchAll = Base<"SERVICE_FETCH_ALL">;
    export type ClientFetchAll = Base<"CLIENT_FETCH_ALL">;
    export type SelfFetch = Base<"SELF_FETCH">;
    export interface Hello extends Base<"HELLO"> {
        readonly uuid: Uuid,
        readonly version: string
    }
    export type ServiceFetchResult = Base<"SERVICE_FETCH_RESULT"> & Info.Service;
    export interface ServiceFetchAllResult extends Base<"SERVICE_FETCH_ALL_RESULT"> {
        readonly services: ReadonlyArray<Info.Service>
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
        export type Subscribed = BaseStatus<"SELF_SUBSCRIBED"> & Info.Service;
        export type AlreadySubscribed = BaseStatus<"SELF_ALREADY_SUBSCRIBED"> & Info.Service;
        export type NotSubscribed = BaseStatus<"SELF_NOT_SUBSCRIBED"> & Info.Service;
        export type Unsubscribed = BaseStatus<"SELF_UNSUBSCRIBED"> & Info.Service;
        export type ServiceCreated = BaseStatus<"SERVICE_CREATED">  & Info.Service;
        export type ServiceDeleted = BaseStatus<"SERVICE_DELETED"> & Info.Service;
        export interface ServiceClientSubscribed extends BaseStatus<"SERVICE_CLIENT_SUBSCRIBED">, Info.Client {
            service: Info.Service
        }
        export interface ServiceClientUnsubscribed extends BaseStatus<"SERVICE_CLIENT_UNSUBSCRIBED">, Info.Client {
            service: Info.Service
        }
        export type Bad = BaseStatus<"BAD">;
        export type Unsupported = BaseStatus<"UNSUPPORTED">;
        export interface Protocol extends BaseStatus<"PROTOCOL"> {
            readonly desc: string
        }
        export type ServiceAlreadyCreated = BaseStatus<"SERVICE_ALREADY_CREATED"> & Info.Service;
        export interface InvalidName extends BaseStatus<"INVALID_NAME"> {
            readonly name: string
        }
        export interface InvalidUuid extends BaseStatus<"INVALID_UUID"> {
            readonly uuid: Uuid
        }
        export type InvalidService = BaseStatus<"INVALID_SERVICE"> & ServiceField;
    
        export type Any = Ok | MessageSent | Subscribed | Unsubscribed
            | ServiceCreated | ServiceDeleted | Bad | Unsupported | Protocol
            | ServiceAlreadyCreated | InvalidName | InvalidUuid | InvalidService
            | ClientJoined | ClientLeft;
    }
    
    export type Any<M> = Identify | Message<M> | SelfSubscribe | SelfUnsubscribe
        | ServiceCreate | ServiceDelete | ServiceFetch | ClientFetchAll
        | ServiceFetchAll | SelfFetch | Hello | ServiceFetchResult | ServiceFetchAllResult
        | ClientFetchAllResult | SelfFetchResult | Status.Any;
}

export default Payload;