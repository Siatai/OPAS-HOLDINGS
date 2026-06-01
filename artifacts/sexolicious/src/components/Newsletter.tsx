import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-card border border-white/10 rounded-lg p-6 sm:p-10 md:p-16 text-center relative overflow-hidden"
        >
          {/* Tech decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-primary to-secondary" />
          <div className="absolute top-4 right-4 opacity-20">
            <Terminal className="w-10 h-10 sm:w-16 sm:h-16 text-white" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-white mb-2 relative z-10 uppercase tracking-wide">
            Join the Waitlist — <span className="text-primary">Early Access</span>
          </h2>
          <p className="font-serif italic text-white/70 text-lg sm:text-xl md:text-2xl mb-6 relative z-10">
            Secure Your Position
          </p>
          <p className="text-white/50 text-sm sm:text-base md:text-lg mb-8 sm:mb-10 max-w-xl mx-auto font-sans relative z-10">
            Be first to access exclusive asset drops across real estate, supercars, yachts and jets.
          </p>

          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-4 border border-secondary/30 bg-secondary/10 rounded font-mono text-secondary text-sm inline-block px-8"
            >
              &gt; STATUS: INVITATION_SECURED
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto relative z-10">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address..."
                required
                className="flex-1 bg-black border border-white/20 rounded px-6 py-4 text-white placeholder:text-white/30 font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <button
                type="submit"
                className="group px-8 py-4 bg-primary text-black font-bold tracking-wider uppercase text-sm flex items-center justify-center gap-3 hover:bg-primary/90 transition-colors whitespace-nowrap rounded"
              >
                <span>Initialize</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
