import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useShieldedWallet } from "seismic-react";
import { CreateTokenForm } from "./components/CreateTokenForm";

export function App() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { loaded, error: walletError } = useShieldedWallet();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">SRC20 Factory</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Deploy a private token on Seismic
          </p>
        </div>

        <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
          {!isConnected ? (
            <div className="text-center space-y-4">
              <p className="text-gray-400 text-sm">
                Connect your wallet to deploy an SRC20 token
              </p>
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  className="w-full rounded-lg bg-cyan-600 hover:bg-cyan-500 px-4 py-2.5 font-medium transition-colors"
                >
                  Connect {connector.name}
                </button>
              ))}
            </div>
          ) : !loaded ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">
                Initializing shielded wallet...
              </p>
            </div>
          ) : walletError ? (
            <div className="text-center py-8">
              <p className="text-red-400 text-sm">{walletError}</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
                <span className="text-xs font-mono text-gray-400">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <button
                  onClick={() => disconnect()}
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                >
                  Disconnect
                </button>
              </div>
              <CreateTokenForm />
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          Seismic Testnet
        </p>
      </div>
    </div>
  );
}
