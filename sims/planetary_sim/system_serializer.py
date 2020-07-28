# -------------------
# Converts a GravitySystem to JSON format and vice versa
# -------------------

from gravity_system import GravitySystem
from body import Body
from vector import Vector
from typing import Dict, Any, Tuple, List


def vector_to_object(vector: Vector) -> Tuple[float, float, float]:
    return vector.x, vector.y, vector.z


def body_to_object(body: Body) -> Dict[str, Any]:
    data = {
        "name": body.name,
        "mass": body.mass,
        "radius": body.bodyRadius,
        "location": vector_to_object(body.location),
        "color": vector_to_object(body.color),
        "orbitRadius": body.orbitRadius,
        "orbitSpeed": body.orbitSpeed,
        "direction": vector_to_object(body.orbitDirection),
    }
    return data

def system_data_to_object(system: GravitySystem) -> Dict[str, Any]:
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
    return systemData

def system_objects_to_object(system: GravitySystem) -> List[Dict[str, Any]]:
    objects = []
    if system.central_body != None:
        centralJson = body_to_object(system.central_body)
        objects.append(centralJson)

    for b in system.orbiting_bodies:
        bodyJson = body_to_object(b)
        objects.append(bodyJson)
    return objects

def system_to_object(system: GravitySystem) -> Dict[str, Any]:
    systemData = system_data_to_object(system)
    objects = system_objects_to_object(system)

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

        location = dict["location"]

        body.setLocation(Vector(location[0], location[1], location[2]), False)

        color = dict["color"]
        body.setColor(Vector(color[0], color[1], color[2]))

        if (body.name != systemDict["centralBodyName"]):
            direction = dict["direction"]
            body.orbitDirection = Vector(direction[0], direction[1], direction[2])
            body.setSpeed(dict["orbitSpeed"])
            body.setOrbitRadius(dict["orbitRadius"])

            system.add_body(body)

    return system
