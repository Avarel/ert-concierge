use crate::{polygon::Polygon, vector::Vec2f};

#[derive(Debug, Copy, Clone)]
struct Interval {
    lo: f64,
    hi: f64,
}

impl Interval {
    fn intersect_length(&self, other: Interval) -> f64 {
        if self.lo <= other.hi && other.lo <= self.hi {
            let hi = self.hi.min(other.hi);
            let lo = self.lo.max(other.lo);
            hi - lo
        } else {
            0.0
        }
    }
}

struct BoundingBox {
    ll: Vec2f,
    ur: Vec2f,
}

impl BoundingBox {
    fn of(poly: &Polygon) -> Self {
        let points = poly.points();
        let mut ll = points[0];
        let mut ur = points[0];
        for point in points {
            if point.x < ll.x {
                ll.x = point.x;
            }
            if point.x > ur.x {
                ur.x = point.x;
            }
            if point.y < ll.y {
                ll.y = point.y;
            }
            if point.y > ur.y {
                ur.y = point.y;
            }
        }
        BoundingBox { ll, ur }
    }

    fn intersect(&self, other: &BoundingBox) -> bool {
        !(self.ll.y >= other.ur.y || other.ll.y >= self.ur.y)
            && !(self.ll.x >= other.ur.x || other.ll.x >= self.ur.x)
    }
}

// Returns the length of intersection & the axis pointing from poly1 to poly2
fn partial_sat(poly1: &Polygon, poly2: &Polygon) -> Option<(f64, Vec2f)> {
    let line = poly2.centroid() - poly1.centroid();

    let mut pair = (f64::INFINITY, Vec2f::ZERO);
    let points = poly1.points();
    for e in 0..points.len() {
        let v1 = points[e];
        let v2 = points[(e + 1) % points.len()];
        let para = v2 - v1;
        let mut perp = para.perp().normalize();

        if line.dot(perp) < 0.0 {
            perp = -perp;
        }

        let i1 = project(poly1, perp);
        let i2 = project(poly2, perp);
        let l = i1.intersect_length(i2);

        if l == 0.0 {
            return None;
        } else if l < pair.0 {
            pair = (l, perp * l);
            // z = e as i32;
        }
    }

    return Some(pair);
}

/// Axis must be normalized (magnitude = 1.0).
fn project(poly: &Polygon, axis: Vec2f) -> Interval {
    let points = poly.points();
    let mut lo = points[0].dot(axis);
    let mut hi = lo;
    for point in points {
        let dot = point.dot(axis);
        if dot < lo {
            lo = dot;
        } else if dot > hi {
            hi = dot;
        }
    }
    Interval { lo, hi }
}

// Returns None or MTV (minimum translation vector/collision normal approximate) pointing from poly1 to poly2
pub fn find_collision(poly1: &Polygon, poly2: &Polygon) -> Option<Vec2f> {
    if !BoundingBox::of(poly1).intersect(&BoundingBox::of(poly2)) {
        None
    } else {
        let r1 = partial_sat(poly1, poly2)?;
        let r2 = partial_sat(poly2, poly1)?;

        Some(if r1.0 <= r2.0 { r1.1 } else { -r2.1 })
    }
}

// #[derive(Copy, Clone, Debug)]
// pub struct Seg {
//     pub start: Vec2f,
//     pub end: Vec2f
// }

// pub fn magic_2(a: Polygon, b: Polygon, n: Vec2f) {
//     let e1 = nearest_edge_to_normal(a, n);
//     let e2 = nearest_edge_to_normal(b, -n);

// }

// pub fn nearest_edge_to_normal(shape: Polygon, n: Vec2f) -> Seg {
//     // // step 1
//     // // find the farthest vertex in
//     // // the polygon along the separation normal
//     // int c = vertices.length;
//     // for (int i = 0; i < c; i++) {
//     //   double projection = n.dot(v);
//     //   if (projection > max) {
//     //     max = projection;
//     //     index = i;
//     //   }
//     // }

//     let index = shape
//         .points()
//         .iter()
//         .copied()
//         .map(|v| n.dot(v))
//         .enumerate()
//         .max_by(|(_, a), (_, b)| a.partial_cmp(b).unwrap())
//         .unwrap().0;

//     // // step 2
//     // // now we need to use the edge that
//     // // is most perpendicular, either the
//     // // right or the left
//     // Vector2 v = vertices[index];
//     // Vector2 v1 = v.next;
//     // Vector2 v0 = v.prev;
//     // // v1 to v
//     // Vector2 l = v - v1;
//     // // v0 to v
//     // Vector2 r = v - v0;
//     // // normalize
//     // l.normalize();
//     // r.normalize();

//     let v = shape.vertex(index);
//     let [v0, v1] = shape.adj_vertex(index);
//     let l = (v - v1).normalize();
//     let r = (v - v0).normalize();

//     // // the edge that is most perpendicular
//     // // to n will have a dot product closer to zero
//     // if (r.dot(n) <= l.dot(n)) {
//     //   // the right edge is better
//     //   // make sure to retain the winding direction
//     //   return new Edge(v, v0, v);
//     // } else {
//     //   // the left edge is better
//     //   // make sure to retain the winding direction
//     //   return new Edge(v, v, v1);
//     // }
//     // // we return the maximum projection vertex (v)
//     // // and the edge points making the best edge (v and either v0 or v1)

//     if r.dot(n) <= l.dot(n) {
//         Seg { start: v0, end: v }
//     } else {
//         Seg { start: v, end: v1 }
//     }
// }
