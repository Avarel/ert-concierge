# ERT Concierge
Websocket protocol for connecting multiple client types and facilitating transfer of information between specific clients.

## Running
* Install [**Rust 1.44.1 or above**](https://www.rust-lang.org/).
* Clone the repository.
* Execute `cargo run --release` in the terminal.

## Warning
The `tls/` folder represents example certificate and key for use with SSL (they are **very unsecure**), not for use in production.
This is currently disabled in the code. You must uncomment the relevant lines in [main.rs](./src/main.rs) to enable
TLS.

## Documentation
* [**Websocket**](./PAYLOAD.md) protocol for interacting with the concierge, the main method of data communication.
* [**File system**](./FILESYSTEM.md) protocol for transferring files between clients connected to the Concierge.
* [**Rust rundown**](./RUST.md) for future maintainers.