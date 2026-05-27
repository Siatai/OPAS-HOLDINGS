import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Phase = "entering" | "loading" | "exiting";

export default function LoaderScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>("entering");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("loading"), 100);
    const t2 = setTimeout(() => setPhase("exiting"), 3200);
    const t3 = setTimeout(onComplete, 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  const curtainEase = [0.76, 0, 0.24, 1] as const;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none">
      {/* Ambient amber glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: phase === "exiting" ? 0 : 0.35, scale: 1.2 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(232,137,12,0.5) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      {/* Top curtain panel */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1/2 bg-[#05080f] flex items-end justify-center overflow-hidden"
        animate={phase === "exiting" ? { y: "-100%" } : { y: 0 }}
        initial={{ y: 0 }}
        transition={{ duration: 0.55, ease: curtainEase, delay: phase === "exiting" ? 0 : 0 }}
      >
        {/* Tech grid */}
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:3rem_3rem]" />

        {/* Top half content: logo + OPAS */}
        <div className="relative z-10 flex flex-col items-center pb-6 gap-6">
          <motion.div
            initial={{ scale: 0.2, opacity: 0, rotate: 8 }}
            animate={{ scale: 1, opacity: phase === "exiting" ? 0 : 1, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-28 h-28"
          >
            <motion.img
              src="/opas-logo.png"
              alt="Opas"
              className="w-full h-full object-contain"
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          <div className="flex items-center gap-[0.12em] overflow-hidden">
            {"OPAS".split("").map((letter, i) => (
              <motion.span
                key={i}
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.65, delay: 1.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl md:text-8xl font-display font-black text-white tracking-[0.08em]"
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom curtain panel */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-1/2 bg-[#05080f] flex items-start justify-center overflow-hidden"
        animate={phase === "exiting" ? { y: "100%" } : { y: 0 }}
        initial={{ y: 0 }}
        transition={{ duration: 0.55, ease: curtainEase, delay: phase === "exiting" ? 0 : 0 }}
      >
        {/* Tech grid */}
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:3rem_3rem]" />

        {/* Bottom half content: divider line + PROPERTIES + progress bar */}
        <div className="relative z-10 flex flex-col items-center pt-6 w-full max-w-xl px-8 gap-5">
          {/* Amber line sweep */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 1.55, ease: "easeInOut" }}
            className="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent origin-center"
          />

          <div className="flex items-center justify-center overflow-hidden gap-[0.04em]">
            {"PROPERTIES".split("").map((letter, i) => (
              <motion.span
                key={i}
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.8 + i * 0.035, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg md:text-2xl font-display font-light text-white/50 tracking-[0.45em] uppercase"
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* Thin amber sub-line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: 2.25, ease: "easeInOut" }}
            className="w-1/2 h-px bg-primary/30 origin-center"
          />

          {/* Progress bar */}
          <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden mt-2">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.65, delay: 2.4, ease: "linear" }}
              className="w-full h-full bg-primary origin-left"
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 2.5 }}
            className="text-[10px] font-mono text-white/20 tracking-[0.3em] uppercase"
          >
            Initialising platform
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
