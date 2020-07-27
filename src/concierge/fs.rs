//! This file manages the file server part of the Concierge.

use super::Concierge;
pub use error::FsError;
use log::debug;
use std::{ffi::OsStr, path::PathBuf};
use tokio::{
    fs::{File, OpenOptions},
    io::AsyncWriteExt,
    stream::StreamExt,
};
use tokio_util::codec::{BytesCodec, FramedRead};
use uuid::Uuid;
use warp::{
    hyper::{header, Body, Response, StatusCode},
    multipart::FormData,
    Buf, Reply,
};

mod error {
    use warp::{reject::Reject, Rejection};

    #[derive(thiserror::Error, Debug)]
    pub enum FsError {
        #[allow(dead_code)]
        #[error("Unknown file system error")]
        Unknown,
        #[error("Encoding error")]
        Encoding,
        #[error("Not a file")]
        NotAFile,
        #[error("Insufficient permission")]
        Forbidden,
        #[error("Bad authorization")]
        BadAuthorization,
        #[error("IO Error")]
        IoError(#[from] tokio::io::Error),
    }

    impl Reject for FsError {}

    impl FsError {
        pub fn rejection(self) -> Rejection {
            warp::reject::custom(self)
        }
    }
}

fn base_path(name: &str) -> PathBuf {
    let mut buf = PathBuf::new();
    buf.push(".");
    buf.push("fs");
    buf.push(name);
    buf
}

pub struct FsFileReply {
    file_name: String,
    file: File,
}

impl FsFileReply {
    pub fn new(string: impl ToString, file: File) -> Self {
        Self {
            file_name: string.to_string(),
            file,
        }
    }
}

impl warp::Reply for FsFileReply {
    fn into_response(self) -> Response<Body> {
        // FramedRead reads the file in chunks and reuses a buffer to save memory.
        let stream = FramedRead::new(self.file, BytesCodec::new());

        Response::builder()
            .status(StatusCode::ACCEPTED)
            .header(
                header::CONTENT_DISPOSITION.as_str(),
                format!("attachment; filename=\"{}\"", self.file_name),
            )
            .body(Body::wrap_stream(stream))
            .unwrap_or_else(|err| {
                // In case the header formatting is botched.
                let mut res = Response::new(Body::from(err.to_string()));
                *res.status_mut() = StatusCode::INTERNAL_SERVER_ERROR;
                res
            })
    }
}

pub async fn handle_file_get(
    concierge: &Concierge,
    name: String,
    auth: Uuid,
    tail: &str,
) -> Result<FsFileReply, FsError> {
    debug!(
        "Received GET request (name: {}, auth: {}, path: {})",
        name, auth, tail
    );
    let tail = sanitize_filename::sanitize(tail);

    // Check that the key is registered with the concierge.
    if !concierge.clients.read().await.contains_key(&auth) {
        return Err(FsError::BadAuthorization);
    }

    // Construct the file path.
    let file_path = base_path(&name).join(tail);

    // Check that the file path is legal.
    let file_name = file_path
        .file_name()
        .and_then(OsStr::to_str)
        .ok_or_else(|| FsError::Encoding)?;

    // Check that the file at the path is a file.
    if !file_path.is_file() {
        return Err(FsError::NotAFile);
    }

    // Make sure file exists.
    let file = File::open(&file_path).await?;

    Ok(FsFileReply::new(file_name.to_owned(), file))
}

pub async fn handle_file_delete(
    concierge: &Concierge,
    name: String,
    auth: Uuid,
    tail: &str,
) -> Result<impl Reply, FsError> {
    debug!(
        "Received DELETE request (name: {}, auth: {}, path: {})",
        name, auth, tail
    );
    let tail = sanitize_filename::sanitize(tail);

    // Check that a client with the auth UUID exists in the concierge.
    let clients = concierge.clients.read().await;
    let client = clients
        .get(&auth)
        .ok_or_else(|| FsError::BadAuthorization)?;

    if client.name() != name {
        return Err(FsError::Forbidden);
    }

    // Construct the path and remove the file.
    let file_path = base_path(&name).join(tail);
    tokio::fs::remove_file(file_path).await?;

    Ok(StatusCode::OK)
}

pub async fn handle_file_put(
    concierge: &Concierge,
    name: String,
    auth: Uuid,
    tail: &str,
    mut body: impl Buf,
) -> Result<impl Reply, FsError> {
    debug!(
        "Received upload request (name: {}, auth: {}, path: {})",
        name, auth, tail
    );
    let tail = sanitize_filename::sanitize(tail);

    // Check that a client with the auth UUID exists in the concierge.
    let clients = concierge.clients.read().await;
    let client = clients
        .get(&auth)
        .ok_or_else(|| FsError::BadAuthorization)?;

    if client.name() != name {
        return Err(FsError::Forbidden);
    }

    // Construct the path and create the directories recursively.
    let file_path = base_path(&name).join(tail);
    tokio::fs::create_dir_all(file_path.parent().unwrap()).await?;

    // Open the file.
    let mut file = OpenOptions::new()
        .create(true)
        .write(true)
        .open(file_path)
        .await?;
    file.set_len(0).await?;

    // Write the file as long as the body streams bytes.
    while body.has_remaining() {
        let bytes = body.bytes();
        file.write_all(bytes).await?;
        let n = bytes.len();
        body.advance(n);
    }

    Ok(StatusCode::CREATED)
}

pub async fn handle_file_put_multipart(
    concierge: &Concierge,
    name: String,
    auth: Uuid,
    tail: &str,
    mut data: FormData,
) -> Result<impl Reply, FsError> {
    debug!(
        "Received upload[multipart] request (name: {}, auth: {})",
        name, auth
    );
    let tail = sanitize_filename::sanitize(tail);

    // Check that a client with the auth UUID exists in the concierge.
    let clients = concierge.clients.read().await;
    let client = clients
        .get(&auth)
        .ok_or_else(|| FsError::BadAuthorization)?;

    if client.name() != name {
        return Err(FsError::Forbidden);
    }


    // Construct the path and create the directories recursively.
    let file_path = base_path(&name).join(tail);
    tokio::fs::create_dir_all(file_path.parent().unwrap()).await?;

    // Open the file.
    let mut file = OpenOptions::new()
        .create(true)
        .write(true)
        .open(file_path)
        .await?;
    file.set_len(0).await?;

    let mut file_name = None;
    while let Some(Ok(mut part)) = data.next().await {
        // Check that all parts are part of one file. The file name must
        // be consistent with the first part uploaded, else it will be ignored.
        if let Some(name) = part.filename() {
            if file_name.is_none() {
                file_name = Some(name.to_owned());
            } else if name != file_name.as_ref().unwrap() {
                continue;
            }
        } else if file_name.is_some() {
            // ignore part if filename has been set, but the part has no filename.
            continue;
        }

        if let Some(Ok(buf)) = part.data().await {
            file.write_all(buf.bytes()).await.unwrap();
        }
    }

    Ok(StatusCode::CREATED)
}
