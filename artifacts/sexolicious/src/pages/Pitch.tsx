import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import logo from "/opas-logo.png";
import worldSkyline from "@/assets/images/world_skyline.png";
import imgInvestor from "@/assets/images/dubai.png";
import imgCustomer from "@/assets/images/london.png";
import imgOverview from "@/assets/images/assets/yacht_super.png";

const wordmark = { fontFamily: "var(--app-font-wordmark)" } as const;
const serif = { fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" as const };

type Deck = {
  n: string;
  title: string;
  blurb: string;
  meta: string;
  href: string;
  img: string;
  accent: string;
};

const DECKS: Deck[] = [
  {
    n: "01",
    title: "Investor Deck",
    blurb: "Opportunity, market, structure and raise. Built for capital conversations.",
    meta: "Private capital",
    href: "/opas-investor-deck/",
    img: imgInvestor,
    accent: "#EA8D0E",
  },
  {
    n: "02",
    title: "How It Works",
    blurb: "Co-ownership, income flow and liquidity explained clearly for clients.",
    meta: "Client walkthrough",
    href: "/opas-customer-deck/",
    img: imgCustomer,
    accent: "#48BAC1",
  },
  {
    n: "03",
    title: "Overview",
    blurb: "The broad OPAS story across real estate, supercars, yachts and jets.",
    meta: "General overview",
    href: "/opas-overview-deck/",
    img: imgOverview,
    accent: "#F6D38A",
  },
];

export default function Pitch() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative min-h-screen lg:h-screen bg-background text-foreground overflow-x-hidden overflow-y-auto lg:overflow-hidden">
      <img src={worldSkyline} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.15]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,10,20,0.74)_0%,rgba(6,10,20,0.56)_28%,rgba(6,10,20,0.78)_100%)]" />
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(234,141,14,0.18),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(72,186,193,0.12),transparent_24%),radial-gradient(circle_at_52%_84%,rgba(255,255,255,0.06),transparent_34%)]"
        animate={reduceMotion ? undefined : { opacity: [0.84, 1, 0.88] }}
        transition={reduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:4.6rem_4.6rem]" />
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary" />

      <div className="relative z-10 h-full flex flex-col px-5 md:px-[5vw] pt-6 md:pt-8 pb-6 md:pb-7">
        <header className="flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3 group min-w-0">
            <img src={logo} alt="Opas Holdings" className="h-10 w-10 object-contain shrink-0" />
            <span className="font-sans uppercase tracking-[0.32em] text-[11px] md:text-[13px] text-foreground/75 group-hover:text-foreground transition-colors truncate">
              Opas Holdings
            </span>
          </a>
          <div className="flex items-center gap-2 text-[10px] md:text-[11px] uppercase tracking-[0.28em] text-muted-foreground shrink-0">
            <Lock className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">Private presentation room</span>
          </div>
        </header>

        <main className="flex-1 min-h-0 grid lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.22fr)] gap-7 lg:gap-9 items-center py-8 md:py-10">
          <section className="min-w-0">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="text-secondary text-[2rem] md:text-[3rem] leading-none mb-4"
              style={serif}
            >
              Choose a presentation
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.62, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              style={wordmark}
              className="text-foreground text-[3.4rem] sm:text-[4.6rem] md:text-[6.3rem] lg:text-[7rem] leading-[0.88] tracking-tight"
            >
              OPAS DECKS
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.62, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 max-w-xl font-sans text-[15px] md:text-[19px] leading-relaxed text-foreground/76"
            >
              Three tailored presentations, each framed for a different audience. Enter the room that matches the conversation.
            </motion.p>
          </section>

          <section className="min-w-0 min-h-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 h-full">
              {DECKS.map((d, i) => (
                <motion.a
                  key={d.n}
                  href={d.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={
                    reduceMotion
                      ? { opacity: 1, y: 0 }
                      : { opacity: 1, y: [0, i % 2 === 0 ? -6 : -3, 0] }
                  }
                  whileHover={{ y: -8 }}
                  transition={
                    reduceMotion
                      ? { duration: 0.58, delay: 0.18 + i * 0.08, ease: [0.22, 1, 0.36, 1] }
                      : {
                          opacity: { duration: 0.58, delay: 0.18 + i * 0.08, ease: [0.22, 1, 0.36, 1] },
                          y: { duration: 5.4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.18 + i * 0.08 },
                        }
                  }
                  className="group min-h-0 rounded-xl overflow-hidden border border-white/10 bg-[rgba(8,12,24,0.78)] hover:border-primary/45 transition-colors shadow-[0_28px_70px_-42px_rgba(0,0,0,0.95)] flex flex-col"
                >
                  <div className="relative aspect-[1.2/1] md:aspect-[0.92/1] min-h-[180px] md:min-h-0 overflow-hidden">
                    <img
                      src={d.img}
                      alt={d.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-82 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,18,0.16)_0%,rgba(4,8,18,0.46)_42%,rgba(4,8,18,0.95)_100%)]" />
                    <span className="absolute top-4 left-4 text-[2.4rem] leading-none" style={{ ...wordmark, color: d.accent }}>
                      {d.n}
                    </span>
                  </div>

                  <div className="p-5 md:p-6 flex flex-col flex-1">
                    <div className="text-[10px] tracking-[0.28em] uppercase text-white/38 mb-3 font-sans">{d.meta}</div>
                    <h2 className="text-[1.9rem] md:text-[2.15rem] leading-[0.92] text-white mb-3" style={wordmark}>
                      {d.title}
                    </h2>
                    <p className="text-[13px] md:text-[14px] leading-6 text-white/68 font-sans">
                      {d.blurb}
                    </p>
                    <div className="mt-auto pt-6 flex items-center justify-between gap-3">
                      <span className="text-[10px] tracking-[0.24em] uppercase text-white/32 font-sans">Open room</span>
                      <span className="inline-flex items-center gap-2 text-[10.5px] tracking-[0.24em] uppercase text-primary font-sans">
                        Enter
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </section>
        </main>

        <footer className="flex items-center justify-between gap-4 pt-2">
          <span className="flex items-center gap-2 font-sans uppercase tracking-[0.26em] text-[10px] text-muted-foreground">
            <span className="inline-block w-2 h-2 rotate-45 bg-primary" />
            Strictly private &amp; confidential
          </span>
          <span style={wordmark} className="text-foreground/85 text-[1.9rem] leading-none">
            OPAS
          </span>
        </footer>
      </div>
    </div>
  );
}
