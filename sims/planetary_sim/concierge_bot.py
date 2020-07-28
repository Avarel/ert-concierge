import sys
import asyncio
from types import FrameType
from typing import cast
import websockets
import json
import system_serializer
import signal
import requests
from concierge_api import GroupCreate, Identify, Message, Payload, TargetGroup, TargetUuid, Target
from system_serializer import system_data_to_object

name = "planetary_simulation"
nickname = "Planetary Simulation"
version = "0.1.1"
group_name = "planetary_simulation_out"
running = True
uuid = None

uri = sys.argv[1] if len(sys.argv) >= 2 else "ws://localhost:64209/ws"

file = open("./SavedSystems/SolarSystem.json")
system = system_serializer.object_to_system(json.load(file))

paused = False
send_interval = 0.02
dt = 0.01
simulation_interval = 0.01
pause_check_interval = 0.1


async def concierge_bot():
    global uri
    print("Connecting")
    async with websockets.connect(uri, subprotocols="ert-concierge") as socket:
        global name, nickname, version, group_name, system, uuid
        await socket.send(Identify(name, nickname, version, tags=["simulation"]).to_json())
        hello = json.loads(await socket.recv())

        uuid = hello["uuid"]
        server_version = hello["version"]
        print(f"My uuid is {uuid}. The server version is {server_version}.")

        print("Creating group.")
        await socket.send(GroupCreate(group_name).to_json())

        print("Starting simulation.")

        asyncio.create_task(recv_loop(socket))
        asyncio.create_task(system_loop())
        await send_loop(socket)

        print("Disconnecting and stopping simulation.")


async def send_loop(socket: websockets.WebSocketClientProtocol):
    global running, paused, send_interval
    await send_system_data(TargetGroup(group_name), socket)
    while running:
        if not paused:
            await send_system_objs(TargetGroup(group_name), socket)
            await asyncio.sleep(send_interval)
        else:
            # less intensive pause check
            await asyncio.sleep(pause_check_interval)


async def send_system_data(target: Target, socket: websockets.WebSocketClientProtocol):
    global group_name
    await socket.send(Message(None, target, {
        "type": "SYSTEM_DATA_DUMP",
        "data": system_data_to_object(system)
    }).to_json())

async def send_system_objs(target: Target, socket: websockets.WebSocketClientProtocol):
    global group_name
    await socket.send(Message(None, target, {
        "type": "SYSTEM_OBJS_DUMP",
        "objects": system_serializer.system_objects_to_object(system)
    }).to_json())



async def system_loop():
    """System simulation loop"""
    global running, paused, simulation_interval, pause_check_inteval
    while running:
        if not paused:
            system.tick_system(dt)
            await asyncio.sleep(simulation_interval)
        else:
            # less intensive pause check
            await asyncio.sleep(pause_check_interval)


async def recv_loop(socket: websockets.WebSocketClientProtocol):
    """Incoming message loop"""
    global paused, simulation_interval, uuid
    async for msg in socket:
        payload = Payload.from_object(json.loads(msg))
        if payload != None:
            if payload.type == "MESSAGE":
                global system, paused
                message = cast(Message, payload)
                msg_type = message.data.get("type")
                if msg_type == "PAUSE":
                    print("Paused")
                    paused = True
                elif msg_type == "PLAY":
                    print("Resume")
                    paused = False
                elif msg_type == "FAST_FORWARD":
                    simulation_interval /= 2
                elif msg_type == "STEP_FORWARD":
                    system.tick_system(dt)
                    if paused:
                        await send_system_objs(TargetGroup(group_name), socket)
                elif msg_type == "FAST_BACKWARD":
                    simulation_interval *= 2
                elif msg_type == "FETCH_SYSTEM_DATA":
                    await send_system_data(TargetUuid(message.origin.uuid), socket)
                elif msg_type == "FETCH_SYSTEM_OBJS":
                    await send_system_objs(TargetUuid(message.origin.uuid), socket)
                elif msg_type == "LOAD_SYSTEM":
                    url: str = message.data["url"]
                    print("Recv request to download remote system at", url)

                    try:
                        headers = {'x-fs-key': uuid}
                        r = requests.get(url, headers=headers)
                        paused = True
                        await socket.send(Message(None, TargetGroup(group_name), {
                            "type": "SYSTEM_CLEAR",
                        }).to_json())
                        system = system_serializer.object_to_system(r.json())
                        paused = False
                    except Exception as e:
                        print("Unable to load remote content:", e)


def stop(signal: signal.Signals, frame: FrameType):
    global running
    running = False


signal.signal(signal.SIGINT, stop)

asyncio.get_event_loop().run_until_complete(concierge_bot())

exit(0)
