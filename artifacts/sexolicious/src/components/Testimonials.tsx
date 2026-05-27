import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "I've always wanted exposure to the Dubai real estate market, but the barrier to entry was too high. Opas Properties let me build a global portfolio in literally 10 minutes. The monthly yields are flawless.",
    name: "Alexander C.",
    role: "Tech Entrepreneur",
    location: "San Francisco"
  },
  {
    quote: "The interface is beautiful, the properties are genuinely tier-1, and the liquidity is game-changing. I traded my Paris equity interest for a stake in Tokyo without a single phone call.",
    name: "Eleanor V.",
    role: "Private Equity",
    location: "London"
  },
  {
    quote: "As a traditional real estate investor, I was skeptical. But seeing my dividends hit my wallet automatically while owning premium assets across three continents has completely changed my strategy.",
    name: "Marcus T.",
    role: "Architect",
    location: "New York"
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-32 bg-[#050505] relative">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <div className="text-center mb-14 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mb-6 space-x-1"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-5 h-5 fill-primary text-primary" />
            ))}
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-white mb-2 uppercase tracking-wide"
          >
            Trusted by the <span className="text-primary">New Elite</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif italic text-white/70 text-lg sm:text-xl md:text-2xl mb-6"
          >
            Voices of Our Investors
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="glass-panel p-6 sm:p-10 border border-white/5 hover:border-primary/30 transition-colors duration-500 relative group"
            >
              <div className="absolute top-0 left-10 w-10 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              
              <div className="text-5xl sm:text-6xl font-serif text-primary/20 absolute top-4 left-4 sm:top-6 sm:left-6 leading-none select-none">"</div>
              
              <p className="text-white/80 leading-relaxed relative z-10 mb-8 text-lg sm:text-xl md:text-2xl font-serif italic">
                {testimonial.quote}
              </p>
              
              <div className="mt-auto border-t border-white/10 pt-6">
                <div className="text-white font-serif text-lg">{testimonial.name}</div>
                <div className="text-primary text-xs tracking-widest font-sans uppercase mt-1">
                  {testimonial.role} · {testimonial.location}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
