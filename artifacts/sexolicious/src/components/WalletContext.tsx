import React, { createContext, useContext, useState, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2, Shield, Zap, Globe2 } from "lucide-react";
import worldSkyline from "@/assets/images/world_skyline.png";

interface WalletContextType {
  isOpen: boolean;
  openWallet: () => void;
  closeWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const SHARKON = { fontFamily: "Sharkon, Nevera, sans-serif" };
const NEVERA  = { fontFamily: "Nevera, Inter, sans-serif" };

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openWallet = () => setIsOpen(true);
  const closeWallet = () => setIsOpen(false);

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
                <div className="relative h-[220px] md:h-auto md:min-h-[480px] overflow-hidden">
                  {/* Skyline image */}
                  <img
                    src={worldSkyline}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-bottom"
                    style={{ filter: "saturate(1.05) contrast(1.05)" }}
                  />
                  {/* Top-down fade */}
                  <div className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(8,12,24,0.6) 0%, rgba(8,12,24,0.15) 35%, rgba(8,12,24,0.5) 80%, rgba(8,12,24,0.9) 100%)",
                    }}
                  />
                  {/* Right edge fade into right panel */}
                  <div className="hidden md:block absolute inset-y-0 right-0 w-32"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(8,12,24,0.85) 100%)",
                    }}
                  />
                  {/* Amber horizon kiss */}
                  <div className="absolute inset-x-0 bottom-[18%] h-32 opacity-60 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse 60% 100% at 50% 100%, rgba(234,141,14,0.35), transparent 70%)",
                    }}
                  />

                  {/* Glowing OPAS seal — floating */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%]"
                  >
                    <div className="relative">
                      {/* Outer pulsing ring */}
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
                      {/* Seal */}
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

                  {/* Corner glyphs */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 z-10">
                    <span className="w-1 h-1 rounded-full bg-secondary animate-pulse" />
                    <span className="text-[8px] font-mono tracking-[0.32em] uppercase text-white/55">
                      Encrypted · TLS 1.3
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 z-10 text-[8px] font-mono tracking-[0.32em] uppercase text-white/35">
                    16 markets · 8 cities · live
                  </div>
                </div>

                {/* ── Right: Connection content ── */}
                <div className="relative flex flex-col items-start text-left p-7 md:p-9 space-y-5 bg-[rgba(8,12,24,0.6)]">
                  <div className="metallic-border inline-flex items-center gap-2 px-3 py-1 rounded-full">
                    <span className="w-1 h-1 rounded-full bg-secondary animate-pulse" />
                    <span className="text-[8.5px] tracking-[0.32em] uppercase metallic-text" style={NEVERA}>
                      Secure channel
                    </span>
                  </div>

                  <div>
                    <h3 className="text-[26px] md:text-[30px] leading-[1.05] mb-3" style={SHARKON}>
                      <span className="metallic-text">Acquire your</span>
                      <br />
                      <span className="metallic-warm-text">equity interest.</span>
                    </h3>
                    <p className="text-white/55 text-[13.5px] leading-relaxed" style={NEVERA}>
                      Establishing secure connection to decentralized wallet protocols.
                      Your ownership in luxury real estate begins here.
                    </p>
                  </div>

                  {/* Feature chips — replace empty space with substance */}
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

                  {/* Animated progress bar */}
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[8.5px] tracking-[0.32em] uppercase text-white/40" style={NEVERA}>Handshake</span>
                      <span className="text-[8.5px] tracking-[0.32em] uppercase text-primary/70" style={NEVERA}>in progress</span>
                    </div>
                    <div className="w-full h-px bg-white/5 relative overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 w-1/3"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent 0%, #ea8d0e 50%, transparent 100%)",
                        }}
                        animate={{ x: ["-100%", "300%"] }}
                        transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                      />
                    </div>
                  </div>

                  <div className="metallic-divider w-full" />

                  <div className="flex items-center gap-2.5 text-[10px] text-primary/80 uppercase tracking-[0.32em]" style={NEVERA}>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Awaiting Web3 provider</span>
                  </div>

                  <div className="w-full pt-1 text-[8.5px] tracking-[0.3em] uppercase text-white/25" style={NEVERA}>
                    Beta · v1.0.4 · OPA-IDX-001
                  </div>
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
