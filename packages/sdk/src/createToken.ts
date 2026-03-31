import type { Account, Address, Chain, Hash, Transport } from "viem";
import { decodeEventLog } from "viem";
import type { ShieldedWalletClient } from "seismic-viem";
import { shieldedWriteContract } from "seismic-viem";
import { SRC20FactoryAbi } from "./abi.js";
import { getFactoryAddress } from "./addresses.js";

export interface CreateTokenParams {
  name: string;
  symbol: string;
  decimals?: number;
  initialSupply: bigint;
}

export interface CreateTokenResult {
  tokenAddress: Address;
  txHash: Hash;
}

export async function createToken<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account = Account,
>(
  client: ShieldedWalletClient<TTransport, TChain, TAccount>,
  params: CreateTokenParams,
): Promise<CreateTokenResult> {
  const chainId = client.chain?.id;
  if (!chainId) {
    throw new Error("Client must have a chain configured");
  }

  const factoryAddress = getFactoryAddress(chainId);
  const decimals = params.decimals ?? 18;

  const txHash = await shieldedWriteContract(client, {
    address: factoryAddress,
    abi: SRC20FactoryAbi,
    functionName: "createToken",
    args: [params.name, params.symbol, decimals, params.initialSupply],
    chain: client.chain,
  } as any);

  const receipt = await client.waitForTransactionReceipt({ hash: txHash });

  // Parse TokenCreated event from logs
  for (const log of receipt.logs) {
    try {
      const event = decodeEventLog({
        abi: SRC20FactoryAbi,
        data: log.data,
        topics: log.topics,
      });
      if (event.eventName === "TokenCreated") {
        return {
          tokenAddress: event.args.token,
          txHash,
        };
      }
    } catch {
      // Not a TokenCreated event, skip
    }
  }

  throw new Error("TokenCreated event not found in transaction receipt");
}
