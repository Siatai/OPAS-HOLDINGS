import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2, Shield, Zap, Globe2, AlertTriangle, CheckCircle2, ExternalLink, Copy } from "lucide-react";
import { useAccount, useConnect, useDisconnect, useChainId } from "wagmi";
import worldSkyline from "@/assets/images/world_skyline.png";
import { Link } from "wouter";

interface WalletContextType {
  isOpen: boolean;
  openWallet: () => void;
  closeWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const SHARKON = { fontFamily: "Sharkon, Nevera, sans-serif" };
const NEVERA  = { fontFamily: "Nevera, Inter, sans-serif" };

const CHAIN_NAME: Record<number, string> = {
  1: "Ethereum", 137: "Polygon", 8453: "Base", 42161: "Arbitrum",
};

function shortAddr(a?: string) {
  return a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "";
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { address, isConnected, status } = useAccount();
  const chainId = useChainId();
  const { connectors, connect, error: connectError, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const openWallet  = () => setIsOpen(true);
  const closeWallet = () => setIsOpen(false);

  const hasInjected = useMemo(
    () => typeof window !== "undefined" && !!(window as any).ethereum,
    [],
  );
  const injected = connectors.find((c) => c.id === "injected") ?? connectors[0];

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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 24 }}
              transition={{ delay: 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="metallic-border relative w-full max-w-3xl rounded-xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
              style={{
                background:
                  "linear-gradient(160deg, rgba(12,18,32,0.96) 0%, rgba(8,12,24,0.96) 55%, rgba(20,12,4,0.96) 100%)",
              }}
            >
              <button
                onClick={closeWallet}
                className="absolute top-4 right-4 z-20 text-white/40 hover:text-primary transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-[1.05fr_1fr]">

                {/* ── Left: Skyline hero panel ── */}
                <div className="relative h-[220px] md:h-auto md:min-h-[520px] overflow-hidden">
                  <img
                    src={worldSkyline}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-bottom"
                    style={{ filter: "saturate(1.05) contrast(1.05)" }}
                  />
                  <div className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(8,12,24,0.6) 0%, rgba(8,12,24,0.15) 35%, rgba(8,12,24,0.5) 80%, rgba(8,12,24,0.9) 100%)",
                    }}
                  />
                  <div className="hidden md:block absolute inset-y-0 right-0 w-32"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(8,12,24,0.85) 100%)",
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-[18%] h-32 opacity-60 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse 60% 100% at 50% 100%, rgba(234,141,14,0.35), transparent 70%)",
                    }}
                  />

                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%]"
                  >
                    <div className="relative">
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ border: "1px solid rgba(234,141,14,0.45)" }}
                        animate={{ scale: [1, 1.55], opacity: [0.6, 0] }}
                        transition={{ repeat: Infinity, duration: 2.6, ease: "easeOut" }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ border: "1px solid rgba(11,181,190,0.4)" }}
                        animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                        transition={{ repeat: Infinity, duration: 3.2, ease: "easeOut", delay: 0.4 }}
                      />
                      <div
                        className="relative w-[110px] h-[110px] rounded-full flex items-center justify-center"
                        style={{
                          background:
                            "radial-gradient(circle at 30% 30%, rgba(234,141,14,0.55), rgba(234,141,14,0.08) 70%)",
                          border: "1px solid rgba(234,141,14,0.55)",
                          boxShadow:
                            "inset 0 1px 0 rgba(255,255,255,0.2), 0 0 50px -5px rgba(234,141,14,0.55)",
                        }}
                      >
                        <div className="text-center">
                          <div
                            className="text-[22px] tracking-[0.18em] text-white"
                            style={{ fontFamily: "Sharkon, Nevera, sans-serif" }}
                          >
                            OPAS
                          </div>
                          <div
                            className="text-[7px] tracking-[0.4em] uppercase text-primary mt-0.5"
                            style={NEVERA}
                          >
                            Vault · 001
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <div className="absolute top-4 left-4 flex items-center gap-1.5 z-10">
                    <span className={`w-1 h-1 rounded-full ${isConnected ? "bg-emerald-400" : "bg-secondary"} animate-pulse`} />
                    <span className="text-[8px] font-mono tracking-[0.32em] uppercase text-white/55">
                      {isConnected ? "Channel open · TLS 1.3" : "Encrypted · TLS 1.3"}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 z-10 text-[8px] font-mono tracking-[0.32em] uppercase text-white/35">
                    {isConnected
                      ? `${CHAIN_NAME[chainId] ?? `chain ${chainId}`} · ${shortAddr(address)}`
                      : "16 markets · 8 cities · live"}
                  </div>
                </div>

                {/* ── Right: Connection content ── */}
                <div className="relative flex flex-col items-start text-left p-7 md:p-9 space-y-5 bg-[rgba(8,12,24,0.6)]">
                  <div className="metallic-border inline-flex items-center gap-2 px-3 py-1 rounded-full">
                    <span className={`w-1 h-1 rounded-full ${isConnected ? "bg-emerald-400" : "bg-secondary"} animate-pulse`} />
                    <span className="text-[8.5px] tracking-[0.32em] uppercase metallic-text" style={NEVERA}>
                      {isConnected ? "Wallet connected" : "Secure channel"}
                    </span>
                  </div>

                  {!isConnected && (
                    <>
                      <div>
                        <h3 className="text-[26px] md:text-[30px] leading-[1.05] mb-3" style={SHARKON}>
                          <span className="metallic-text">Acquire your</span>
                          <br />
                          <span className="metallic-warm-text">equity interest.</span>
                        </h3>
                        <p className="text-white/55 text-[13.5px] leading-relaxed" style={NEVERA}>
                          Connect MetaMask, Trust Wallet or any EIP-1193 browser wallet to enter the Opas vault.
                        </p>
                      </div>

                      <div className="w-full grid grid-cols-3 gap-2">
                        {[
                          { icon: Shield, label: "Audited" },
                          { icon: Zap,    label: "Instant" },
                          { icon: Globe2, label: "Global" },
                        ].map(({ icon: Icon, label }) => (
                          <div
                            key={label}
                            className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-md"
                            style={{
                              background: "rgba(20,28,48,0.6)",
                              border: "1px solid rgba(220,225,235,0.08)",
                            }}
                          >
                            <Icon className="w-3.5 h-3.5 text-primary/80" />
                            <span className="text-[8.5px] tracking-[0.28em] uppercase text-white/55" style={NEVERA}>
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => injected && connect({ connector: injected })}
                        disabled={isPending || !hasInjected}
                        className="group relative w-full overflow-hidden px-5 py-3.5 text-[11px] font-bold tracking-[0.22em] text-[#050810] bg-primary uppercase rounded-sm disabled:opacity-50 disabled:cursor-not-allowed amber-glow"
                        style={{ fontFamily: "BankGothic, sans-serif" }}
                      >
                        {isPending ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Awaiting signature…
                          </span>
                        ) : hasInjected ? (
                          "Connect Wallet"
                        ) : (
                          "No browser wallet detected"
                        )}
                      </button>

                      {!hasInjected && (
                        <div className="w-full flex items-start gap-2 p-3 rounded-md text-[11px] text-amber-200/80"
                          style={{ background: "rgba(234,141,14,0.06)", border: "1px solid rgba(234,141,14,0.18)" }}
                        >
                          <AlertTriangle className="w-3.5 h-3.5 mt-px shrink-0 text-primary" />
                          <span style={NEVERA}>
                            Install MetaMask or open this site inside Trust Wallet's in-app browser to continue.{" "}
                            <a href="https://metamask.io/download" target="_blank" rel="noreferrer" className="underline decoration-primary/40 hover:text-primary">
                              Get MetaMask <ExternalLink className="inline w-3 h-3" />
                            </a>
                          </span>
                        </div>
                      )}

                      {connectError && (
                        <div className="w-full text-[11px] text-red-300/80" style={NEVERA}>
                          {connectError.message}
                        </div>
                      )}

                      <div className="metallic-divider w-full" />
                      <div className="w-full text-[8.5px] tracking-[0.3em] uppercase text-white/25" style={NEVERA}>
                        Beta · v1.0.4 · OPA-IDX-001
                      </div>
                    </>
                  )}

                  {isConnected && (
                    <>
                      <div>
                        <h3 className="text-[24px] md:text-[28px] leading-[1.05] mb-2" style={SHARKON}>
                          <span className="metallic-text">Welcome,</span>{" "}
                          <span className="metallic-warm-text">investor.</span>
                        </h3>
                        <p className="text-white/55 text-[13px] leading-relaxed" style={NEVERA}>
                          Your vault is live across {CHAIN_NAME[chainId] ?? "your network"}. Review holdings and vote on active proposals.
                        </p>
                      </div>

                      <div className="w-full rounded-md p-3 space-y-2"
                        style={{ background: "rgba(20,28,48,0.6)", border: "1px solid rgba(220,225,235,0.08)" }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[8.5px] tracking-[0.32em] uppercase text-white/40" style={NEVERA}>Address</span>
                          <button onClick={copy} className="flex items-center gap-1.5 text-[11px] text-white/85 hover:text-primary transition-colors font-mono">
                            {shortAddr(address)}
                            {copied
                              ? <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[8.5px] tracking-[0.32em] uppercase text-white/40" style={NEVERA}>Network</span>
                          <span className="text-[11px] text-white/85" style={NEVERA}>{CHAIN_NAME[chainId] ?? `Chain ${chainId}`}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[8.5px] tracking-[0.32em] uppercase text-white/40" style={NEVERA}>Status</span>
                          <span className="text-[11px] text-emerald-300" style={NEVERA}>{status}</span>
                        </div>
                      </div>

                      <div className="w-full flex flex-col gap-2">
                        <Link href="/portfolio" onClick={closeWallet}
                          className="w-full text-center px-5 py-3 text-[11px] font-bold tracking-[0.22em] text-[#050810] bg-primary uppercase rounded-sm amber-glow"
                          style={{ fontFamily: "BankGothic, sans-serif" }}
                        >
                          Open Portfolio
                        </Link>
                        <button onClick={() => disconnect()}
                          className="w-full px-5 py-2.5 text-[10.5px] tracking-[0.22em] text-white/55 hover:text-white uppercase border border-white/10 hover:border-white/25 rounded-sm transition-colors"
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
