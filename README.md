# SRC20 Factory

Deploy a private SRC20 token on [Seismic](https://seismic.systems) in one command.

SRC20 is Seismic's private variant of ERC20 — balances, transfer amounts, and allowances are all encrypted on-chain using shielded types. The SRC20 Factory is a pre-deployed contract on Seismic testnet that deploys new SRC20 tokens without requiring a compiler or Foundry toolchain.

## Quick Start

### CLI (fastest)

```bash
bunx create-src20
```

Or non-interactive:

```bash
bunx create-src20 --name "My Token" --symbol "MTK" --supply 1000000 --key 0xYOUR_PRIVATE_KEY
```

### SDK (programmatic)

```typescript
import { createToken, getTokenInfo } from "@seismic/src20-sdk";
import { createShieldedWalletClient } from "seismic-viem";
import { privateKeyToAccount } from "viem/accounts";
import { http } from "viem";
import { seismicTestnet } from "seismic-viem/chain";

const client = await createShieldedWalletClient({
  chain: seismicTestnet,
  transport: http(),
  account: privateKeyToAccount("0xYOUR_PRIVATE_KEY"),
});

const { tokenAddress, txHash } = await createToken(client, {
  name: "My Token",
  symbol: "MTK",
  initialSupply: 1_000_000n,
});

console.log(`Token deployed at: ${tokenAddress}`);
```

### Web GUI

```bash
cd packages/web && bun dev
```

### Rust API

```bash
cd packages/api && cargo run

# POST /api/create-token
curl -X POST http://localhost:3001/api/create-token \
  -H "Content-Type: application/json" \
  -d '{"name":"My Token","symbol":"MTK","initial_supply":"1000000","private_key":"0x..."}'
```

## Architecture

| Package              | Description                                  |
| -------------------- | -------------------------------------------- |
| `packages/contracts` | Solidity factory + token contracts (sforge)  |
| `packages/sdk`       | `@seismic/src20-sdk` — shared TypeScript SDK |
| `packages/cli`       | `create-src20` — interactive CLI             |
| `packages/web`       | React GUI with wallet connect                |
| `packages/api`       | Rust API server (Axum + seismic-alloy)       |

## Development

Requires: [Bun](https://bun.sh), [sforge](https://docs.seismic.systems/getting-started/installation)

```bash
# Install dependencies
bun install

# Build and test contracts
cd packages/contracts
sforge build
sforge test -vv

# Build SDK + CLI
bun run build:sdk
bun run build:cli

# Run web GUI
bun run dev:web

# Run Rust API
cd packages/api && cargo run
```

## Testnet

- **RPC**: `https://gcp-2.seismictest.net/rpc`
- **Network details**: [docs.seismic.systems/networks/testnet](https://docs.seismic.systems/networks/testnet)

## License

AGPL-3.0
