//! This file manages the file server part of the Concierge.

use super::Concierge;
use anyhow::Result;
use hyper::Body;
use tokio::fs::File;
use tokio_util::codec::{BytesCodec, FramedRead};
use warp::http::Response;

pub struct FileReply(String, File);

impl FileReply {
    pub fn new(string: impl ToString, file: File) -> Self {
        Self(string.to_string(), file)
    }
}

impl warp::Reply for FileReply {
    fn into_response(self) -> warp::reply::Response {
        let stream = FramedRead::new(self.1, BytesCodec::new());
        let res = Response::builder()
            .header(
                "Content-Disposition",
                format!("attachment; filename=\"{}\"", self.0),
            )
            .body(Body::wrap_stream(stream))
            .unwrap();
        res
    }
}

pub async fn handle_file_request(_: &Concierge, string: String) -> Result<FileReply> {
    Ok(FileReply::new(
        "file.txt",
        File::open(format!("./{}", string)).await?,
    ))
}