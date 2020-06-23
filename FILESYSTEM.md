# File System
The file system is available to all clients connected to the concierge through
the websocket. File transfers are facilitated by regular HTTP requests.

All connecting clients are given their own `./fs/client_name/` folder that stores
their files. The client folder is deleted when the connecting client disconnects
from the server.

All HTTP requests to the server must have an `Authorization` header attached with a `uuid` value.

## Upload Files
To upload a file, simply make a `PUT` HTTP request to `./fs/client_name/file.extension`
(sub-folders are allowed) and stream data to the response. The `client_name` must match
the name associated with the `uuid` returned from a `HELLO` payload from the concierge. On success, the server will return a `201 CREATED` status code.

### Rust Example
This is an example of uploading afile using Rust, adapted from the [Rust file server client](./examples/fs_client.rs).

```rust
    let file = File::open(Path::new(".").join(file_name)).await?;
    
    let stream = FramedRead::new(file, BytesCodec::new());
    let client = reqwest::Client::new();
    let res = client
        .put(&format!("http://127.0.0.1:8080/fs/{}/{}", name, file_name))
        .timeout(Duration::from_secs(1))
        .header("Authorization", uuid)
        .body(Body::wrap_stream(stream))
        .send()
        .await?;

    println!("{} {:?}", res.status(), res.text().await);
    Ok(())
```

## Download Files
To download a file, simply make a `GET` HTTP request to `./fs/client_name/file.extension`
and handle the incoming stream of bytes. Connecting clients can download files uploaded
by any `client_name`. As long as the authorization UUID is correct, a `202 ACCEPTED` will
be returned and a byte stream will be opened.

### Rust Example
```rust
    let client = reqwest::Client::new();
    let res = client
        .get(&format!("http://127.0.0.1:8080/fs/{}/{}", name, file_name))
        .timeout(Duration::from_secs(1))
        .header("Authorization", uuid)
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
To delete a file, make a `DELETE` HTTP request to `./fs/client_name/file.extension`. The `client_name` must match the name associated with the `uuid` returned from a `HELLO` payload from the concierge. On success, the server will return a `200 OK` status code.

### Rust Example
```rust
    let client = reqwest::Client::new();
    let res = client
        .delete(&format!("http://127.0.0.1:8080/fs/{}/{}", name, file_name))
        .timeout(Duration::from_secs(1))
        .header("Authorization", uuid)
        .send()
        .await?;

    println!("{} {:?}", res.status(), res.text().await);
```