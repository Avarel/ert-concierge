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
use std::{collections::HashSet, fs::OpenOptions, path::PathBuf, str::FromStr};

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
    #[error("Attempted to upload multi-file to single-file multipart route")]
    MultiFileInSingleRoute,
    #[error("Content disposition missing")]
    ContentDispositionMissing,
    #[error("Content disposition exist but file name field does not")]
    ContentDispositionFileNameMissing,
}

impl ResponseError for FsError {
    fn status_code(&self) -> StatusCode {
        use FsError::*;
        match self {
            Unknown => StatusCode::INTERNAL_SERVER_ERROR,
            Encoding => StatusCode::EXPECTATION_FAILED,
            Forbidden => StatusCode::FORBIDDEN,
            BadAuthorization => StatusCode::UNAUTHORIZED,
            MultiFileInSingleRoute => StatusCode::PRECONDITION_FAILED,
            MissingAuthorization
            | ContentDispositionMissing
            | ContentDispositionFileNameMissing => StatusCode::PRECONDITION_REQUIRED,
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
    let uuid = extract_header(&req)?;

    let query = srv.send(QueryUuid { uuid }).await.unwrap().is_some();

    if !query {
        return Err(FsError::BadAuthorization.into());
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

pub async fn multipart_upload_single(
    path: web::Path<(String, String)>,
    req: HttpRequest,
    srv: web::Data<Addr<Concierge>>,
    mut payload: Multipart,
) -> Result<impl Responder, Error> {
    let name = path.0.to_string();
    let tail = sanitize_filename::sanitize(&path.1);

    let uuid = extract_header(&req)?;

    let query: Option<String> = srv.send(QueryUuid { uuid }).await.unwrap();

    let client_name = query.ok_or(FsError::BadAuthorization)?;
    if client_name != name {
        return Err(FsError::Forbidden.into());
    }

    let base_path = base_path(&name);
    let file_path = base_path.join(&tail);

    // Submit blocking operations to threadpool
    let file_path_clone = file_path.clone();
    let mut f = web::block(move || {
        std::fs::create_dir_all(base_path)?;
        std::fs::File::create(file_path_clone)
    })
    .await?;

    let (mut flag, mut field_fname) = (true, None);

    // iterate over multipart stream
    while let Ok(Some(mut field)) = payload.try_next().await {
        if flag {
            // first field dictates how all other fields should be
            field_fname = field
                .content_disposition()
                .and_then(|c| c.get_filename().map(|s| s.to_string()));
            flag = false;
        } else {
            // every other field must be of the same file type
            if field_fname
                != field
                    .content_disposition()
                    .and_then(|c| c.get_filename().map(|s| s.to_string()))
            {
                web::block(move || std::fs::remove_file(file_path)).await?;
                return Err(FsError::MultiFileInSingleRoute.into());
            }
        }

        while let Some(chunk) = field.next().await {
            let data = chunk.unwrap();
            // filesystem operations are blocking, we have to use threadpool
            f = web::block(move || f.write_all(&data).map(|_| f)).await?;
        }
    }

    Ok(HttpResponse::Created())
}

pub fn extract_header<T: FromStr>(req: &HttpRequest) -> Result<T, FsError> {
    req
        .headers()
        .get(FS_KEY_HEADER)
        .ok_or(FsError::MissingAuthorization)?
        .to_str()
        .map_err(|_| FsError::Encoding)?
        .parse()
        .map_err(|_| FsError::Encoding)
}

pub async fn multipart_upload_multi(
    path: web::Path<String>,
    req: HttpRequest,
    srv: web::Data<Addr<Concierge>>,
    mut payload: Multipart,
) -> Result<impl Responder, Error> {
    let name = path.to_string();

    let uuid = extract_header(&req)?;

    let query: Option<String> = srv.send(QueryUuid { uuid }).await.unwrap();

    let client_name = query.ok_or(FsError::BadAuthorization)?;
    if client_name != name {
        return Err(FsError::Forbidden.into());
    }

    let mut file_list = HashSet::new();

    // iterate over multipart stream
    while let Ok(Some(mut field)) = payload.try_next().await {
        let content_disposition = field
            .content_disposition()
            .ok_or(FsError::ContentDispositionMissing)?;
        let file_name = content_disposition
            .get_filename()
            .ok_or(FsError::ContentDispositionFileNameMissing)?;

        let file_path = base_path(&name).join(sanitize_filename::sanitize(&file_name));

        let mut f = if file_list.contains(file_name) {
            web::block(|| OpenOptions::new().append(true).open(file_path)).await
        } else {
            file_list.insert(file_name.to_string());
            web::block(|| {
                OpenOptions::new()
                    .write(true)
                    .create(true)
                    .truncate(true)
                    .open(file_path)
            })
            .await
        }?;

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
        return Err(FsError::Forbidden.into());
    }

    let file_path = base_path(&name).join(tail);

    web::block(|| std::fs::remove_file(file_path)).await?;

    Ok(HttpResponse::Ok())
}
