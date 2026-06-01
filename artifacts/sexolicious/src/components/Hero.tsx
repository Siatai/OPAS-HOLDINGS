import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { useWallet } from "./WalletContext";
import FitText from "./FitText";
import { useOpasPrice, fmtOpasRate } from "@/lib/opasPrice";
import worldSkyline from "@/assets/images/world_skyline.png";
import heroCar from "@/assets/images/assets/car_ferrari.png";
import heroYacht from "@/assets/images/assets/yacht_riva.png";
import heroJet from "@/assets/images/assets/jet_gulfstream.png";

const TICKER_ITEMS = [
  "120 assets", "4 asset classes", "$480M aum", "18,000 investors",
  "real estate", "supercars", "yachts", "private jets",
  "avg yield 7.4%", "Dubai +17.2%", "Pagani +22%", "Riva charter +19%",
];

const SHARKON = { fontFamily: "Sharkon, Nevera, sans-serif" };
const NEVERA  = { fontFamily: "Nevera, Inter, sans-serif" };
const SERIF   = { fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" as const };

const HERO_ASSETS = [
  { img: heroCar,   label: "Supercars",    yld: "12.6%", accent: "#EA8D0E", pos: "bottom-[16%] left-[3%]",  delay: 0.9,  dur: 5.0 },
  { img: heroYacht, label: "Yachts",       yld: "11.0%", accent: "#0BB5BE", pos: "bottom-[10%] left-[22%]", delay: 1.1,  dur: 6.0 },
  { img: heroJet,   label: "Private Jets", yld: "10.8%", accent: "#22D3EE", pos: "bottom-[24%] left-[40%]", delay: 1.3,  dur: 5.5 },
];

export default function Hero() {
  const { scrollY } = useScroll();
  const y       = useTransform(scrollY, [0, 800], [0, 120]);
  const opacity = useTransform(scrollY, [0, 520, 780], [1, 1, 0]);
  const { openWallet } = useWallet();
  const { price: opasPrice, changePct: opasChange } = useOpasPrice();

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

      {/* World-landmarks skyline — infinite, dimmed, classy marquee band */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[44%] z-0 overflow-hidden">
        {/* Mirror-tiled track: [A][A-flipped] repeated → seamless infinite loop */}
        <div className="skyline-scroll flex h-full w-max items-end will-change-transform">
          {Array.from({ length: 8 }, (_, i) => i).map((i) => (
            <img
              key={i}
              src={worldSkyline}
              alt=""
              draggable={false}
              className={`h-full w-auto object-cover object-bottom select-none ${i % 2 === 1 ? "-scale-x-100" : ""}`}
              style={{ filter: "brightness(0.7) saturate(0.8) contrast(1.03)" }}
            />
          ))}
        </div>
        {/* Top fade — blend strip into the dark hero background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, hsl(222,47%,5%) 0%, rgba(8,12,24,0.55) 30%, rgba(8,12,24,0.12) 62%, transparent 100%)",
          }}
        />
        {/* Side vignette fades — keep the loop edges soft & refined */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-44 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-44 bg-gradient-to-l from-background to-transparent" />
        {/* Whisper-soft amber horizon */}
        <div
          className="absolute inset-x-0 bottom-0 h-20 opacity-[0.16]"
          style={{
            background:
              "radial-gradient(ellipse 60% 100% at 50% 100%, rgba(234,141,14,0.3), transparent 70%)",
          }}
        />
      </div>

      {/* Floating tokenized-asset cards over the skyline (desktop) */}
      <div className="hidden lg:block absolute inset-0 z-[5] pointer-events-none">
        {HERO_ASSETS.map((a) => (
          <motion.div
            key={a.label}
            className={`absolute ${a.pos} w-[160px] rounded-lg overflow-hidden`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: [0, -10, 0] }}
            transition={{
              opacity: { duration: 0.8, delay: a.delay },
              y: { duration: a.dur, repeat: Infinity, ease: "easeInOut", delay: a.delay },
            }}
            style={{
              border: `1px solid ${a.accent}59`,
              boxShadow: `0 20px 50px -20px rgba(0,0,0,0.7), 0 0 42px -16px ${a.accent}80`,
            }}
          >
            <div className="relative aspect-[16/10]">
              <img src={a.img} alt={a.label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <span
                className="absolute top-2 left-2 text-[7px] tracking-[0.28em] uppercase px-1.5 py-0.5 rounded backdrop-blur-sm"
                style={{ ...NEVERA, background: `${a.accent}33`, color: "#fff" }}
              >
                Tokenized
              </span>
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <span className="text-[8px] tracking-[0.26em] uppercase text-white/85" style={NEVERA}>{a.label}</span>
                <span className="inline-flex items-center gap-1 text-[9px]" style={{ ...NEVERA, color: a.accent }}>
                  <TrendingUp className="w-2.5 h-2.5" /> {a.yld}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
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
              className="text-2xl sm:text-3xl md:text-[2.1rem] leading-[1.18] tracking-[0.01em] mb-6 font-normal"
              style={SHARKON}
            >
              <span className="metallic-text">Own anything,</span>
              <br />
              <span className="metallic-warm-text">anywhere.</span>
            </motion.h1>

            {/* Subhead — Cormorant italic, restrained */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35 }}
              className="text-[15px] md:text-base text-white/45 max-w-md mb-10 leading-relaxed"
              style={SERIF}
            >
              The planet's rarest real estate, supercars, yachts &amp; jets — acquired in minutes,
              owned on-chain, liquid on demand. AI valuation, blockchain title, sovereign-grade discretion.
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
                className="btn-metal group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-sm transition-all duration-300 hover:translate-y-[-1px]"
                style={NEVERA}
              >
                <span className="relative z-10 text-[10.5px] font-bold tracking-[0.28em] uppercase text-[#1a0e02]">
                  Connect wallet
                </span>
                <ArrowRight className="w-3.5 h-3.5 relative z-10 text-[#1a0e02] group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              <a
                href="#properties"
                className="btn-metal-silver group inline-flex items-center gap-2 px-6 py-3 rounded-sm transition-all duration-300 hover:translate-y-[-1px]"
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

                {/* Live $OPAS price */}
                <div
                  className="flex items-center justify-between mb-5 rounded-lg px-3 py-2.5"
                  style={{
                    background: "rgba(11,181,190,0.07)",
                    border: "1px solid rgba(11,181,190,0.22)",
                  }}
                >
                  <div className="leading-tight">
                    <div className="text-[7.5px] tracking-[0.3em] uppercase text-white/35 mb-0.5" style={NEVERA}>
                      $OPAS · USDT
                    </div>
                    <div className="text-[20px] leading-none text-secondary" style={SHARKON}>
                      {fmtOpasRate(opasPrice)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp
                      className={`w-3 h-3 ${opasChange >= 0 ? "text-emerald-400" : "text-rose-400 rotate-180"}`}
                    />
                    <span
                      className={`text-[11px] font-mono tabular-nums ${opasChange >= 0 ? "text-emerald-300" : "text-rose-300"}`}
                    >
                      {opasChange >= 0 ? "+" : ""}{opasChange.toFixed(2)}%
                    </span>
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

                {/* Three-stat row — segmented premium panel with hairline dividers */}
                <div
                  className="grid grid-cols-3 gap-px rounded-lg overflow-hidden"
                  style={{
                    background: "linear-gradient(180deg, rgba(220,225,235,0.10), rgba(220,225,235,0.04))",
                    border: "1px solid rgba(220,225,235,0.10)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                  }}
                >
                  {[
                    { l: "AUM",       v: "$480M" },
                    { l: "Assets",    v: "120"   },
                    { l: "Investors", v: "18k"   },
                  ].map(d => (
                    <div
                      key={d.l}
                      className="px-2 py-2.5"
                      style={{ background: "linear-gradient(180deg, rgba(10,13,22,0.82), rgba(7,9,16,0.92))" }}
                    >
                      <FitText align="center" className="text-[7.5px] tracking-[0.26em] uppercase text-white/35 mb-1" style={NEVERA}>{d.l}</FitText>
                      <FitText align="center" className="text-[18px] leading-none" style={SHARKON}><span className="metallic-text">{d.v}</span></FitText>
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
