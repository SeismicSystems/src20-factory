use alloy::primitives::Address;
use alloy::sol;
use axum::extract::Path;
use axum::Json;
use serde::Serialize;

use crate::seismic::client;

sol! {
    #[sol(rpc)]
    contract SRC20Token {
        function name() external view returns (string);
        function symbol() external view returns (string);
        function decimals() external view returns (uint8);
        function owner() external view returns (address);
        function totalSupply() external view returns (uint256);
    }
}

#[derive(Serialize)]
pub struct TokenInfoResponse {
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub owner: String,
    pub total_supply: String,
}

#[derive(Serialize)]
pub struct ErrorResponse {
    pub error: String,
}

pub async fn handler(
    Path(address): Path<String>,
) -> Result<Json<TokenInfoResponse>, Json<ErrorResponse>> {
    let token_address: Address = address.parse()
        .map_err(|e| Json(ErrorResponse { error: format!("Invalid address: {}", e) }))?;

    let provider = client::create_public_provider()
        .await
        .map_err(|e| Json(ErrorResponse { error: format!("Provider error: {}", e) }))?;

    let token = SRC20Token::new(token_address, &provider);

    let name = token.name().call().await
        .map_err(|e| Json(ErrorResponse { error: format!("Failed to read name: {}", e) }))?;
    let symbol = token.symbol().call().await
        .map_err(|e| Json(ErrorResponse { error: format!("Failed to read symbol: {}", e) }))?;
    let decimals = token.decimals().call().await
        .map_err(|e| Json(ErrorResponse { error: format!("Failed to read decimals: {}", e) }))?;
    let owner = token.owner().call().await
        .map_err(|e| Json(ErrorResponse { error: format!("Failed to read owner: {}", e) }))?;
    let total_supply = token.totalSupply().call().await
        .map_err(|e| Json(ErrorResponse { error: format!("Failed to read supply: {}", e) }))?;

    Ok(Json(TokenInfoResponse {
        name,
        symbol,
        decimals,
        owner: format!("{:?}", owner),
        total_supply: total_supply.to_string(),
    }))
}
