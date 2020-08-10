use actix_web::{web, HttpRequest, Responder};

pub async fn get(path: web::Path<(String, String)>, req: HttpRequest) -> impl Responder {
    let thing = req.headers().get(crate::FS_KEY_HEADER);
    // let string = req.match_info().get("wow").unwrap();
    format!("{} {} {:?}", path.0, path.1, thing)
}