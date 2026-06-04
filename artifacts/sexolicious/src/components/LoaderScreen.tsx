import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Phase = "in" | "hold" | "out";

export default function LoaderScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 200);
    const t2 = setTimeout(() => setPhase("out"),  3900);
    const t3 = setTimeout(onComplete,              4700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  const exiting = phase === "out";
  const ease = [0.76, 0, 0.24, 1] as const;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden" aria-hidden>

      {/* ── Top curtain ── */}
      <motion.div
        className="absolute top-0 left-0 w-full h-[51%] bg-[#050810] overflow-hidden flex flex-col items-center justify-end pb-5"
        animate={exiting ? { y: "-100%" } : { y: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        {/* grid overlay */}
        <div className="absolute inset-0 opacity-[0.035]
          bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]
          bg-[size:3.5rem_3.5rem]" />

        {/* amber radial behind logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(234,141,14,0.22) 0%, transparent 70%)", filter: "blur(40px)" }} />

        {/* Logo */}
        <motion.div
          initial={{ scale: 0.25, opacity: 0, rotate: 8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-24 h-24 mb-7"
        >
          <motion.img
            src="/opas-logo.png"
            alt="Opas"
            loading="eager"
            decoding="sync"
            className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(234,141,14,0.7)]"
            animate={{
              scale: [1, 1.045, 1],
              filter: [
                "drop-shadow(0 0 22px rgba(234,141,14,0.52))",
                "drop-shadow(0 0 34px rgba(234,141,14,0.82))",
                "drop-shadow(0 0 22px rgba(234,141,14,0.52))",
              ],
            }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* OPAS — letter stagger */}
        <div className="relative z-10 flex items-end gap-[0.04em] overflow-hidden">
          {"OPAS".split("").map((letter, i) => (
            <motion.span
              key={i}
              initial={{ y: 70, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.05 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="opas-3d text-[72px] md:text-[96px] leading-none tracking-[0.06em]"
              style={{ fontFamily: "DuneRise, BankGothic, sans-serif" }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* ── Bottom curtain ── */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-[51%] bg-[#050810] overflow-hidden flex flex-col items-center justify-start pt-4"
        animate={exiting ? { y: "100%" } : { y: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        {/* grid overlay */}
        <div className="absolute inset-0 opacity-[0.035]
          bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]
          bg-[size:3.5rem_3.5rem]" />

        {/* Amber sweep line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.55, delay: 1.55, ease: "easeInOut" }}
          className="relative z-10 w-[360px] md:w-[520px] h-px origin-left mb-4"
          style={{ background: "linear-gradient(90deg, transparent, #EA8D0E 40%, #EA8D0E 60%, transparent)" }}
        />

        {/* HOLDINGS */}
        <div className="relative z-10 flex items-start gap-[0.02em] overflow-hidden">
          {"HOLDINGS".split("").map((letter, i) => (
            <motion.span
              key={i}
              initial={{ y: -50, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                backgroundPosition: ["140% 50%", "-40% 50%", "-40% 50%"],
              }}
              transition={{
                y: { duration: 0.5, delay: 1.75 + i * 0.03, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.5, delay: 1.75 + i * 0.03, ease: [0.16, 1, 0.3, 1] },
                backgroundPosition: { duration: 1.15, delay: 2.1, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.9 },
              }}
              className="text-xl md:text-2xl leading-none tracking-[0.45em] uppercase text-transparent bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]"
              style={{
                fontFamily: "BankGothic, sans-serif",
                fontWeight: 300,
                backgroundImage: "linear-gradient(100deg, rgba(255,255,255,0.36) 18%, rgba(255,255,255,0.42) 34%, rgba(255,246,222,0.98) 50%, rgba(255,255,255,0.42) 66%, rgba(255,255,255,0.36) 82%)",
                backgroundSize: "220% 100%",
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Sub-line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.4, delay: 2.55, ease: "easeInOut" }}
          className="relative z-10 w-40 h-px bg-primary/25 origin-center mt-5"
        />

        {/* Progress bar */}
        <div className="relative z-10 mt-6 w-[280px] md:w-[360px] h-[2px] bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 2.6, ease: "linear" }}
            className="w-full h-full bg-primary origin-left"
          />
        </div>

        {/* Label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2.85 }}
          className="relative z-10 mt-3 text-[9px] text-white/20 tracking-[0.35em] uppercase"
          style={{ fontFamily: "Xirod, monospace" }}
        >
          Initialising platform
        </motion.p>
      </motion.div>
    </div>
  );
}
