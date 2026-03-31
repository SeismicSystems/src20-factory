# SRC20 Factory

Deploy an SRC20 token in one command on Seismic. Pre-deployed factory contract on testnet that any developer can call to spin up a new private SRC20 token — no compiler, no sforge, no repo cloning required.

## Package Manager

**Bun exclusively** — no npm, no yarn, no pnpm. All commands use `bun install`, `bun run`, `bunx`.

## Architecture

```
packages/
  contracts/   Solidity — SRC20Token.sol + SRC20Factory.sol (compiled with sforge)
  sdk/         @seismic/src20-sdk — shared TypeScript SDK (seismic-viem)
  cli/         create-src20 — interactive CLI (bunx create-src20)
  web/         React GUI — wallet connect + deploy form (seismic-react)
  api/         Rust API — Axum server (seismic-alloy)
```

## Build

```bash
# Contracts
cd packages/contracts && sforge build && sforge test -vv

# TypeScript packages
bun install
bun run build:sdk
bun run build:cli
bun run dev:web

# Rust API
cd packages/api && cargo build
```

## Key Design Decisions

- Factory deploys full SRC20Token instances (not EIP-1167 clones) because SRC20 uses immutable fields for decimals and EIP-2612 domain separator
- SRC20Token inherits from the canonical seismic-std-lib SRC20.sol — do NOT modify the base contract
- All tokens get encrypted events automatically (Intelligence + Directory integration baked into base SRC20)
- Testnet only (RPC: https://gcp-1.seismictest.net/rpc)
- Default 18 decimals in CLI; API exposes decimals as option

## Seismic-Specific

- `sforge` / `ssolc` — Seismic's Foundry fork (NOT `forge`)
- Shielded types: `suint256`, `saddress`, `sbool` — encrypted on-chain
- seismic-viem: `createShieldedWalletClient`, `getShieldedContract`
- seismic-alloy: `SeismicSignedProvider` for Rust
- System contracts: Directory (`0x1000...0004`), Intelligence (`0x1000...0005`)
