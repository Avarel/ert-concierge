# ERT / Concierge
Websocket protocol for connecting multiple client types and facilitating transfer of information between specific clients. The server is based upon [Rust](https://www.rust-lang.org/), [actix-web](https://actix.rs/) and [serde+serde_json](https://serde.rs/).

## Project Structure
* `./` **Root:** The Rust central server `ert-concierge` code is located at `src/`.
    * `./services/` **Services:** Contains code for various services that can be connected to the central server.
        * `./services/chat_service` **Chat service:** Python service that facilitates very simple chat functions.
        * `./services/planetary_sim` **Planetary simulation:** Python service that runs Alison Noyes's planetary simulation.
        * `./services/physics_sim` **Physics simulation:** Rust service that runs a physics simulation/game.
* `./concierge_api_rs` **Concierge API:** The working definition and serialization code (using `serde`) of the API as described in [this document](./PAYLOAD.md).
* `./babylonjs-web` **BabylonJS front-end:** The web front-end that uses BabylonJS for rendering 3D objects.
    * `./babylonjs-web/src` **Front-end source:** The front-end code is written using React and TypeScript, and managed using Webpack.
    * `./babylonjs-web/dist` **Front-end compiled code:** This is the code compiled using Webpack. For more information on compilation, see the [README.md](./babylonjs-web/README.md).

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
To access the front-end, you simply compile (see above) and launch the `index.html` file. Alternatively,
the front-end is also mounted at `/babylonjs` when the central server is running.
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
* [**Websocket**](./docs/SOCKET.md) protocol for interacting with the concierge, the main method of data communication.
* [**File system**](./docs/FILES.md) protocol for transferring files between clients connected to the Concierge.
* [**Rust rundown**](./docs/RUST.md) for future maintainers.