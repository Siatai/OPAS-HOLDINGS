import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { useWallet } from "./WalletContext";
import worldSkyline from "@/assets/images/world_skyline.png";

const TICKER_ITEMS = [
  "48 properties", "$142M aum", "12,500 investors", "16 countries",
  "avg yield 6.1%", "Dubai +17.2%", "Tokyo +9.6%", "Miami +14.2%",
];

const SHARKON = { fontFamily: "Sharkon, Nevera, sans-serif" };
const NEVERA  = { fontFamily: "Nevera, Inter, sans-serif" };
const SERIF   = { fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" as const };

export default function Hero() {
  const { scrollY } = useScroll();
  const y       = useTransform(scrollY, [0, 800], [0, 120]);
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
      {/* Subtle mouse-tracking radial — much softer than before */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse 50% 50% at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(234,141,14,0.05) 0%, transparent 70%)`,
        }}
      />

      {/* Cool silver wash on the right side — metallic atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_45%_60%_at_75%_45%,rgba(200,210,225,0.045)_0%,transparent_70%)]" />

      {/* Faint amber wash on the left */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_45%_55%_at_22%_55%,rgba(234,141,14,0.04)_0%,transparent_70%)]" />

      {/* World-landmarks skyline backdrop */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] z-0 overflow-hidden">
        <img
          src={worldSkyline}
          alt=""
          className="absolute inset-x-0 bottom-0 w-full h-full object-cover object-bottom"
          style={{ filter: "saturate(1.05) contrast(1.05)" }}
        />
        {/* Top fade — blend image into the dark hero background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, hsl(222,47%,5%) 0%, rgba(8,12,24,0.55) 35%, transparent 70%)",
          }}
        />
        {/* Subtle amber horizon kiss */}
        <div
          className="absolute inset-x-0 bottom-[28%] h-32 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 60% 100% at 50% 100%, rgba(234,141,14,0.35), transparent 70%)",
          }}
        />
      </div>

      {/* Refined HUD grid — even more subtle */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]
        bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]
        bg-[size:4rem_4rem]
        [mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,#000_15%,transparent_100%)]" />

      {/* ── Main content ── */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex-1 w-full container mx-auto px-6 lg:px-12 pt-28 lg:pt-32 pb-4 flex items-center"
      >
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-10 xl:gap-16 items-center">

          {/* ── Left: copy ── */}
          <div className="flex flex-col md:col-span-7">

            {/* Status pill — silver/teal, refined */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="metallic-border inline-flex items-center gap-2 px-3 py-1 mb-8 w-fit rounded-full"
            >
              <span className="w-1 h-1 rounded-full bg-secondary animate-pulse" />
              <span className="text-[9px] tracking-[0.32em] uppercase metallic-text" style={NEVERA}>
                System online · v1.0.4
              </span>
            </motion.div>

            {/* Headline — Sharkon, sleek, metallic accents */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(1.4rem,2.4vw,2.1rem)] leading-[1.18] tracking-[0.01em] mb-6 font-normal"
              style={SHARKON}
            >
              <span className="metallic-text">Where technology</span>
              <br />
              <span className="metallic-warm-text">meets</span>{" "}
              <span className="text-white/90">prime real estate</span>
            </motion.h1>

            {/* Subhead — Cormorant italic, restrained */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35 }}
              className="text-[15px] md:text-base text-white/45 max-w-md mb-10 leading-relaxed"
              style={SERIF}
            >
              AI-driven valuation. Blockchain co-ownership. Real-time market intelligence.
              An equity interest in the world's finest properties — from&nbsp;$100.
            </motion.p>

            {/* CTAs — silver metallic outline + warm primary */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="flex flex-wrap gap-3.5 mb-10 md:mb-0"
            >
              <button
                onClick={openWallet}
                className="group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-sm overflow-hidden transition-all duration-300 hover:translate-y-[-1px]"
                style={{
                  ...NEVERA,
                  background: "linear-gradient(180deg, #f5b955 0%, #ea8d0e 50%, #b87d1e 100%)",
                  boxShadow: "0 8px 28px -10px rgba(234,141,14,0.55), inset 0 1px 0 rgba(255,255,255,0.25)",
                }}
              >
                <span className="relative z-10 text-[10.5px] font-bold tracking-[0.28em] uppercase text-[#1a0e02]">
                  Connect wallet
                </span>
                <ArrowRight className="w-3.5 h-3.5 relative z-10 text-[#1a0e02] group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              <a
                href="#properties"
                className="metallic-border group inline-flex items-center gap-2 px-6 py-3 rounded-sm transition-all duration-300 hover:translate-y-[-1px] hover:bg-white/[0.03]"
                style={NEVERA}
              >
                <span className="text-[10.5px] font-bold tracking-[0.28em] uppercase text-white/85 group-hover:text-white">
                  View portfolio
                </span>
              </a>
            </motion.div>
          </div>

          {/* ── Right: sleek metallic data panel (no building) ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full md:col-span-5 flex justify-center md:justify-end"
          >
            <div className="relative w-full max-w-sm">
              {/* Faint metallic disc behind panel */}
              <div
                aria-hidden
                className="absolute -inset-10 rounded-full opacity-60 blur-2xl pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(200,210,225,0.06) 0%, transparent 60%)",
                }}
              />

              {/* Index ticker card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative rounded-xl p-6 backdrop-blur-2xl overflow-hidden"
                style={{
                  background:
                    "linear-gradient(155deg, rgba(28,38,62,0.96) 0%, rgba(20,28,48,0.96) 55%, rgba(38,28,16,0.96) 100%)",
                  border: "1px solid rgba(220,225,235,0.18)",
                  boxShadow:
                    "0 30px 70px -15px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 0 1px rgba(232,232,238,0.04)",
                }}
              >
                {/* Top row: token id + status */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, #f5d98e 0%, #c8912a 100%)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 0 14px rgba(234,141,14,0.35)",
                      }}
                    >
                      <span className="text-[9px] font-bold text-[#1a0e02] tracking-tighter" style={NEVERA}>OP</span>
                    </div>
                    <div className="leading-tight">
                      <div className="text-[8.5px] tracking-[0.3em] uppercase text-white/35" style={NEVERA}>Opas index</div>
                      <div className="text-[11px] tracking-[0.2em] uppercase metallic-text" style={NEVERA}>Live · Tier I</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                    <span className="text-[8.5px] tracking-[0.3em] uppercase text-secondary/80" style={NEVERA}>online</span>
                  </div>
                </div>

                {/* Hero metric */}
                <div className="mb-5">
                  <div className="text-[8.5px] tracking-[0.32em] uppercase text-white/35 mb-1.5" style={NEVERA}>
                    Aggregate net yield
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="text-[44px] leading-none metallic-warm-text font-normal" style={SHARKON}>
                      6.1%
                    </div>
                    <div className="flex items-center gap-1 pb-1.5">
                      <TrendingUp className="w-3 h-3 text-secondary" />
                      <span className="text-[10px] text-secondary tracking-wider" style={NEVERA}>+0.4 wk</span>
                    </div>
                  </div>
                </div>

                {/* Sparkline */}
                <div className="h-12 flex items-end gap-[3px] mb-5 px-0.5">
                  {[42,55,48,62,58,71,65,78,72,84,79,92,86,100].map((h,i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-[2px]"
                      style={{
                        height: `${h}%`,
                        background:
                          i === 13
                            ? "linear-gradient(180deg, #f5d98e, #ea8d0e)"
                            : `linear-gradient(180deg, rgba(232,232,238,${0.18 + (i/13)*0.25}), rgba(154,160,168,${0.08 + (i/13)*0.12}))`,
                      }}
                    />
                  ))}
                </div>

                {/* Metallic divider */}
                <div className="metallic-divider mb-4" />

                {/* Three-stat row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { l: "AUM",        v: "$142M" },
                    { l: "Properties", v: "48"    },
                    { l: "Investors",  v: "12.5k" },
                  ].map(d => (
                    <div key={d.l} className="text-center">
                      <div className="text-[7.5px] tracking-[0.28em] uppercase text-white/30 mb-1" style={NEVERA}>{d.l}</div>
                      <div className="text-[15px] metallic-text" style={SHARKON}>{d.v}</div>
                    </div>
                  ))}
                </div>

                {/* Bottom token strip */}
                <div className="mt-5 flex items-center justify-between text-[8px] tracking-[0.32em] uppercase text-white/30" style={NEVERA}>
                  <span>opa-idx-001</span>
                  <span className="text-primary/60">stake from $100</span>
                </div>
              </motion.div>

              {/* Tiny floating chip — Tokyo highlight */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.1 }}
                className="absolute -bottom-4 -left-3 rounded-md px-3 py-2 backdrop-blur-xl border border-white/15"
                style={{
                  background: "rgba(20,28,48,0.95)",
                  boxShadow: "0 8px 24px -8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[8.5px] tracking-[0.3em] uppercase text-white/50" style={NEVERA}>Tokyo</span>
                  <span className="text-[10px] metallic-warm-text" style={NEVERA}>+9.6%</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </motion.div>

      {/* ── Refined ticker ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="relative z-10 w-full overflow-hidden border-t border-white/5 bg-black/40 backdrop-blur py-2.5"
      >
        <div className="ticker-track flex whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center">
              <span className="metallic-text mx-4 text-[10px]" style={NEVERA}>◇</span>
              <span className="text-[10px] tracking-[0.28em] text-white/35 uppercase" style={NEVERA}>
                {item}
              </span>
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
