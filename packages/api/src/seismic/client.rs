use alloy::primitives::Address;
use alloy::providers::ProviderBuilder;
use anyhow::{Context, Result};

const RPC_URL: &str = "https://gcp-2.seismictest.net/rpc";

const FACTORY_ADDRESS: &str = "0x87F850cbC2cFfac086F20d0d7307E12d06fA2127";

pub fn factory_address() -> Result<Address> {
    let addr: Address = FACTORY_ADDRESS.parse()
        .context("Invalid factory address")?;
    if addr == Address::ZERO {
        anyhow::bail!("Factory address not yet configured. Deploy the factory and update client.rs.");
    }
    Ok(addr)
}

/// Create a read-only provider for view calls (no signing needed).
pub async fn create_public_provider() -> Result<impl alloy::providers::Provider + Clone> {
    let provider = ProviderBuilder::new()
        .connect_http(RPC_URL.parse()?);
    Ok(provider)
}
