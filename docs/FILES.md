# File System
The file system is available to all clients connected to the concierge through
the websocket. File transfers are facilitated by regular HTTP requests.

All connecting clients are given their own `./fs/client_name/` folder that stores their files. The client folder is deleted when the connecting client disconnects from the server.

All HTTP requests to the server must have an `x-fs-key` header attached with a `uuid` value obtained sent from a `HELLO` [websocket payload](./PAYLOAD.md).

## Upload Files
* Create a `POST` HTTP request to `./fs/client_name/file.extension`.
    * Sub-folders are allowed, ie. `./fs/client_name/folder/../file.extension`
* The HTTP request must have an `x-fs-key` header with the UUID associated with `client_name`.
* The method of uploading is through multipart forms.
    * This uploading method is often used by browsers and for large files.
    * The concierge only supports uploading one file using multipart at the moment.

Upon success/completion of the data stream, the server will return a `201 CREATED` status code.

### JS Example (Browser-based Multipart Form)
```javascript
uploadForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let formData = new FormData(uploadForm);
    let baseUrl = new URL(window.location.href);
    baseUrl.port = "64209";
    
    let url = new URL(`/fs/${this.client.name}/system.json`, baseURL);
    let headers = new Headers();
    headers.append("x-fs-key", this.client.uuid);
    let response = await fetch(url.toString(), {
        method: 'POST',
        headers,
        body: formData,
    });
});
```

## Download Files
* Create `GET` HTTP request to `./fs/client_name/file.extension`.
    * Sub-folders are allowed, ie. `./fs/client_name/folder/../file.extension`.
* The HTTP request must have an `x-fs-key` header with the UUID associated with a client connected to the websocket, but not necessarily associated with `client_name`.

As long as the x-fs-key UUID is recognized, a `202 ACCEPTED` will
be returned and a byte stream will be opened. This byte stream can be used
to stream data to a local file.

### Rust Example
```rust
let client = reqwest::Client::new();
let res = client
    .get(&format!("http://127.0.0.1:8080/fs/{}/{}", name, file_name))
    .timeout(Duration::from_secs(1))
    .header("x-fs-key", uuid)
    .send()
    .await?;

println!("{}", res.status());

let file_path = Path::new(".").join("examples").join("test_download").join(name).join(file_name);

tokio::fs::create_dir_all(file_path.parent().unwrap()).await?;

let mut file = OpenOptions::new()
    .create(true)
    .write(true)
    .open(file_path)
    .await?;

let mut stream = res.bytes_stream();
// Write the file as the data stream is coming through
while let Some(chunk) = stream.next().await {
    let chunk = chunk?;
    file.write_all(chunk.bytes()).await?;
}
file.flush().await?;

println!("Done writing!");
```
## Delete Files
* Create a `DELETE` HTTP request to `./fs/client_name/file.extension`.The
    * Sub-folders are allowed, ie. `./fs/client_name/folder/../file.extension`
* The HTTP request must have an `x-fs-key` header with the UUID associated with `client_name`.

On success, the server will return a `200 OK` status code indicating that the
file has been deleted.

### Rust Example
```rust
let client = reqwest::Client::new();
let res = client
    .delete(&format!("http://127.0.0.1:8080/fs/{}/{}", name, file_name))
    .timeout(Duration::from_secs(1))
    .header("x-fs-key", uuid)
    .send()
    .await?;

println!("{} {:?}", res.status(), res.text().await);
```