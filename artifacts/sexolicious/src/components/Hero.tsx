import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { useWallet } from "./WalletContext";

const TICKER_ITEMS = [
  "48 PROPERTIES", "$142M AUM", "12,500 INVESTORS", "16 COUNTRIES",
  "AVG YIELD 6.1%", "DUBAI +17.2%", "TOKYO +9.6%", "MIAMI +14.2%",
];

export default function Hero() {
  const { scrollY } = useScroll();
  const y       = useTransform(scrollY, [0, 800], [0, 180]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const { openWallet } = useWallet();

  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top)  / rect.height,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center overflow-hidden bg-background"
    >
      {/* ── Radial mouse glow ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-700"
        style={{
          background: `radial-gradient(ellipse 60% 60% at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(234,141,14,0.10) 0%, transparent 70%)`,
        }}
      />

      {/* ── Static centre glow ── */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_70%_55%_at_30%_55%,rgba(234,141,14,0.07)_0%,transparent_65%)]" />

      {/* ── Tech HUD grid ── */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]
        bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]
        bg-[size:3.5rem_3.5rem]
        [mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,#000_20%,transparent_100%)]" />

      {/* ── Content ── */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 w-full container mx-auto px-6 lg:px-12 pt-28 pb-16 lg:pt-36"
      >
        <div className="grid lg:grid-cols-[1fr_300px] gap-12 lg:gap-8 items-center max-w-6xl">

          {/* Left column */}
          <div>
            {/* Status pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 border border-secondary/25 bg-secondary/8 backdrop-blur-sm rounded-full"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              <span
                className="text-[10px] tracking-[0.3em] text-secondary uppercase"
                style={{ fontFamily: "Xirod, monospace" }}
              >
                System Online v1.0.4
              </span>
            </motion.div>

            {/* H1 — Dune Rise */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-wide text-white mb-6"
              style={{ fontFamily: "DuneRise, BankGothic, sans-serif" }}
            >
              Where Technology
              <br />
              <span
                className="text-primary drop-shadow-[0_0_28px_rgba(234,141,14,0.55)]"
              >
                Meets
              </span>{" "}
              <span className="text-white/90">Prime</span>
              <br />
              Real Estate
            </motion.h1>

            {/* Subheading — Cormorant italic */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-white/60 max-w-xl mb-10 leading-relaxed"
              style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" }}
            >
              AI-driven valuation. Blockchain co-ownership interests. Real-time market
              intelligence. An equity stake in the world's finest properties —
              from&nbsp;$100.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={openWallet}
                className="group relative overflow-hidden flex items-center gap-3 px-7 py-3.5 bg-primary text-[#050810] text-xs font-bold tracking-[0.2em] uppercase rounded-sm amber-glow transition-all duration-300 hover:shadow-[0_0_50px_rgba(234,141,14,0.55)]"
                style={{ fontFamily: "BankGothic, sans-serif" }}
              >
                <span className="relative z-10">Connect Wallet</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              <a
                href="#properties"
                className="flex items-center gap-2 px-7 py-3.5 text-xs font-bold tracking-[0.2em] text-white/70 hover:text-primary border border-white/15 hover:border-primary/40 uppercase rounded-sm transition-all duration-300"
                style={{ fontFamily: "BankGothic, sans-serif" }}
              >
                View Portfolio
              </a>
            </motion.div>
          </div>

          {/* Right column — floating data card */}
          <motion.div
            initial={{ opacity: 0, x: 60, rotate: 3 }}
            animate={{ opacity: 1, x: 0, rotate: -1 }}
            transition={{ duration: 1.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block relative"
          >
            <div className="bg-card border border-white/8 rounded-lg p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              {/* glow corner */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex justify-between items-start mb-5">
                <div>
                  <div
                    className="text-[9px] text-secondary tracking-[0.3em] uppercase mb-1"
                    style={{ fontFamily: "Xirod, monospace" }}
                  >
                    Tokyo · OPA-TKY
                  </div>
                  <div
                    className="text-white font-bold text-base tracking-wide"
                    style={{ fontFamily: "BankGothic, sans-serif" }}
                  >
                    Shibuya Prime
                  </div>
                </div>
                <TrendingUp className="w-4 h-4 text-primary mt-1" />
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: "Rental", value: "4.5%", color: "text-secondary" },
                  { label: "Growth", value: "+9.6%", color: "text-green-400" },
                  { label: "ROI",    value: "~14.1%", color: "text-primary" },
                ].map((d) => (
                  <div key={d.label} className="bg-white/4 rounded p-2 text-center">
                    <div
                      className="text-white/35 text-[8px] tracking-widest uppercase mb-1"
                      style={{ fontFamily: "Xirod, monospace" }}
                    >
                      {d.label}
                    </div>
                    <div className={`font-bold text-sm ${d.color}`} style={{ fontFamily: "Rostex, monospace" }}>
                      {d.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* sparkline */}
              <div className="h-10 w-full border-t border-white/8 pt-2.5 flex items-end gap-1">
                {[35, 52, 40, 68, 44, 78, 60, 88, 72, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm"
                    style={{
                      height: `${h}%`,
                      background: i === 9
                        ? "rgba(234,141,14,0.9)"
                        : `rgba(234,141,14,${0.15 + (i / 9) * 0.25})`,
                    }}
                  />
                ))}
              </div>

              <div
                className="mt-3 text-[8px] text-white/20 tracking-widest uppercase"
                style={{ fontFamily: "Xirod, monospace" }}
              >
                From $130 / equity stake
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Ticker ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-14 w-full overflow-hidden border-y border-white/7 bg-black/30 backdrop-blur py-2.5"
        >
          <div className="ticker-track flex whitespace-nowrap">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="inline-flex items-center">
                <span
                  className="text-primary mx-3 text-xs"
                  style={{ fontFamily: "Xirod, monospace" }}
                >
                  /
                </span>
                <span
                  className="text-[11px] tracking-[0.22em] text-white/40 uppercase"
                  style={{ fontFamily: "Neuropol, sans-serif" }}
                >
                  {item}
                </span>
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
