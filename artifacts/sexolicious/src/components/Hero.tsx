import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { useWallet } from "./WalletContext";
import FitText, { FitTextGroup } from "./FitText";
import { useOpasPrice, fmtOpasRate } from "@/lib/opasPrice";
import { useMinWidth } from "@/hooks/use-mobile";
import worldSkyline from "@/assets/images/world_skyline.png";
import propPenthouse from "@/assets/images/properties/lux_penthouse_skyline.jpg";
import yachtRiva from "@/assets/images/assets/yacht_riva.png";

const TICKER_ITEMS = [
  "120 assets", "4 asset classes", "$480M aum", "18,000 investors",
  "real estate", "supercars", "yachts", "private jets",
  "avg yield 7.4%", "Dubai +17.2%", "Pagani +22%", "Riva charter +19%",
];

const SHARKON = { fontFamily: "Sharkon, Nevera, sans-serif" };
const NEVERA = { fontFamily: "Nevera, Inter, sans-serif" };
const SERIF = { fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" as const };

const LEDGER_FRAGMENTS = [
  {
    label: "Mayfair Penthouse",
    meta: "Prime residential",
    stat: "+17.2%",
    image: propPenthouse,
    accent: "#E8D7B6",
    className: "left-[-20px] top-[40px] w-[154px] rotate-[-7deg]",
  },
  {
    label: "Riva 110 Dolcevita",
    meta: "Mediterranean charter",
    stat: "+19.1%",
    image: yachtRiva,
    accent: "#3ED6C3",
    className: "right-[-18px] bottom-[34px] w-[168px] rotate-[7deg]",
  },
] as const;

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 120]);
  const opacity = useTransform(scrollY, [0, 520, 780], [1, 1, 0]);
  const { openWallet } = useWallet();
  const { price: opasPrice, changePct: opasChange } = useOpasPrice();

  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const sectionRef = useRef<HTMLElement>(null);
  const showCenter = useMinWidth(1535);
  const reduceMotion = useReducedMotion();
  const tiltY = (mousePos.x - 0.5) * 14;
  const tiltX = -(mousePos.y - 0.5) * 14;

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
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse 50% 50% at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(234,141,14,0.05) 0%, transparent 70%)`,
        }}
      />

      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_45%_60%_at_75%_45%,rgba(200,210,225,0.045)_0%,transparent_70%)]" />
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_45%_55%_at_22%_55%,rgba(234,141,14,0.04)_0%,transparent_70%)]" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[44%] z-0 overflow-hidden">
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
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, hsl(222,47%,5%) 0%, rgba(8,12,24,0.55) 30%, rgba(8,12,24,0.12) 62%, transparent 100%)",
          }}
        />
        <div className="absolute inset-y-0 left-0 w-24 md:w-44 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-44 bg-gradient-to-l from-background to-transparent" />
        <div
          className="absolute inset-x-0 bottom-0 h-20 opacity-[0.16]"
          style={{
            background:
              "radial-gradient(ellipse 60% 100% at 50% 100%, rgba(234,141,14,0.3), transparent 70%)",
          }}
        />
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]
        bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]
        bg-[size:4rem_4rem]
        [mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,#000_15%,transparent_100%)]" />

      {showCenter && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute z-[6] top-[45%] left-[calc(50%_+_24px)] -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] pointer-events-none"
          style={{ perspective: "1300px" }}
        >
          <div
            className="relative w-full h-full"
            style={{
              transformStyle: "preserve-3d",
              transform: reduceMotion ? undefined : `rotateX(${tiltX * 0.55}deg) rotateY(${tiltY * 0.55}deg)`,
              transition: "transform 0.35s ease-out",
            }}
          >
            <div
              className="absolute inset-[18px] rounded-[42px] blur-3xl opacity-90"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(242,140,40,0.22) 0%, rgba(217,107,157,0.10) 30%, rgba(61,15,28,0.16) 58%, transparent 80%)",
              }}
            />

            <motion.div
              className="absolute left-1/2 top-1/2 h-[236px] w-[236px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[32px]"
              animate={reduceMotion ? undefined : { rotateZ: [-1, 1.2, -1] }}
              transition={reduceMotion ? undefined : { duration: 16, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background:
                  "linear-gradient(155deg, rgba(16,16,21,0.97) 0%, rgba(8,9,12,0.98) 48%, rgba(34,20,12,0.96) 100%)",
                border: "1px solid rgba(255,236,205,0.16)",
                boxShadow:
                  "0 44px 110px -40px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,245,227,0.12), inset 0 -30px 60px rgba(242,140,40,0.08)",
              }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_18%,transparent_82%,rgba(242,140,40,0.05))]" />
              <motion.div
                aria-hidden
                className="absolute inset-y-0 left-[-18%] w-[36%] skew-x-[-18deg] bg-[linear-gradient(90deg,transparent,rgba(255,244,221,0.16),transparent)] mix-blend-screen"
                animate={reduceMotion ? undefined : { x: ["-20%", "350%"] }}
                transition={reduceMotion ? undefined : { duration: 8.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.6 }}
              />

              <div className="relative z-10 flex h-full flex-col px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl"
                      style={{
                        background: "linear-gradient(145deg, rgba(245,217,142,0.22), rgba(242,140,40,0.16))",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16), 0 10px 28px -16px rgba(242,140,40,0.85)",
                      }}
                    >
                      <img src="/opas-logo.png" alt="Opas" className="h-8 w-8 object-contain" />
                    </div>
                    <div>
                      <div className="text-[9px] tracking-[0.34em] uppercase text-white/36" style={NEVERA}>Private index</div>
                      <div className="text-[14px] tracking-[0.18em] uppercase text-[#f6dfb2]" style={NEVERA}>Black Ledger</div>
                    </div>
                  </div>
                  <div className="rounded-full border border-white/10 px-3 py-1 text-[8px] tracking-[0.28em] uppercase text-[#f3c97a]" style={NEVERA}>
                    Invite only
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-[8px] tracking-[0.34em] uppercase text-white/34" style={NEVERA}>Access to curated trophy inventory</div>
                  <div className="mt-2 text-[31px] leading-[0.95] text-[#f7e7c3]" style={SHARKON}>
                    Wealth wants
                    <br />
                    discretion.
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    { label: "AUM", value: "$480M", tone: "text-[#f7e7c3]" },
                    { label: "Net Yield", value: "6.1%", tone: "text-[#f3b562]" },
                    { label: "Entry", value: "$100", tone: "text-[#f7e7c3]" },
                    { label: "Windows", value: "04", tone: "text-[#d772a0]" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl px-4 py-3"
                      style={{
                        background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
                        border: "1px solid rgba(255,236,205,0.10)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                      }}
                    >
                      <div className="text-[7px] tracking-[0.32em] uppercase text-white/34" style={NEVERA}>{item.label}</div>
                      <div className={`mt-2 text-[18px] leading-none ${item.tone}`} style={SHARKON}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {LEDGER_FRAGMENTS.map((fragment, index) => (
              <motion.div
                key={fragment.label}
                initial={{ opacity: 0, y: 16, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.55 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className={`absolute ${fragment.className}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div
                  className="overflow-hidden rounded-[24px]"
                  animate={reduceMotion ? undefined : { y: [-4, 4, -4] }}
                  transition={reduceMotion ? undefined : { duration: 9 + index, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    background: "linear-gradient(180deg, rgba(18,18,22,0.96), rgba(9,9,12,0.98))",
                    border: "1px solid rgba(255,236,205,0.14)",
                    boxShadow: `0 20px 40px -20px rgba(0,0,0,0.88), inset 0 1px 0 rgba(255,245,227,0.10), 0 0 24px -14px ${fragment.accent}`,
                  }}
                >
                  <div className="relative h-[106px] overflow-hidden">
                    <img src={fragment.image} alt="" className="h-full w-full object-cover object-center" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(7,7,10,0.08)_45%,rgba(7,7,10,0.72)_100%)]" />
                  </div>
                  <div className="px-4 py-3">
                    <div className="text-[7px] tracking-[0.30em] uppercase text-white/34" style={NEVERA}>{fragment.meta}</div>
                    <div className="mt-1 text-[13px] leading-tight text-white/88" style={SHARKON}>{fragment.label}</div>
                    <div className="mt-2 text-[10px] tracking-[0.28em] uppercase" style={{ ...NEVERA, color: fragment.accent }}>{fragment.stat}</div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex-1 w-full container mx-auto px-6 lg:px-12 pt-28 lg:pt-32 pb-4 flex items-center"
      >
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-10 xl:gap-16 items-center">
          <div className="flex flex-col md:col-span-7">
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

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35 }}
              className="text-[15px] md:text-base text-white/45 max-w-md mb-10 leading-relaxed"
              style={SERIF}
            >
              The planet&apos;s rarest real estate, supercars, yachts and jets acquired in minutes,
              held with discretion, and surfaced through a private ledger built for serious capital.
            </motion.p>

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

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full md:col-span-5 flex justify-center md:justify-end"
          >
            <div className="relative w-full max-w-sm">
              <div
                aria-hidden
                className="absolute -inset-10 rounded-full opacity-60 blur-2xl pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(200,210,225,0.06) 0%, transparent 60%)",
                }}
              />

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

                <div className="h-12 flex items-end gap-[3px] mb-5 px-0.5">
                  {[42,55,48,62,58,71,65,78,72,84,79,92,86,100].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-[2px]"
                      style={{
                        height: `${h}%`,
                        background:
                          i === 13
                            ? "linear-gradient(180deg, #f5d98e, #ea8d0e)"
                            : `linear-gradient(180deg, rgba(232,232,238,${0.18 + (i / 13) * 0.25}), rgba(154,160,168,${0.08 + (i / 13) * 0.12}))`,
                      }}
                    />
                  ))}
                </div>

                <div className="metallic-divider mb-4" />

                <FitTextGroup>
                  <div
                    className="grid grid-cols-3 gap-px rounded-lg overflow-hidden"
                    style={{
                      background: "linear-gradient(180deg, rgba(220,225,235,0.10), rgba(220,225,235,0.04))",
                      border: "1px solid rgba(220,225,235,0.10)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                    }}
                  >
                    {[
                      { l: "AUM", v: "$480M" },
                      { l: "Assets", v: "120" },
                      { l: "Investors", v: "18k" },
                    ].map((d) => (
                      <div
                        key={d.l}
                        className="px-2 py-2.5 flex flex-col justify-center"
                        style={{ background: "linear-gradient(180deg, rgba(10,13,22,0.82), rgba(7,9,16,0.92))" }}
                      >
                        <FitText align="center" className="text-[7.5px] tracking-[0.26em] uppercase text-white/35 mb-1" style={NEVERA}>{d.l}</FitText>
                        <FitText share align="center" className="h-[18px] text-[18px] leading-none" style={SHARKON}><span className="metallic-text">{d.v}</span></FitText>
                      </div>
                    ))}
                  </div>
                </FitTextGroup>

                <div className="mt-5 flex items-center justify-between text-[8px] tracking-[0.32em] uppercase text-white/30" style={NEVERA}>
                  <span>opa-idx-001</span>
                  <span className="text-primary/60">stake from $100</span>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </motion.div>

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
