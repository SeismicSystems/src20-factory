import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { useShieldedWallet } from "seismic-react";
import { CreateTokenForm } from "./components/CreateTokenForm";
import { humanizeError } from "./utils/humanizeError";

export function App() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { loaded, error: walletError } = useShieldedWallet();
  const [pendingSwitch, setPendingSwitch] = useState(false);

  const handleConnect = async () => {
    if (pendingSwitch) {
      setPendingSwitch(false);
      try {
        await (window as any).ethereum?.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });
      } catch {
        return;
      }
    }
    connect({ connector: injected({ target: "metaMask" }) });
  };

  const handleUseDifferentWallet = () => {
    setPendingSwitch(true);
    disconnect();
  };

  return (
    <div className="min-h-screen bg-seismic-bg flex items-center justify-center p-4 relative">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(130,90,109,0.07)_0%,_transparent_65%)] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo + title */}
        <div className="text-center mb-8">
          <img
            src="/seis_logo.png"
            alt="Seismic"
            className="h-9 mx-auto mb-5 opacity-90"
          />
          <h1 className="text-xl font-semibold tracking-wide text-seismic-cream font-suisse-works">
            SRC20 Factory
          </h1>
          <p className="text-seismic-cream/40 mt-1.5 text-sm font-suisse tracking-wide">
            Deploy a private token on Seismic
          </p>
        </div>

        {/* Glass card */}
        <div className="rounded-xl bg-[rgba(209,204,191,0.05)] border border-[rgba(209,204,191,0.12)] backdrop-blur-md p-6 shadow-seismic-card">
          {!isConnected ? (
            <div className="text-center space-y-4">
              <p className="text-seismic-cream/40 text-sm font-suisse">
                Connect your wallet to deploy an SRC20 token
              </p>
              <button
                onClick={handleConnect}
                className="w-full rounded-lg bg-[rgba(130,90,109,0.75)] hover:bg-[rgba(130,90,109,0.95)] border border-[rgba(255,255,255,0.18)] hover:border-[rgba(255,255,255,0.3)] px-4 py-2.5 text-seismic-cream font-medium font-suisse tracking-wide transition-all duration-150 hover:scale-[1.01] active:scale-[0.99]"
              >
                Connect MetaMask
              </button>
            </div>
          ) : !loaded ? (
            <div className="text-center py-8">
              <div className="inline-block w-5 h-5 border-2 border-seismic-mauve border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-seismic-cream/40 text-sm font-suisse">
                Initializing shielded wallet…
              </p>
              <button
                onClick={handleUseDifferentWallet}
                className="mt-4 text-xs text-seismic-cream/30 hover:text-seismic-cream/70 font-suisse transition-colors"
              >
                Use a different wallet
              </button>
            </div>
          ) : walletError ? (
            <div className="text-center py-8">
              <p className="text-red-400/80 text-sm font-suisse">
                {humanizeError(walletError)}
              </p>
              <button
                onClick={handleUseDifferentWallet}
                className="mt-4 text-xs text-seismic-cream/30 hover:text-seismic-cream/70 font-suisse transition-colors"
              >
                Use a different wallet
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(209,204,191,0.1)]">
                <span className="text-xs font-mono text-seismic-cream/40">
                  {address?.slice(0, 6)}…{address?.slice(-4)}
                </span>
                <button
                  onClick={() => disconnect()}
                  className="text-xs text-seismic-cream/30 hover:text-seismic-cream/70 font-suisse transition-colors"
                >
                  Disconnect
                </button>
              </div>
              <CreateTokenForm />
            </>
          )}
        </div>

        <p className="text-center text-[10px] text-seismic-cream/20 mt-6 font-suisse tracking-[0.2em] uppercase">
          Seismic Testnet
        </p>
      </div>
    </div>
  );
}
