import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, TrendingUp, MapPin } from "lucide-react";
import { useWallet } from "./WalletContext";

import dubaiImg from "@/assets/images/dubai.png";
import londonImg from "@/assets/images/london.png";
import newYorkImg from "@/assets/images/new-york.png";
import hongKongImg from "@/assets/images/hong-kong.png";
import parisImg from "@/assets/images/paris.png";
import singaporeImg from "@/assets/images/singapore.png";
import tokyoImg from "@/assets/images/tokyo.png";
import miamiImg from "@/assets/images/miami.png";

const SHARKON = { fontFamily: "Sharkon, Nevera, sans-serif" };
const NEVERA  = { fontFamily: "Nevera, Inter, sans-serif" };
const SERIF   = { fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" as const };

type Property = {
  id: string;
  title: string;
  token: string;
  price: number;
  available: number;
  rentalYield: string;
  capitalGrowth: string;
  totalRoi: string;
  tier: string;
};

type City = {
  id: string;
  name: string;
  country: string;
  code: string;
  image: string;
  avgYield: string;
  source: string;
  properties: Property[];
};

const CITIES: City[] = [
  {
    id: "dubai", name: "Dubai", country: "UAE", code: "DXB", image: dubaiImg,
    avgYield: "7.4%", source: "Knight Frank / JLL · 2024",
    properties: [
      { id: "dxb-1", title: "Burj Khalifa Penthouse",   token: "OPA-DXB-01", price: 150, available: 12, rentalYield: "7.4%", capitalGrowth: "+17.2%", totalRoi: "~24.6%", tier: "Tier I" },
      { id: "dxb-2", title: "Palm Jumeirah Signature",  token: "OPA-DXB-02", price: 180, available: 8,  rentalYield: "6.8%", capitalGrowth: "+15.4%", totalRoi: "~22.2%", tier: "Tier I" },
      { id: "dxb-3", title: "Marina Sky Tower 88",      token: "OPA-DXB-03", price: 120, available: 28, rentalYield: "8.1%", capitalGrowth: "+12.6%", totalRoi: "~20.7%", tier: "Tier II" },
    ],
  },
  {
    id: "london", name: "London", country: "UK", code: "LDN", image: londonImg,
    avgYield: "3.8%", source: "Savills Prime · 2024",
    properties: [
      { id: "ldn-1", title: "Mayfair Townhouse",        token: "OPA-LDN-01", price: 200, available: 8,  rentalYield: "3.8%", capitalGrowth: "+4.1%",  totalRoi: "~7.9%",  tier: "Tier I" },
      { id: "ldn-2", title: "Knightsbridge Residence",  token: "OPA-LDN-02", price: 240, available: 4,  rentalYield: "3.4%", capitalGrowth: "+3.8%",  totalRoi: "~7.2%",  tier: "Tier I" },
      { id: "ldn-3", title: "Belgravia Crescent",       token: "OPA-LDN-03", price: 175, available: 16, rentalYield: "4.0%", capitalGrowth: "+5.2%",  totalRoi: "~9.2%",  tier: "Tier II" },
    ],
  },
  {
    id: "newyork", name: "New York", country: "USA", code: "NYC", image: newYorkImg,
    avgYield: "4.2%", source: "StreetEasy / REBNY · 2024",
    properties: [
      { id: "nyc-1", title: "Manhattan Sky-rise",       token: "OPA-NYC-01", price: 180, available: 24, rentalYield: "4.2%", capitalGrowth: "+4.8%",  totalRoi: "~9.0%",  tier: "Tier I" },
      { id: "nyc-2", title: "Central Park West",        token: "OPA-NYC-02", price: 220, available: 11, rentalYield: "3.9%", capitalGrowth: "+5.4%",  totalRoi: "~9.3%",  tier: "Tier I" },
      { id: "nyc-3", title: "Tribeca Loft Collection",  token: "OPA-NYC-03", price: 145, available: 19, rentalYield: "4.6%", capitalGrowth: "+6.1%",  totalRoi: "~10.7%", tier: "Tier II" },
    ],
  },
  {
    id: "hongkong", name: "Hong Kong", country: "HK SAR", code: "HKG", image: hongKongImg,
    avgYield: "2.8%", source: "Centaline / JLL · 2024",
    properties: [
      { id: "hkg-1", title: "Victoria Harbour Suite",   token: "OPA-HKG-01", price: 160, available: 5,  rentalYield: "2.8%", capitalGrowth: "+2.1%", totalRoi: "~4.9%", tier: "Tier I" },
      { id: "hkg-2", title: "The Peak Residence",       token: "OPA-HKG-02", price: 195, available: 3,  rentalYield: "2.5%", capitalGrowth: "+2.8%", totalRoi: "~5.3%", tier: "Tier I" },
      { id: "hkg-3", title: "Causeway Bay Tower",       token: "OPA-HKG-03", price: 135, available: 14, rentalYield: "3.2%", capitalGrowth: "+3.4%", totalRoi: "~6.6%", tier: "Tier II" },
    ],
  },
  {
    id: "paris", name: "Paris", country: "France", code: "PAR", image: parisImg,
    avgYield: "3.6%", source: "BNP Paribas RE · 2024",
    properties: [
      { id: "par-1", title: "8th Arrondissement",       token: "OPA-PAR-01", price: 140, available: 31, rentalYield: "3.6%", capitalGrowth: "+3.2%", totalRoi: "~6.8%", tier: "Tier I" },
      { id: "par-2", title: "Champs-Élysées Hôtel",     token: "OPA-PAR-02", price: 175, available: 9,  rentalYield: "3.4%", capitalGrowth: "+4.1%", totalRoi: "~7.5%", tier: "Tier I" },
      { id: "par-3", title: "Le Marais Maison",         token: "OPA-PAR-03", price: 115, available: 22, rentalYield: "4.1%", capitalGrowth: "+3.6%", totalRoi: "~7.7%", tier: "Tier II" },
    ],
  },
  {
    id: "singapore", name: "Singapore", country: "SG", code: "SGP", image: singaporeImg,
    avgYield: "4.1%", source: "URA / Savills · 2024",
    properties: [
      { id: "sgp-1", title: "Marina Bay Condo",         token: "OPA-SGP-01", price: 170, available: 18, rentalYield: "4.1%", capitalGrowth: "+7.3%", totalRoi: "~11.4%", tier: "Tier I" },
      { id: "sgp-2", title: "Orchard Road Residence",   token: "OPA-SGP-02", price: 195, available: 7,  rentalYield: "3.8%", capitalGrowth: "+6.5%", totalRoi: "~10.3%", tier: "Tier I" },
      { id: "sgp-3", title: "Sentosa Cove Villa",       token: "OPA-SGP-03", price: 215, available: 4,  rentalYield: "3.6%", capitalGrowth: "+8.2%", totalRoi: "~11.8%", tier: "Tier I" },
    ],
  },
  {
    id: "tokyo", name: "Tokyo", country: "Japan", code: "TKY", image: tokyoImg,
    avgYield: "4.5%", source: "MLIT / CBRE · 2024",
    properties: [
      { id: "tky-1", title: "Shibuya Prime",            token: "OPA-TKY-01", price: 130, available: 42, rentalYield: "4.5%", capitalGrowth: "+9.6%",  totalRoi: "~14.1%", tier: "Tier I" },
      { id: "tky-2", title: "Roppongi Sky Tower",       token: "OPA-TKY-02", price: 160, available: 18, rentalYield: "4.2%", capitalGrowth: "+10.4%", totalRoi: "~14.6%", tier: "Tier I" },
      { id: "tky-3", title: "Ginza Heritage Suite",     token: "OPA-TKY-03", price: 195, available: 6,  rentalYield: "3.8%", capitalGrowth: "+11.2%", totalRoi: "~15.0%", tier: "Tier I" },
    ],
  },
  {
    id: "miami", name: "Miami", country: "USA", code: "MIA", image: miamiImg,
    avgYield: "5.8%", source: "Miami Realtors · 2024",
    properties: [
      { id: "mia-1", title: "South Beach Oceanfront",   token: "OPA-MIA-01", price: 120, available: 2,  rentalYield: "5.8%", capitalGrowth: "+8.4%", totalRoi: "~14.2%", tier: "Tier I" },
      { id: "mia-2", title: "Brickell Sky Penthouse",   token: "OPA-MIA-02", price: 155, available: 11, rentalYield: "5.4%", capitalGrowth: "+9.1%", totalRoi: "~14.5%", tier: "Tier I" },
      { id: "mia-3", title: "Coconut Grove Estate",     token: "OPA-MIA-03", price: 105, available: 26, rentalYield: "6.1%", capitalGrowth: "+7.8%", totalRoi: "~13.9%", tier: "Tier II" },
    ],
  },
];

export default function Properties() {
  const { openWallet } = useWallet();
  const [activeCityId, setActiveCityId] = useState<string>(CITIES[0].id);
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Reactive viewport check for coverflow spread (avoids SSR drift + resizes live)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const activeCity = CITIES.find(c => c.id === activeCityId)!;
  const cards = activeCity.properties;

  // Reset card index when city changes
  useEffect(() => { setActiveCardIdx(0); }, [activeCityId]);

  const next = () => setActiveCardIdx(i => (i + 1) % cards.length);
  const prev = () => setActiveCardIdx(i => (i - 1 + cards.length) % cards.length);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cards.length]);

  return (
    <section id="properties" className="relative py-20 md:py-28 bg-background overflow-hidden">
      {/* Atmospheric backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]
        bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]
        bg-[size:4rem_4rem]
        [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_15%,transparent_100%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_50%_60%_at_50%_40%,rgba(234,141,14,0.05)_0%,transparent_70%)]" />

      <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10">

        {/* ── Section header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-10 h-px bg-secondary" />
              <span className="text-secondary tracking-[0.32em] uppercase text-[10px]" style={NEVERA}>
                Live markets · 8 cities
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl md:text-5xl leading-[1.05] tracking-wide mb-2"
              style={SHARKON}
            >
              <span className="metallic-text">Asset</span>{" "}
              <span className="metallic-warm-text">portfolio</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white/55 text-base sm:text-xl md:text-2xl"
              style={SERIF}
            >
              Curated masterpieces — select a city to explore.
            </motion.p>
          </div>
        </div>

        {/* ── CITY ALBUM GRID ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4 mb-2">
          {CITIES.map((city, idx) => {
            const isActive = city.id === activeCityId;
            return (
              <motion.button
                key={city.id}
                onClick={() => setActiveCityId(city.id)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
                whileHover={{ y: -3 }}
                className="group relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer"
                style={{
                  border: isActive
                    ? "1px solid rgba(234,141,14,0.6)"
                    : "1px solid rgba(220,225,235,0.12)",
                  boxShadow: isActive
                    ? "0 0 0 1px rgba(234,141,14,0.35), 0 20px 50px -20px rgba(234,141,14,0.45), inset 0 1px 0 rgba(255,255,255,0.1)"
                    : "0 10px 30px -15px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
                  transition: "border 0.4s, box-shadow 0.4s",
                }}
              >
                {/* Image */}
                <div className="absolute inset-0">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                    style={{ filter: isActive ? "saturate(1.1) brightness(1.05)" : "saturate(0.85) brightness(0.85)" }}
                  />
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/20" />
                {/* Active glow */}
                {isActive && (
                  <motion.div
                    layoutId="city-glow"
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "radial-gradient(ellipse 100% 60% at 50% 100%, rgba(234,141,14,0.35) 0%, transparent 70%)",
                    }}
                  />
                )}

                {/* Top label: code */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                  <span
                    className="text-[8px] tracking-[0.28em] uppercase px-1.5 py-0.5 rounded backdrop-blur-sm"
                    style={{
                      ...NEVERA,
                      background: isActive ? "rgba(234,141,14,0.18)" : "rgba(0,0,0,0.45)",
                      color: isActive ? "#f5d98e" : "rgba(255,255,255,0.55)",
                    }}
                  >
                    {city.code}
                  </span>
                  <span className="text-[8px] tracking-[0.25em] uppercase text-white/60" style={NEVERA}>
                    {city.properties.length} · listings
                  </span>
                </div>

                {/* Bottom: name + yield */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className={`text-[10px] tracking-[0.28em] uppercase mb-0.5 ${isActive ? "text-primary" : "text-white/40"}`} style={NEVERA}>
                    {city.country}
                  </div>
                  <div className="text-base md:text-lg leading-none mb-2" style={SHARKON}>
                    <span className={isActive ? "metallic-warm-text" : "metallic-text"}>{city.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3 text-secondary/80" />
                    <span className="text-[10px] text-secondary/90 tracking-wider" style={NEVERA}>
                      avg {city.avgYield}
                    </span>
                  </div>
                </div>

                {/* Active corner ticks */}
                {isActive && (
                  <>
                    <span className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-primary" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-primary" />
                    <span className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-primary" />
                    <span className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-primary" />
                  </>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* ── HOT PROPERTIES — 3D COVERFLOW CAROUSEL ── */}
        <div className="mt-16">
          {/* Heading row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] tracking-[0.32em] uppercase text-primary/80" style={NEVERA}>
                  Hot in {activeCity.name} · {activeCity.country}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl tracking-wide" style={SHARKON}>
                <span className="metallic-text">Trending</span>{" "}
                <span className="metallic-warm-text">listings</span>
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                aria-label="Previous"
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-primary transition-all hover:scale-105"
                style={{
                  background: "rgba(20,28,48,0.85)",
                  border: "1px solid rgba(220,225,235,0.18)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/40 min-w-[42px] text-center" style={NEVERA}>
                {String(activeCardIdx + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}
              </span>
              <button
                onClick={next}
                aria-label="Next"
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-primary transition-all hover:scale-105"
                style={{
                  background: "rgba(20,28,48,0.85)",
                  border: "1px solid rgba(220,225,235,0.18)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Coverflow stage */}
          <div
            className="relative h-[440px] sm:h-[460px] md:h-[520px] mt-6 overflow-hidden"
            style={{ perspective: "1600px" }}
          >
            {/* Floor reflection */}
            <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 60% 100% at 50% 100%, rgba(234,141,14,0.12) 0%, transparent 70%)" }}
            />

            <AnimatePresence mode="popLayout">
              {cards.map((card, idx) => {
                const offset = idx - activeCardIdx;
                const abs = Math.abs(offset);
                const isCenter = offset === 0;

                // Coverflow transforms (pixel-based so spread is independent of card width).
                // Smaller spread on phone (matches narrower card) so side cards stay on-screen.
                const x = offset * (isMobile ? 150 : 220);   // px horizontal offset
                const rotateY = offset * -28;      // turn outwards
                const scale = isCenter ? 1 : 0.78 - (abs - 1) * 0.08;
                const z = isCenter ? 0 : -120 * abs;
                const opacity = abs > 2 ? 0 : abs === 0 ? 1 : abs === 1 ? 0.75 : 0.35;
                const zIndex = 30 - abs;

                return (
                  <motion.div
                    key={`${activeCity.id}-${card.id}`}
                    onClick={() => !isCenter && setActiveCardIdx(idx)}
                    className="absolute top-1/2 left-1/2 cursor-pointer"
                    style={{ transformStyle: "preserve-3d", zIndex }}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{
                      opacity,
                      x: `calc(-50% + ${x}px)`,
                      y: "-50%",
                      rotateY,
                      scale,
                      z,
                    }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <PropertyCard
                      card={card}
                      city={activeCity}
                      isCenter={isCenter}
                      onAcquire={openWallet}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {cards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCardIdx(idx)}
                aria-label={`Go to card ${idx + 1}`}
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: idx === activeCardIdx ? 28 : 8,
                  background:
                    idx === activeCardIdx
                      ? "linear-gradient(90deg, #f5d98e, #ea8d0e)"
                      : "rgba(255,255,255,0.18)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── Card subcomponent ─────────────────────── */
function PropertyCard({
  card, city, isCenter, onAcquire,
}: {
  card: Property;
  city: City;
  isCenter: boolean;
  onAcquire: () => void;
}) {
  return (
    <div
      className="relative w-[260px] sm:w-[300px] md:w-[360px] rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(160deg, rgba(20,28,48,0.96) 0%, rgba(14,20,36,0.96) 60%, rgba(28,20,12,0.96) 100%)",
        border: isCenter ? "1px solid rgba(234,141,14,0.4)" : "1px solid rgba(220,225,235,0.16)",
        boxShadow: isCenter
          ? "0 40px 90px -20px rgba(0,0,0,0.85), 0 0 60px -10px rgba(234,141,14,0.3), inset 0 1px 0 rgba(255,255,255,0.12)"
          : "0 25px 60px -15px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={city.image} alt={card.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        {/* Scanline overlay on center card */}
        {isCenter && (
          <div className="absolute inset-0 opacity-30 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_3px]" />
        )}

        {/* Top labels */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span
            className="text-[8.5px] tracking-[0.28em] uppercase px-2 py-1 rounded backdrop-blur-sm"
            style={{
              ...NEVERA,
              background: "rgba(11,181,190,0.18)",
              border: "1px solid rgba(11,181,190,0.45)",
              color: "#7ed7dc",
            }}
          >
            Token live
          </span>
          <span
            className="text-[8.5px] tracking-[0.28em] uppercase px-2 py-1 rounded backdrop-blur-sm"
            style={{
              ...NEVERA,
              background: "rgba(0,0,0,0.55)",
              border: "1px solid rgba(220,225,235,0.18)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {card.token}
          </span>
        </div>

        {/* Bottom title */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="text-[9px] tracking-[0.32em] uppercase text-primary/80 mb-1" style={NEVERA}>
            {city.name} · {card.tier}
          </div>
          <h4 className="text-lg leading-tight" style={SHARKON}>
            <span className="metallic-text">{card.title}</span>
          </h4>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Availability bar */}
        <div>
          <div className="flex justify-between text-[9px] tracking-[0.28em] uppercase text-white/45 mb-1.5" style={NEVERA}>
            <span>Ownership available</span>
            <span className="text-primary/80">{card.available}%</span>
          </div>
          <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${card.available}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #f5d98e, #ea8d0e)" }}
            />
          </div>
        </div>

        {/* Three-stat row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { l: "Yield",  v: card.rentalYield,   c: "text-secondary"      },
            { l: "Growth", v: card.capitalGrowth, c: "metallic-text"       },
            { l: "ROI",    v: card.totalRoi,      c: "metallic-warm-text"  },
          ].map(d => (
            <div
              key={d.l}
              className="rounded p-2 text-center"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(220,225,235,0.06)" }}
            >
              <div className="text-[8px] tracking-[0.28em] uppercase text-white/35 mb-1" style={NEVERA}>{d.l}</div>
              <div className={`text-[13px] ${d.c}`} style={SHARKON}>{d.v}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={(e) => { e.stopPropagation(); onAcquire(); }}
          className="w-full py-2.5 rounded-sm text-[10px] tracking-[0.28em] uppercase transition-all duration-300 hover:translate-y-[-1px]"
          style={{
            ...NEVERA,
            background: isCenter
              ? "linear-gradient(180deg, #f5b955 0%, #ea8d0e 50%, #b87d1e 100%)"
              : "rgba(255,255,255,0.04)",
            color: isCenter ? "#1a0e02" : "rgba(255,255,255,0.75)",
            border: isCenter ? "none" : "1px solid rgba(220,225,235,0.18)",
            fontWeight: 700,
            boxShadow: isCenter ? "0 8px 24px -10px rgba(234,141,14,0.5), inset 0 1px 0 rgba(255,255,255,0.25)" : "none",
          }}
        >
          {isCenter ? "Acquire equity interest" : "from $" + card.price}
        </button>
      </div>
    </div>
  );
}
