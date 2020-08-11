# -------------------
# Represents a body with mass that interacts with other bodies with gravity
# -------------------

from __future__ import division
from typing import Optional
from vector import Vector
import json

class Body:
    def __init__(self, name: str, mass: float, bodyRadius: float):
        self.name = name
        self.mass = mass
        self.bodyRadius = bodyRadius

        # Use default values on initialization
        self.centralBody: Optional[Body] = None
        self.scaledBodyRadius = bodyRadius
        self.location = Vector(1, 0, 0)
        self.scaledLocation = Vector(1, 0, 0)

        self.orbitRadius = 0.0
        self.scaledOrbitRadius = 0.0
        self.orbitSpeed = 0.0
        self.orbitDirection = Vector(0, 0, 0)
        self.color = Vector(0, 0, 0)

        self.velocity = Vector(0, 0, 0)
        self.force = Vector(0, 0, 0)
        self.impulse = Vector(0, 0, 0)

        self.scale = 1.0
        self.bodyScale = 1.0

        self.colliding = False

    def isCentralBody(self):
        if (self.centralBody == None): return False
        return self.centralBody.name == self.name;

    # -------------------
    # Mutators
    # -------------------

    def setScale(self, newScale: float):
        self.scale = newScale
        self.setBodyRadius(self.bodyRadius)

        if (self.isCentralBody()): return

        self.setOrbitRadius(self.orbitRadius)
        self.setLocation(self.location, False)

    def setBodyScale(self, newScale: float):
        self.bodyScale = newScale
        self.setBodyRadius(self.bodyRadius)

    def setOrbitRadius(self, radius: float):
        if (self.isCentralBody()): return

        self.orbitRadius = radius
        self.scaledOrbitRadius = radius / self.scale

        currentLocation = Vector.copy(self.location)
        if (self.centralBody == None):
            # Assume the central body will be at the origin
            center = Vector(0, 0, 0)
        else:
            center = Vector.copy(self.centralBody.location)
        direction = Vector.subtract(currentLocation, center).normalize()

        self.location = Vector.add(center, Vector.multiply(direction, self.orbitRadius))
        self.scaledLocation = Vector.add(center, Vector.multiply(direction, self.scaledOrbitRadius))

    def setSpeed(self, speed: float):
        if (self.isCentralBody()): return

        self.orbitSpeed = speed
        self.velocity.x = self.orbitDirection.x * speed
        self.velocity.y = self.orbitDirection.y * speed
        self.velocity.z = self.orbitDirection.z * speed

    def addForce(self, force: Vector):
        self.force.addToSelf(force)

    def addImpulse(self, impulse: Vector):
        self.impulse.addToSelf(impulse)

    def setBodyRadius(self, radius: float):
        self.bodyRadius = radius
        self.scaledBodyRadius = radius / self.scale * self.bodyScale

    def setColor(self, color: Vector):
        self.color = color

    def setLocation(self, location: Vector, scaled: bool):
        if (scaled):
            self.scaledLocation = location
            self.location = Vector.multiply(location, self.scale)
        else:
            self.location = location
            self.scaledLocation = Vector.multiply(location, 1 / self.scale)

    def setVelocity(self, velocity: Vector, scaled: bool):
        if (scaled):
            self.velocity = Vector.multiply(velocity, self.scale)
        else:
            self.velocity = velocity

    # -------------------
    # Accessors
    # -------------------
    def getName(self):
        return self.name

    def getBodyRadius(self):
        return self.bodyRadius

    def getScaledLocation(self):
        return self.scaledLocation

    def getJson(self):
        data = {
            "type" : "sphere",
            "name" : self.name,
            "posX" : self.scaledLocation.x,
            "posY" : self.scaledLocation.y,
            "posZ" : self.scaledLocation.z,
            "rotX" : 0,
            "rotY" : 0,
            "rotZ" : 0,
            "scaleX" : self.scaledBodyRadius * 2,
            "scaleY" : self.scaledBodyRadius * 2,
            "scaleZ" : self.scaledBodyRadius * 2
        }
        jsonString = json.dumps(data)

        return jsonString.replace("{", "<").replace("}", ">")

    # -------------------
    # Apply physics
    # -------------------

    def tick(self, dt):
        if (self.isCentralBody()):
            print("Central body location is locked.")
            self.location.zero
            self.scaledLocation.zero
            return

        initVelocity = Vector.copy(self.velocity)

        # Impulses
        momentum = Vector.multiply(self.velocity, self.mass)
        momentum.addToSelf(self.impulse)
        self.velocity = Vector.multiply(momentum, 1 / self.mass)

        # Forces
        self.velocity.addToSelf(Vector.multiply(self.force, dt / self.mass))

        # Use the average velocity
        averageVelocity = Vector(self.velocity.x + initVelocity.x / 2, self.velocity.y + initVelocity.y / 2, self.velocity.z + initVelocity.z / 2)

        # Update location
        self.location.addToSelf(Vector.multiply(averageVelocity, dt))

        mag = self.location.magnitude() / self.scale
        self.scaledLocation = Vector.multiply(self.location.normalize(), mag)

        self.impulse.zero()
        self.force.zero()

        # Update other information
        self.orbitRadius = self.location.magnitude()
        self.scaledOrbitRadius = self.scaledLocation.magnitude()
        self.orbitSpeed = abs(self.velocity.magnitude())
        self.orbitDirection = self.velocity.normalize()
