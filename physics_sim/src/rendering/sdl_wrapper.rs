use cs3_physics::{
    polygon::Polygon,
    vector::{Vec2, Vec2f},
};
use sdl2::{
    event::Event, gfx::primitives::DrawRenderer, keyboard::Keycode, pixels::Color, rect::Rect,
    render::Canvas, video::Window, EventPump,
};
use std::time::{Duration, Instant};

const WINDOW_TITLE: &str = "CS 3";
const WINDOW_WIDTH: u32 = 1000;
const WINDOW_HEIGHT: u32 = 500;

#[derive(Debug, Eq, PartialEq, Copy, Clone)]
pub enum KeyEvent {
    KeyPressed,
    KeyReleased,
}

pub struct SDLWrapper {
    center: Vec2f,
    max_diff: Vec2f,
    event_pump: EventPump,
    pub event_queue: Vec<Event>,
    canvas: Canvas<Window>,
    last_tick: Instant,
}

impl SDLWrapper {
    // Initiate the SDL2 subsystems and wrapper.
    pub fn init(min: Vec2f, max: Vec2f) -> Result<Self, String> {
        assert!(min.x < max.x);
        assert!(min.y < max.y);
        let center = 0.5 * (min + max);
        let max_diff = max - center;

        let sdl_context = sdl2::init()?;
        let video_subsystem = sdl_context.video()?;
        let window = video_subsystem
            .window(WINDOW_TITLE, WINDOW_WIDTH, WINDOW_HEIGHT)
            .resizable()
            .position_centered()
            .allow_highdpi()
            .build()
            .map_err(|e| e.to_string())?;

        let canvas = window
            .into_canvas()
            .target_texture()
            .accelerated()
            .present_vsync()
            .build()
            .map_err(|e| e.to_string())?;

        let event_pump = sdl_context.event_pump()?;

        Ok(Self {
            center,
            max_diff,
            event_pump,
            event_queue: Vec::new(),
            canvas,
            last_tick: Instant::now(),
        })
    }

    pub fn clear(&mut self) {
        self.canvas.set_draw_color(Color::WHITE);
        self.canvas.clear();
    }

    pub fn show(&mut self) -> Result<(), String> {
        let window_center = self.window_center()?;
        let max = self.center + self.max_diff;
        let min = self.center - self.max_diff;
        let max_pixel = self.window_position(max, window_center)?;
        let min_pixel = self.window_position(min, window_center)?;
        let rect = Rect::new(
            min_pixel.x as i32,
            max_pixel.y as i32,
            (max_pixel.x - min_pixel.x) as u32,
            (min_pixel.y - max_pixel.y) as u32,
        );
        self.canvas.set_draw_color(Color::BLACK);
        self.canvas.draw_rect(rect)?;
        Ok(self.canvas.present())
    }

    pub fn window_center(&self) -> Result<Vec2f, String> {
        let (width, height) = self.canvas.output_size()?;
        Ok(Vec2::new(f64::from(width / 2), f64::from(height / 2)))
    }

    pub fn scene_scale(&self) -> Result<f64, String> {
        let window_center = self.window_center()?;
        let x_scale = window_center.x / self.max_diff.x;
        let y_scale = window_center.y / self.max_diff.y;
        Ok(x_scale.min(y_scale))
    }

    pub fn window_position(
        &self,
        scene_pos: Vec2f,
        window_center: Vec2f,
    ) -> Result<Vec2<u32>, String> {
        let scene_center_offset = scene_pos - self.center;
        let scale = self.scene_scale()?;
        let pixel_center_offset = scale * scene_center_offset;
        Ok(Vec2::new(
            window_center.x + pixel_center_offset.x,
            window_center.y - pixel_center_offset.y,
        )
        .map(f64::round)
        .map(|n| n as u32))
    }

    pub fn draw_polygon(&mut self, poly: &Polygon, color: Color) -> Result<(), String> {
        assert!(poly.points().len() >= 3);
        let window_center = self.window_center()?;

        let points: (Vec<_>, Vec<_>) = poly
            .points()
            .iter()
            .copied()
            .filter_map(|v| self.window_position(v, window_center).ok())
            .map(|v| v.map(|n| n as i16).into())
            .unzip();

        self.canvas.filled_polygon(&points.0, &points.1, color)
    }

    pub fn draw_point(&mut self, point: Vec2f, color: Color) -> Result<(), String> {
        self.canvas.set_draw_color(color);
        let window_center = self.window_center()?;
        let window_pos = self
            .window_position(point, window_center)?
            .map(|n| n as i32);
        self.canvas.draw_point((window_pos.x, window_pos.y))
    }

    pub fn draw_line(&mut self, point: Vec2f, vector: Vec2f, color: Color) -> Result<(), String> {
        self.canvas.set_draw_color(color);
        let window_center = self.window_center()?;
        let window_pos_start = self
            .window_position(point, window_center)?
            .map(|n| n as i32);
        let window_pos_end = self
            .window_position(point + vector, window_center)?
            .map(|n| n as i32);
        self.canvas.draw_line((window_pos_start.x, window_pos_start.y), (window_pos_end.x, window_pos_end.y))
    }

    pub fn time_since_last_tick(&mut self) -> Duration {
        let elapsed = self.last_tick.elapsed();
        self.last_tick = Instant::now();
        elapsed
    }

    pub fn is_done(&mut self) -> bool {
        while let Some(event) = self.event_pump.poll_event() {
            match event {
                Event::Quit { .. }
                | Event::KeyDown {
                    keycode: Some(Keycode::Escape),
                    ..
                } => {
                    return true;
                }
                Event::KeyDown { .. } | Event::KeyUp { .. } => self.event_queue.push(event),
                _ => {}
            }
        }

        false
    }
}
