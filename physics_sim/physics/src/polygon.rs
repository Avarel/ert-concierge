use crate::vector::Vec2f;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
#[derive(Debug, Clone)]
pub struct Polygon {
    centroid: Vec2f,
    points: Vec<Vec2f>,
}

impl Polygon {
    pub fn new(points: Vec<Vec2f>) -> Self {
        Self::new2(centroid(&points), points)
    }

    pub fn new2(centroid: Vec2f, points: Vec<Vec2f>) -> Self {
        assert!(points.len() >= 3);
        Self {
            centroid, points
        }
    }

    pub fn translate(&mut self, translation: Vec2f) {
        self.centroid += translation;
        self.points.iter_mut().for_each(|v| *v += translation);
    }

    // pub fn vertex(&self, index: usize) -> Vec2f {
    //     self.points[index]
    // }

    // pub fn adj_vertex(&self, index: usize) -> [Vec2f; 2] {
    //     [
    //         self.vertex(if index == 0 { self.points.len() } else { index } - 1),
    //         self.vertex((index + 1) % self.points.len()),
    //     ]
    // }

    pub fn area(&self) -> f64 {
        area(&self.points)
    }

    pub fn centroid(&self) -> Vec2f {
        self.centroid
    }

    pub fn points(&self) -> &[Vec2f] {
        &self.points
    }

    pub fn rotate_relative(&mut self, angle: f64, center: Vec2f) {
        let center = center.into();
        self.centroid.rotate_relative(angle, center);
        self.points
            .iter_mut()
            .for_each(|v| *v = v.rotate_relative(angle, center));
    }
}

fn shoelace(poly: &[Vec2f]) -> f64 {
    (0..poly.len()).fold(0.0, |acc, e| {
        acc + poly[e].cross(poly[(e + 1) % poly.len()])
    }) / 2.0
}

fn area(poly: &[Vec2f]) -> f64 {
    shoelace(poly).abs()
}

fn centroid(poly: &[Vec2f]) -> Vec2f {
    (0..poly.len()).fold(Vec2f::ZERO, |acc, e| {
        let v1 = poly[e];
        let v2 = poly[(e + 1) % poly.len()];
        acc + v1.cross(v2) * Vec2f::new(v1.x + v2.x, v1.y + v2.y)
    }) / (6.0 * shoelace(poly))
}

impl<N: Into<Vec2f>> From<Vec<N>> for Polygon {
    fn from(points: Vec<N>) -> Self {
        Self::new(points.into_iter().map(|n| n.into()).collect())
    }
}
