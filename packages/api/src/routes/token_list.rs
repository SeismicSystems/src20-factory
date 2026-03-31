use alloy::primitives::Address;
use alloy::sol;
use axum::Json;
use serde::Serialize;

use crate::seismic::client;

sol! {
    #[sol(rpc)]
    contract SRC20Factory {
        function getTokenCount() external view returns (uint256);
        function tokens(uint256 index) external view returns (address);
    }

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
pub struct TokenEntry {
    pub address: String,
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub owner: String,
    pub total_supply: String,
}

#[derive(Serialize)]
pub struct TokenListResponse {
    pub count: u64,
    pub tokens: Vec<TokenEntry>,
}

#[derive(Serialize)]
pub struct ErrorResponse {
    pub error: String,
}

pub async fn handler() -> Result<Json<TokenListResponse>, Json<ErrorResponse>> {
    let provider = client::create_public_provider()
        .await
        .map_err(|e| Json(ErrorResponse { error: format!("Provider error: {}", e) }))?;

    let factory_address = client::factory_address()
        .map_err(|e| Json(ErrorResponse { error: format!("Config error: {}", e) }))?;

    let factory = SRC20Factory::new(factory_address, &provider);

    let count: alloy::primitives::U256 = factory.getTokenCount().call().await
        .map_err(|e| Json(ErrorResponse { error: format!("Failed to get token count: {}", e) }))?;

    let count_u64 = count.to::<u64>();
    let mut tokens = Vec::with_capacity(count_u64 as usize);

    for i in 0..count_u64 {
        let addr: Address = factory.tokens(alloy::primitives::U256::from(i)).call().await
            .map_err(|e| Json(ErrorResponse { error: format!("Failed to get token at index {}: {}", i, e) }))?;

        let token = SRC20Token::new(addr, &provider);

        let name = token.name().call().await.unwrap_or_default();
        let symbol = token.symbol().call().await.unwrap_or_default();
        let decimals = token.decimals().call().await.unwrap_or_default();
        let owner = token.owner().call().await.unwrap_or(Address::ZERO);
        let total_supply = token.totalSupply().call().await.unwrap_or_default();

        tokens.push(TokenEntry {
            address: format!("{:?}", addr),
            name,
            symbol,
            decimals,
            owner: format!("{:?}", owner),
            total_supply: total_supply.to_string(),
        });
    }

    Ok(Json(TokenListResponse { count: count_u64, tokens }))
}
