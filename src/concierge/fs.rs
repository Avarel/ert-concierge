//! This file manages the file server part of the Concierge.

use super::Concierge;
use anyhow::Result;
use anyhow::anyhow;
use futures::Stream;
use futures::StreamExt;
use hyper::{Body, StatusCode};
use log::{debug, warn};
use std::{ffi::OsStr, path::Path, collections::HashSet};
use tokio::fs::{File, OpenOptions};
use tokio::io::{AsyncWriteExt};
use tokio_util::codec::{BytesCodec, FramedRead};
use uuid::Uuid;
use warp::{Buf, reply::Response};

pub struct FileReply(String, File);

impl FileReply {
    pub fn new(string: impl ToString, file: File) -> Self {
        Self(string.to_string(), file)
    }
}

pub struct ConciergeFile {
    owner: Uuid,
    targets: Option<HashSet<Uuid>>,
}

impl warp::Reply for FileReply {
    fn into_response(self) -> Response {
        // Use frame read for maximum efficiency
        let stream = FramedRead::new(self.1, BytesCodec::new());
        let res = hyper::Response::builder()
            .header(
                "Content-Disposition",
                format!("attachment; filename=\"{}\"", self.0),
            )
            .body(Body::wrap_stream(stream))
            .unwrap();
        res
    }
}

pub async fn handle_file_get(_: &Concierge, auth: Uuid, string: &str) -> Result<FileReply> {
    let tail_path = Path::new(string);
    let file_path = Path::new(".").join("fs").join(tail_path);

    if let Some(file_name) = file_path.file_name().and_then(OsStr::to_str) {
        if !file_path.is_file() {
            return Err(anyhow!("Not found"))
        }

        return Ok(FileReply::new(
            file_name.to_owned(),
            File::open(file_path).await?,
        ))
    } 
    Err(anyhow!("Not found"))
}

pub async fn handle_file_delete(
    concierge: &Concierge,
    auth: Uuid,
    string: &str,
) -> Result<StatusCode> {
    debug!("Received delete request (auth: {}, path: {})", auth, string);
    if let Some(client) = concierge.clients.get(&auth) {
        // Make sure the path is ../fs/client_name/file_name.extension
        let tail_path = Path::new(string);
        if !tail_path.starts_with(Path::new(client.name())) {
            return Ok(StatusCode::FORBIDDEN);
        }

        //
        let file_path = Path::new(".").join("fs").join(tail_path);
        tokio::fs::remove_file(file_path).await?;

        Ok(StatusCode::OK)
    } else {
        Ok(StatusCode::UNAUTHORIZED)
    }
}

pub async fn handle_file_post(
    concierge: &Concierge,
    auth: Uuid,
    string: &str,
    mut stream: impl Stream<Item = Result<impl Buf, warp::Error>> + Unpin,
) -> Result<StatusCode> {
    debug!("Received upload request (auth: {}, path: {})", auth, string);
    if let Some(client) = concierge.clients.get(&auth) {
        // Make sure the path is ../fs/client_name/file_name.extension
        let tail_path = Path::new(string);
        if !tail_path.starts_with(Path::new(client.name())) {
            return Ok(StatusCode::BAD_REQUEST);
        }

        // Create the folder
        let file_path = Path::new(".").join("fs").join(tail_path);
        tokio::fs::create_dir_all(file_path.parent().unwrap()).await?;

        // Open the file
        let mut file = OpenOptions::new()
            .create(true)
            .write(true)
            .open(file_path)
            .await?;

        // Write the file as the data stream is coming through
        while let Some(chunk) = stream.next().await {
            let chunk = chunk?;
            file.write_all(chunk.bytes()).await?;
        }
        file.flush().await?;

        Ok(StatusCode::CREATED)
    } else {
        warn!("A connection attempt to upload without a valid uuid key");
        Ok(StatusCode::UNAUTHORIZED)
    }
}
