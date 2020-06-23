use anyhow::Result;
use std::{time::Duration, path::Path};
use tokio_util::codec::{BytesCodec, FramedRead};
use futures::StreamExt;
use tokio::{fs::{OpenOptions, File}, io::{AsyncWriteExt, AsyncBufReadExt, BufReader}};
use warp::Buf;
use reqwest::Body;

#[tokio::main]
async fn main() -> Result<()> {
    let mut stdin = BufReader::new(tokio::io::stdin());

    println!("Insert name:");
    let mut name = String::new();
    stdin.read_line(&mut name).await?;

    println!("Insert UUID:");
    let mut uuid = String::new();
    stdin.read_line(&mut uuid).await?;

    loop {
        let mut input = String::new();
        stdin.read_line(&mut input).await?;
        let args = input.split(' ').map(|s| s.trim()).collect::<Vec<_>>();

        if let Some(&cmd) = args.get(0) {
            match cmd {
                "upload" => {
                    if let Some(&file_name) = args.get(1) {
                        upload(uuid.trim(), name.trim(), file_name).await?;
                    } else {
                        eprintln!("Expected 1 more argument");
                    }
                }
                "download" => {
                    if let Some(&file_name) = args.get(1) {
                        download(uuid.trim(), name.trim(), file_name).await?;
                    } else {
                        eprintln!("Expected 1 more argument");
                    }
                }
                "delete" => {
                    if let Some(&file_name) = args.get(1) {
                        delete(uuid.trim(), name.trim(), file_name).await?;
                    } else {
                        eprintln!("Expected 1 more argument");
                    }
                }
                "stop" => break,
                _ => {
                    eprintln!("Unknown cmd")
                }
            }
        }
    }

    tokio::fs::remove_dir_all(Path::new(".").join("examples").join("test_download")).await?;

    Ok(())
}

async fn download(uuid: &str, name: &str, file_name: &str) -> Result<()> {
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


    Ok(())
}

async fn delete(uuid: &str, name: &str, file_name: &str) -> Result<()> {
    let client = reqwest::Client::new();
    let res = client
        .delete(&format!("http://127.0.0.1:8080/fs/{}/{}", name, file_name))
        .timeout(Duration::from_secs(1))
        .header("Authorization", uuid)
        .send()
        .await?;

    println!("{} {:?}", res.status(), res.text().await);
    Ok(())
}

async fn upload(uuid: &str, name: &str, file_name: &str) -> Result<()> {
    let file = File::open(Path::new(".").join(file_name)).await?;
    
    let stream = FramedRead::new(file, BytesCodec::new());
    let client = reqwest::Client::new();
    let res = client
        .post(&format!("http://127.0.0.1:8080/fs/{}/{}", name, file_name))
        .timeout(Duration::from_secs(1))
        .header("Authorization", uuid)
        .body(Body::wrap_stream(stream))
        .send()
        .await?;

    println!("{} {:?}", res.status(), res.text().await);
    Ok(())
}