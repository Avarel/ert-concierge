import asyncio
from types import FrameType
from typing import Any, Dict, Optional
import websockets
import json
import system_serializer
import signal
from concierge_api import GroupCreate, Identify, Message, Payload, TargetGroup

name = "planetary_simulation"
version = "0.1.0"
group_name = "planetary_simulation_out"
running = True

file = open("./SavedSystems/SolarSystem.json")
system = system_serializer.object_to_system(json.load(file))
dt = 0.01  # 0.002


async def hello():
    uri = "ws://localhost:64209/ws"
    print("Connecting")
    async with websockets.connect(uri) as socket:
        global name, version, group_name, system
        await socket.send(Identify(name, version).to_json())
        hello = json.loads(await socket.recv())

        uuid = hello["uuid"]
        server_version = hello["version"]
        print(f"My uuid is {uuid}. The server version is {server_version}.")

        print("Creating group.")
        await socket.send(GroupCreate(group_name).to_json())

        print("Starting simulation.")

        asyncio.create_task(recv_loop(socket))

        global running
        while running:
            system.tick_system(dt)
            await socket.send(Message(None, TargetGroup(group_name), system_serializer.system_to_object(system)).to_json())
            await asyncio.sleep(dt)

        print("Disconnecting and stopping simulation.")


async def recv_loop(socket: websockets.WebSocketClientProtocol):
    async for msg in socket:
        pass


def stop(signal: signal.Signals, frame: FrameType):
    global running
    running = False


signal.signal(signal.SIGINT, stop)

asyncio.get_event_loop().run_until_complete(hello())

exit(0)
