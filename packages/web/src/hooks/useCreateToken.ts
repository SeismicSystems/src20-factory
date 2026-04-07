import { useState } from "react";
import { useShieldedWallet } from "seismic-react";
import { createToken, type CreateTokenResult } from "create-src20";
import { humanizeError } from "../utils/humanizeError";

interface UseCreateTokenParams {
  name: string;
  symbol: string;
  initialSupply: string;
}

interface UseCreateTokenReturn {
  deploy: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  result: CreateTokenResult | null;
}

export function useCreateToken(
  params: UseCreateTokenParams,
): UseCreateTokenReturn {
  const { walletClient } = useShieldedWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateTokenResult | null>(null);

  const deploy = async () => {
    if (!walletClient) {
      setError("Wallet not connected");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const supplyBigInt =
        BigInt(params.initialSupply || "0") * BigInt(10 ** 18);
      const tokenResult = await createToken(walletClient, {
        name: params.name,
        symbol: params.symbol,
        initialSupply: supplyBigInt,
      });
      setResult(tokenResult);
    } catch (err) {
      setError(humanizeError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return { deploy, isLoading, error, result };
}
