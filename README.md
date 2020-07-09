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
```
### Physics Simulation
```bash
cargo run -p physics_sim --release  
```
The physics simulation should only be ran after the central server has been launched. This will connect the physics simulation to a locally-hosted central server.
#### Connecting to External Central Server
In the case that the central server and physics simulation is not located on the same machine, you can run the following instead:
```bash
cargo run -p physics_sim --release ws://ADDRESS:64209/ws
```

## Warning
The `tls/` folder represents example certificate and key for use with SSL (they are **very unsecure**), not for use in production.
This is currently disabled in the code. You must uncomment the relevant lines in [main.rs](./src/main.rs) to enable
TLS.

## Documentation
* [**Websocket**](./PAYLOAD.md) protocol for interacting with the concierge, the main method of data communication.
* [**File system**](./FILESYSTEM.md) protocol for transferring files between clients connected to the Concierge.
* [**Rust rundown**](./RUST.md) for future maintainers.