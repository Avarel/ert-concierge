# ERT / Basic Physics Simulation
Simulates the motion of bodies under gravity and linear momentum conservation (no rotation! Sorry.). Adapted from the C physics engine written in CS3, rewritten in Rust to take advantage of multithreading.

The physics simulation has 2 interactions: cycling between colors (not used) and duplicating boxes.

## Running the Concierge Bot
```bash
cargo run --release -p physics_sim
```