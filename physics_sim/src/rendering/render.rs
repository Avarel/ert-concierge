use cs3_physics::ecs::colliders::*;
use cs3_physics::ecs::{Rgb, DeltaTime};
use super::{IsDone, sdl_wrapper::SDLWrapper};
use sdl2::pixels::Color;
use cs3_physics::specs::prelude::*;

pub struct RenderSys(pub SDLWrapper);
impl<'a> System<'a> for RenderSys {
    type SystemData = (
        WriteExpect<'a, IsDone>,
        WriteExpect<'a, DeltaTime>,
        ReadStorage<'a, Shape>,
        ReadStorage<'a, Rgb>
        // ReadStorage<'a, Mass>,
        // ReadStorage<'a, Pos>,
    );

    fn run(&mut self, (mut done, mut dt, shape, color): Self::SystemData) {
        let RenderSys(sdl) = self;

        sdl.clear();

        for (Shape(polygon), &Rgb(r, g, b)) in (&shape, &color).join() {
            sdl.draw_polygon(polygon, Color::RGB(r, g, b))
                .expect("Draw polygon error.");
        }

        sdl.event_queue.clear();
        // for event in sdl.event_queue.drain(..) {
        //     // dbg!(event);
        // }

        // polygon normals pointed towards their colliders
        // for (Shape(poly1), PhysicalCollider(targets)) in (&shape, &thing).join() {
        //     let poly1points = poly1.points();
        //     for &target in targets {
        //         for e in 0..poly1points.len() {
        //             let v1 = poly1points[e];
        //             let v2 = poly1points[(e + 1) % poly1points.len()];
        //             let para = v2 - v1;
        //             let mut perp = para.perp().normalize();
                    
        //             let pos1 = poly1.centroid();
        //             let pos2 = shape.get(target).unwrap().0.centroid();
        //             let line = pos2 - pos1;
        //             if line.dot(perp) < 0.0 {
        //                 perp = -perp;
        //             }

        //             sdl.draw_line(pos1, line, Color::MAGENTA).unwrap();
        //             sdl.draw_line((v1 + v2) / 2.0, perp * 20.0, Color::RED).unwrap();
        //         }
        //     }
        // }

        // let thing = (&mass, &pos)
        //     .par_join()
        //     .map(|(&Mass(mass), &Pos(pos))| (mass * pos, mass))
        //     .reduce_with(|(n1, d1), (n2, d2)| (n1 + n2, d1 + d2)).map(|(n, d)| n / d).unwrap();
        // sdl.draw_point(thing, Color::RED).unwrap();

        sdl.show().expect("Show error.");

        done.0 = sdl.is_done();
        dt.0 = sdl.time_since_last_tick();
    }
}
