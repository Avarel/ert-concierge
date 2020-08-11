# Notes to Future Maintainers:
#
# This file is not used. It was an attempt at reimplementing the payload structure
# defined in the documents. However, I have given up on it because Python has zero
# good structured AND typed serialization/deserialization libraries. Towards the
# end of the project, the API evolved at such a rate that I could not possibly
# keep up updating the Python implementation, the Rust implementation, and the
# TypeScript implementation at the same time.

from __future__ import annotations
from abc import ABC, abstractmethod
import json
from typing import Dict, List, Optional, Any, Tuple, cast


# Primitive object type, serializable by json
object_type = Dict[str, Any]


class Serialize(ABC):
    @abstractmethod
    def to_object(self) -> object_type:
        pass

    def to_json(self) -> str:
        return json.dumps(self.to_object())


class DiscriminatedSerialize(Serialize):
    def __init__(self, key: str, type: str):
        self.key = key
        self.type = type

    def make_object(self, obj: object_type) -> object_type:
        return {self.key: self.type, **obj}

    def to_object(self) -> object_type:
        return self.make_object({})


class ClientInfo(Serialize):
    def __init__(self, name: str, nickname: Optional[str], uuid: str, tags: Optional[List[str]] = None):
        self.name = name
        self.nickname = nickname
        self.uuid = uuid
        self.tags = tags

    @staticmethod
    def from_object(obj: object_type) -> ClientInfo:
        return ClientInfo(obj["name"], obj.get("nickname"), obj["uuid"], obj.get("tags"))

    def to_object(self) -> object_type:
        return {
            "name": self.name,
            "nickname": self.nickname,
            "uuid": self.uuid,
            "tags": self.tags
        }


class ServiceInfo(Serialize):
    def __init__(self, name: str, nickname: Optional[str], owner_uuid: str, subscribers: List[str]):
        self.name = name
        self.nickname = nickname
        self.owner_uuid = owner_uuid
        self.subscribers = subscribers

    @staticmethod
    def from_object(obj: object_type) -> ServiceInfo:
        return ServiceInfo(obj["name"], obj.get("nickname"), obj["owner_uuid"], obj["subscribers"])

    def to_object(self) -> object_type:
        return {
            "name": self.name,
            "nickname": self.nickname,
            "owner_uuid": self.owner_uuid,
            "subscribers": self.subscribers
        }


class Origin(ClientInfo):
    def __init__(self, client: ClientInfo, service: Optional[ServiceInfo]):
        super().__init__(client.name, client.nickname, client.uuid, client.tags)
        self.service = service

    @staticmethod
    def from_object(obj: object_type) -> Origin:
        return Origin(
            ClientInfo.from_object(obj),
            ServiceInfo.from_object(
                obj["service"]) if "service" in obj and obj["service"] != None else None
        )

    def to_object(self) -> object_type:
        return dict(super().to_object(), **{"service": self.service})


class Target(DiscriminatedSerialize):
    def __init__(self, type: str, kv: Optional[Tuple[str, str]] = None):
        super().__init__("type", type)
        self.kv = kv

    def to_object(self) -> object_type:
        if self.kv != None:
            return super().make_object({
                self.kv[0]: self.kv[1]
            })
        else:
            return super().make_object({})


class TargetAll(Target):
    def __init__(self):
        super().__init__("ALL")


class TargetService(Target):
    def __init__(self, service_name: str):
        super().__init__("SERVICE", ("name", service_name))


class TargetUuid(Target):
    def __init__(self, uuid: str):
        super().__init__("UUID", ("uuid", uuid))


class TargetName(Target):
    def __init__(self, name: str):
        super().__init__("NAME", ("name", name))


class Payload(DiscriminatedSerialize):
    def __init__(self, type: str):
        super().__init__("type", type)

    @staticmethod
    def from_object(obj: object_type) -> Optional[Payload]:
        switch = {
            "MESSAGE": Message,
            "IDENTIFY": Identify,
            "HELLO": Hello,
            "SERVICE_CREATE": ServiceCreate,
            "SERVICE_DELETE": ServiceDelete,
            "SELF_SUBSCRIBE": SelfSubscribe,
            "SELF_UNSUCSCRIBE": SelfUnsubscribe,
            "STATUS": GenericStatus,
            "SERVICE_FETCH_ALL": ServiceFetchAll,
            "CLIENT_FETCH_ALL": ClientFetchAll,
            "SELF_FETCH": SelfFetch,
            "SERVICE_FETCH_RESULT": ServiceFetchResult,
            "SERVICE_FETCH_ALL_RESULT": ServiceFetchAllResult,
            "CLIENT_FETCH_ALL_RESULT": ClientFetchAllResult,
            "SELF_FETCH_RESULT": SelfFetchResult
        }

        type = obj.get("type")
        cls = switch.get(type) if type != None else None
        return cls.from_object(obj) if cls != None else None


class Identify(Payload):
    def __init__(self, name: str, nickname: Optional[str], version: str, secret: Optional[str] = None, tags: Optional[List[str]] = None):
        super().__init__("IDENTIFY")
        self.name = name
        self.nickname = nickname
        self.version = version
        self.secret = secret
        self.tags = tags

    @staticmethod
    def from_object(obj: object_type) -> Identify:
        return Identify(obj["name"], obj.get("nickname"), obj["version"], obj.get("secret"), obj.get("tags"))

    def to_object(self) -> object_type:
        return self.make_object({
            "name": self.name,
            "nickname": self.nickname,
            "version": self.version,
            "secret": self.secret,
            "tags": self.tags
        })


class Message(Payload):
    def __init__(self, origin: Optional[Origin], target: Target, data: Dict[str, Any]):
        super().__init__("MESSAGE")
        self.origin = origin
        self.target = target
        self.data = data

    @staticmethod
    def from_object(obj: object_type) -> Message:
        return Message(Origin.from_object(obj["origin"]) if "origin" in obj else None, obj["target"], obj["data"])

    def to_object(self) -> object_type:
        return self.make_object({
            "origin": self.origin.to_object() if self.origin != None else None,
            "target": self.target.to_object(),
            "data": self.data
        })


class ServiceCreate(Payload):
    def __init__(self, name: str, nickname: Optional[str] = None):
        super().__init__("SERVICE_CREATE")
        self.name = name
        self.nickname = nickname

    @staticmethod
    def from_object(obj: object_type) -> ServiceCreate:
        return ServiceCreate(obj["name"], obj.get("nickname"))

    def to_object(self) -> object_type:
        return self.make_object({
            "name": self.name,
            "nickname": self.nickname
        })


class ServiceDelete(Payload):
    def __init__(self, name: str):
        super().__init__("SERVICE_DELETE")
        self.name = name

    @staticmethod
    def from_object(obj: object_type) -> Optional[ServiceDelete]:
        if obj.get("name") != None:
            return ServiceDelete(obj["name"])
        return None

    def to_object(self) -> object_type:
        return self.make_object({
            "name": self.name
        })


class SelfSubscribe(Payload):
    def __init__(self, name: str):
        super().__init__("SELF_SUBSCRIBE")
        self.name = name

    @staticmethod
    def from_object(obj: object_type) -> SelfSubscribe:
        return SelfSubscribe(obj["name"])

    def to_object(self) -> object_type:
        return self.make_object({
            "name": self.name
        })


class SelfUnsubscribe(Payload):
    def __init__(self, name: str):
        super().__init__("SELF_UNSUBSCRIBE")
        self.name = name

    @staticmethod
    def from_object(obj: object_type) -> SelfUnsubscribe:
        return SelfUnsubscribe(obj["name"])

    def to_object(self) -> object_type:
        return self.make_object({
            "name": self.name
        })


class ServiceFetchAll(Payload):
    def __init__(self):
        super().__init__("SERVICE_FETCH_ALL")


class ClientFetchAll(Payload):
    def __init__(self):
        super().__init__("CLIENT_FETCH_ALL")


class SelfFetch(Payload):
    def __init__(self):
        super().__init__("SELF_FETCH")


class Hello(Payload):
    def __init__(self, uuid: str, version: str):
        super().__init__("HELLO")
        self.uuid = uuid
        self.version = version

    @staticmethod
    def from_object(obj: object_type) -> Hello:
        return Hello(obj["uuid"], obj["version"])


class ServiceFetchResult(Payload):
    def __init__(self, services: ServiceInfo):
        super().__init__("SERVICE_FETCH_RESULT")
        self.services = services

    @staticmethod
    def from_object(obj: object_type) -> ServiceFetchResult:
        return ServiceFetchResult(ServiceInfo.from_object(obj))

    def to_object(self) -> object_type:
        return self.services.to_object()


class ServiceFetchAllResult(Payload):
    def __init__(self, services: List[ServiceInfo]):
        super().__init__("SERVICE_FETCH_ALL_RESULT")
        self.services = services

    @staticmethod
    def from_object(obj: object_type) -> ServiceFetchAllResult:
        return ServiceFetchAllResult(list(map(ServiceInfo.from_object, obj["services"])))

    def to_object(self) -> object_type:
        return self.make_object({
            "services": list(map(ServiceInfo.to_object, self.services))
        })


class ClientFetchAllResult(Payload):
    def __init__(self, clients: List[ClientInfo]):
        super().__init__("CLIENT_FETCH_ALL_RESULT")
        self.clients = clients

    @staticmethod
    def from_object(obj: object_type) -> ClientFetchAllResult:
        return ClientFetchAllResult(list(map(ClientInfo.from_object, obj["clients"])))

    def to_object(self) -> object_type:
        return self.make_object({
            "clients": list(map(lambda x: x.to_object(), self.clients))
        })


class SelfFetchResult(Payload):
    def __init__(self, client: ClientInfo, subscriptions: List[ServiceInfo]):
        super().__init__("SELF_FETCH_RESULT")
        self.client = client
        self.subscriptions = subscriptions

    @staticmethod
    def from_object(obj: object_type) -> SelfFetchResult:
        return SelfFetchResult(ClientInfo.from_object(obj), list(map(ServiceInfo.from_object, obj["subscriptions"])))

    def to_object(self) -> object_type:
        return dict(super().to_object(), **{
            "subscriptions": list(map(lambda x: x.to_object(), self.subscriptions))
        })


class GenericStatus(Payload):
    def __init__(self, code: str, data: Dict[str, Any]):
        super().__init__("STATUS")
        self.code = code
        self.data = data

    @staticmethod
    def from_object(obj: object_type) -> GenericStatus:
        return GenericStatus(obj["code"], obj)

    def to_object(self) -> object_type:
        return self.make_object(self.data)
