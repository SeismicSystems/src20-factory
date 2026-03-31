import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { seismicTestnet } from "seismic-viem";

export const wagmiConfig = createConfig({
  chains: [seismicTestnet],
  connectors: [injected()],
  transports: {
    [seismicTestnet.id]: http(),
  },
});
