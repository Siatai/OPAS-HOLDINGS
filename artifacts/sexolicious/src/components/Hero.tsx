import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, ArrowRight, TrendingUp } from "lucide-react";
import { useWallet } from "./WalletContext";

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const { openWallet } = useWallet();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative h-screen min-h-[800px] w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Dynamic tech-grid background */}
      <div 
        className="absolute inset-0 z-0 opacity-20 transition-transform duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle 600px at ${mousePos.x}px ${mousePos.y}px, rgba(232, 137, 12, 0.15), transparent 100%)`
        }}
      />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(232,137,12,0.08)_0%,transparent_70%)]" />
      
      {/* Tech HUD Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.05] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_30%,transparent_100%)] pointer-events-none" />

      <motion.div 
        style={{ y, opacity }}
        className="container relative z-10 mx-auto px-6 md:px-12 flex flex-col items-center text-center mt-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-secondary/30 bg-secondary/10 backdrop-blur-sm mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-xs font-medium tracking-widest text-secondary uppercase font-mono">System Online v1.0.4</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-tight mb-8 max-w-5xl tracking-wide uppercase"
        >
          Where Technology Meets <br /><span className="text-primary drop-shadow-[0_0_20px_rgba(232,137,12,0.4)]">Prime Real Estate</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl md:text-2xl text-white/70 font-serif italic max-w-3xl mb-12 leading-relaxed"
        >
          Opas Properties uses AI-driven valuation, blockchain fractional ownership, and real-time market intelligence to give every investor access to the world's finest properties — starting at $100.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <button 
            onClick={openWallet}
            className="group relative px-8 py-4 bg-primary text-background font-bold tracking-wider uppercase text-sm flex items-center gap-3 overflow-hidden shadow-[0_0_30px_rgba(232,137,12,0.3)] transition-all hover:shadow-[0_0_50px_rgba(232,137,12,0.5)] rounded"
          >
            <span className="relative z-10">Connect Wallet</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <a 
            href="#properties"
            className="px-8 py-4 text-white font-bold tracking-wider uppercase text-sm border border-white/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 rounded"
          >
            View Properties
          </a>
        </motion.div>

        {/* Ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 w-full max-w-4xl overflow-hidden border-y border-white/10 bg-black/40 backdrop-blur py-3 flex items-center"
        >
          <div className="flex animate-[scroll_20s_linear_infinite] whitespace-nowrap text-sm font-mono text-white/50 tracking-wider">
            <span className="mx-4 text-primary">/</span> 48 PROPERTIES
            <span className="mx-4 text-primary">/</span> $142M AUM
            <span className="mx-4 text-primary">/</span> 12,500 INVESTORS
            <span className="mx-4 text-primary">/</span> 16 COUNTRIES
            <span className="mx-4 text-primary">/</span> 48 PROPERTIES
            <span className="mx-4 text-primary">/</span> $142M AUM
            <span className="mx-4 text-primary">/</span> 12,500 INVESTORS
            <span className="mx-4 text-primary">/</span> 16 COUNTRIES
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Mockup Card */}
      <motion.div
        initial={{ opacity: 0, x: 100, rotate: 5 }}
        animate={{ opacity: 1, x: 0, rotate: -2 }}
        transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
        className="hidden lg:block absolute right-20 top-1/3 bg-card border border-white/10 rounded-lg p-5 shadow-2xl backdrop-blur-xl w-64 z-20 pointer-events-none"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-[10px] text-secondary font-mono mb-1 uppercase">Tokyo, JP</div>
            <div className="font-sans font-bold text-white">Shibuya Prime</div>
          </div>
          <TrendingUp className="w-4 h-4 text-primary" />
        </div>
        <div className="flex justify-between items-end mb-4">
          <div>
            <div className="text-white/40 text-[10px] uppercase font-mono mb-1">Yield</div>
            <div className="text-primary font-bold text-lg">6.2%</div>
          </div>
          <div className="text-right">
            <div className="text-white/40 text-[10px] uppercase font-mono mb-1">Price</div>
            <div className="text-white font-mono">$130/fr</div>
          </div>
        </div>
        <div className="h-8 w-full border-t border-white/10 pt-2 flex items-end justify-between">
          <div className="flex space-x-1 items-end h-full">
            {[40, 60, 45, 80, 50, 90, 70, 100].map((h, i) => (
              <div key={i} className="w-1.5 bg-primary/40 rounded-t-sm" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
