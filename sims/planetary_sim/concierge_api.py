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
    def __init__(self, name: str, uuid: str, tags: Optional[List[str]] = None):
        self.name = name
        self.uuid = uuid
        self.tags = tags

    @staticmethod
    def from_object(obj: object_type) -> Optional[ClientPayload]:
        if obj.get("name") != None and obj.get("uuid") != None:
            return ClientPayload(obj["name"], obj["uuid"], obj.get("tags"))
        return None

    def to_object(self) -> object_type:
        return {
            "name": self.name,
            "uuid": self.uuid,
            "tags": self.tags
        }


class Origin(ClientPayload):
    def __init__(self, name: str, uuid: str, group: Optional[str]):
        super().__init__(name, uuid)
        self.group = group

    @staticmethod
    def from_object(obj: Optional[object_type]) -> Optional[Origin]:
        if obj != None and obj.get("name") != None and obj.get("uuid") != None:
            return Origin(obj["name"], obj["uuid"], obj.get("group"))
        return None

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
            "SUBSCRIBE": Subscribe,
            "UNSUCSCRIBE": Unsubscribe,
            "STATUS": GenericStatus,
            "FETCH_GROUP_SUBSCRIBERS": FetchGroupSubscribers,
            "FETCH_GROUPS": FetchGroups,
            "FETCH_CLIENTS": FetchClients,
            "FETCH_SUBSCRIPTIONS": FetchSubscriptions,
            "GROUP_SUBSCRIBERS": GroupSubscribers,
            "GROUPS": Groups,
            "CLIENTS": Clients,
            "SUBSCRIPTIONS": Subscriptions
        }

        type = obj.get("type")
        cls = switch.get(type) if type != None else None
        return cls.from_object(obj) if cls != None else None


class Identify(Payload):
    def __init__(self, name: str, version: str, secret: Optional[str] = None, tags: Optional[List[str]] = None):
        super().__init__("IDENTIFY")
        self.name = name
        self.version = version
        self.secret = secret
        self.tags = tags

    @staticmethod
    def from_object(obj: object_type) -> Optional[Identify]:
        if obj.get("name") != None and obj.get("version") != None:
            return Identify(obj["name"], obj["version"], obj.get("secret"), obj.get("tags"))
        return None

    def to_object(self) -> object_type:
        return self.make_object({
            "name": self.name,
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
    def from_object(obj: object_type) -> Optional[Message]:
        if obj.get("target") != None and obj.get("data") != None:
            return Message(Origin.from_object(obj.get("origin")), obj["target"], obj["data"])
        return None

    def to_object(self) -> object_type:
        return self.make_object({
            "origin": self.origin.to_object() if self.origin != None else None,
            "target": self.target.to_object(),
            "data": self.data
        })


class GroupPayload(Payload):
    def __init__(self, type: str, group_name: str):
        super().__init__(type)
        self.group = group_name

    def to_object(self) -> object_type:
        return self.make_object({
            "group": self.group
        })


class GroupCreate(GroupPayload):
    def __init__(self, group_name: str):
        super().__init__("GROUP_CREATE", group_name)

    @staticmethod
    def from_object(obj: object_type) -> Optional[GroupCreate]:
        if obj.get("group") != None:
            return GroupCreate(obj["group"])
        return None


class GroupDelete(GroupPayload):
    def __init__(self, group_name: str):
        super().__init__("GROUP_DELETE", group_name)

    @staticmethod
    def from_object(obj: object_type) -> Optional[GroupDelete]:
        if obj.get("group") != None:
            return GroupDelete(obj["group"])
        return None


class Subscribe(GroupPayload):
    def __init__(self, group_name: str):
        super().__init__("SUBSCRIBE", group_name)

    @staticmethod
    def from_object(obj: object_type) -> Optional[Subscribe]:
        if obj.get("group") != None:
            return Subscribe(obj["group"])
        return None


class Unsubscribe(GroupPayload):
    def __init__(self, group_name: str):
        super().__init__("UNSUBSCRIBE", group_name)

    @staticmethod
    def from_object(obj: object_type) -> Optional[Unsubscribe]:
        if obj.get("group") != None:
            return Unsubscribe(obj["group"])
        return None


class FetchGroupSubscribers(GroupPayload):
    def __init__(self, group_name: str):
        super().__init__("FETCH_GROUP_SUBSCRIBERS", group_name)

    @staticmethod
    def from_object(obj: object_type) -> Optional[FetchGroupSubscribers]:
        if obj.get("group") != None:
            return FetchGroupSubscribers(obj["group"])
        return None


class FetchGroups(Payload):
    def __init__(self, group_name: str):
        super().__init__("FETCH_GROUPS")


class FetchClients(Payload):
    def __init__(self, group_name: str):
        super().__init__("FETCH_CLIENTS")


class FetchSubscriptions(Payload):
    def __init__(self, group_name: str):
        super().__init__("FETCH_SUBSCRIPTIONS")


class Hello(Payload):
    def __init__(self, uuid: str, version: str):
        super().__init__("HELLO")
        self.uuid = uuid
        self.version = version

    @staticmethod
    def from_object(obj: object_type) -> Optional[Hello]:
        if obj.get("uuid") != None and obj.get("version") != None:
            return Hello(obj["uuid"], obj["version"])
        return None


class GroupSubscribers(Payload):
    def __init__(self, group_name: str, clients: List[ClientPayload]):
        super().__init__("GROUP_SUBSCRIBERS")
        self.group = group_name
        self.clients = clients

    @staticmethod
    def from_object(obj: object_type) -> Optional[GroupSubscribers]:
        if obj.get("group") != None and obj.get("clients") != None:
            return GroupSubscribers(obj["group"], cast(List[ClientPayload], list(filter(lambda x: x != None, map(ClientPayload.from_object, obj["clients"])))))
        return None

    def to_object(self) -> object_type:
        return self.make_object({
            "group": self.group,
            "clients": list(map(Serialize.to_object, self.clients))
        })


class Groups(Payload):
    def __init__(self, groups: List[str]):
        super().__init__("GROUPS")
        self.groups = groups

    @staticmethod
    def from_object(obj: object_type) -> Optional[Groups]:
        if obj.get("groups") != None:
            return Groups(obj["groups"])
    
    def to_object(self) -> object_type:
        return self.make_object({
            "groups": self.groups
        })


class Clients(Payload):
    def __init__(self, clients: List[ClientPayload]):
        super().__init__("CLIENTS")
        self.clients = clients

    @staticmethod
    def from_object(obj: object_type) -> Optional[Clients]:
        if obj.get("clients") != None:
            return Clients(cast(List[ClientPayload], list(filter(lambda x: x != None, map(ClientPayload.from_object, obj["clients"])))))
        return None

    def to_object(self) -> object_type:
        return self.make_object({
            "clients": list(map(Serialize.to_object, self.clients))
        })

class Subscriptions(Payload):
    def __init__(self, groups: List[str]):
        super().__init__("SUBSCRIPTIONS")
        self.groups = groups

    @staticmethod
    def from_object(obj: object_type) -> Optional[Subscriptions]:
        if obj.get("groups") != None:
            return Subscriptions(obj["groups"])
    
    def to_object(self) -> object_type:
        return self.make_object({
            "groups": self.groups
        })


class GenericStatus(Payload):
    def __init__(self, code: str, data: Dict[str, Any]):
        super().__init__("STATUS")
        self.code = code
        self.data = data

    @staticmethod
    def from_object(obj: object_type) -> Optional[GenericStatus]:
        if obj.get("code") != None:
            return GenericStatus(obj["code"], obj)
        return None

    def to_object(self) -> object_type:
        return self.make_object(self.data)
