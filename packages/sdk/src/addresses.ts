import type { Address } from "viem";

export const FACTORY_ADDRESSES: Record<number, Address> = {
  // Seismic testnet (chain ID 5124)
  5124: "0x87F850cbC2cFfac086F20d0d7307E12d06fA2127",
} as const;

export function getFactoryAddress(chainId: number): Address {
  const address = FACTORY_ADDRESSES[chainId];
  if (!address) {
    throw new Error(`SRC20Factory not deployed on chain ${chainId}`);
  }
  if (address === "0x0000000000000000000000000000000000000000") {
    throw new Error(
      `SRC20Factory address not yet configured for chain ${chainId}. Deploy the factory first and update addresses.ts.`,
    );
  }
  return address;
}
