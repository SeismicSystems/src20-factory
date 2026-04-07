import prompts from "prompts";
import pc from "picocolors";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { privateKeyToAccount } from "viem/accounts";
import { http } from "viem";
import { createShieldedWalletClient, seismicTestnet } from "seismic-viem";
import { createToken } from "./createToken.js";

interface CliArgs {
  name?: string;
  symbol?: string;
  supply?: string;
  key?: string;
  rpc?: string;
}

function parseArgs(): CliArgs {
  const argv = yargs(hideBin(process.argv))
    .option("name", {
      type: "string",
      description: "Token name",
    })
    .option("symbol", {
      type: "string",
      description: "Token symbol",
    })
    .option("supply", {
      type: "string",
      description: "Initial supply (in whole tokens, e.g. 1000000)",
    })
    .option("key", {
      type: "string",
      description: "Private key (hex)",
    })
    .option("rpc", {
      type: "string",
      description: "Custom RPC URL",
    })
    .help()
    .parseSync();

  return argv as CliArgs;
}

function formatSupply(supply: bigint, decimals: number): string {
  const whole = supply / BigInt(10 ** decimals);
  return whole.toLocaleString();
}

export async function main() {
  console.log();
  console.log(pc.cyan(pc.bold("  Create SRC20 Token on Seismic")));
  console.log();

  const args = parseArgs();

  // Collect any missing params interactively
  const questions: prompts.PromptObject[] = [];

  if (!args.name) {
    questions.push({
      type: "text",
      name: "name",
      message: "Token name",
      validate: (v: string) => (v.trim() ? true : "Name is required"),
    });
  }

  if (!args.symbol) {
    questions.push({
      type: "text",
      name: "symbol",
      message: "Token symbol",
      validate: (v: string) => (v.trim() ? true : "Symbol is required"),
    });
  }

  if (!args.supply) {
    questions.push({
      type: "text",
      name: "supply",
      message: "Initial supply (whole tokens)",
      initial: "1000000",
      validate: (v: string) => {
        const n = Number(v);
        return !isNaN(n) && n >= 0 ? true : "Must be a non-negative number";
      },
    });
  }

  if (!args.key) {
    questions.push({
      type: "password",
      name: "key",
      message: "Private key",
      validate: (v: string) =>
        /^0x[0-9a-fA-F]{64}$/.test(v)
          ? true
          : "Must be a 0x-prefixed 64-char hex string",
    });
  }

  const answers =
    questions.length > 0
      ? await prompts(questions, { onCancel: () => process.exit(0) })
      : {};

  const tokenName = args.name || answers.name;
  const tokenSymbol = args.symbol || answers.symbol;
  const supplyStr = args.supply || answers.supply || "1000000";
  const privateKey = args.key || answers.key;

  if (!tokenName || !tokenSymbol || !privateKey) {
    console.error(pc.red("Missing required parameters."));
    process.exit(1);
  }

  const decimals = 18;
  const initialSupply = BigInt(supplyStr) * BigInt(10 ** decimals);

  console.log();
  console.log(pc.dim("  Deploying to Seismic testnet..."));
  console.log();

  const account = privateKeyToAccount(privateKey as `0x${string}`);

  const rpcUrl = args.rpc || "https://gcp-2.seismictest.net/rpc";
  const client = await createShieldedWalletClient({
    chain: seismicTestnet,
    transport: http(rpcUrl),
    account,
  });

  const result = await createToken(client, {
    name: tokenName,
    symbol: tokenSymbol,
    initialSupply,
  });

  console.log(pc.green(pc.bold("  Token deployed!")));
  console.log();
  console.log(`  ${pc.dim("Address:")}  ${result.tokenAddress}`);
  console.log(`  ${pc.dim("Name:")}     ${tokenName}`);
  console.log(`  ${pc.dim("Symbol:")}   ${tokenSymbol}`);
  console.log(
    `  ${pc.dim("Supply:")}   ${formatSupply(initialSupply, decimals)}`,
  );
  console.log(`  ${pc.dim("Owner:")}    ${account.address}`);
  console.log(`  ${pc.dim("Tx:")}       ${result.txHash}`);
  console.log(
    `  ${pc.dim("Explorer:")} https://seismic-testnet.socialscan.io/address/${result.tokenAddress}`,
  );
  console.log();
}
