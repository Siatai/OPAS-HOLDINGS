import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { useWallet } from "./WalletContext";
import BuildingIllustration from "./BuildingIllustration";

const TICKER_ITEMS = [
  "48 PROPERTIES", "$142M AUM", "12,500 INVESTORS", "16 COUNTRIES",
  "AVG YIELD 6.1%", "DUBAI +17.2%", "TOKYO +9.6%", "MIAMI +14.2%",
];

export default function Hero() {
  const { scrollY } = useScroll();
  const y       = useTransform(scrollY, [0, 800], [0, 160]);
  const opacity = useTransform(scrollY, [0, 380], [1, 0]);
  const { openWallet } = useWallet();

  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMousePos({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen w-full overflow-hidden bg-background flex flex-col">
      {/* Mouse radial glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse 55% 55% at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(234,141,14,0.09) 0%, transparent 70%)`,
        }}
      />

      {/* Static left-side warmth */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_55%_50%_at_25%_55%,rgba(234,141,14,0.06)_0%,transparent_65%)]" />

      {/* Tech HUD grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.045]
        bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]
        bg-[size:3.5rem_3.5rem]
        [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />

      {/* ── Main content ── */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex-1 w-full container mx-auto px-6 lg:px-12 pt-28 lg:pt-32 pb-4 flex items-center"
      >
        {/* Two-column layout — never overlaps */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 xl:gap-14 items-center">

          {/* ── Left column: copy ── */}
          <div className="flex flex-col">
            {/* Status pill */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-7 w-fit border border-secondary/25 bg-secondary/8 backdrop-blur-sm rounded-full"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              <span className="text-[9px] tracking-[0.3em] text-secondary uppercase" style={{ fontFamily: "Xirod, monospace" }}>
                System Online v1.0.4
              </span>
            </motion.div>

            {/* Headline — DuneRise */}
            <motion.h1
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(1.75rem,3.6vw,3rem)] leading-[1.08] tracking-wide text-white mb-5"
              style={{ fontFamily: "DuneRise, BankGothic, sans-serif" }}
            >
              Where Technology
              <br />
              <span className="text-primary drop-shadow-[0_0_24px_rgba(234,141,14,0.5)]">Meets</span>
              {" "}Prime
              <br />
              Real Estate
            </motion.h1>

            {/* Sub — Cormorant italic */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35 }}
              className="text-base md:text-lg text-white/55 max-w-md mb-9 leading-relaxed"
              style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" }}
            >
              AI-driven valuation. Blockchain co-ownership interests.
              Real-time market intelligence. An equity stake in the world's
              finest properties — from&nbsp;$100.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="flex flex-wrap gap-4 mb-10 md:mb-0"
            >
              <button
                onClick={openWallet}
                className="group relative overflow-hidden flex items-center gap-2.5 px-6 py-3 bg-primary text-[#050810] text-[11px] font-bold tracking-[0.2em] uppercase rounded-sm amber-glow transition-all hover:shadow-[0_0_50px_rgba(234,141,14,0.5)]"
                style={{ fontFamily: "BankGothic, sans-serif" }}
              >
                <span className="relative z-10">Connect Wallet</span>
                <ArrowRight className="w-3.5 h-3.5 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              <a
                href="#properties"
                className="flex items-center gap-2 px-6 py-3 text-[11px] font-bold tracking-[0.2em] text-white/60 hover:text-primary border border-white/12 hover:border-primary/40 uppercase rounded-sm transition-all"
                style={{ fontFamily: "BankGothic, sans-serif" }}
              >
                View Portfolio
              </a>
            </motion.div>
          </div>

          {/* ── Right column: building illustration + data overlay ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full flex justify-center md:justify-end"
          >
            {/* Building SVG container */}
            <div className="relative w-[260px] sm:w-[280px] md:w-[300px] xl:w-[340px]" style={{ aspectRatio: "408/540" }}>
              <BuildingIllustration />

              {/* Floating data card pinned to tower mid-right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.88, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="absolute -right-6 top-[28%] w-[148px] bg-[#0c1628]/90 border border-white/10 rounded-lg p-3.5 shadow-2xl backdrop-blur-xl"
              >
                <div className="absolute inset-0 rounded-lg pointer-events-none" style={{ boxShadow: "0 0 20px rgba(234,141,14,0.15) inset" }} />
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-[8px] text-secondary tracking-[0.3em] uppercase mb-0.5" style={{ fontFamily: "Xirod, monospace" }}>
                      Tokyo · OPA-TKY
                    </div>
                    <div className="text-white font-bold text-[11px] tracking-wide" style={{ fontFamily: "BankGothic, sans-serif" }}>
                      Shibuya Prime
                    </div>
                  </div>
                  <TrendingUp className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                </div>

                <div className="grid grid-cols-2 gap-1.5 mb-2.5">
                  {[
                    { l: "Yield",  v: "4.5%",  c: "text-secondary" },
                    { l: "ROI",    v: "~14.1%", c: "text-primary" },
                  ].map(d => (
                    <div key={d.l} className="bg-white/5 rounded p-1.5 text-center">
                      <div className="text-white/35 text-[7px] tracking-widest uppercase mb-0.5" style={{ fontFamily: "Xirod, monospace" }}>{d.l}</div>
                      <div className={`font-bold text-xs ${d.c}`} style={{ fontFamily: "Rostex, monospace" }}>{d.v}</div>
                    </div>
                  ))}
                </div>

                {/* Sparkline */}
                <div className="h-8 flex items-end gap-0.5">
                  {[35,52,40,68,44,78,60,88,72,100].map((h,i) => (
                    <div key={i} className="flex-1 rounded-t-sm"
                      style={{ height: `${h}%`, background: i === 9 ? "rgba(234,141,14,0.9)" : `rgba(234,141,14,${0.1 + (i/9)*0.3})` }} />
                  ))}
                </div>
                <div className="mt-1.5 text-[7px] text-primary/60 tracking-widest" style={{ fontFamily: "Xirod, monospace" }}>
                  from $130 / stake
                </div>
              </motion.div>

              {/* Teal pulse dot — top of antenna */}
              <motion.div
                className="absolute top-[1%] left-[49%] w-1.5 h-1.5 rounded-full bg-primary"
                animate={{ boxShadow: ["0 0 4px rgba(234,141,14,0.6)", "0 0 14px rgba(234,141,14,0.9)", "0 0 4px rgba(234,141,14,0.6)"] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
            </div>
          </motion.div>

        </div>
      </motion.div>

      {/* ── Ticker ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="relative z-10 w-full overflow-hidden border-t border-white/6 bg-black/35 backdrop-blur py-2.5"
      >
        <div className="ticker-track flex whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center">
              <span className="text-primary mx-3 text-[10px]" style={{ fontFamily: "Xirod, monospace" }}>/</span>
              <span className="text-[10px] tracking-[0.22em] text-white/35 uppercase" style={{ fontFamily: "Neuropol, sans-serif" }}>
                {item}
              </span>
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
