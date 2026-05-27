import React, { createContext, useContext, useState, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import BuildingIllustration from "./BuildingIllustration";

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

              <div className="grid grid-cols-1 md:grid-cols-2">

                {/* ── Left: Anime building illustration ── */}
                <div className="relative h-[280px] md:h-auto md:min-h-[440px] flex items-center justify-center bg-[radial-gradient(ellipse_70%_60%_at_50%_55%,rgba(234,141,14,0.12)_0%,transparent_70%)] overflow-hidden">
                  <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]" />
                  <div className="relative w-[200px] md:w-[260px]" style={{ aspectRatio: "408/540" }}>
                    <BuildingIllustration />
                  </div>
                  {/* Vertical divider on desktop */}
                  <div className="hidden md:block absolute top-8 bottom-8 right-0 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />
                </div>

                {/* ── Right: Connection content ── */}
                <div className="flex flex-col items-start text-left p-8 md:p-10 space-y-5">
                  <div className="metallic-border inline-flex items-center gap-2 px-3 py-1 rounded-full">
                    <span className="w-1 h-1 rounded-full bg-secondary animate-pulse" />
                    <span className="text-[8.5px] tracking-[0.32em] uppercase metallic-text" style={NEVERA}>
                      Secure channel
                    </span>
                  </div>

                  <div>
                    <h3 className="text-[26px] md:text-[30px] leading-[1.1] mb-3" style={SHARKON}>
                      <span className="metallic-text">Acquire your</span>
                      <br />
                      <span className="metallic-warm-text">equity interest.</span>
                    </h3>
                    <p className="text-white/45 text-sm leading-relaxed" style={NEVERA}>
                      Establishing secure connection to decentralized wallet protocols.
                      Your ownership in luxury real estate begins here.
                    </p>
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
