import React from "react";
import { motion } from "framer-motion";
import { Droplets, Globe2, Shield, Zap } from "lucide-react";

const benefits = [
  {
    icon: Droplets,
    title: "Instant Liquidity",
    description: "Unlike traditional real estate, trade your property fractions 24/7 on our secondary marketplace with zero lock-up periods."
  },
  {
    icon: Globe2,
    title: "Global Diversification",
    description: "Don't tie all your capital to one city. Spread risk by owning fractions of prime real estate across multiple global markets."
  },
  {
    icon: Shield,
    title: "No Mortgage, No Hassle",
    description: "Forget credit checks, interest rates, and property management. We handle maintenance, tenants, and taxes. You just collect yield."
  },
  {
    icon: Zap,
    title: "Democratic Access",
    description: "Assets previously reserved for ultra-high-net-worth individuals are now available to you, starting at a fraction of the cost."
  }
];

export default function Benefits() {
  return (
    <section id="benefits" className="py-32 bg-black relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif text-white mb-8 leading-tight"
            >
              Why Fractional <span className="luxury-gradient-text">Ownership</span> is Superior
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/50 text-lg mb-12 leading-relaxed"
            >
              The archaic rules of real estate investing have been rewritten. We've stripped away the friction, the gatekeepers, and the massive capital requirements to bring you the purest form of asset ownership.
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + (index * 0.1) }}
                  >
                    <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center mb-6 bg-primary/5">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-serif text-white mb-3">{benefit.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed">{benefit.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative h-[600px] rounded-2xl overflow-hidden glass-panel border border-white/10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1)_0%,transparent_100%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Abstract decorative element representing a global portfolio */}
              <div className="relative w-64 h-64">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border border-primary/20 rounded-full"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 border border-white/10 rounded-full"
                />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-8 border border-primary/40 rounded-full border-dashed"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Globe2 className="w-16 h-16 text-primary drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
                </div>
              </div>
            </div>
            
            {/* Overlay stats cards */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute top-12 right-12 bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl"
            >
              <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Monthly Yield</div>
              <div className="text-2xl font-serif text-primary">+8.4%</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="absolute bottom-12 left-12 bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl"
            >
              <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Portfolio Value</div>
              <div className="text-2xl font-serif text-white">$14,250</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
