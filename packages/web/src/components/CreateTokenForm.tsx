import { useState } from "react";
import { useCreateToken } from "../hooks/useCreateToken";

export function CreateTokenForm() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("1000000");

  const { deploy, isLoading, error, result } = useCreateToken({
    name,
    symbol,
    initialSupply: supply,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await deploy();
  };

  if (result) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-emerald-900/30 border border-emerald-700 p-6">
          <h3 className="text-lg font-semibold text-emerald-400 mb-4">
            Token Deployed
          </h3>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-gray-400">Address</dt>
              <dd className="font-mono text-white break-all">
                {result.tokenAddress}
              </dd>
            </div>
            <div>
              <dt className="text-gray-400">Name</dt>
              <dd className="text-white">{name}</dd>
            </div>
            <div>
              <dt className="text-gray-400">Symbol</dt>
              <dd className="text-white">{symbol}</dd>
            </div>
            <div>
              <dt className="text-gray-400">Supply</dt>
              <dd className="text-white">{Number(supply).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-gray-400">Transaction</dt>
              <dd className="font-mono text-white break-all text-xs">
                {result.txHash}
              </dd>
            </div>
          </dl>
          <div className="mt-4 flex gap-3">
            <a
              href={`https://seismic-testnet.socialscan.io/address/${result.tokenAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cyan-400 hover:text-cyan-300 underline"
            >
              View on Explorer
            </a>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-gray-400 hover:text-white underline"
            >
              Deploy Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Token Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Token"
          required
          className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Token Symbol</label>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="MTK"
          required
          className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">
          Initial Supply
        </label>
        <input
          type="text"
          value={supply}
          onChange={(e) => setSupply(e.target.value.replace(/[^0-9]/g, ""))}
          placeholder="1000000"
          required
          className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Whole tokens (18 decimals applied automatically)
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-900/30 border border-red-700 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !name || !symbol || !supply}
        className="w-full rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:text-gray-500 px-4 py-2.5 font-medium transition-colors"
      >
        {isLoading ? "Deploying..." : "Deploy Token"}
      </button>
    </form>
  );
}
