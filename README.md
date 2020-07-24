# ERT Concierge
Websocket protocol for connecting multiple client types and facilitating transfer of information between specific clients.

## Compilation
* Install [**Rust 1.44.1 or above**](https://www.rust-lang.org/).
* Clone or download the repository.

### Compiling Native Artifacts
```bash
cargo build --release --workspace
```
This will build optimized Rust artifacts of `ert_concierge` and `physics_sim`. This might take a long time.
### Compiling Webpack Front-end
```bash
cd babylonjs-web/; npm run build; cd ../
```
This will `cd` to the front-end directory and build the TypeScript files into minified and bundled JavaScript files.

## Running
### Front-End
To access the front-end, you simply compile (see above) and launch the `index.html` file.
### Central Server
```bash
cargo run --release
OR
cargo run --release -p ert_concierge
```
### Physics Simulation
```bash
cargo run --release -p physics_sim
```
The physics simulation should only be ran after the central server has been launched. This will connect the physics simulation to a locally-hosted central server.
### Planetary Simulation
```bash
cd planetary_sim/; python3 concierge_bot.py
```
The planetary simulation should only be ran after the central server has been launched. This will connect the planetary simulation to a locally-hosted central server.
#### Connecting to External Central Server
In the case that the central server and physics simulation is not located on the same machine, you can run the following instead:
```bash
cargo run -p physics_sim --release ws://ADDRESS:64209/ws
```

## Documentation
* [**Websocket**](./PAYLOAD.md) protocol for interacting with the concierge, the main method of data communication.
* [**File system**](./FILESYSTEM.md) protocol for transferring files between clients connected to the Concierge.
* [**Rust rundown**](./RUST.md) for future maintainers.