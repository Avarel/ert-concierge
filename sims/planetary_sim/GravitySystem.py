# -------------------
# Stores the bodies in the system and applies the appropriate forces
# -------------------

from __future__ import division
from typing import List, Optional

from vector import Vector
from body import Body
from collision import Collision

import math


class GravitySystem:
    elasticity = 1.0
    gravity_limit = 0.0

    def __init__(self):
        self.central_body: Optional[Body] = None
        self.orbiting_bodies: List[Body] = []
        self.player_bodies: List[Optional[Body]] = [None, None]

        # Default physics constants
        self.G = 1
        self.scale = 1
        self.time_scale = 1
        self.body_scale = 1
        self.central_body_scale = 1
        self.system_radius = 5
        self.hand_mass = 1

        self.statistics = ""

    def update_body(self, updated: Body):
        if (updated.name[:4] == "left"):
            self.player_bodies[0] = updated
        if (updated.name[:5] == "right"):
            self.player_bodies[1] = updated
        if (updated.name == "emptyleft"):
            self.player_bodies[0] = None
        if (updated.name == "emptyright"):
            self.player_bodies[1] = None

    # -------------------
    # Mutators
    # -------------------
    def add_body(self, newBody):
        newBody.setScale(self.scale)
        newBody.setBodyScale(self.body_scale)
        newBody.centralBody = self.central_body

        self.orbiting_bodies.append(newBody)

    def set_scale(self, newScale):
        self.scale = newScale

        self.central_body.setScale(newScale)

        for b in self.orbiting_bodies:
            b.setScale(newScale)

    def set_body_scale(self, newScale):
        self.bodyScale = newScale

        self.central_body.setBodyScale(newScale * self.central_body_scale)

        for b in self.orbiting_bodies:
            b.setBodyScale(newScale)

    # -------------------
    # Accessors
    # -------------------
    def get_body_with_name(self, name: str) -> Optional[Body]:
        for b in self.orbiting_bodies:
            if b.name.lower() == name.lower():
                return b

        if self.central_body.name.lower() == name.lower():
            return self.central_body

        return None

    # -------------------
    # Physics
    # -------------------

    # Get force on a caused by b
    def get_force_on(self, a: Body, b: Body) -> Vector:
        dist = Vector.distance(a.location, b.location)
        if dist <= GravitySystem.gravity_limit:
            return Vector(0, 0, 0)

        mag = self.G * a.mass * b.mass / math.pow(dist, 2)
        dir = Vector.subtract(b.location, a.location).normalize()

        return Vector.multiply(dir, mag)

    def apply_forces(self):
        for b in self.orbiting_bodies:
            if self.central_body != None:
                force = self.get_force_on(b, self.central_body)
                b.addForce(force)
            for other in self.orbiting_bodies:
                bodyForce = self.get_force_on(b, other)
                b.addForce(bodyForce)
            '''for other in self.playerBodies:
                if other != "empty":
                    handForce = self.getForceOn(b, other)
                    b.addForce(handForce)'''

    def apply_impulses(self):
        for b in self.orbiting_bodies:
            collidedThisFrame = False
            for other in self.orbiting_bodies:
                imp = Collision.getCollisionImpulse(b, other, self.elasticity)
                if (imp.x != 0 or imp.y != 0 or imp.z != 0):
                    collidedThisFrame = True
                elif (imp.x == 123.4 and imp.y == 123.4 and imp.z == 123.4):
                    collidedThisFrame = True
                else:
                    b.addImpulse(imp)

            for other in self.player_bodies:
                if other != None:
                    imp = Collision.getCollisionImpulse(
                        b, other, self.elasticity)
                    if (imp.x != 0 or imp.y != 0 or imp.z != 0):
                        collidedThisFrame = True
                    elif (imp.x == 123.4 and imp.y == 123.4 and imp.z == 123.4):
                        collidedThisFrame = True
                    else:
                        b.addImpulse(imp)

            # Don't want to apply impulses multiple times
            if collidedThisFrame:
                b.colliding = True
            else:
                b.colliding = False

    def update_statistics(self):
        self.statistics = ""

        self.statistics += self.central_body.name + "<line>"
        self.statistics += "Mass: " + str(self.central_body.mass) + "<line>"
        self.statistics += "Radius: " + \
            str(self.central_body.bodyRadius) + "<line><line>"

        for b in self.orbiting_bodies:
            self.statistics += b.name + "<line>"
            self.statistics += "Mass: " + str(b.mass) + "<line>"
            self.statistics += "Radius:" + str(b.bodyRadius) + "<line>"
            self.statistics += "Orbit radius:" + str(b.orbitRadius) + "<line>"
            self.statistics += "Orbit speed:" + \
                str(b.orbitSpeed) + "<line><line>"

    def tick_system(self, dt):
        self.apply_forces()
        self.apply_impulses()

        toRemove = []

        for b in self.orbiting_bodies:
            b.tick(dt * self.time_scale)
            if b.scaledOrbitRadius > self.system_radius:
                toRemove.append(b)

        for b in toRemove:
            self.orbiting_bodies.remove(b)

        self.update_statistics()
        return toRemove
