# It is required that the following packages are available in your
# python path. Check the README.md on how to install them.
#
# websockets asyncio requests

import sys
import asyncio
import websockets
import json
import system_serializer
import signal
import requests
from types import FrameType
from typing import Any, Dict, cast
from vector import Vector
from concierge_api import ServiceCreate, Identify, Message, Payload, TargetService, TargetUuid, Target
from system_serializer import system_data_to_object

# Default to localhost if no cmdline argument is provided
uri = sys.argv[1] if len(sys.argv) >= 2 else "ws://localhost:64209/ws"

# General settings
name = "planetary_simulation"
nickname = "Planetary Simulation"
version = "0.1.1"
group_name = "planetary_simulation_out"

# Runtime settings
running = True
uuid = None

# Default system
file = open("./SavedSystems/SolarSystem.json")
system = system_serializer.object_to_system(json.load(file))

# Simulation settings
paused = False  # is the simulation paused
send_interval = 0.02  # how often to send the simulation state
dt = 0.01  # timestep of the simulation
simulation_interval = 0.01  # delays between each step
pause_check_interval = 0.1  # delays when the simulation is paused

group_target = TargetService(group_name)


async def concierge_bot():
    """
    Main method for starting the concierge bot.
    """
    global uri
    print("Connecting to the concierge.")
    async with websockets.connect(uri, subprotocols="ert-concierge") as socket:
        global name, nickname, version, group_name, system, uuid
        await socket.send(Identify(name, nickname, version, tags=["simulation"]).to_json())
        hello = json.loads(await socket.recv())

        uuid = hello["uuid"]
        server_version = hello["version"]
        print(f"My uuid is {uuid}. The server version is {server_version}.")

        print("Creating group.")
        await socket.send(ServiceCreate(group_name, "Planetary Simulation Channel").to_json())

        print("Starting simulation.")

        asyncio.create_task(recv_loop(socket))
        asyncio.create_task(system_loop(socket))
        await send_loop(socket)

        print("Disconnecting and stopping simulation.")


async def send_loop(socket: websockets.WebSocketClientProtocol):
    """
    A loop to send the simulation state (separate from actually driving the simulation)
    in a set interval.
    """
    global running, paused, send_interval, group_target
    await send_system_data(group_target, socket)
    while running:
        if not paused:
            await send_system_objs(group_target, socket)
            await asyncio.sleep(send_interval)
        else:
            # less intensive pause check
            await asyncio.sleep(pause_check_interval)


async def send_system_data(target: Target, socket: websockets.WebSocketClientProtocol):
    """Send the system data to the target."""
    await send_msg(target, socket, {
        "type": "SYSTEM_DATA_DUMP",
        "data": system_data_to_object(system)
    })


async def send_system_objs(target: Target, socket: websockets.WebSocketClientProtocol):
    """Send the system objects dump to the target."""
    await send_msg(target, socket, {
        "type": "SYSTEM_OBJS_DUMP",
        "objects": system_serializer.system_objects_to_object(system)
    })


async def send_msg(target: Target, socket: websockets.WebSocketClientProtocol, data: Dict[str, Any]):
    await socket.send(Message(None, target, data).to_json())


async def system_loop(socket: websockets.WebSocketClientProtocol):
    """
    This loop drives the system simulation one step forward in an interval.
    """
    global running, paused, simulation_interval, pause_check_inteval, group_target
    while running:
        if not paused:
            removed = system.tick_system(dt)
            ids = list(map(lambda b: b.name, removed))
            await send_msg(group_target, socket, {
                "type": "SYSTEM_REMOVE_PLANETS",
                "ids": ids
            })
            await asyncio.sleep(simulation_interval)
        else:
            # less intensive pause check
            await asyncio.sleep(pause_check_interval)


async def recv_loop(socket: websockets.WebSocketClientProtocol):
    """
    Incoming message loop. Nothing very special about it.
    """

    async for msg in socket:
        payload = Payload.from_object(json.loads(msg))
        if payload != None:
            if payload.type == "MESSAGE":
                message = cast(Message, payload)
                try:
                    await handle_message(message, socket)
                except Exception as e:
                    print("Uncaught exception", e)


async def handle_message(message: Message, socket: websockets.WebSocketClientProtocol):
    """This handles each message from the recv_loop"""
    global paused, simulation_interval, uuid, system, paused, group_target
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
            await send_system_objs(group_target, socket)
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
            # temp pause
            temp = paused
            paused = True
            # load
            system = system_serializer.object_to_system(r.json())
            # send
            await send_msg(group_target, socket, {
                "type": "SYSTEM_CLEAR",
            })
            await send_system_data(TargetUuid(message.origin.uuid), socket)
            await send_system_objs(TargetUuid(message.origin.uuid), socket)
            paused = temp
        except Exception as e:
            print("Unable to load remote content:", e)
    elif msg_type == "UPDATE_DATA":
        # obtain fields and update
        update_target = str(message.data.get("target"))
        update_field = message.data.get("field")
        update_value = message.data.get("value")
        print("Updating data:", update_target, update_field, update_value)
        # not the most elegant solution but most adaptable for other data types
        if update_target == "system":
            if update_field == "gravityConstant":
                system.G = float(str(update_value))
            elif update_field == "scale":
                system.scale = float(str(update_value))
                # Due to laziness on the client side, I opted to send the system data
                # which will prompt it to refetch and reset the system visualization.
                # This is also employed in other locations, sorry for staining your eyes.
                await send_system_data(group_target, socket)
            elif update_field == "bodyScale":
                system.body_scale = float(str(update_value))
                await send_system_data(group_target, socket)
            elif update_field == "centralBodyScale":
                system.central_body_scale = float(str(update_value))
                await send_system_data(group_target, socket)
            elif update_field == "elasticity":
                system.elasticity = float(str(update_value))
            elif update_field == "boundary":
                system.system_radius = float(str(update_value))
        elif update_target in list(map(lambda b: b.name, system.orbiting_bodies)) or update_target == system.central_body.name:
            body = system.get_body_with_name(
                update_target) or system.central_body
            if update_field == "mass":
                body.mass = float(str(update_value))
            elif update_field == "radius":
                body.setBodyRadius(float(str(update_value)))
                await send_system_data(group_target, socket)
            elif update_field == "orbitRadius":
                body.setOrbitRadius(float(str(update_value)))
            elif update_field == "orbitSpeed":
                body.setSpeed(float(str(update_value)))
            elif update_field == "location[0]":
                new_location = Vector.copy(body.location)
                new_location.x = float(str(update_value))
                body.setLocation(new_location, False)
            elif update_field == "location[1]":
                new_location = Vector.copy(body.location)
                new_location.y = float(str(update_value))
                body.setLocation(new_location, False)
            elif update_field == "location[2]":
                new_location = Vector.copy(body.location)
                new_location.z = float(str(update_value))
                body.setLocation(new_location, False)
            pass


def stop(signal: signal.Signals, frame: FrameType):
    global running
    running = False


signal.signal(signal.SIGINT, stop)

asyncio.get_event_loop().run_until_complete(concierge_bot())

exit(0)
