import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Connect & Verify",
    description: "Link your digital wallet and complete our streamlined, secure verification process in minutes.",
  },
  {
    number: "02",
    title: "Select Properties",
    description: "Browse our curated portfolio of ultra-luxury real estate across the world's most prestigious cities.",
  },
  {
    number: "03",
    title: "Acquire Fractions",
    description: "Purchase fractional ownership starting at $100. Receive your digital ownership deed instantly.",
  },
  {
    number: "04",
    title: "Earn Yield",
    description: "Receive monthly rental dividends directly to your wallet while your property value appreciates.",
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 bg-[#050505] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-serif text-white mb-6"
          >
            The Path to <span className="luxury-gradient-text">Ownership</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/50 max-w-2xl mx-auto text-lg"
          >
            A frictionless process designed for the modern elite investor. No mortgages, no endless paperwork. Just pure acquisition.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-px bg-white/10 z-0" />
          
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-full bg-background border border-primary/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(212,175,55,0.1)] relative group">
                <div className="absolute inset-0 rounded-full border border-primary/50 scale-[1.15] opacity-0 group-hover:opacity-100 group-hover:scale-[1.2] transition-all duration-500" />
                <span className="text-2xl font-serif text-primary">{step.number}</span>
              </div>
              
              <h3 className="text-xl font-serif text-white mb-4">{step.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed max-w-[250px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
