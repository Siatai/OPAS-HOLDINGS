import React, { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { label: "Total Value Locked", value: 142, prefix: "$", suffix: "M+", decimal: false },
  { label: "Global Properties", value: 48, prefix: "", suffix: "", decimal: false },
  { label: "Active Investors", value: 12.5, prefix: "", suffix: "k", decimal: true },
  { label: "Countries Present", value: 16, prefix: "", suffix: "", decimal: false },
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
    <section className="py-24 border-y border-white/5 bg-[#050505] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 divide-x divide-white/5">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-center text-center px-4"
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4 luxury-gradient-text drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} decimal={stat.decimal} />
              </div>
              <div className="text-white/40 text-xs md:text-sm tracking-[0.2em] uppercase font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
