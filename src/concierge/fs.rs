//! This file manages the file server part of the Concierge.

use super::Concierge;
pub use error::FsError;
use log::debug;
use std::{ffi::OsStr, path::Path};
use tokio::{
    fs::{File, OpenOptions},
    io::AsyncWriteExt,
};
use tokio_util::codec::{BytesCodec, FramedRead};
use uuid::Uuid;
use warp::{
    hyper::{Body, Response, StatusCode},
    Buf,
};

mod error {
    use warp::{reject::Reject, Rejection};

    #[derive(Debug, Copy, Clone)]
    pub enum FsError {
        Unknown,
        Encoding,
        FileNotFound,
        IoError,
        NotAFile,
        Forbidden,
        BadAuthorization,
    }

    impl Reject for FsError {}

    impl FsError {
        pub fn rejection(self) -> Rejection {
            warp::reject::custom(self)
        }
    }
}

/// Base path of the file system.
macro_rules! base_path {
    () => {
        Path::new(".").join("fs")
    };
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
                "Content-Disposition",
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
    auth: Uuid,
    string: &str,
) -> Result<FsFileReply, FsError> {
    debug!("Received GET request (auth: {}, path: {})", auth, string);

    // Check that the key is registered with the concierge.
    if !concierge.clients.read().await.contains_key(&auth) {
        return Err(FsError::BadAuthorization);
    }

    // Construct the file path.
    let tail_path = Path::new(string);
    let file_path = base_path!().join(tail_path);

    // Check that the file path is legal.
    let file_name = file_path
        .file_name()
        .and_then(OsStr::to_str)
        .ok_or_else(|| FsError::Encoding)?;

    // Check that the file at the path is a file.
    if file_path.is_file() {
        return Err(FsError::NotAFile);
    }

    // Make sure file exists.
    let file = File::open(&file_path)
        .await
        .map_err(|_| FsError::FileNotFound)?;

    Ok(FsFileReply::new(file_name.to_owned(), file))
}

pub async fn handle_file_delete(
    concierge: &Concierge,
    auth: Uuid,
    string: &str,
) -> Result<StatusCode, FsError> {
    debug!("Received delete request (auth: {}, path: {})", auth, string);

    // Check that a client with the auth UUID exists in the concierge.
    let clients = concierge.clients.read().await;
    let client = clients
        .get(&auth)
        .ok_or_else(|| FsError::BadAuthorization)?;

    // Check that the client has access to the path.
    let tail_path = Path::new(string);
    if !tail_path.starts_with(Path::new(client.name())) {
        return Err(FsError::Forbidden);
    }

    // Construct the path and remove the file.
    let file_path = base_path!().join(tail_path);
    tokio::fs::remove_file(file_path)
        .await
        .map_err(|_| FsError::FileNotFound)?;

    Ok(StatusCode::OK)
}

pub async fn handle_file_put(
    concierge: &Concierge,
    auth: Uuid,
    string: &str,
    mut body: impl Buf,
) -> Result<StatusCode, FsError> {
    debug!("Received upload request (auth: {}, path: {})", auth, string);

    // Check that a client with the auth UUID exists in the concierge.
    let clients = concierge.clients.read().await;
    let client = clients
        .get(&auth)
        .ok_or_else(|| FsError::BadAuthorization)?;

    // Check that the client has access to the path.
    let tail_path = Path::new(string);
    if !tail_path.starts_with(Path::new(client.name())) {
        return Err(FsError::Forbidden);
    }

    // Construct the path and create the directories recursively.
    let file_path = base_path!().join(tail_path);
    tokio::fs::create_dir_all(file_path.parent().unwrap())
        .await
        .map_err(|_| FsError::Unknown)?;

    // Open the file.
    let mut file = OpenOptions::new()
        .create(true)
        .write(true)
        .open(file_path)
        .await
        .map_err(|_| FsError::FileNotFound)?;

    // Write the file as long as the body streams bytes.
    while body.has_remaining() {
        let bytes = body.bytes();
        file.write_all(body.bytes())
            .await
            .map_err(|_| FsError::IoError)?;
        let n = bytes.len();
        body.advance(n);
    }

    Ok(StatusCode::CREATED)
}
