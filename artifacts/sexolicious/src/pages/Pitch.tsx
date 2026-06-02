import React from "react";
import { motion } from "framer-motion";
import logo from "/opas-logo.png";
import worldSkyline from "@/assets/images/world_skyline.png";
import imgRealEstate from "@/assets/images/dubai.png";
import imgCar from "@/assets/images/assets/car_ferrari.png";
import imgYacht from "@/assets/images/assets/yacht_super.png";
import imgJet from "@/assets/images/assets/jet_gulfstream.png";

const wordmark = { fontFamily: "var(--app-font-wordmark)" } as const;

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.4 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

function SlideHeader({ section, label }: { section: string; label: string }) {
  return (
    <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-[8vw] pt-[4vh] z-10">
      <div className="flex items-center gap-[1vw]">
        <img src={logo} alt="Opas Holdings" className="h-[5vh] w-[5vh] object-contain" />
        <span className="font-sans uppercase tracking-[0.4em] text-[clamp(9px,1vw,14px)] text-foreground/70">
          Opas Holdings
        </span>
      </div>
      <div className="flex items-baseline gap-[0.8vw]">
        <span className="font-display text-primary text-[clamp(11px,1.1vw,16px)]">{section}</span>
        <span className="font-sans uppercase tracking-[0.35em] text-[clamp(9px,1vw,14px)] text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}

function SlideFooter({ page }: { page: string }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-[8vw] pb-[4vh] z-10">
      <div className="flex items-center gap-[0.7vw]">
        <span className="inline-block w-[0.7vh] h-[0.7vh] rotate-45 bg-primary" />
        <span className="font-sans uppercase tracking-[0.3em] text-[clamp(8px,0.85vw,12px)] text-muted-foreground">
          Strictly private &amp; confidential
        </span>
      </div>
      <span className="font-sans tracking-[0.3em] text-[clamp(8px,0.85vw,12px)] text-muted-foreground">
        {page} / 08
      </span>
    </div>
  );
}

function Slide({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`snap-start relative w-full h-screen overflow-hidden flex flex-col justify-center px-[8vw] ${className}`}
    >
      <div className="absolute top-0 left-0 right-0 h-[0.4vh] bg-border" />
      {children}
    </section>
  );
}

export default function Pitch() {
  return (
    <div className="h-screen overflow-y-auto snap-y snap-mandatory bg-background text-foreground">
      {/* 01 — Title */}
      <section className="snap-start relative w-full h-screen overflow-hidden flex flex-col justify-between px-[8vw] py-[7vh]">
        <img
          src={worldSkyline}
          alt="Global skyline"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,hsl(222_47%_5%/0.97)_30%,hsl(222_47%_5%/0.78)_60%,hsl(222_47%_5%/0.55))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_12%,hsl(35_92%_50%/0.20),transparent_45%)]" />
        <div className="absolute top-0 left-0 right-0 h-[0.4vh] bg-primary" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-[1.1vw]">
            <img src={logo} alt="Opas Holdings" className="h-[8vh] w-[8vh] object-contain" />
            <span className="font-sans uppercase tracking-[0.45em] text-[clamp(10px,1.15vw,16px)] text-foreground/80">
              Opas Holdings
            </span>
          </div>
          <span className="font-sans uppercase tracking-[0.4em] text-[clamp(9px,1vw,14px)] text-muted-foreground">
            Investor Briefing — 2026
          </span>
        </div>

        <motion.div {...reveal} className="relative max-w-[72vw]">
          <p className="font-serif italic text-secondary text-[clamp(20px,2.6vw,44px)] leading-none mb-[3.5vh]">
            Own the world&apos;s finest assets, in co-ownership
          </p>
          <h1 style={wordmark} className="text-foreground text-[clamp(80px,15vw,260px)] leading-[0.82] tracking-tight">
            OPAS
          </h1>
          <div className="mt-[2.5vh] h-[0.35vh] w-[22vw] bg-primary/80" />
          <p className="mt-[3vh] font-sans text-[clamp(16px,2vw,34px)] text-foreground/90 [text-wrap:balance] max-w-[58vw]">
            Tokenized co-ownership of real estate, supercars, yachts &amp; private jets — ownership interests from $100.
          </p>
        </motion.div>

        <div className="relative flex items-end justify-between">
          <div className="font-sans uppercase tracking-[0.35em] text-[clamp(9px,1vw,14px)] text-muted-foreground">
            AI valuation · Blockchain co-ownership · 24/7 secondary market
          </div>
          <div className="font-sans uppercase tracking-[0.3em] text-[clamp(8px,0.95vw,13px)] text-muted-foreground border border-border px-[1.4vw] py-[1vh] rounded-sm">
            Strictly private &amp; confidential
          </div>
        </div>
      </section>

      {/* 02 — Problem */}
      <Slide>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_85%,hsl(35_92%_50%/0.10),transparent_45%)]" />
        <SlideHeader section="01" label="Why now" />
        <motion.h2 {...reveal} className="relative font-display text-[clamp(28px,3.4vw,60px)] leading-[1] tracking-tight mb-[5vh] max-w-[70vw]">
          Trophy assets stay locked away
        </motion.h2>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-[2.5vw]">
          {[
            "Six- to nine-figure minimums gate almost everyone out of the world's best assets.",
            "Ownership is illiquid — selling a property or a yacht takes months, not minutes.",
            "Yields and provenance are opaque, broker-driven, and hard to verify independently.",
          ].map((t, i) => (
            <motion.div
              key={i}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.12 }}
              className="border-t border-border pt-[2.5vh]"
            >
              <div className="font-display text-primary text-[clamp(28px,3.4vw,56px)] leading-none mb-[1.5vh]">
                0{i + 1}
              </div>
              <p className="font-sans text-[clamp(15px,1.65vw,28px)] leading-snug text-foreground/90 [text-wrap:pretty]">
                {t}
              </p>
            </motion.div>
          ))}
        </div>
        <SlideFooter page="02" />
      </Slide>

      {/* 03 — Solution */}
      <Slide>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,hsl(185_88%_40%/0.12),transparent_45%)]" />
        <SlideHeader section="02" label="The solution" />
        <div className="relative grid grid-cols-1 md:grid-cols-[34%_66%] gap-[4vw] items-center">
          <motion.div {...reveal}>
            <div className="font-display text-primary text-[clamp(48px,6vw,104px)] leading-[0.85] whitespace-nowrap">
              $100
            </div>
            <p className="font-serif italic text-secondary text-[clamp(16px,1.9vw,32px)] mt-[1.5vh] leading-snug">
              the new minimum ownership interest
            </p>
            <p className="font-sans text-[clamp(13px,1.4vw,24px)] text-foreground/75 mt-[3vh] leading-snug [text-wrap:pretty]">
              Opas turns illiquid trophy assets into verifiable, tradeable ownership interests.
            </p>
          </motion.div>
          <div className="flex flex-col gap-[3vh]">
            {[
              { c: "primary", h: "Buy in from $100", p: "Acquire a co-ownership stake across four asset classes — no six-figure cheque required." },
              { c: "secondary", h: "Earn real yield", p: "Rental and charter income is distributed pro-rata to every ownership interest." },
              { c: "primary", h: "Exit any time", p: "A 24/7 on-chain secondary market replaces a months-long broker sale." },
            ].map((b, i) => (
              <motion.div
                key={i}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.12 }}
                className={`border-l-[0.3vw] ${b.c === "primary" ? "border-primary" : "border-secondary"} pl-[2vw]`}
              >
                <h3 className="font-display text-[clamp(16px,1.8vw,30px)] leading-tight mb-[1.2vh]">{b.h}</h3>
                <p className="font-sans text-[clamp(13px,1.4vw,24px)] text-foreground/85 leading-snug [text-wrap:pretty]">
                  {b.p}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
        <SlideFooter page="03" />
      </Slide>

      {/* 04 — Market */}
      <Slide>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,hsl(35_92%_50%/0.14),transparent_50%)]" />
        <SlideHeader section="03" label="Market opportunity" />
        <motion.h2 {...reveal} className="relative font-display text-[clamp(28px,3.4vw,60px)] leading-[1] tracking-tight mb-[6vh] max-w-[62vw]">
          A market compounding fast
        </motion.h2>
        <div className="relative grid grid-cols-[1fr_auto_1fr] items-end gap-[2.5vw]">
          <motion.div {...reveal}>
            <div className="font-display text-secondary text-[clamp(48px,6vw,104px)] leading-[0.85] whitespace-nowrap">$31B</div>
            <p className="font-sans text-[clamp(13px,1.5vw,26px)] text-foreground/85 mt-[1.5vh] leading-snug [text-wrap:pretty]">
              tokenized real-world assets on-chain
            </p>
            <p className="font-sans text-[clamp(10px,1.05vw,16px)] text-muted-foreground mt-[0.6vh]">Today · 2026</p>
          </motion.div>
          <div className="font-sans text-primary text-[clamp(28px,3.5vw,60px)] leading-none pb-[3vh]">→</div>
          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.15 }}>
            <div className="font-display text-primary text-[clamp(48px,6vw,104px)] leading-[0.85] whitespace-nowrap">$5.5T</div>
            <p className="font-sans text-[clamp(13px,1.5vw,26px)] text-foreground/85 mt-[1.5vh] leading-snug [text-wrap:pretty]">
              projected tokenized asset market
            </p>
            <p className="font-sans text-[clamp(10px,1.05vw,16px)] text-muted-foreground mt-[0.6vh]">Citi base case · 2030</p>
          </motion.div>
        </div>
        <p className="relative font-sans text-[clamp(9px,1vw,15px)] text-muted-foreground mt-[7vh] max-w-[72vw] [text-wrap:pretty]">
          Sources: industry on-chain RWA estimates (2026); Citi GPS tokenization base-case projection (2030). Luxury real
          estate, collectible cars, yachts and aviation remain among the largest under-tokenized pools.
        </p>
        <SlideFooter page="04" />
      </Slide>

      {/* 05 — How it works */}
      <Slide>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,hsl(185_88%_40%/0.10),transparent_45%)]" />
        <SlideHeader section="04" label="How it works" />
        <motion.h2 {...reveal} className="relative font-display text-[clamp(28px,3.4vw,60px)] leading-[1] tracking-tight mb-[5vh] max-w-[70vw]">
          One protocol, end to end
        </motion.h2>
        <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-[2vw]">
          {[
            { h: "Valuation", p: "An AI engine prices every asset against live market comparables." },
            { h: "Ownership", p: "Title is structured into verifiable ownership interests on-chain." },
            { h: "Income", p: "Rental and charter yield is paid pro-rata to every holder." },
            { h: "Liquidity", p: "Holders trade in and out 24/7 on the Opas secondary market." },
          ].map((s, i) => (
            <motion.div
              key={i}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.1 }}
              className="bg-card border border-border rounded-md p-[1.6vw] h-[38vh] flex flex-col"
            >
              <span className="font-display text-primary text-[clamp(20px,2.4vw,42px)] leading-none">0{i + 1}</span>
              <h3 className="font-display text-[clamp(14px,1.5vw,26px)] leading-tight mt-[2vh] mb-[1.5vh]">{s.h}</h3>
              <p className="font-sans text-[clamp(12px,1.2vw,20px)] text-foreground/80 leading-snug [text-wrap:pretty]">
                {s.p}
              </p>
            </motion.div>
          ))}
        </div>
        <SlideFooter page="05" />
      </Slide>

      {/* 06 — Portfolio */}
      <Slide>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_85%,hsl(35_92%_50%/0.10),transparent_45%)]" />
        <SlideHeader section="05" label="The portfolio" />
        <motion.h2 {...reveal} className="relative font-display text-[clamp(26px,3.2vw,56px)] leading-[1] tracking-tight mb-[4vh]">
          Four asset classes, real yield
        </motion.h2>
        <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-[1.8vw]">
          {[
            { img: imgRealEstate, h: "Real estate", s: "57 residences · 8 cities", y: "2.5–8.4%", l: "net rental yield", c: "primary" },
            { img: imgCar, h: "Supercars", s: "Collectible & charter", y: "8.6–12.6%", l: "charter yield", c: "primary" },
            { img: imgYacht, h: "Yachts", s: "Crewed charter", y: "8.2–11.0%", l: "charter yield", c: "primary" },
            { img: imgJet, h: "Private jets", s: "Managed aviation", y: "Charter", l: "income split", c: "secondary" },
          ].map((a, i) => (
            <motion.div
              key={i}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.1 }}
              className="bg-card border border-border rounded-md overflow-hidden h-[46vh] flex flex-col"
            >
              <img src={a.img} alt={a.h} className="w-full h-[17vh] object-cover" />
              <div className="p-[1.3vw] flex flex-col flex-1">
                <h3 className="font-display text-[clamp(12px,1.2vw,20px)] leading-tight">{a.h}</h3>
                <p className="font-sans text-[clamp(11px,1.1vw,18px)] text-foreground/70 mt-[0.8vh] leading-snug">{a.s}</p>
                <div className="mt-auto">
                  <div className={`font-display ${a.c === "primary" ? "text-primary" : "text-secondary"} text-[clamp(16px,1.7vw,30px)] leading-none whitespace-nowrap`}>
                    {a.y}
                  </div>
                  <p className="font-sans text-[clamp(9px,0.95vw,15px)] text-muted-foreground mt-[0.5vh]">{a.l}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="relative font-sans text-[clamp(9px,0.95vw,15px)] text-muted-foreground mt-[3vh]">
          Yield ranges from real 2024 market data — Knight Frank, JLL, Savills, CBRE.
        </p>
        <SlideFooter page="06" />
      </Slide>

      {/* 07 — Business model */}
      <Slide>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,hsl(185_88%_40%/0.10),transparent_45%)]" />
        <SlideHeader section="06" label="Business model" />
        <motion.h2 {...reveal} className="relative font-display text-[clamp(28px,3.4vw,60px)] leading-[1] tracking-tight mb-[4vh] max-w-[70vw]">
          Three aligned revenue streams
        </motion.h2>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-[2.2vw] mb-[5vh]">
          {[
            { c: "primary", n: "7%", h: "Trade fee", p: "Charged on every secondary-market transaction across the platform." },
            { c: "secondary", n: "Margin", h: "Management", p: "A management margin on rental and charter income across the asset book." },
            { c: "primary", n: "Spread", h: "Acquisition", p: "An onboarding spread when new assets are sourced and brought to the platform." },
          ].map((r, i) => (
            <motion.div
              key={i}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.12 }}
              className={`border-t-[0.3vw] ${r.c === "primary" ? "border-primary" : "border-secondary"} pt-[2vh]`}
            >
              <div className={`font-display ${r.c === "primary" ? "text-primary" : "text-secondary"} text-[clamp(24px,3vw,52px)] leading-none mb-[1.2vh]`}>
                {r.n}
              </div>
              <h3 className="font-display text-[clamp(16px,1.9vw,32px)] leading-tight mb-[0.8vh]">{r.h}</h3>
              <p className="font-sans text-[clamp(13px,1.4vw,24px)] text-foreground/80 leading-snug [text-wrap:pretty]">{r.p}</p>
            </motion.div>
          ))}
        </div>
        <SlideFooter page="07" />
      </Slide>

      {/* 08 — Ask */}
      <section className="snap-start relative w-full h-screen overflow-hidden flex flex-col justify-center px-[8vw]">
        <img src={worldSkyline} alt="Global skyline" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-[linear-gradient(75deg,hsl(222_47%_5%/0.97)_38%,hsl(222_47%_5%/0.72))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_85%,hsl(35_92%_50%/0.18),transparent_45%)]" />
        <div className="absolute top-0 left-0 right-0 h-[0.4vh] bg-primary" />

        <div className="relative grid grid-cols-1 md:grid-cols-[44%_56%] gap-[5vw] items-center">
          <motion.div {...reveal}>
            <p className="font-serif italic text-secondary text-[clamp(16px,2vw,34px)] mb-[1.5vh]">We are raising</p>
            <div className="font-display text-primary text-[clamp(40px,5vw,88px)] leading-[0.85] whitespace-nowrap border-b-[0.25vw] border-dashed border-primary/50 pb-[1.5vh] inline-block">
              $X.X M
            </div>
            <p className="font-sans text-[clamp(13px,1.4vw,24px)] text-foreground/85 mt-[3vh] leading-snug [text-wrap:pretty]">
              at a target valuation of{" "}
              <span className="text-foreground border-b border-dashed border-muted-foreground">[ add valuation ]</span> to
              scale acquisitions and the secondary market.
            </p>
          </motion.div>
          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.15 }}>
            <p className="font-sans uppercase tracking-[0.35em] text-[clamp(9px,1vw,15px)] text-muted-foreground mb-[2.5vh]">
              Use of funds
            </p>
            <div className="flex flex-col gap-[2vh]">
              {[
                "Asset acquisition pipeline",
                "Secondary market & product engineering",
                "Licensing, compliance & custody",
                "Investor acquisition & brand",
              ].map((u, i) => (
                <div key={i} className={`flex items-baseline gap-[1.5vw] ${i < 3 ? "border-b border-border pb-[1.5vh]" : ""}`}>
                  <span className="font-display text-primary text-[clamp(14px,1.6vw,28px)]">0{i + 1}</span>
                  <span className="font-sans text-[clamp(13px,1.5vw,26px)] text-foreground/90">{u}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-[6vh] left-[8vw] right-[8vw] flex items-end justify-between">
          <div style={wordmark} className="text-foreground text-[clamp(28px,3.5vw,60px)] leading-none">OPAS</div>
          <div className="text-right font-sans text-[clamp(12px,1.2vw,20px)] text-foreground/80">
            <p>opasholdings.com</p>
            <p className="text-muted-foreground">invest@opasholdings.com</p>
          </div>
        </div>
      </section>
    </div>
  );
}
