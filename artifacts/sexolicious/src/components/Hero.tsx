import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { useWallet } from "./WalletContext";
import FitText, { FitTextGroup } from "./FitText";
import { useOpasPrice, fmtOpasRate } from "@/lib/opasPrice";
import { useMinWidth } from "@/hooks/use-mobile";
import worldSkyline from "@/assets/images/world_skyline.png";
import propBeachfront from "@/assets/images/properties/lux_beachfront.jpg";
import yachtRiva from "@/assets/images/assets/yacht_riva.png";
import jetCabin from "@/assets/images/assets/jet_cabin.png";
import carLambo from "@/assets/images/assets/car_lambo.png";

const TICKER_ITEMS = [
  "120 assets", "4 asset classes", "$480M aum", "18,000 investors",
  "real estate", "supercars", "yachts", "private jets",
  "avg yield 7.4%", "Dubai +17.2%", "Pagani +22%", "Riva charter +19%",
];

const SHARKON = { fontFamily: "Sharkon, Nevera, sans-serif" };
const NEVERA = { fontFamily: "Nevera, Inter, sans-serif" };
const SERIF = { fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" as const };

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
          className="absolute z-[6] top-[47%] left-[calc(50%_+_12px)] -translate-x-1/2 -translate-y-1/2 w-[368px] h-[520px] pointer-events-none"
          style={{ perspective: "1300px" }}
        >
          <div
            className="relative w-full h-full"
            style={{
              transformStyle: "preserve-3d",
              transform: reduceMotion ? undefined : `rotateX(${tiltX * 0.16}deg) rotateY(${tiltY * 0.16}deg)`,
              transition: "transform 0.35s ease-out",
            }}
          >
            <div
              className="absolute inset-[30px] rounded-[48px] blur-3xl opacity-80"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(242,140,40,0.16) 0%, rgba(217,107,157,0.08) 36%, rgba(61,15,28,0.12) 64%, transparent 84%)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.85, delay: 0.46, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-[40px] top-[58px] h-[318px] w-[150px]"
              style={{
                transform: reduceMotion ? undefined : `translate3d(${tiltY * -0.18}px, ${tiltX * 0.12}px, -18px)`,
              }}
            >
              <div
                className="relative h-full overflow-hidden rounded-[26px]"
                style={{
                  background: "linear-gradient(180deg, rgba(18,20,26,0.96), rgba(10,10,14,0.98))",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 26px 56px -30px rgba(0,0,0,0.94), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
              >
                <img src={jetCabin} alt="" className="h-full w-full object-cover object-center opacity-90" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,8,14,0.10)_0%,rgba(6,8,14,0.24)_34%,rgba(7,7,10,0.78)_100%)]" />
                <div className="absolute left-4 top-4 text-[8px] tracking-[0.34em] uppercase text-white/50" style={NEVERA}>
                  Flight access
                </div>
                <div className="absolute left-4 bottom-5 text-[9px] tracking-[0.26em] uppercase text-[#f3b562]" style={NEVERA}>
                  Private jets
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-[172px] top-[286px] h-[158px] w-[174px]"
              style={{
                transform: reduceMotion ? undefined : `translate3d(${tiltY * 0.16}px, ${tiltX * -0.12}px, -10px)`,
              }}
            >
              <div
                className="relative h-full overflow-hidden rounded-[24px]"
                style={{
                  background: "linear-gradient(180deg, rgba(18,20,26,0.96), rgba(10,10,14,0.98))",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 22px 46px -26px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
              >
                <img src={carLambo} alt="" className="h-full w-full object-cover object-center" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,10,0.06)_0%,rgba(7,7,10,0.16)_34%,rgba(7,7,10,0.72)_100%)]" />
                <div className="absolute left-4 bottom-4 text-[9px] tracking-[0.26em] uppercase text-[#d96b9d]" style={NEVERA}>
                  Supercars
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-[88px] top-[24px] h-[404px] w-[228px]"
              style={{
                transformStyle: "preserve-3d",
                transform: reduceMotion
                  ? "translateZ(0)"
                  : `translate3d(${tiltY * 0.24}px, ${tiltX * -0.18}px, 8px) rotateX(${tiltX * 0.04}deg) rotateY(${tiltY * 0.05}deg)`,
              }}
            >
              <div
                className="absolute inset-[18px] rounded-[34px] blur-2xl opacity-80"
                style={{ background: "radial-gradient(circle at 50% 30%, rgba(234,141,14,0.22), transparent 72%)" }}
              />
              <div
                className="relative h-full overflow-hidden rounded-[30px]"
                style={{
                  background: "linear-gradient(160deg, rgba(21,25,34,0.98) 0%, rgba(10,11,15,0.99) 70%, rgba(32,20,10,0.96) 100%)",
                  border: "1px solid rgba(247,229,193,0.14)",
                  boxShadow:
                    "0 42px 90px -38px rgba(0,0,0,0.96), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -24px 60px rgba(234,141,14,0.05)",
                }}
              >
                <div className="absolute inset-x-0 top-0 h-[56%] overflow-hidden">
                  <img src={propBeachfront} alt="" className="h-full w-full object-cover object-center" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,246,230,0.05)_0%,transparent_28%,rgba(9,10,14,0.12)_52%,rgba(9,10,14,0.62)_100%)]" />
                </div>
                <div className="absolute inset-x-0 top-[50%] h-[2px] bg-[linear-gradient(90deg,transparent,rgba(247,229,193,0.55),transparent)]" />
                <div className="absolute inset-x-0 bottom-0 h-[50%] bg-[linear-gradient(180deg,rgba(12,14,18,0.08)_0%,rgba(11,12,16,0.94)_18%,rgba(10,10,14,0.98)_100%)]" />

                <div className="absolute left-6 top-5 rounded-full px-3 py-1 text-[8px] tracking-[0.30em] uppercase text-[#f7e5c1]" style={{ ...NEVERA, background: "rgba(12,14,18,0.46)", border: "1px solid rgba(247,229,193,0.16)" }}>
                  Tier I access
                </div>
                <div className="absolute right-6 top-6 text-[8px] tracking-[0.28em] uppercase text-white/52" style={NEVERA}>
                  Curated issue
                </div>

                <div className="absolute left-6 right-6 bottom-28">
                  <div className="text-[8px] tracking-[0.34em] uppercase text-white/40 mb-2" style={NEVERA}>
                    Private market folio
                  </div>
                  <div className="text-[29px] leading-[0.95] text-[#f7e7c3]" style={SHARKON}>
                    Trophy assets,
                    <br />
                    privately held.
                  </div>
                </div>

                <div className="absolute left-6 right-6 bottom-7 grid grid-cols-2 gap-3">
                  {[
                    { label: "Estates", value: "Palm / Mayfair" },
                    { label: "Water", value: "Riva / Gulf" },
                    { label: "Air", value: "Cabin class" },
                    { label: "Road", value: "Collector spec" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl px-3 py-2"
                      style={{
                        background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
                        border: "1px solid rgba(247,229,193,0.08)",
                      }}
                    >
                      <div className="text-[7px] tracking-[0.28em] uppercase text-white/34" style={NEVERA}>{item.label}</div>
                      <div className="mt-1 text-[10px] tracking-[0.12em] uppercase text-white/80" style={NEVERA}>{item.value}</div>
                    </div>
                  ))}
                </div>

                <motion.div
                  aria-hidden
                  className="absolute inset-y-0 left-[-24%] w-[26%] skew-x-[-18deg] bg-[linear-gradient(90deg,transparent,rgba(255,246,227,0.12),transparent)] mix-blend-screen"
                  animate={reduceMotion ? undefined : { x: ["-24%", "420%"] }}
                  transition={reduceMotion ? undefined : { duration: 10.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 2.8 }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.68, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-[46px] top-[390px] flex items-center gap-3 rounded-full px-4 py-2"
              style={{
                background: "rgba(13,14,18,0.72)",
                border: "1px solid rgba(247,229,193,0.10)",
                boxShadow: "0 18px 36px -24px rgba(0,0,0,0.9)",
              }}
            >
              <img src={yachtRiva} alt="" className="h-10 w-16 rounded-full object-cover object-center opacity-90" />
              <div>
                <div className="text-[7px] tracking-[0.28em] uppercase text-white/38" style={NEVERA}>Superyachts</div>
                <div className="text-[10px] tracking-[0.18em] uppercase text-[#3ed6c3]" style={NEVERA}>Marina wealth</div>
              </div>
            </motion.div>
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
              owned on-chain, and packaged with the polish of a private-market glossy.
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
