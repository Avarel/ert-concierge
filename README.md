# Concierge
Websocket protocol for connecting multiple client types and facilitating transfer of information between specific clients.

## Running
* Install [**Rust 1.44.1 or above**](https://www.rust-lang.org/).
* `cd concierge/` to the project root.
* Execute `cargo run --release` in the terminal.

## Documentation
* [**Websocket**](./PAYLOAD.md) protocol for interacting with the concierge, the main method of data communication.
* [**File system**](./FILESYSTEM.md) protocol for transferring files between clients connected to the Concierge.