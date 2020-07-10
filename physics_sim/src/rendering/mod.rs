use cs3_physics::{ecs::DeltaTime, specs::{WriteExpect, System}};
use std::time::{Duration, Instant};

pub mod render;
pub mod sdl_wrapper;

pub struct IsDone(pub bool);

pub struct TimeSys {
    last_tick: Instant
}

impl TimeSys {
    pub fn new() -> Self {
        Self {
            last_tick: Instant::now(),
        }
    }
}

impl<'a> System<'a> for TimeSys {
    type SystemData = WriteExpect<'a, DeltaTime>;

    fn run(&mut self, mut dt: Self::SystemData) {
        let elapsed = self.last_tick.elapsed();
        self.last_tick = Instant::now();
        dt.0 = elapsed;
        std::thread::sleep(Duration::from_millis(10))
    }
}