import { http, createConfig, type CreateConnectorFn } from "wagmi";
import { bsc } from "wagmi/chains";
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
        url: typeof window !== "undefined" ? window.location.origin : "https://opasholdings.com",
        icons: ["https://opasholdings.com/opas-logo.png"],
      },
    }),
  );
}

// Only BNB Smart Chain (BSC) is requested. Requesting several chains at once made
// some mobile wallets (notably Trust) reject the WalletConnect session with a
// "required chains not supported" error. The app never sends real on-chain
// transactions (chain is display-only), so a single chain maximises wallet
// compatibility.
export const wagmiConfig = createConfig({
  chains: [bsc],
  connectors,
  transports: {
    [bsc.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
