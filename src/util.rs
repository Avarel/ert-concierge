use dashmap::{DashMap, ElementGuard};
use hyper::Body;
use std::hash::Hash;
use tokio::fs::File;
use tokio_util::codec::{BytesCodec, FramedRead};
use warp::http::Response;
use uuid::Uuid;

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

pub fn get_or_compute_group(map: &DashMap<String, DashMap<Uuid, ()>>, group: String) -> ElementGuard<String, DashMap<Uuid, ()>> {
    get_or_compute(map, group, DashMap::new)
}

pub fn get_or_compute<K: Hash + Eq + 'static, V: 'static>(
    map: &DashMap<K, V>,
    key: K,
    f: impl FnOnce() -> V,
) -> ElementGuard<K, V> {
    map.get(&key)
        .unwrap_or_else(|| map.insert_and_get(key, f()))
}