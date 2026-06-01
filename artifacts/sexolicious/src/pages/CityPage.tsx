import React, { useEffect } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, MapPin, Coins } from "lucide-react";
import { getCityById, type Property } from "@/data/cities";
import { useWallet } from "@/components/WalletContext";
import MarqueeText from "@/components/MarqueeText";

const SHARKON = { fontFamily: "Sharkon, Nevera, sans-serif" };
const NEVERA  = { fontFamily: "Nevera, Inter, sans-serif" };
const SERIF   = { fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" as const };

export default function CityPage() {
  const [, params] = useRoute<{ cityId: string }>("/city/:cityId");
  const [, navigate] = useLocation();
  const { openWallet } = useWallet();
  const city = params?.cityId ? getCityById(params.cityId) : undefined;

  useEffect(() => { window.scrollTo(0, 0); }, [params?.cityId]);

  if (!city) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl mb-3" style={SHARKON}>City not found</h1>
        <button
          onClick={() => navigate("/")}
          className="text-primary hover:underline tracking-wider text-sm"
          style={NEVERA}
        >
          ← Back to home
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* ── Hero header ── */}
      <section className="relative h-[55vh] sm:h-[60vh] md:h-[68vh] overflow-hidden">
        <motion.img
          src={city.image}
          alt={city.name}
          initial={{ scale: 1.1, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "saturate(1.05) brightness(0.7)" }}
        />
        {/* Gradient veils */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_85%,rgba(234,141,14,0.18)_0%,transparent_70%)]" />

        {/* Grid mask */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none
          bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]
          bg-[size:5rem_5rem]
          [mask-image:radial-gradient(ellipse_70%_70%_at_30%_70%,#000_20%,transparent_100%)]" />

        {/* Back button (floating top-left) */}
        <div className="absolute top-20 sm:top-24 left-4 sm:left-6 md:left-12 z-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-md backdrop-blur-md
                       text-white/80 hover:text-primary transition-all hover:scale-[1.02] text-xs tracking-[0.28em] uppercase"
            style={{
              ...NEVERA,
              background: "rgba(10,16,32,0.55)",
              border: "1px solid rgba(220,225,235,0.18)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Link>
        </div>

        {/* Header content */}
        <div className="absolute inset-x-0 bottom-0 z-10 pb-10 sm:pb-14 md:pb-20">
          <div className="container mx-auto px-4 sm:px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-10 h-px bg-primary" />
              <span className="text-primary tracking-[0.32em] uppercase text-[10px] sm:text-[11px]" style={NEVERA}>
                {city.code} · {city.country} · Listings
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="leading-[0.95] mb-4 sm:mb-6 text-4xl sm:text-6xl md:text-[5.25rem]"
              style={{
                ...SHARKON,
                letterSpacing: "0.01em",
              }}
            >
              <MarqueeText>
                <span className="metallic-warm-text">{city.name}</span>
              </MarqueeText>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="text-white/70 text-lg sm:text-xl md:text-2xl max-w-2xl"
              style={SERIF}
            >
              {city.properties.length} curated assets · avg yield {city.avgYield} · sourced from {city.source}
            </motion.p>

            {/* Stat strip */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <div className="flex items-center gap-2 px-3 py-2 rounded-md backdrop-blur-md"
                style={{ background: "rgba(10,16,32,0.45)", border: "1px solid rgba(220,225,235,0.14)" }}
              >
                <TrendingUp className="w-3.5 h-3.5 text-secondary" />
                <span className="text-xs tracking-[0.28em] uppercase text-white/85" style={NEVERA}>
                  AVG {city.avgYield}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md backdrop-blur-md"
                style={{ background: "rgba(10,16,32,0.45)", border: "1px solid rgba(220,225,235,0.14)" }}
              >
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs tracking-[0.28em] uppercase text-white/85" style={NEVERA}>
                  {city.properties.length} listings
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Listings grid ── */}
      <section className="relative py-14 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="flex items-end justify-between mb-8 md:mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-6 h-px bg-secondary" />
                <span className="text-secondary tracking-[0.32em] uppercase text-[10px]" style={NEVERA}>
                  Available now
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl tracking-wide" style={SHARKON}>
                <span className="metallic-text">Curated</span>{" "}
                <span className="metallic-warm-text">portfolio</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
            {city.properties.map((p, i) => (
              <PropertyCard key={p.id} property={p} propImage={p.image} cityName={city.name} index={i} onAcquire={openWallet} />
            ))}
          </div>

          {/* Back-to-cities ribbon */}
          <div className="mt-14 md:mt-20 text-center">
            <Link
              href="/#properties"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md text-white/75 hover:text-primary transition-all hover:scale-[1.02] text-xs tracking-[0.32em] uppercase"
              style={{
                ...NEVERA,
                background: "rgba(20,28,48,0.55)",
                border: "1px solid rgba(220,225,235,0.16)",
              }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to all cities
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function PropertyCard({
  property: p,
  propImage,
  cityName,
  index,
  onAcquire,
}: {
  property: Property;
  propImage: string;
  cityName: string;
  index: number;
  onAcquire: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(20,28,48,0.7) 0%, rgba(10,16,32,0.85) 100%)",
        border: "1px solid rgba(220,225,235,0.14)",
        boxShadow: "0 18px 50px -25px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Image area */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={propImage}
          alt={p.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
          style={{ filter: "saturate(1) brightness(0.85)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        {/* Tier badge */}
        <div className="absolute top-3 left-3">
          <span
            className="text-[10px] tracking-[0.28em] uppercase px-2 py-1 rounded backdrop-blur-sm"
            style={{
              ...NEVERA,
              background: "rgba(234,141,14,0.18)",
              color: "#f5d98e",
              border: "1px solid rgba(234,141,14,0.35)",
            }}
          >
            {p.tier}
          </span>
        </div>

        {/* Token chip */}
        <div className="absolute top-3 right-3">
          <span
            className="text-[10px] tracking-[0.25em] uppercase px-2 py-1 rounded backdrop-blur-sm text-white/70"
            style={{ ...NEVERA, background: "rgba(0,0,0,0.5)" }}
          >
            {p.token}
          </span>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="text-[10px] tracking-[0.32em] uppercase text-primary/80 mb-1" style={NEVERA}>
            {cityName}
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl leading-tight tracking-wide" style={SHARKON}>
            <MarqueeText title={p.title}>
              <span className="metallic-text">{p.title}</span>
            </MarqueeText>
          </h3>
        </div>
      </div>

      {/* Stats body */}
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
          <Stat label="Rental yield" value={p.rentalYield} />
          <Stat label="Cap. growth" value={p.capitalGrowth} accent />
          <Stat label="Total ROI" value={p.totalRoi} accent />
        </div>

        <div className="flex items-center justify-between text-[11px] tracking-[0.22em] uppercase text-white/55 mb-4" style={NEVERA}>
          <span>From <span className="text-white/85">${p.price}</span></span>
          <span>{p.available} units left</span>
        </div>

        <button
          onClick={onAcquire}
          className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-md text-xs sm:text-sm tracking-[0.3em] uppercase transition-all hover:scale-[1.02]"
          style={{
            ...NEVERA,
            background: "linear-gradient(135deg, rgba(234,141,14,0.95) 0%, rgba(214,121,4,1) 100%)",
            color: "#100b03",
            boxShadow: "0 10px 28px -10px rgba(234,141,14,0.55), inset 0 1px 0 rgba(255,255,255,0.35)",
          }}
        >
          <Coins className="w-3.5 h-3.5" />
          Acquire equity
        </button>
      </div>
    </motion.div>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className="rounded-md px-2 py-2 sm:py-2.5 text-center"
      style={{
        background: "rgba(220,225,235,0.04)",
        border: "1px solid rgba(220,225,235,0.10)",
      }}
    >
      <div className="text-[8px] sm:text-[9px] tracking-[0.22em] uppercase text-white/45 mb-0.5" style={NEVERA}>
        {label}
      </div>
      <div
        className="text-sm sm:text-base tracking-wide"
        style={{
          ...SHARKON,
          color: accent ? "#f5d98e" : "rgba(255,255,255,0.9)",
        }}
      >
        {value}
      </div>
    </div>
  );
}
