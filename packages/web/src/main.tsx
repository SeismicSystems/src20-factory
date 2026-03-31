import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ShieldedWalletProvider } from "seismic-react";
import { wagmiConfig } from "./config";
import { App } from "./App";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ShieldedWalletProvider config={wagmiConfig}>
          <App />
        </ShieldedWalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
