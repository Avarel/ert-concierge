# -------------------
# Converts a GravitySystem to JSON format and vice versa
# -------------------

from gravity_system import GravitySystem
from body import Body
from vector import Vector
from typing import List, Dict, Any


def body_to_object(body: Body) -> Dict[str, Any]:
    data = {
        "name": body.name,
        "mass": body.mass,
        "radius": body.bodyRadius,
        "locationX": body.location.x,
        "locationY": body.location.y,
        "locationZ": body.location.z,
        "orbitRadius": body.orbitRadius,
        "orbitSpeed": body.orbitSpeed,
        "directionX": body.orbitDirection.x,
        "directionY": body.orbitDirection.y,
        "directionZ": body.orbitDirection.z
    }
    return data


def system_to_object(system: GravitySystem) -> Dict[str, Any]:
    systemData = {
        "gravityConstant": system.G,
        "scale": system.scale,
        "timeScale": system.time_scale,
        "bodyScale": system.body_scale,
        "centralBodyScale": system.central_body_scale,
        "elasticity": system.elasticity,
        "bodyCount": len(system.orbiting_bodies) + 1,
        "centralBodyName": system.central_body.name,
        "handMass": system.hand_mass,
        "boundary": system.system_radius
    }

    objects = []
    if system.central_body != None:
        centralJson = body_to_object(system.central_body)
        objects.append(centralJson)

    for b in system.orbiting_bodies:
        bodyJson = body_to_object(b)
        objects.append(bodyJson)

    obj = {
        "systemData": systemData,
        "objects": objects
    }

    return obj


def object_to_system(obj: Dict[str, Any]) -> GravitySystem:
    systemDict = obj["systemData"]

    system = GravitySystem()
    system.G = systemDict["gravityConstant"]
    system.scale = systemDict["scale"]
    system.time_scale = systemDict["timeScale"]
    system.body_scale = systemDict["bodyScale"]
    system.central_body_scale = systemDict["centralBodyScale"]
    system.elasticity = systemDict["elasticity"]
    system.system_radius = systemDict["boundary"]
    system.hand_mass = systemDict["handMass"]

    centralBody = None
    objects = obj["objects"]
    for dict in objects:
        body = Body(dict["name"], dict["mass"], dict["radius"])

        if (body.name == systemDict["centralBodyName"]):
            centralBody = body
            system.central_body = body
            centralBody.setScale(system.scale)
            centralBody.setBodyScale(
                system.body_scale * system.central_body_scale)
            print("Central body found:", centralBody.name)

        if (centralBody != None):
            body.centralBody = centralBody
        else:
            print(body.name, "has no central body")

        body.setLocation(
            Vector(dict["locationX"], dict["locationY"], dict["locationZ"]), False)

        if (body.name != systemDict["centralBodyName"]):
            body.orbitDirection = Vector(
                dict["directionX"], dict["directionY"], dict["directionZ"])
            body.setSpeed(dict["orbitSpeed"])
            body.setOrbitRadius(dict["orbitRadius"])

            system.add_body(body)

    return system
