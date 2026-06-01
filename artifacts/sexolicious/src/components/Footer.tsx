import React from "react";
import { Link } from "wouter";
import { Twitter, Linkedin, Send } from "lucide-react"; // Send used for Telegram

export default function Footer() {
  return (
    <footer className="bg-background pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-3 group mb-4">
              <img src="/opas-logo.png" alt="Opas Logo" className="w-10 h-10 object-contain" />
              <span className="text-xl font-sans font-bold tracking-wide text-white">OPAS HOLDINGS</span>
            </Link>
            <p className="text-primary font-mono text-xs uppercase tracking-widest mb-6">
              Tokenized Assets · Real Estate · Supercars · Yachts · Jets · Web3
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-primary hover:border-primary transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-primary hover:border-primary transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-primary hover:border-primary transition-all">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-sans font-bold mb-6 text-sm uppercase tracking-widest">Platform</h4>
            <ul className="space-y-4">
              <li><a href="#properties" className="text-white/50 hover:text-primary text-sm transition-colors">Data Terminal</a></li>
              <li><a href="#how-it-works" className="text-white/50 hover:text-primary text-sm transition-colors">The Protocol</a></li>
              <li><a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">Secondary Market</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-sans font-bold mb-6 text-sm uppercase tracking-widest">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">About Us</a></li>
              <li><a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">Careers</a></li>
              <li><a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">API Docs</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-sans font-bold mb-6 text-sm uppercase tracking-widest">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">Smart Contract Audit</a></li>
            </ul>
          </div>
        </div>
        
        {/* ── Legal / Disclosure strip ─────────────────────────── */}
        <div className="relative mt-4">
          {/* Glowing hairline */}
          <div className="absolute -top-px inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="absolute -top-px left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent blur-[2px]" />

          <div
            className="relative rounded-2xl overflow-hidden mt-10 px-6 py-8 md:px-10 md:py-9"
            style={{
              background:
                "linear-gradient(180deg, rgba(20,28,48,0.55) 0%, rgba(8,12,24,0.85) 100%)",
              border: "1px solid rgba(220,225,235,0.08)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.04), 0 30px 80px -40px rgba(234,141,14,0.18)",
            }}
          >
            {/* Faint corner glyphs */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute top-3 left-3 w-3 h-3 border-l border-t border-primary/30" />
              <div className="absolute top-3 right-3 w-3 h-3 border-r border-t border-primary/30" />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-l border-b border-primary/30" />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-r border-b border-primary/30" />
            </div>

            {/* Soft radial highlight */}
            <div
              className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[60%] h-40 rounded-full opacity-40 blur-3xl"
              style={{ background: "radial-gradient(closest-side, rgba(234,141,14,0.25), transparent)" }}
            />

            <div className="relative grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-center">
              {/* Left — Year seal + brand line */}
              <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-3 min-w-[180px]">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        "radial-gradient(circle at 30% 30%, rgba(234,141,14,0.35), rgba(234,141,14,0.05) 70%)",
                      border: "1px solid rgba(234,141,14,0.45)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 0 18px -4px rgba(234,141,14,0.4)",
                    }}
                  >
                    <span className="text-[10px] font-mono tracking-[0.18em] text-primary">OP</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono tracking-[0.32em] text-white/40 uppercase">
                      Est. {new Date().getFullYear()}
                    </span>
                    <span className="text-[11px] font-mono tracking-[0.22em] text-white/70 uppercase">
                      Opas Holdings Ltd
                    </span>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-2 mt-1">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono tracking-[0.22em] uppercase"
                    style={{
                      background: "rgba(11,181,190,0.08)",
                      border: "1px solid rgba(11,181,190,0.25)",
                      color: "#7fdce2",
                    }}
                  >
                    <span className="w-1 h-1 rounded-full bg-[#0BB5BE] animate-pulse" />
                    SEC · Compliant
                  </span>
                  <span className="text-[9px] font-mono tracking-[0.22em] uppercase text-white/35">
                    All rights reserved
                  </span>
                </div>
              </div>

              {/* Right — Disclosure */}
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px w-8 bg-gradient-to-r from-primary/60 to-transparent" />
                  <span className="text-[9px] font-mono tracking-[0.36em] uppercase text-primary/80">
                    Disclosure
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                <p
                  className="text-[13px] md:text-[14px] leading-[1.7] text-white/65"
                  style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" }}
                >
                  Co-ownership equity interests in real estate, supercars, yachts and jets carry risk. ROI figures are
                  indicative estimates based on publicly available market data and do not
                  constitute a guarantee of future returns. Past performance is not
                  indicative of future results.{" "}
                  <span className="text-white/90 not-italic font-mono text-[10px] tracking-[0.2em] uppercase">
                    · This is not financial advice ·
                  </span>
                </p>

                {/* Mobile compliance row */}
                <div className="md:hidden flex items-center gap-2 mt-4">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono tracking-[0.22em] uppercase"
                    style={{
                      background: "rgba(11,181,190,0.08)",
                      border: "1px solid rgba(11,181,190,0.25)",
                      color: "#7fdce2",
                    }}
                  >
                    <span className="w-1 h-1 rounded-full bg-[#0BB5BE] animate-pulse" />
                    SEC · Compliant
                  </span>
                  <span className="text-[9px] font-mono tracking-[0.22em] uppercase text-white/35">
                    All rights reserved
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom micro-line: token-style stamp */}
          <div className="flex items-center justify-center gap-3 mt-5 opacity-60">
            <span className="h-px w-12 bg-white/10" />
            <span className="text-[9px] font-mono tracking-[0.42em] uppercase text-white/35">
              OPA · LDN · 001 · v1.0.4
            </span>
            <span className="h-px w-12 bg-white/10" />
          </div>
        </div>
      </div>
    </footer>
  );
}
