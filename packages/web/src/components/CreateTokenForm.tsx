import { useState } from "react";
import { useCreateToken } from "../hooks/useCreateToken";

const inputClass =
  "w-full rounded-lg bg-seismic-black border border-[rgba(209,204,191,0.15)] px-3 py-2.5 text-seismic-cream placeholder:text-seismic-cream/25 font-suisse text-sm focus:outline-none focus:border-[rgba(130,90,109,0.7)] focus:bg-[rgba(22,22,22,0.8)] transition-colors";

const labelClass =
  "block text-xs text-seismic-cream/50 mb-1.5 font-suisse tracking-wide uppercase";

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
        <div className="rounded-lg bg-[rgba(166,146,77,0.08)] border border-[rgba(166,146,77,0.3)] p-5">
          <h3 className="text-sm font-semibold text-seismic-gold font-suisse-works tracking-wide mb-4">
            Token Deployed
          </h3>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-[10px] text-seismic-cream/40 font-suisse uppercase tracking-widest mb-0.5">
                Address
              </dt>
              <dd className="font-mono text-seismic-cream/90 break-all text-xs">
                {result.tokenAddress}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] text-seismic-cream/40 font-suisse uppercase tracking-widest mb-0.5">
                Name
              </dt>
              <dd className="text-seismic-cream font-suisse">{name}</dd>
            </div>
            <div>
              <dt className="text-[10px] text-seismic-cream/40 font-suisse uppercase tracking-widest mb-0.5">
                Symbol
              </dt>
              <dd className="text-seismic-cream font-suisse">{symbol}</dd>
            </div>
            <div>
              <dt className="text-[10px] text-seismic-cream/40 font-suisse uppercase tracking-widest mb-0.5">
                Supply
              </dt>
              <dd className="text-seismic-cream font-suisse">
                {Number(supply).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] text-seismic-cream/40 font-suisse uppercase tracking-widest mb-0.5">
                Transaction
              </dt>
              <dd className="font-mono text-seismic-cream/90 break-all text-xs">
                {result.txHash}
              </dd>
            </div>
          </dl>
          <div className="mt-5 pt-4 border-t border-[rgba(209,204,191,0.1)] flex gap-4">
            <a
              href={`https://seismic-testnet.socialscan.io/address/${result.tokenAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-seismic-gold/80 hover:text-seismic-gold font-suisse transition-colors"
            >
              View on Explorer ↗
            </a>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-seismic-cream/30 hover:text-seismic-cream/70 font-suisse transition-colors"
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
        <label className={labelClass}>Token Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Token"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Token Symbol</label>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="MTK"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Initial Supply</label>
        <input
          type="text"
          value={supply}
          onChange={(e) => setSupply(e.target.value.replace(/[^0-9]/g, ""))}
          placeholder="1000000"
          required
          className={inputClass}
        />
        <p className="text-[10px] text-seismic-cream/25 mt-1.5 font-suisse">
          Whole tokens — 18 decimals applied automatically
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-[rgba(255,80,80,0.08)] border border-[rgba(255,80,80,0.3)] p-3 text-xs text-red-400/80 font-suisse">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !name || !symbol || !supply}
        className="w-full rounded-lg bg-[rgba(130,90,109,0.75)] hover:bg-[rgba(130,90,109,0.95)] border border-[rgba(255,255,255,0.18)] hover:border-[rgba(255,255,255,0.3)] disabled:bg-[rgba(40,40,40,0.5)] disabled:border-[rgba(209,204,191,0.08)] disabled:text-seismic-cream/30 px-4 py-2.5 text-seismic-cream font-medium font-suisse tracking-wide text-sm transition-all duration-150 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:scale-100"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block w-3.5 h-3.5 border-2 border-seismic-cream/40 border-t-seismic-cream rounded-full animate-spin" />
            Deploying…
          </span>
        ) : (
          "Deploy Token"
        )}
      </button>
    </form>
  );
}
