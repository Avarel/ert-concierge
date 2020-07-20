# -------------------
# Determines the impulse caused by a collision between two bodies
# -------------------

from body import Body
from vector import Vector

from datetime import datetime

collisionLimit = 0

class Collision:
    @staticmethod
    def bodyOverlap(a: Body, b: Body):
        dist = Vector.distance(a.scaledLocation, b.scaledLocation)
        if (dist <= collisionLimit): return 0

        overlap = dist - a.scaledBodyRadius - b.scaledBodyRadius

        if (overlap >= 0): return 0
        return overlap * -1

    # Gets the impulse of the collision on Body a caused by Body b with elasticity e
    @staticmethod
    def getCollisionImpulse(a: Body, b: Body, e: float) -> Vector:
        overlap = Collision.bodyOverlap(a, b)
        if (overlap == 0): return Vector(0, 0, 0)

        if (a.colliding or b.colliding): return Vector(123.4, 123.4, 123.4)

        print("Collision detected at time", datetime.now(), "between", a.name, b.name)
        axis = Vector(b.location.x - a.location.x, b.location.y - a.location.y, b.location.z - a.location.z).normalize()
        speedA = Vector.dot(a.velocity, axis)
        speedB = Vector.dot(b.velocity, axis)
        reducedMass = (a.mass * b.mass) / (a.mass + b.mass)

        impulse = reducedMass * (1 + e) * (speedA - speedB)
        print("     impulse magnitude is", impulse)
        print("     velocity a", a.velocity.x, a.velocity.y, a.velocity.z)
        print("     velocity b", b.velocity.x, b.velocity.y, b.velocity.z)
        axis.multiplyToSelf(impulse)
        print("     impulse vector is", axis.x, axis.y, axis.z)

        return axis
