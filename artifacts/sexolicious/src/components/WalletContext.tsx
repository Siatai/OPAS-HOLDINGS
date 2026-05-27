import React, { createContext, useContext, useState, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Cpu, Loader2 } from "lucide-react";

interface WalletContextType {
  isOpen: boolean;
  openWallet: () => void;
  closeWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ delay: 0.1, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md p-8 mx-4 bg-card border border-white/10 rounded-lg shadow-[0_0_50px_rgba(232,137,12,0.15)]"
            >
              <button
                onClick={closeWallet}
                className="absolute top-4 right-4 text-white/50 hover:text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative flex items-center justify-center w-20 h-20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-t-2 border-r-2 border-primary rounded-full opacity-50"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-2 border-b-2 border-l-2 border-secondary rounded-full"
                  />
                  <Cpu className="w-8 h-8 text-primary" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-sans font-bold text-white">System Integration</h3>
                  <p className="text-white/50 text-sm leading-relaxed font-mono">
                    Establishing secure connection to decentralized wallet protocols. Standby.
                  </p>
                </div>
                
                <div className="w-full h-px bg-white/5 my-4 relative overflow-hidden">
                   <motion.div 
                     className="absolute inset-y-0 left-0 w-1/3 bg-primary"
                     animate={{ x: ["-100%", "300%"] }}
                     transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                   />
                </div>

                <div className="flex items-center space-x-3 text-xs text-primary font-mono uppercase tracking-widest">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Awaiting Web3 Provider...</span>
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
