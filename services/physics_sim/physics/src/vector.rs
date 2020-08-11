use std::ops::{Add, AddAssign, Div, DivAssign, Mul, MulAssign, Neg, Sub, SubAssign};
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
/// A 2-dimensional vector, holding 2 values of the same type.
#[derive(Debug, Copy, Clone, PartialEq, Default)]
pub struct Vec2<T> {
    pub x: T,
    pub y: T,
}

impl<T> Vec2<T> {
    /// Returns a vector_t value made from the given arguments.
    ///
    /// # Example
    /// ```
    /// use cs3_physics::vector::Vec2;
    /// let mut v = Vec2::new("element1", "element2");
    /// ```
    pub const fn new(x: T, y: T) -> Self {
        Self { x, y }
    }

    /// Maps the components of the vector into another type.
    ///
    /// # Example
    /// ```
    /// use cs3_physics::vector::Vec2;
    /// let v1 = Vec2::new(1, 2);
    /// let v2 = v1.map(|i| i + 2);
    /// assert_eq!(v2, Vec2::new(3, 4));
    /// ```
    pub fn map<B>(self, f: impl Fn(T) -> B) -> Vec2<B> {
        Vec2::new(f(self.x), f(self.y))
    }
}

impl<T> From<Vec2<T>> for (T, T) {
    /// Unzip the vector into a tuple.
    ///
    /// # Example
    /// ```
    /// use cs3_physics::vector::Vec2;
    /// let v: (i32, i32) = Vec2::new(1, 2).into();
    /// assert_eq!(v, (1, 2));
    /// ```
    fn from(v: Vec2<T>) -> Self {
        (v.x, v.y)
    }
}

impl<T> From<(T, T)> for Vec2<T> {
    /// Zip the tuple into a vector.
    ///
    /// # Example
    /// ```
    /// use cs3_physics::vector::Vec2;
    /// let v: Vec2<i32> = (1,2).into();
    /// assert_eq!(v, Vec2::new(1, 2));
    /// ```
    fn from(t: (T, T)) -> Self {
        Vec2::new(t.0, t.1)
    }
}

impl<T: Add<Output = T>> Add for Vec2<T> {
    type Output = Self;

    /// Adds two vectors.
    /// Performs the usual componentwise vector sum.
    ///
    /// # Example
    /// ```
    /// use cs3_physics::vector::Vec2;
    /// let v1 = Vec2::new(1, 2);
    /// let v2 = Vec2::new(3, 4);
    /// let v = v1 + v2;
    /// assert_eq!(v, Vec2::new(4,6));
    /// ```
    fn add(self, rhs: Self) -> Self::Output {
        Self::new(self.x + rhs.x, self.y + rhs.y)
    }
}

impl<T: AddAssign> AddAssign for Vec2<T> {
    /// Adds two vectors.
    /// Performs the usual componentwise vector sum.
    ///
    /// # Example
    /// ```
    /// use cs3_physics::vector::Vec2;
    /// let mut v1 = Vec2::new(1, 2);
    /// let v2 = Vec2::new(3, 4);
    /// v1 += v2;
    /// assert_eq!(v1, Vec2::new(4,6));
    /// ```
    fn add_assign(&mut self, rhs: Self) {
        self.x += rhs.x;
        self.y += rhs.y;
    }
}

impl<T: Sub<Output = T>> Sub for Vec2<T> {
    type Output = Self;

    /// Subtracts two vectors.
    /// Performs the usual componentwise vector difference.
    ///
    /// # Example
    /// ```
    /// use cs3_physics::vector::Vec2;
    /// let v1 = Vec2::new(1, 2);
    /// let v2 = Vec2::new(3, 4);
    /// let v = v1 - v2;
    /// assert_eq!(v, Vec2::new(-2,-2));
    /// ```
    fn sub(self, rhs: Self) -> Self::Output {
        Self::new(self.x - rhs.x, self.y - rhs.y)
    }
}

impl<T: SubAssign> SubAssign for Vec2<T> {
    /// Subtracts two vectors.
    /// Performs the usual componentwise vector difference.
    ///
    /// # Example
    /// ```
    /// use cs3_physics::vector::Vec2;
    /// let mut v1 = Vec2::new(1, 2);
    /// let v2 = Vec2::new(3, 4);
    /// v1 -= v2;
    /// assert_eq!(v1, Vec2::new(-2,-2));
    /// ```
    fn sub_assign(&mut self, rhs: Self) {
        self.x -= rhs.x;
        self.y -= rhs.y;
    }
}

impl<T: Mul<Output = T> + Copy> Mul<T> for Vec2<T> {
    type Output = Self;

    /// Multiplies a vector by a scalar.
    /// Performs the usual componentwise product.
    ///
    /// # Example
    /// ```
    /// use cs3_physics::vector::Vec2;
    /// let v1 = Vec2::new(1, 2);
    /// let v = v1 * 3;
    /// assert_eq!(v, Vec2::new(3, 6));
    /// ```
    fn mul(self, rhs: T) -> Self::Output {
        self.map(|n| n * rhs)
    }
}

impl<T: MulAssign + Copy> MulAssign<T> for Vec2<T> {
    /// Multiplies a vector by a scalar.
    /// Performs the usual componentwise product.
    ///
    /// # Example
    /// ```
    /// use cs3_physics::vector::Vec2;
    /// let mut v = Vec2::new(1, 2);
    /// v *= 3;
    /// assert_eq!(v, Vec2::new(3, 6));
    /// ```
    fn mul_assign(&mut self, rhs: T) {
        self.x *= rhs;
        self.y *= rhs;
    }
}

impl<T: Neg<Output = T>> Neg for Vec2<T> {
    type Output = Self;

    /// Computes the additive inverse a vector.
    /// This is done by using componentwise negation.
    ///
    /// # Example
    /// ```
    /// use cs3_physics::vector::Vec2;
    /// let v = Vec2::new(1, 2);
    /// assert_eq!(-v, Vec2::new(-1, -2));
    /// ```
    fn neg(self) -> Self::Output {
        self.map(|n| -n)
    }
}

impl<T: Neg<Output = T>> Vec2<T> {
    /// Returns a perpendicular vector to the input vector.
    ///
    /// # Example
    /// ```
    /// use cs3_physics::vector::Vec2;
    /// let v = Vec2::new(1.0, 2.0);
    /// assert_eq!(v.dot(v.perp()), 0.0);
    /// ```
    pub fn perp(self) -> Vec2<T> {
        Self::new(self.y, -self.x)
    }
}

/// A real-valued 2-dimensional vector.
/// 
/// Positive x is towards the right; positive y is towards the top.
pub type Vec2f = Vec2<f64>;

impl Mul<Vec2f> for f64 {
    type Output = Vec2f;

    /// Multiplies a vector by a scalar.
    /// Performs the usual componentwise product.
    fn mul(self, rhs: Vec2f) -> Self::Output {
        Vec2::new(self * rhs.x, self * rhs.y)
    }
}

impl Div<f64> for Vec2f {
    type Output = Self;

    /// Divides a vector by a scalar.
    /// Performs the usual componentwise quotient.
    fn div(self, rhs: f64) -> Self::Output {
        self.map(|n| n / rhs)
    }
}

impl DivAssign<f64> for Vec2f {
    /// Divides a vector by a scalar.
    /// Performs the usual componentwise quotient.
    fn div_assign(&mut self, rhs: f64) {
        self.x /= rhs;
        self.y /= rhs;
    }
}

impl Vec2f {
    /// The zero vector, i.e. (0, 0).
    pub const ZERO: Self = Self::new(0.0, 0.0);

    /// Rotates a vector by an angle around (0, 0).
    /// The angle is given in radians.
    /// Positive angles are counterclockwise, according to the right hand rule.
    ///
    /// See https://en.wikipedia.org/wiki/Rotation_matrix.
    /// (You can derive this matrix by noticing that rotation by a fixed angle
    /// is linear and then computing what it does to (1, 0) and (0, 1).)
    pub fn rotate(self, angle: f64) -> Self {
        Self::new(
            self.x * angle.cos() - self.y * angle.sin(),
            self.x * angle.sin() + self.y * angle.cos(),
        )
    }

    pub fn rotate_relative(self, angle: f64, center: Self) -> Self {
        return (self - center).rotate(angle) + center;
    }

    /// Returns a velocity vector after a given acceleration has been applied.
    /// This is essentially the formula v(t) = v_0 + at.
    pub fn tick(self, acc: Self, dt: f64) -> Self {
        return self + dt * acc;
    }

    /// Computes the dot product of two vectors.
    /// See https://en.wikipedia.org/wiki/Dot_product#Algebraic_definition.
    pub fn dot(self, rhs: Self) -> f64 {
        self.x * rhs.x + self.y * rhs.y
    }

    /// Computes the cross product of two vectors, which lies along the z-axis.
    ///
    /// See https://en.wikipedia.org/wiki/Cross_product#Computing_the_cross_product.
    pub fn cross(self, rhs: Self) -> f64 {
        self.x * rhs.y - rhs.x * self.y
    }

    /// Returns the magnitude of the vector.
    pub fn norm(self) -> f64 {
        (self.x.powi(2) + self.y.powi(2)).sqrt()
    }

    /// Returns a normalized vector (same direction, but magnitude is 1).
    pub fn normalize(self) -> Self {
        self / self.norm()
    }
}
