import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Globe2,
  Loader2,
  QrCode,
  Shield,
  X,
  Zap,
} from "lucide-react";
import { Link } from "wouter";
import { useAccount, useChainId, useConnect, useDisconnect } from "wagmi";
import { simulateIncomingSwap, getHoldings } from "@/lib/portfolio";
import connectWalletVisual from "@/assets/images/connect-wallet-visual-v1.png";

interface WalletContextType {
  isOpen: boolean;
  openWallet: () => void;
  closeWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const SHARKON = { fontFamily: "Sharkon, Nevera, sans-serif" };
const NEVERA = { fontFamily: "Nevera, Inter, sans-serif" };

const CHAIN_NAME: Record<number, string> = {
  1: "Ethereum",
  56: "BNB Smart Chain",
  137: "Polygon",
  8453: "Base",
  42161: "Arbitrum",
};

function shortAddr(address?: string) {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { address, isConnected, status } = useAccount();
  const chainId = useChainId();
  const { connectors, connect, error: connectError, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const openWallet = () => setIsOpen(true);
  const closeWallet = () => setIsOpen(false);

  useEffect(() => {
    if (!isConnected || !address) return;
    const account = address;
    const tick = () => {
      if (getHoldings(account).length > 0) simulateIncomingSwap(account);
    };
    const first = setTimeout(tick, 12000);
    const loop = setInterval(tick, 45000);
    return () => {
      clearTimeout(first);
      clearInterval(loop);
    };
  }, [isConnected, address]);

  const hasInjected = useMemo(
    () => typeof window !== "undefined" && !!(window as Window & { ethereum?: unknown }).ethereum,
    [],
  );
  const injectedConnector = connectors.find((connector) => connector.id === "injected");
  const wcConnector = connectors.find((connector) => connector.id === "walletConnect");

  const copy = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <WalletContext.Provider value={{ isOpen, openWallet, closeWallet }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeWallet}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-md md:items-center"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 24 }}
              transition={{ delay: 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
              className="metallic-border relative my-auto max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-hidden overflow-y-auto rounded-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
              style={{
                background:
                  "linear-gradient(160deg, rgba(12,18,32,0.96) 0%, rgba(8,12,24,0.96) 55%, rgba(20,12,4,0.96) 100%)",
              }}
            >
              <button
                onClick={closeWallet}
                className="absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-md border border-white/10 bg-[#050810]/70 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70 backdrop-blur transition-colors hover:border-primary/40 hover:text-primary"
                aria-label="Back"
              >
                ← Back
              </button>
              <button
                onClick={closeWallet}
                className="absolute right-3 top-3 z-20 rounded-md border border-white/10 bg-[#050810]/70 p-1.5 text-white/50 backdrop-blur transition-colors hover:border-primary/40 hover:text-primary"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-[1.05fr_1fr]">
                <div className="relative h-[180px] overflow-hidden md:h-auto md:min-h-[480px]">
                  <img
                    src={connectWalletVisual}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    style={{ filter: "saturate(1.02) contrast(1.04)" }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(8,12,24,0.42) 0%, rgba(8,12,24,0.08) 35%, rgba(8,12,24,0.38) 80%, rgba(8,12,24,0.84) 100%)",
                    }}
                  />
                  <div
                    className="absolute inset-y-0 right-0 hidden w-32 md:block"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(8,12,24,0.85) 100%)",
                    }}
                  />

                  <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5">
                    <span
                      className={`h-1 w-1 rounded-full ${isConnected ? "bg-emerald-400" : "bg-secondary"} animate-pulse`}
                    />
                    <span className="font-mono text-[8px] uppercase tracking-[0.32em] text-white/55">
                      {isConnected ? "Channel open · TLS 1.3" : "Encrypted · TLS 1.3"}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 z-10 font-mono text-[8px] uppercase tracking-[0.32em] text-white/35">
                    {isConnected
                      ? `${CHAIN_NAME[chainId] ?? `chain ${chainId}`} · ${shortAddr(address)}`
                      : "16 markets · 8 cities · live"}
                  </div>
                </div>

                <div className="relative flex flex-col items-start space-y-5 bg-[rgba(8,12,24,0.6)] p-7 text-left md:p-9">
                  <div className="metallic-border inline-flex items-center gap-2 rounded-full px-3 py-1">
                    <span
                      className={`h-1 w-1 rounded-full ${isConnected ? "bg-emerald-400" : "bg-secondary"} animate-pulse`}
                    />
                    <span
                      className="metallic-text text-[8.5px] uppercase tracking-[0.32em]"
                      style={NEVERA}
                    >
                      {isConnected ? "Wallet connected" : "Secure channel"}
                    </span>
                  </div>

                  {!isConnected && (
                    <>
                      <div>
                        <h3 className="mb-3 text-[26px] leading-[1.05] md:text-[30px]" style={SHARKON}>
                          <span className="metallic-text">Acquire your</span>
                          <br />
                          <span className="metallic-warm-text">equity interest.</span>
                        </h3>
                        <p className="text-[13.5px] leading-relaxed text-white/55" style={NEVERA}>
                          Connect with MetaMask, Trust Wallet, Rainbow, Coinbase Wallet, or any
                          WalletConnect-compatible app on your phone. Browser extensions stay
                          available, but they are no longer required.
                        </p>
                      </div>

                      <div className="grid w-full grid-cols-3 gap-2">
                        {[
                          { icon: Shield, label: "Audited" },
                          { icon: Zap, label: "Instant" },
                          { icon: Globe2, label: "Global" },
                        ].map(({ icon: Icon, label }) => (
                          <div
                            key={label}
                            className="flex flex-col items-center justify-center gap-1 rounded-md py-2.5"
                            style={{
                              background: "rgba(20,28,48,0.6)",
                              border: "1px solid rgba(220,225,235,0.08)",
                            }}
                          >
                            <Icon className="h-3.5 w-3.5 text-primary/80" />
                            <span
                              className="text-[8.5px] uppercase tracking-[0.28em] text-white/55"
                              style={NEVERA}
                            >
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="w-full space-y-2.5">
                        {wcConnector && (
                          <button
                            onClick={() => connect({ connector: wcConnector })}
                            disabled={isPending}
                            className="btn-metal group relative flex w-full flex-col items-center gap-1 overflow-hidden rounded-sm px-5 py-3.5 disabled:cursor-not-allowed disabled:opacity-50"
                            style={{ fontFamily: "BankGothic, sans-serif" }}
                          >
                            <span className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#050810]">
                              <QrCode className="h-3.5 w-3.5" /> Connect mobile wallet
                            </span>
                            <span
                              className="text-[8.5px] uppercase tracking-[0.22em] text-[#050810]/70"
                              style={NEVERA}
                            >
                              Scan QR on desktop or open your installed wallet on mobile
                            </span>
                          </button>
                        )}

                        {hasInjected && injectedConnector && (
                          <button
                            onClick={() => connect({ connector: injectedConnector })}
                            disabled={isPending}
                            className="flex w-full flex-col items-center gap-0.5 rounded-sm border border-white/15 px-5 py-3 transition-colors hover:border-primary/45 hover:bg-white/[0.03] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isPending ? (
                              <span className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/85">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Awaiting
                                signature...
                              </span>
                            ) : (
                              <>
                                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/85">
                                  Connect browser wallet
                                </span>
                                <span
                                  className="text-[8.5px] uppercase tracking-[0.22em] text-white/40"
                                  style={NEVERA}
                                >
                                  MetaMask, Rabby, Brave, Coinbase extension
                                </span>
                              </>
                            )}
                          </button>
                        )}

                        {!wcConnector && (
                          <div
                            className="flex w-full items-start gap-2 rounded-md p-3 text-[11px] text-amber-200/80"
                            style={{
                              background: "rgba(234,141,14,0.06)",
                              border: "1px solid rgba(234,141,14,0.18)",
                            }}
                          >
                            <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0 text-primary" />
                            <span style={NEVERA}>
                              WalletConnect is unavailable in this build. Add a Reown project id
                              or install MetaMask to continue.{" "}
                              <a
                                href="https://metamask.io/download"
                                target="_blank"
                                rel="noreferrer"
                                className="underline decoration-primary/40 hover:text-primary"
                              >
                                Get MetaMask <ExternalLink className="inline h-3 w-3" />
                              </a>
                            </span>
                          </div>
                        )}
                      </div>

                      {connectError && (
                        <div className="w-full text-[11px] text-red-300/80" style={NEVERA}>
                          {connectError.message}
                        </div>
                      )}

                      <div className="metallic-divider w-full" />
                      <div
                        className="w-full text-[8.5px] uppercase tracking-[0.3em] text-white/25"
                        style={NEVERA}
                      >
                        Beta · v1.0.4 · OPA-IDX-001
                      </div>
                    </>
                  )}

                  {isConnected && (
                    <>
                      <div>
                        <h3 className="mb-2 text-[24px] leading-[1.05] md:text-[28px]" style={SHARKON}>
                          <span className="metallic-text">Welcome,</span>{" "}
                          <span className="metallic-warm-text">investor.</span>
                        </h3>
                        <p className="text-[13px] leading-relaxed text-white/55" style={NEVERA}>
                          Your vault is live across {CHAIN_NAME[chainId] ?? "your network"}.
                          Review holdings and vote on active proposals.
                        </p>
                      </div>

                      <div
                        className="w-full space-y-2 rounded-md p-3"
                        style={{
                          background: "rgba(20,28,48,0.6)",
                          border: "1px solid rgba(220,225,235,0.08)",
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="text-[8.5px] uppercase tracking-[0.32em] text-white/40"
                            style={NEVERA}
                          >
                            Address
                          </span>
                          <button
                            onClick={copy}
                            className="flex items-center gap-1.5 font-mono text-[11px] text-white/85 transition-colors hover:text-primary"
                          >
                            {shortAddr(address)}
                            {copied ? (
                              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span
                            className="text-[8.5px] uppercase tracking-[0.32em] text-white/40"
                            style={NEVERA}
                          >
                            Network
                          </span>
                          <span className="text-[11px] text-white/85" style={NEVERA}>
                            {CHAIN_NAME[chainId] ?? `Chain ${chainId}`}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span
                            className="text-[8.5px] uppercase tracking-[0.32em] text-white/40"
                            style={NEVERA}
                          >
                            Status
                          </span>
                          <span className="text-[11px] text-emerald-300" style={NEVERA}>
                            {status}
                          </span>
                        </div>
                      </div>

                      <div className="flex w-full flex-col gap-2">
                        <Link
                          href="/dashboard"
                          onClick={closeWallet}
                          className="btn-metal w-full rounded-sm px-5 py-3 text-center font-bold uppercase tracking-[0.22em] text-[#050810]"
                          style={{ fontFamily: "BankGothic, sans-serif" }}
                        >
                          Open Dashboard
                        </Link>
                        <button
                          onClick={() => disconnect()}
                          className="w-full rounded-sm border border-white/10 px-5 py-2.5 text-[10.5px] uppercase tracking-[0.22em] text-white/55 transition-colors hover:border-white/25 hover:text-white"
                          style={NEVERA}
                        >
                          Disconnect
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
