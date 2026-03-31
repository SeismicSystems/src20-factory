import type { Address, PublicClient } from "viem";
import { SRC20TokenAbi } from "./abi.js";

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  owner: Address;
  totalSupply: bigint;
}

export async function getTokenInfo(
  client: PublicClient,
  tokenAddress: Address,
): Promise<TokenInfo> {
  const [name, symbol, decimals, owner, totalSupply] = await Promise.all([
    client.readContract({
      address: tokenAddress,
      abi: SRC20TokenAbi,
      functionName: "name",
    }),
    client.readContract({
      address: tokenAddress,
      abi: SRC20TokenAbi,
      functionName: "symbol",
    }),
    client.readContract({
      address: tokenAddress,
      abi: SRC20TokenAbi,
      functionName: "decimals",
    }),
    client.readContract({
      address: tokenAddress,
      abi: SRC20TokenAbi,
      functionName: "owner",
    }),
    client.readContract({
      address: tokenAddress,
      abi: SRC20TokenAbi,
      functionName: "totalSupply",
    }),
  ]);

  return {
    name: name as string,
    symbol: symbol as string,
    decimals: Number(decimals),
    owner: owner as Address,
    totalSupply: totalSupply as bigint,
  };
}
