# -------------------
# A three-dimensional Vector which can represent location, rotation, etc.
# -------------------

from __future__ import annotations
import math


class Vector:
    def __init__(self, x: float, y: float, z: float):
        self.x: float = x
        self.y: float = y
        self.z: float = z

    def addToSelf(self, other: Vector):
        self.x += other.x
        self.y += other.y
        self.z += other.z

    def multiplyToSelf(self, scalar: float):
        self.x *= scalar
        self.y *= scalar
        self.z *= scalar

    def magnitude(self):
        return math.sqrt(math.pow(self.x, 2) + math.pow(self.y, 2) + math.pow(self.z, 2))

    def normalize(self):
        mag = self.magnitude()
        if (mag == 0):
            return Vector(0, 0, 0)
        return Vector(self.x / mag, self.y / mag, self.z / mag)

    def zero(self):
        self.x = 0
        self.y = 0
        self.z = 0

    # -------------------
    # Static methods
    # -------------------
    @staticmethod
    def multiply(vector: Vector, scalar: float):
        return Vector(vector.x * scalar, vector.y * scalar, vector.z * scalar)

    @staticmethod
    def subtract(a: Vector, b: Vector):
        return Vector(a.x - b.x, a.y - b.y, a.z - b.z)

    @staticmethod
    def add(a: Vector, b: Vector):
        return Vector(a.x + b.x, a.y + b.y, a.z + b.z)

    @staticmethod
    def copy(vector: Vector):
        return Vector(vector.x, vector.y, vector.z)

    @staticmethod
    def distance(a: Vector, b: Vector):
        return math.sqrt(math.pow(a.x - b.x, 2) + math.pow(a.y - b.y, 2) + math.pow(a.z - b.z, 2))

    @staticmethod
    def dot(a: Vector, b: Vector):
        return a.x * b.x + a.y * b.y + a.z * b.z
