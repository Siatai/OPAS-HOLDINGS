import React, { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Database, Globe2, Users, Layers } from "lucide-react";

const stats = [
  { label: "Total Value Locked", value: 480, prefix: "$", suffix: "M+", decimal: false, icon: Database },
  { label: "Tokenized Assets", value: 120, prefix: "", suffix: "+", decimal: false, icon: Layers },
  { label: "Asset Classes", value: 4, prefix: "", suffix: "", decimal: false, icon: Globe2 },
  { label: "Active Investors", value: 18, prefix: "", suffix: "k", decimal: false, icon: Users },
];

function Counter({ value, prefix, suffix, decimal }: { value: number, prefix: string, suffix: string, decimal: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {prefix}{decimal ? count.toFixed(1) : Math.floor(count)}{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Hex grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'104\' viewBox=\'0 0 60 104\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 104L0 86.6025V51.9615L30 34.641L60 51.9615V86.6025L30 104ZM30 69.282L45 77.9422V60.6217L30 51.9615L15 60.6217V77.9422L30 69.282ZM30 34.641L0 17.3205V-17.3205L30 -34.641L60 -17.3205V17.3205L30 34.641ZM30 0L45 8.66025V-8.66025L30 -17.3205L15 -8.66025V8.66025L30 0Z\' fill=\'%23ffffff\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }} />
      
      {/* Glowing lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_10px_rgba(232,137,12,0.5)]" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_10px_rgba(232,137,12,0.5)]" />
      
      <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        <div className="premium-shell p-6 sm:p-8 md:p-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="premium-flex-card items-center text-center px-4 py-6 sm:px-6 sm:py-8"
              >
                <div className="premium-icon-chip mb-2 sm:mb-3">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                </div>
                <div
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 tracking-tight"
                  style={{ fontFamily: "Rostex, BankGothic, sans-serif" }}
                >
                  <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} decimal={stat.decimal} />
                </div>
                <div
                  className="text-white/45 text-[10px] uppercase tracking-[0.25em]"
                  style={{ fontFamily: "Xirod, monospace" }}
                >
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </div>
        </div>
      </div>
    </section>
  );
}
