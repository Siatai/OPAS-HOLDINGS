import React, { createContext, useContext, useState, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Hexagon, Loader2 } from "lucide-react";

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
              transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg p-8 mx-4 border glass-panel border-primary/20 rounded-2xl gold-glow"
            >
              <button
                onClick={closeWallet}
                className="absolute top-6 right-6 text-muted-foreground hover:text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative flex items-center justify-center w-20 h-20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-t-2 border-r-2 border-primary rounded-full opacity-50"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-2 border-b-2 border-l-2 border-primary/50 rounded-full"
                  />
                  <Hexagon className="w-8 h-8 text-primary" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-3xl font-serif luxury-gradient-text">Extraordinary Awaits</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    We are building something extraordinary for you. Our secure wallet integration is currently under construction.
                  </p>
                </div>
                
                <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-4" />

                <div className="flex items-center space-x-3 text-sm text-primary/80 uppercase tracking-widest">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparing Vault</span>
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
