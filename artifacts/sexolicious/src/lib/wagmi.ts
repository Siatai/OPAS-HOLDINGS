import { http, createConfig, type CreateConnectorFn } from "wagmi";
import { bsc } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const DEFAULT_REOWN_PROJECT_ID = "76f883600e0c97368c598abb958393f2";

// WalletConnect lets visitors connect a wallet installed on their phone
// (MetaMask, Trust, Rainbow, etc.) by scanning a QR code on desktop or
// deep-linking on mobile, not just browser extensions or wallet browsers.
// Prefer the env var when present so deployments can override it without
// changing source, but keep the live Reown project id as a fallback.
const wcProjectId =
  (import.meta.env as Record<string, string | undefined>)
    .VITE_WALLETCONNECT_PROJECT_ID?.trim() || DEFAULT_REOWN_PROJECT_ID;

const connectors: CreateConnectorFn[] = [injected({ shimDisconnect: true })];

connectors.push(
  walletConnect({
    projectId: wcProjectId,
    showQrModal: true,
    metadata: {
      name: "Opas Holdings",
      description: "Luxury tokenized-asset co-ownership platform",
      url:
        typeof window !== "undefined"
          ? window.location.origin
          : "https://opasholdings.com",
      icons: ["https://opasholdings.com/opas-logo.png"],
    },
  }),
);

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
