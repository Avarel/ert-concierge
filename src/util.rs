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
