import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import logo from "/opas-logo.png";
import worldSkyline from "@/assets/images/world_skyline.png";
import imgCustomer from "@/assets/images/london.png";
import imgOverview from "@/assets/images/assets/yacht_super.png";

const wordmark = { fontFamily: "var(--app-font-wordmark)" } as const;

type Deck = {
  n: string;
  title: string;
  blurb: string;
  meta: string;
  href: string;
  img: string;
};

const DECKS: Deck[] = [
  {
    n: "01",
    title: "Investor Deck",
    blurb: "The opportunity, the market, the model and the raise — built for capital partners.",
    meta: "8 slides · Strictly private",
    href: "/opas-investor-deck/",
    img: worldSkyline,
  },
  {
    n: "02",
    title: "How It Works",
    blurb: "Co-ownership explained step by step — what you own, the yield and the liquidity.",
    meta: "8 slides · For clients",
    href: "/opas-customer-deck/",
    img: imgCustomer,
  },
  {
    n: "03",
    title: "Overview",
    blurb: "The big picture — what Opas is across real estate, supercars, yachts and jets.",
    meta: "8 slides · General audience",
    href: "/opas-overview-deck/",
    img: imgOverview,
  },
];

const reveal = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

export default function Pitch() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden flex flex-col">
      <img src={worldSkyline} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.12]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,hsl(35_92%_50%/0.14),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_110%,hsl(185_88%_40%/0.10),transparent_45%)]" />
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary" />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-[6vw] pt-7">
        <a href="/" className="flex items-center gap-3 group">
          <img src={logo} alt="Opas Holdings" className="h-9 w-9 object-contain" />
          <span className="font-sans uppercase tracking-[0.4em] text-[11px] md:text-[13px] text-foreground/75 group-hover:text-foreground transition-colors">
            Opas Holdings
          </span>
        </a>
        <span className="hidden sm:flex items-center gap-2 font-sans uppercase tracking-[0.3em] text-[10px] md:text-[11px] text-muted-foreground">
          <Lock className="w-3 h-3 text-primary" />
          Private presentation room
        </span>
      </header>

      {/* Hero copy */}
      <div className="relative z-10 px-6 md:px-[6vw] pt-[8vh] md:pt-[10vh]">
        <motion.p {...reveal} className="font-serif italic text-secondary text-2xl md:text-4xl leading-none mb-4">
          Choose a presentation
        </motion.p>
        <motion.h1
          {...reveal}
          transition={{ ...reveal.transition, delay: 0.08 }}
          style={wordmark}
          className="text-foreground text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight"
        >
          OPAS DECKS
        </motion.h1>
        <motion.p
          {...reveal}
          transition={{ ...reveal.transition, delay: 0.16 }}
          className="mt-5 font-sans text-base md:text-xl text-foreground/80 max-w-2xl [text-wrap:balance]"
        >
          Three tailored decks — pick the one that fits your audience.
        </motion.p>
      </div>

      {/* Cards */}
      <div className="relative z-10 flex-1 px-6 md:px-[6vw] py-[6vh] md:py-[8vh]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7 max-w-6xl">
          {DECKS.map((d, i) => (
            <motion.a
              key={d.n}
              href={d.href}
              {...reveal}
              transition={{ ...reveal.transition, delay: 0.24 + i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative flex flex-col overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 transition-colors shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]"
            >
              <div className="relative h-44 md:h-48 overflow-hidden">
                <img
                  src={d.img}
                  alt={d.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(222_47%_5%/0.2),hsl(222_47%_5%/0.85))]" />
                <span className="absolute top-4 left-4 font-display text-primary text-3xl leading-none drop-shadow">
                  {d.n}
                </span>
              </div>

              <div className="flex flex-col flex-1 p-6">
                <h2 className="font-display text-2xl md:text-[26px] leading-tight mb-2">{d.title}</h2>
                <p className="font-sans text-sm md:text-[15px] text-foreground/75 leading-snug [text-wrap:pretty]">
                  {d.blurb}
                </p>
                <div className="mt-auto pt-6 flex items-center justify-between">
                  <span className="font-sans uppercase tracking-[0.28em] text-[10px] text-muted-foreground">
                    {d.meta}
                  </span>
                  <span className="flex items-center gap-1.5 text-primary font-sans uppercase tracking-[0.22em] text-[11px]">
                    View
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 flex items-center justify-between px-6 md:px-[6vw] pb-7">
        <span className="flex items-center gap-2 font-sans uppercase tracking-[0.3em] text-[10px] text-muted-foreground">
          <span className="inline-block w-2 h-2 rotate-45 bg-primary" />
          Strictly private &amp; confidential
        </span>
        <span style={wordmark} className="text-foreground/90 text-2xl leading-none">
          OPAS
        </span>
      </footer>
    </div>
  );
}
