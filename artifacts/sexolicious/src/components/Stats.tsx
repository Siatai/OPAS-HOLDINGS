import React, { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Database, Globe2, Users, Layers } from "lucide-react";

const stats = [
  { label: "Total Value Locked", value: 142, prefix: "$", suffix: "M+", decimal: false, icon: Database },
  { label: "Global Properties", value: 48, prefix: "", suffix: "", decimal: false, icon: Layers },
  { label: "Active Investors", value: 12.5, prefix: "", suffix: "k", decimal: true, icon: Users },
  { label: "Countries Present", value: 16, prefix: "", suffix: "", decimal: false, icon: Globe2 },
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
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 divide-x divide-white/5">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col items-center text-center px-4"
              >
                <div className="mb-4 p-3 rounded-full bg-white/5 border border-white/10">
                  <Icon className="w-5 h-5 text-secondary" />
                </div>
                <div className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 tracking-tighter">
                  <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} decimal={stat.decimal} />
                </div>
                <div className="text-white/50 text-xs font-mono uppercase tracking-widest">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
