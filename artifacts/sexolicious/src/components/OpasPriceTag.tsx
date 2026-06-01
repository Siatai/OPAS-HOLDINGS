import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useOpasPrice, fmtOpasRate } from "@/lib/opasPrice";

const SHARKON = { fontFamily: "Sharkon, Nevera, sans-serif" };

/**
 * Live $OPAS / USDT price pill. Ticks up and down in real time, flashing
 * green on an up-tick and red on a down-tick. Used in the navbar and on the
 * Marketplace / Portfolio headers.
 */
export default function OpasPriceTag({
  className = "",
  withSparkline = false,
}: {
  className?: string;
  withSparkline?: boolean;
}) {
  const { price, changePct, dir, history } = useOpasPrice();
  const up = changePct >= 0;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border bg-[#050810]/70 backdrop-blur ${
        up ? "border-emerald-400/25" : "border-rose-400/25"
      } ${className}`}
    >
      <span className="hidden sm:inline text-[8px] font-mono tracking-[0.3em] uppercase text-white/40">
        OPAS/USDT
      </span>
      <span className="sm:hidden text-[8px] font-mono tracking-[0.3em] uppercase text-white/40">
        OPAS
      </span>

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={price.toFixed(3)}
          initial={{ color: dir === 1 ? "#6ee7b7" : dir === -1 ? "#fda4af" : "#ffffff" }}
          animate={{ color: "#ffffff" }}
          transition={{ duration: 0.7 }}
          className="text-[12px] tabular-nums leading-none"
          style={SHARKON}
        >
          {fmtOpasRate(price)}
        </motion.span>
      </AnimatePresence>

      {withSparkline && <Sparkline history={history} up={up} />}

      <span
        className={`flex items-center gap-0.5 text-[10px] font-mono tabular-nums ${
          up ? "text-emerald-300" : "text-rose-300"
        }`}
      >
        {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {up ? "+" : ""}
        {changePct.toFixed(2)}%
      </span>
    </div>
  );
}

function Sparkline({ history, up }: { history: number[]; up: boolean }) {
  if (history.length < 2) return null;
  const w = 56;
  const h = 16;
  const min = Math.min(...history);
  const max = Math.max(...history);
  const span = max - min || 1;
  const pts = history
    .map((p, i) => {
      const x = (i / (history.length - 1)) * w;
      const y = h - ((p - min) / span) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} className="hidden md:block" aria-hidden>
      <polyline
        points={pts}
        fill="none"
        stroke={up ? "#34d399" : "#fb7185"}
        strokeWidth={1.25}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.85}
      />
    </svg>
  );
}
