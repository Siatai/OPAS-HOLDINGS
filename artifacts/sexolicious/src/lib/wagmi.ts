import { http, createConfig, type CreateConnectorFn } from "wagmi";
import { mainnet, polygon, base, arbitrum } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

// WalletConnect lets visitors connect a wallet installed on their phone
// (MetaMask, Trust, Rainbow, etc.) by scanning a QR code on desktop or
// deep-linking on mobile — not just browser extensions. It needs a free
// project id from https://cloud.reown.com, supplied via this env var.
const wcProjectId = (import.meta.env as Record<string, string | undefined>)
  .VITE_WALLETCONNECT_PROJECT_ID;

const connectors: CreateConnectorFn[] = [injected({ shimDisconnect: true })];

if (wcProjectId) {
  connectors.push(
    walletConnect({
      projectId: wcProjectId,
      showQrModal: true,
      metadata: {
        name: "Opas Holdings",
        description: "Luxury tokenized-asset co-ownership platform",
        url: typeof window !== "undefined" ? window.location.origin : "https://opas.holdings",
        icons: ["https://opas.holdings/opas-logo.png"],
      },
    }),
  );
}

export const wagmiConfig = createConfig({
  chains: [mainnet, polygon, base, arbitrum],
  connectors,
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
