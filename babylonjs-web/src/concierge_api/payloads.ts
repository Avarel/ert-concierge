/** Branded string that is assumed to be a valid UUID. */
export type Uuid = string & { readonly __is_uuid: never };

export module Payload {
    interface ServiceField {
        readonly service: string
    }

    interface SuccessfulField {
        readonly successful: boolean
    }

    interface HasClientInfo {
        readonly client: Info.Client
    }

    interface HasServiceInfo {
        readonly service: Info.Service
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
    export type ServiceFetchResult = Base<"SERVICE_FETCH_RESULT"> & HasServiceInfo;
    export interface ServiceFetchAllResult extends Base<"SERVICE_FETCH_ALL_RESULT"> {
        readonly services: ReadonlyArray<Info.Service>
    }
    export interface ClientFetchAllResult extends Base<"CLIENT_FETCH_ALL_RESULT"> {
        readonly clients: ReadonlyArray<Info.Client>
    }
    export interface SelfFetchResult extends Base<"SELF_FETCH_RESULT">, HasClientInfo {
        readonly subscriptions: ReadonlyArray<Info.Client>,
    }

    export type ClientJoined = Base<"CLIENT_JOINED"> & HasClientInfo;
    export type ClientLeft = Base<"CLIENT_LEFT"> & HasClientInfo;
    export type Ok = Base<"OK">;
    export type Subscribed = Base<"SELF_SUBSCRIBE_RESULT"> & HasServiceInfo & SuccessfulField;
    export type Unsubscribed = Base<"SELF_UNSUBSCRIBE_RESULT"> & HasServiceInfo & SuccessfulField;
    export type ServiceCreated = Base<"SERVICE_CREATE_RESULT">  & HasServiceInfo & SuccessfulField;
    export type ServiceDeleted = Base<"SERVICE_DELETE_RESULT"> & HasServiceInfo;
    export interface ServiceClientSubscribed extends Base<"SERVICE_CLIENT_SUBSCRIBED">, HasClientInfo {
        service: Info.Service
    }
    export interface ServiceClientUnsubscribed extends Base<"SERVICE_CLIENT_UNSUBSCRIBED">, HasClientInfo {
        service: Info.Service
    }
    export type Bad = Base<"BAD">;
    export type ErrorUnsupported = Base<"ERROR_UNSUPPORTED">;
    export interface ErrorInternal extends Base<"ERROR_INTERNAL"> {
        readonly desc: string
    }
    export interface ErrorProtocol extends Base<"ERROR_PROTOCOL"> {
        readonly desc: string
    }
    export type ServiceAlreadyCreated = Base<"SERVICE_ALREADY_CREATED"> & HasServiceInfo;
    export interface InvalidName extends Base<"INVALID_NAME"> {
        readonly name: string
    }
    export interface InvalidUuid extends Base<"INVALID_UUID"> {
        readonly uuid: Uuid
    }
    export type InvalidService = Base<"INVALID_SERVICE"> & ServiceField;

    export type Out = Message<any> | Ok | Subscribed | Unsubscribed
        | ServiceCreated | ServiceDeleted | Bad | ErrorUnsupported | ErrorInternal
        | ErrorProtocol | ServiceAlreadyCreated | InvalidName | InvalidUuid 
        | InvalidService | ClientJoined | ClientLeft | Hello | ServiceFetchResult 
        | ServiceFetchAllResult | ClientFetchAllResult | SelfFetchResult;
    
    export type In = Message<any> | Identify | SelfSubscribe | SelfUnsubscribe
        | ServiceCreate | ServiceDelete | ServiceFetch | ClientFetchAll
        | ServiceFetchAll | SelfFetch;

    export type Any = In | Out;
}

export default Payload;