use crate::concierge::{Concierge, QueryUuid};
use actix::prelude::*;
use actix_files::NamedFile;
use actix_multipart::Multipart;
use actix_web::{
    http::{
        header::{ContentDisposition, DispositionType},
        StatusCode,
    },
    web, Error, HttpRequest, HttpResponse, Responder, ResponseError,
};
use futures::{StreamExt, TryStreamExt};
use std::io::Write;
use std::{ffi::OsStr, path::PathBuf};
use uuid::Uuid;

pub const FS_KEY_HEADER: &str = "x-fs-key";

#[derive(thiserror::Error, Debug)]
pub enum FsError {
    #[allow(dead_code)]
    #[error("Unknown file system error")]
    Unknown,
    #[error("Encoding error")]
    Encoding,
    #[error("Insufficient permission")]
    Forbidden,
    #[error("Bad authorization")]
    BadAuthorization,
    #[error("Missing x-fs-key header")]
    MissingAuthorization,
}

impl ResponseError for FsError {
    fn status_code(&self) -> StatusCode {
        match self {
            FsError::Unknown => StatusCode::INTERNAL_SERVER_ERROR,
            FsError::Encoding => StatusCode::EXPECTATION_FAILED,
            FsError::Forbidden => StatusCode::FORBIDDEN,
            FsError::BadAuthorization | FsError::MissingAuthorization => StatusCode::UNAUTHORIZED,
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

pub async fn get(
    path: web::Path<(String, String)>,
    req: HttpRequest,
    srv: web::Data<Addr<Concierge>>,
) -> Result<impl Responder, Error> {
    let uuid = req
        .headers()
        .get(FS_KEY_HEADER)
        .ok_or(FsError::MissingAuthorization)?
        .to_str()
        .map_err(|_| FsError::Encoding)?
        .parse()
        .map_err(|_| FsError::Encoding)?;

    let query = srv.send(QueryUuid { uuid }).await.unwrap().is_some();

    if !query {
        return Err(FsError::BadAuthorization)?;
    }

    let name = &path.0;
    let tail = sanitize_filename::sanitize(&path.1);

    // Construct the file path.
    let file_path = base_path(&name).join(tail);
    let file = NamedFile::open(file_path)?;

    Ok(file
        .use_last_modified(true)
        .set_content_disposition(ContentDisposition {
            disposition: DispositionType::Attachment,
            parameters: vec![],
        }))
}

pub async fn multipart_upload(
    path: web::Path<(String, String)>,
    req: HttpRequest,
    srv: web::Data<Addr<Concierge>>,
    mut payload: Multipart,
) -> Result<impl Responder, Error> {
    let name = path.0.to_string();
    let tail = sanitize_filename::sanitize(&path.1);

    let uuid = req
        .headers()
        .get(FS_KEY_HEADER)
        .ok_or(FsError::MissingAuthorization)?
        .to_str()
        .map_err(|_| FsError::Encoding)?
        .parse()
        .map_err(|_| FsError::Encoding)?;

    let query: Option<String> = srv.send(QueryUuid { uuid }).await.unwrap();

    let client_name = query.ok_or(FsError::BadAuthorization)?;
    if client_name != name {
        return Err(FsError::Forbidden)?;
    }

    // iterate over multipart stream
    while let Ok(Some(mut field)) = payload.try_next().await {
        let name = name.clone();
        let base_path = base_path(&name);
        let file_path = base_path.join(&tail);

        // File::create is blocking operation, use threadpool
        let mut f = web::block(move || {
            std::fs::create_dir_all(base_path)?;
            std::fs::File::create(file_path)
        }).await?;
        // Field in turn is stream of *Bytes* object
        while let Some(chunk) = field.next().await {
            let data = chunk.unwrap();
            // filesystem operations are blocking, we have to use threadpool
            f = web::block(move || f.write_all(&data).map(|_| f)).await?;
        }
    }

    Ok(HttpResponse::Created())
}

pub async fn delete(
    path: web::Path<(String, String)>,
    req: HttpRequest,
    srv: web::Data<Addr<Concierge>>,
) -> Result<impl Responder, Error> {
    let name = &path.0;
    let tail = sanitize_filename::sanitize(&path.1);

    let uuid = req
        .headers()
        .get(FS_KEY_HEADER)
        .ok_or(FsError::MissingAuthorization)?
        .to_str()
        .map_err(|_| FsError::Encoding)?
        .parse()
        .map_err(|_| FsError::Encoding)?;

    let query: Option<String> = srv.send(QueryUuid { uuid }).await.unwrap();

    let client_name = query.ok_or(FsError::BadAuthorization)?;
    if &client_name != name {
        return Err(FsError::Forbidden)?;
    }

    let file_path = base_path(&name).join(tail);

    web::block(|| std::fs::remove_file(file_path)).await?;

    Ok(HttpResponse::Ok())
}
