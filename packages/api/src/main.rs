mod routes;
mod seismic;

use axum::{routing::get, Router};
use tower_http::cors::CorsLayer;
use tracing_subscriber;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();

    let app = Router::new()
        .route("/api/tokens", get(routes::token_list::handler))
        .route("/api/token/{address}", get(routes::token_info::handler))
        .layer(CorsLayer::permissive());

    let addr = "0.0.0.0:3001";
    tracing::info!("SRC20 API listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
