import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Link2, Zap, Globe, FileKey, Activity } from "lucide-react";

const benefits = [
  {
    icon: BrainCircuit,
    title: "AI Valuation Engine",
    description: "Our models process millions of data points to identify mispriced assets before they hit the open market."
  },
  {
    icon: FileKey,
    title: "Blockchain Title Deeds",
    description: "Ownership is recorded on-chain, providing immutable proof of title that cannot be forged or destroyed."
  },
  {
    icon: Zap,
    title: "Real-Time Liquidity",
    description: "Exit your positions instantly. Trade equity interests 24/7 on our matched secondary market with zero lockup periods."
  },
  {
    icon: Globe,
    title: "Global Diversification",
    description: "Build a cross-border portfolio spanning Tokyo, London, and New York from a single interface."
  },
  {
    icon: Link2,
    title: "Zero Mortgage Required",
    description: "Bypass legacy banking. No credit checks, no interest rates. Own premium assets outright."
  },
  {
    icon: Activity,
    title: "24/7 Markets",
    description: "Real estate that never sleeps. React to global events instantly and rebalance your portfolio on the fly."
  }
];

export default function Benefits() {
  return (
    <section id="benefits" className="py-20 md:py-32 bg-background relative">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <div className="text-center mb-14 md:mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-white mb-2 uppercase tracking-wide"
          >
            The <span className="text-primary">Opas Advantage</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif italic text-white/70 text-lg sm:text-xl md:text-2xl mb-6"
          >
            Redefining Wealth Generation
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-sans"
          >
            We have engineered away the friction of traditional real estate investing, replacing it with speed, transparency, and unprecedented access.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className="bg-card border border-white/5 p-5 sm:p-8 rounded-lg relative overflow-hidden group hover:bg-white/[0.02] transition-colors"
              >
                {/* Glowing left border */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_15px_rgba(232,137,12,0.8)]" />
                
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-sans font-bold text-white mb-2">{benefit.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
