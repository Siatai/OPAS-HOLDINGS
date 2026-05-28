import { http, createConfig } from "wagmi";
import { mainnet, polygon, base, arbitrum } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [mainnet, polygon, base, arbitrum],
  connectors: [
    injected({ shimDisconnect: true }),
  ],
  transports: {
    [mainnet.id]:  http(),
    [polygon.id]:  http(),
    [base.id]:     http(),
    [arbitrum.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
