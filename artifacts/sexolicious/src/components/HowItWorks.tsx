import React from "react";
import { motion } from "framer-motion";
import { Wallet, Brain, Coins, TrendingUp } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Wallet,
    title: "Connect Wallet",
    description: "Link your Web3 wallet instantly to our secure platform. No legacy banking paperwork required.",
  },
  {
    number: "02",
    icon: Brain,
    title: "AI Asset Match",
    description: "Our proprietary valuation engine identifies underpriced real estate, supercars, yachts and jets globally and matches them to your risk profile.",
  },
  {
    number: "03",
    icon: Coins,
    title: "Acquire Equity Interests",
    description: "Deploy $OPAS to acquire smart-contract backed co-ownership stakes from $100. Title-deed verified, immutable, and on-chain.",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Earn & Trade 24/7",
    description: "Collect automated rental and charter yield in USDT straight to your wallet, and trade your ownership interests on our liquid secondary market.",
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <div className="text-center mb-16 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-white mb-2 uppercase tracking-wide"
          >
            The <span className="text-primary">Opas Protocol</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif italic text-white/70 text-lg sm:text-xl md:text-2xl mb-6"
          >
            A Seamless Pathway to Premium Assets
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/50 max-w-2xl mx-auto text-sm sm:text-base md:text-lg font-sans"
          >
            A frictionless technological bridge to the world's most premium assets.
          </motion.p>
        </div>

        <div className="premium-grid-frame p-6 sm:p-8 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-px bg-white/10 z-0 overflow-hidden">
            <motion.div 
              className="w-1/3 h-full bg-gradient-to-r from-transparent via-primary to-transparent"
              animate={{ x: ["-100%", "300%"] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            />
          </div>
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="premium-flex-card relative z-10 items-center text-center p-6 sm:p-7"
              >
                <div className="w-24 h-24 rounded-full bg-card border border-white/10 flex items-center justify-center mb-6 relative group hover:border-primary/50 transition-colors">
                  <div className="absolute inset-0 rounded-full bg-primary/5 scale-[1.15] opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <Icon className="w-8 h-8 text-primary relative z-10" />
                  <div
                  className="absolute -bottom-4 bg-background px-2 text-[11px] text-white/35 tracking-widest"
                  style={{ fontFamily: "Xirod, monospace" }}
                >
                  {step.number}
                </div>
                </div>
                
                <h3 className="text-xl font-sans font-bold text-white mb-2 mt-1">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed max-w-[250px]">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
        </div>
      </div>
    </section>
  );
}
