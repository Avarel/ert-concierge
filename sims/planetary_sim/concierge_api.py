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


class ClientPayload(Serialize):
    def __init__(self, name: str, nickname: Optional[str], uuid: str, tags: Optional[List[str]] = None):
        self.name = name
        self.nickname = nickname
        self.uuid = uuid
        self.tags = tags

    @staticmethod
    def from_object(obj: object_type) -> ClientPayload:
        return ClientPayload(obj["name"], obj.get("nickname"), obj["uuid"], obj.get("tags"))

    def to_object(self) -> object_type:
        return {
            "name": self.name,
            "nickname": self.nickname,
            "uuid": self.uuid,
            "tags": self.tags
        }


class GroupPayload(Serialize):
    def __init__(self, name: str, nickname: Optional[str], owner_uuid: str, subscribers: List[str]):
        self.name = name
        self.nickname = nickname
        self.owner_uuid = owner_uuid
        self.subscribers = subscribers

    @staticmethod
    def from_object(obj: object_type) -> GroupPayload:
        return GroupPayload(obj["name"], obj.get("nickname"), obj["owner_uuid"], obj["subscribers"])

    def to_object(self) -> object_type:
        return {
            "name": self.name,
            "nickname": self.nickname,
            "owner_uuid": self.owner_uuid,
            "subscribers": self.subscribers
        }


class Origin(ClientPayload):
    def __init__(self, client: ClientPayload, group: Optional[GroupPayload]):
        super().__init__(client.name, client.nickname, client.uuid, client.tags)
        self.group = group

    @staticmethod
    def from_object(obj: object_type) -> Origin:
        return Origin(
            ClientPayload.from_object(obj),
            GroupPayload.from_object(
                obj["group"]) if "group" in obj and obj["group"] != None else None
        )

    def to_object(self) -> object_type:
        return dict(super().to_object(), **{"group": self.group})


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


class TargetGroup(Target):
    def __init__(self, group_name: str):
        super().__init__("GROUP", ("group", group_name))


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
            "GROUP_CREATE": GroupCreate,
            "GROUP_DELETE": GroupDelete,
            "SELF_SUBSCRIBE": SelfSubscribe,
            "SELF_UNSUCSCRIBE": SelfUnsubscribe,
            "STATUS": GenericStatus,
            "GROUP_FETCH_ALL": GroupFetchAll,
            "CLIENT_FETCH_ALL": ClientFetchAll,
            "SELF_FETCH": SelfFetch,
            "GROUP_FETCH_RESULT": GroupFetchResult,
            "GROUP_FETCH_ALL_RESULT": GroupFetchAllResult,
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


class GroupCreate(Payload):
    def __init__(self, name: str, nickname: Optional[str] = None):
        super().__init__("GROUP_CREATE")
        self.name = name
        self.nickname = nickname

    @staticmethod
    def from_object(obj: object_type) -> GroupCreate:
        return GroupCreate(obj["name"], obj.get("nickname"))

    def to_object(self) -> object_type:
        return self.make_object({
            "name": self.name,
            "nickname": self.nickname
        })


class GroupDelete(Payload):
    def __init__(self, name: str):
        super().__init__("GROUP_DELETE")
        self.name = name

    @staticmethod
    def from_object(obj: object_type) -> Optional[GroupDelete]:
        if obj.get("name") != None:
            return GroupDelete(obj["name"])
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


class GroupFetchAll(Payload):
    def __init__(self):
        super().__init__("GROUP_FETCH_ALL")


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


class GroupFetchResult(Payload):
    def __init__(self, group: GroupPayload):
        super().__init__("GROUP_SUBSCRIBERS")
        self.group = group

    @staticmethod
    def from_object(obj: object_type) -> GroupFetchResult:
        return GroupFetchResult(GroupPayload.from_object(obj))

    def to_object(self) -> object_type:
        return self.group.to_object()


class GroupFetchAllResult(Payload):
    def __init__(self, groups: List[GroupPayload]):
        super().__init__("GROUP_FETCH_ALL_RESULT")
        self.groups = groups

    @staticmethod
    def from_object(obj: object_type) -> GroupFetchAllResult:
        return GroupFetchAllResult(list(map(GroupPayload.from_object, obj["subscriptions"])))

    def to_object(self) -> object_type:
        return self.make_object({
            "groups": list(map(GroupPayload.to_object, self.groups))
        })


class ClientFetchAllResult(Payload):
    def __init__(self, clients: List[ClientPayload]):
        super().__init__("CLIENT_FETCH_ALL_RESULT")
        self.clients = clients

    @staticmethod
    def from_object(obj: object_type) -> ClientFetchAllResult:
        return ClientFetchAllResult(list(map(ClientPayload.from_object, obj["clients"])))

    def to_object(self) -> object_type:
        return self.make_object({
            "clients": list(map(lambda x: x.to_object(), self.clients))
        })


class SelfFetchResult(Payload):
    def __init__(self, client: ClientPayload, subscriptions: List[GroupPayload]):
        super().__init__("SELF_FETCH_RESULT")
        self.client = client
        self.subscriptions = subscriptions

    @staticmethod
    def from_object(obj: object_type) -> SelfFetchResult:
        return SelfFetchResult(ClientPayload.from_object(obj), list(map(GroupPayload.from_object, obj["subscriptions"])))

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
