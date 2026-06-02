import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import {
  ChevronLeft, ChevronRight, TrendingUp, ArrowUpRight,
  Building2, Car, Ship, Plane, Lock, Palette, Watch, Grape, Gem, Globe,
} from "lucide-react";
import { useWallet } from "./WalletContext";
import MarqueeText from "./MarqueeText";
import FitText, { FitTextGroup } from "./FitText";
import { CITIES } from "@/data/cities";
import {
  CATEGORIES, assetsByCategory, getCategory,
  type Asset, type AssetCategory, type CategoryMeta,
} from "@/data/assets";

const SHARKON = { fontFamily: "Sharkon, Nevera, sans-serif" };
const NEVERA  = { fontFamily: "Nevera, Inter, sans-serif" };
const SERIF   = { fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" as const };

const TAB_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Building2, Car, Ship, Plane,
};

const COMING_SOON = [
  { icon: Palette, label: "Fine Art",       blurb: "Blue-chip canvases & sculpture from auction houses.",  accent: "#C084FC" },
  { icon: Watch,   label: "Rare Watches",   blurb: "Independent horology & vintage grail references.",      accent: "#EA8D0E" },
  { icon: Grape,   label: "Vineyards",      blurb: "Grand cru estates with annual en-primeur yield.",       accent: "#0BB5BE" },
  { icon: Gem,     label: "Collectibles",   blurb: "Coloured stones, hypercars memorabilia & more.",        accent: "#22D3EE" },
];

export default function Properties() {
  const { openWallet } = useWallet();
  const [, navigate] = useLocation();
  const cityRail = useLoopRail(2800);

  // One flagship residence per city for the real-estate row.
  const seenCity = new Set<string>();
  const featuredRE = assetsByCategory("real-estate").filter((a) => {
    if (!a.cityId || seenCity.has(a.cityId)) return false;
    seenCity.add(a.cityId);
    return true;
  });

  const rows: { meta: CategoryMeta; assets: Asset[] }[] = CATEGORIES.map((meta) => ({
    meta,
    assets: meta.id === "real-estate" ? featuredRE : assetsByCategory(meta.id),
  }));

  return (
    <section id="properties" className="relative py-20 md:py-28 bg-background overflow-hidden">
      {/* Atmospheric backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]
        bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]
        bg-[size:4rem_4rem]
        [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_15%,transparent_100%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_50%_60%_at_50%_30%,rgba(234,141,14,0.05)_0%,transparent_70%)]" />

      <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10">

        {/* ── Section header ── */}
        <div className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-10 h-px bg-primary" />
            <span className="text-primary tracking-[0.32em] uppercase text-[10px]" style={NEVERA}>
              The Opas collection · 4 asset classes
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-5xl leading-[1.05] tracking-wide mb-2"
            style={SHARKON}
          >
            <span className="metallic-text">Own a piece of</span>{" "}
            <span className="metallic-warm-text">everything</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/55 text-base sm:text-xl md:text-2xl"
            style={SERIF}
          >
            Real estate, supercars, yachts &amp; jets — curated masterpieces, tokenized from $100.
          </motion.p>
        </div>

        {/* ── GATEWAY CITIES CAROUSEL ── */}
        <div className="mb-16 md:mb-20">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div className="flex items-center gap-2.5">
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] tracking-[0.32em] uppercase text-primary/85" style={NEVERA}>
                Where Opas operates · {CITIES.length} prime cities worldwide
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => cityRail.scrollByDir(-1)}
                aria-label="Scroll cities left"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all hover:scale-105"
                style={{ background: "rgba(20,28,48,0.85)", border: "1px solid rgba(220,225,235,0.18)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => cityRail.scrollByDir(1)}
                aria-label="Scroll cities right"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all hover:scale-105"
                style={{ background: "rgba(20,28,48,0.85)", border: "1px solid rgba(220,225,235,0.18)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="relative -mx-4 sm:-mx-6 md:-mx-12">
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-5 sm:w-10 z-10 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-5 sm:w-10 z-10 bg-gradient-to-l from-background to-transparent" />
            <div
              ref={cityRail.railRef}
              {...cityRail.pauseHandlers}
              className="flex gap-3 md:gap-4 overflow-x-auto snap-x snap-proximity px-4 sm:px-6 md:px-12 pb-5 pt-1 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
            >
              {[0, 1, 2].flatMap((copy) => CITIES.map((city) => ({ city, copy }))).map(({ city, copy }) => (
                <div
                  key={`${city.id}-${copy}`}
                  data-card
                  className="asset-loop-card snap-center shrink-0"
                  aria-hidden={copy === 1 ? undefined : true}
                >
                <button
                  onClick={() => navigate(`/city/${city.id}`)}
                  aria-label={`View ${city.name} listings`}
                  tabIndex={copy === 1 ? 0 : -1}
                  className="group relative w-[198px] sm:w-[226px] aspect-[3/4] rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-1"
                style={{
                  border: "1px solid rgba(220,225,235,0.12)",
                  boxShadow: "0 10px 30px -15px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                <div className="absolute inset-0">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                    style={{ filter: "saturate(1) brightness(1.08)" }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/5" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse 100% 60% at 50% 100%, rgba(234,141,14,0.35) 0%, transparent 70%)" }}
                />
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                  <span
                    className="text-[8px] tracking-[0.28em] uppercase px-1.5 py-0.5 rounded backdrop-blur-sm"
                    style={{ ...NEVERA, background: "rgba(0,0,0,0.45)", color: "rgba(255,255,255,0.6)" }}
                  >
                    {city.code}
                  </span>
                  <span className="text-[8px] tracking-[0.25em] uppercase text-white/55" style={NEVERA}>
                    {city.properties.length} · listings
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3">
                  <div className="text-[9px] sm:text-[10px] tracking-[0.24em] sm:tracking-[0.28em] uppercase mb-0.5 text-white/45 group-hover:text-primary transition-colors" style={NEVERA}>
                    {city.country}
                  </div>
                  <FitText className="leading-tight mb-1.5 sm:mb-2 text-[16px] sm:text-lg" style={SHARKON} title={city.name}>
                    <span className="metallic-text group-hover:hidden">{city.name}</span>
                    <span className="metallic-warm-text hidden group-hover:inline">{city.name}</span>
                  </FitText>
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1 min-w-0">
                      <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-secondary/80 shrink-0" />
                      <FitText className="text-[9px] sm:text-[10px] text-secondary/90 tracking-wider min-w-0 flex-1" style={NEVERA}>
                        avg {city.avgYield}
                      </FitText>
                    </div>
                    <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-white/40 opacity-0 -translate-x-1 group-hover:text-primary group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                </div>
                </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FOUR ASSET-CLASS SHOWCASE ROWS ── */}
        <div className="space-y-16 md:space-y-20">
          {rows.map((row, i) => (
            <AssetRow
              key={row.meta.id}
              index={i}
              meta={row.meta}
              assets={row.assets}
              onAcquire={openWallet}
              onViewAll={() => navigate("/marketplace")}
            />
          ))}
        </div>

        {/* ── COMING SOON ── */}
        <ComingSoon />
      </div>
    </section>
  );
}

/* ───────────────────── Roundabout (infinite loop) rail hook ─────────────────────
   The cards are rendered in three identical copies. We keep the scroll position
   parked inside the middle copy and silently jump by one copy-width whenever the
   user drifts toward either edge — so the rail loops forever like a roundabout.
   On every frame we also spotlight whichever card sits closest to the centre. */
function useLoopRail(autoMs: number) {
  const railRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLElement | null>(null);
  const hoverRef = useRef<HTMLElement | null>(null);
  const [paused, setPaused] = useState(false);

  // Exact card-to-card distance (width + real gap) measured from two siblings,
  // so every autoplay/arrow step lands a card dead-centre instead of drifting.
  const cardStep = (el: HTMLElement) => {
    const cards = el.querySelectorAll<HTMLElement>("[data-card]");
    if (cards.length >= 2) return cards[1].offsetLeft - cards[0].offsetLeft;
    return cards[0] ? cards[0].offsetWidth + 20 : el.clientWidth * 0.8;
  };

  // Park scroll so the first card of the middle copy is horizontally centred in
  // the viewport (critical on mobile where a single card shows at a time).
  const centerPark = (el: HTMLElement) => {
    const cards = el.querySelectorAll<HTMLElement>("[data-card]");
    const third = el.scrollWidth / 3;
    if (third <= el.clientWidth || cards.length < 3) return;
    const target = cards[cards.length / 3];
    el.scrollLeft = target.offsetLeft - (el.clientWidth - target.offsetWidth) / 2;
  };

  // Game-style depth-of-field: just THREE discrete steps — the focused card is
  // sharp, its immediate neighbours get a touch of blur, everything further out
  // gets a bit more (and stops there). The focus is normally whichever card sits
  // closest to the rail centre, but while the pointer hovers a card the focus
  // SHIFTS to it (it sharpens, its prev/next pick up the same stepped blur).
  // Cheap inline-style writes that the `.asset-loop-card` CSS transition animates.
  const LVL_BLUR = [0, 1.1, 2.2];      // sharp · a little · a little more
  const LVL_SCALE = [1.04, 0.99, 0.95];
  const LVL_OPACITY = [1, 0.9, 0.8];
  const spotlight = () => {
    const el = railRef.current;
    if (!el) return;
    const step = cardStep(el) || 1;
    // Focus on the hovered card if present, otherwise the rail centre.
    const focus = hoverRef.current;
    const mid = focus
      ? focus.offsetLeft + focus.offsetWidth / 2
      : el.scrollLeft + el.clientWidth / 2;
    let best: HTMLElement | null = null;
    let bestDist = Infinity;
    el.querySelectorAll<HTMLElement>("[data-card]").forEach((c) => {
      const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
      const lvl = Math.min(Math.round(dist / step), 2); // 0 | 1 | 2
      c.style.transform = `scale(${LVL_SCALE[lvl]})`;
      c.style.opacity = `${LVL_OPACITY[lvl]}`;
      c.style.filter = lvl === 0 ? "none" : `blur(${LVL_BLUR[lvl]}px)`;
      c.style.zIndex = lvl === 0 ? "2" : "1";
      if (dist < bestDist) { bestDist = dist; best = c; }
    });
    const centered = best as HTMLElement | null;
    if (centered !== centerRef.current) {
      centerRef.current?.classList.remove("is-center");
      centered?.classList.add("is-center");
      centerRef.current = centered;
    }
  };

  // Graceful re-centre — jump by exactly one copy-width so we land on an
  // identical card. Runs ONLY after the scroll has settled (debounced), never
  // mid-flight, so autoplay never visibly stutters. Pulls back toward the middle
  // copy once we drift past half a copy, leaving buffer on both sides.
  const wrap = () => {
    const el = railRef.current;
    if (!el) return;
    const third = el.scrollWidth / 3;
    if (third <= el.clientWidth) return;
    if (el.scrollLeft < third * 0.5) el.scrollLeft += third;
    else if (el.scrollLeft > third * 1.5) el.scrollLeft -= third;
  };

  // Hard-edge guard — runs every rAF while scrolling. Sustained manual drags can
  // outrun the debounced wrap and reach the very first/last clone; the edges line
  // up with identical cards one copy over, so shifting by `third` is invisible
  // and prevents the rail from ever hitting a dead stop.
  const guard = () => {
    const el = railRef.current;
    if (!el) return;
    const third = el.scrollWidth / 3;
    if (third <= el.clientWidth) return;
    const max = el.scrollWidth - el.clientWidth;
    if (el.scrollLeft <= 1) el.scrollLeft += third;
    else if (el.scrollLeft >= max - 1) el.scrollLeft -= third;
  };

  // Park scroll in the middle copy on mount (card widths are fixed, so layout is
  // stable immediately — no need to wait for images).
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const t = window.setTimeout(() => {
      centerPark(el);
      spotlight();
    }, 60);
    return () => clearTimeout(t);
  }, []);

  // Spotlight follows every frame; the wrap is debounced to fire only once the
  // scroll comes to rest, which keeps the transition buttery-smooth.
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    let raf = 0;
    let settle = 0;
    let resizeT = 0;
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; guard(); spotlight(); });
      window.clearTimeout(settle);
      settle = window.setTimeout(() => { wrap(); spotlight(); }, 90);
    };
    // Re-centre after orientation/viewport changes (debounced) so the spotlighted
    // card stays dead-centre on rotate or resize, mirroring the mount behaviour.
    const onResize = () => {
      window.clearTimeout(resizeT);
      resizeT = window.setTimeout(() => { centerPark(el); spotlight(); }, 120);
    };
    // Pointer-hover focus: shift the sharp card to whatever the user hovers.
    const onOver = (e: Event) => {
      const card = (e.target as HTMLElement)?.closest<HTMLElement>("[data-card]");
      if (card && card !== hoverRef.current) { hoverRef.current = card; spotlight(); }
    };
    const onLeave = () => {
      if (hoverRef.current) { hoverRef.current = null; spotlight(); }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("mouseover", onOver);
    el.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("mouseover", onOver);
      el.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(settle);
      window.clearTimeout(resizeT);
    };
  }, []);

  const scrollByDir = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: cardStep(el) * dir, behavior: "smooth" });
  };

  // Auto-advance one card at a time; the wrap logic makes it loop forever.
  // Respect users who prefer reduced motion — skip autoplay entirely for them.
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const el = railRef.current;
    if (!el) return;
    const id = window.setInterval(() => {
      el.scrollBy({ left: cardStep(el), behavior: "smooth" });
    }, autoMs);
    return () => clearInterval(id);
  }, [paused, autoMs]);

  const pauseHandlers = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onTouchStart: () => setPaused(true),
    onTouchEnd: () => setPaused(false),
  };

  return { railRef, scrollByDir, pauseHandlers };
}

/* ─────────────────────── Showcase row ─────────────────────── */
function AssetRow({
  index, meta, assets, onAcquire, onViewAll,
}: {
  index: number;
  meta: CategoryMeta;
  assets: Asset[];
  onAcquire: () => void;
  onViewAll: () => void;
}) {
  const { railRef, scrollByDir, pauseHandlers } = useLoopRail(3200 + index * 500);
  const Icon = TAB_ICONS[meta.icon];
  const accent = meta.accent;
  // Three identical copies → seamless "roundabout" loop.
  const loop = [0, 1, 2].flatMap((copy) => assets.map((a) => ({ a, copy })));

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
    >
      {/* Row header */}
      <div className="flex items-end justify-between gap-4 mb-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 mb-2 min-w-0">
            <span
              className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
              style={{ background: `${accent}1a`, border: `1px solid ${accent}59` }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
            </span>
            <MarqueeText className="text-[10px] tracking-[0.32em] uppercase min-w-0 flex-1" style={{ ...NEVERA, color: `${accent}d9` }}>
              {meta.blurb}
            </MarqueeText>
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl tracking-wide" style={SHARKON}>
            <span className="metallic-text">{meta.label}</span>
          </h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onViewAll}
            className="hidden sm:flex items-center gap-1.5 h-9 sm:h-10 px-3.5 rounded-full text-[9.5px] tracking-[0.24em] uppercase text-white/70 hover:text-white transition-all hover:scale-105"
            style={{ ...NEVERA, background: "rgba(20,28,48,0.85)", border: "1px solid rgba(220,225,235,0.18)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}
          >
            View all
            <ArrowUpRight className="w-3.5 h-3.5" style={{ color: accent }} />
          </button>
          <button
            onClick={() => scrollByDir(-1)}
            aria-label={`Scroll ${meta.label} left`}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all hover:scale-105"
            style={{ background: "rgba(20,28,48,0.85)", border: "1px solid rgba(220,225,235,0.18)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollByDir(1)}
            aria-label={`Scroll ${meta.label} right`}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all hover:scale-105"
            style={{ background: "rgba(20,28,48,0.85)", border: "1px solid rgba(220,225,235,0.18)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rail */}
      <div className="relative -mx-4 sm:-mx-6 md:-mx-12">
        {/* edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-5 sm:w-10 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-5 sm:w-10 z-10 bg-gradient-to-l from-background to-transparent" />
        <div
          ref={railRef}
          {...pauseHandlers}
          className="flex gap-4 md:gap-5 overflow-x-auto snap-x snap-proximity px-4 sm:px-6 md:px-12 pb-5 pt-1 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
        >
          {loop.map(({ a, copy }) => (
            <div
              key={`${a.id}-${copy}`}
              data-card
              className="asset-loop-card snap-center shrink-0"
              aria-hidden={copy === 1 ? undefined : true}
            >
              <AssetCard
                card={a}
                accent={accent}
                rentalNoun={meta.rentalNoun}
                onAcquire={onAcquire}
                interactive={copy === 1}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────── Asset card ─────────────────────── */
function AssetCard({
  card, accent, rentalNoun, onAcquire, interactive = true,
}: {
  card: Asset;
  accent: string;
  rentalNoun: string;
  onAcquire: () => void;
  interactive?: boolean;
}) {
  return (
    <div
      className="group relative w-[240px] sm:w-[290px] md:w-[320px] rounded-xl overflow-hidden transition-transform duration-300 hover:-translate-y-1"
      style={{
        background: "linear-gradient(160deg, rgba(20,28,48,0.96) 0%, rgba(14,20,36,0.96) 60%, rgba(28,20,12,0.96) 100%)",
        border: "1px solid rgba(220,225,235,0.16)",
        boxShadow: "0 25px 60px -18px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* accent glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: `inset 0 0 0 1px ${accent}59, 0 0 60px -10px ${accent}4d` }}
      />

      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-110"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span
            className="text-[8.5px] tracking-[0.28em] uppercase px-2 py-1 rounded backdrop-blur-sm"
            style={{ ...NEVERA, background: "rgba(11,181,190,0.18)", border: "1px solid rgba(11,181,190,0.45)", color: "#7ed7dc" }}
          >
            Token live
          </span>
          <span
            className="text-[8.5px] tracking-[0.28em] uppercase px-2 py-1 rounded backdrop-blur-sm"
            style={{ ...NEVERA, background: "rgba(0,0,0,0.55)", border: "1px solid rgba(220,225,235,0.18)", color: "rgba(255,255,255,0.7)" }}
          >
            {card.token}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="text-[9px] tracking-[0.32em] uppercase mb-1 line-clamp-2" style={{ ...NEVERA, color: `${accent}cc` }}>
            {card.subtitle} · {card.tier}
          </div>
          <h4 className="text-lg leading-tight" style={SHARKON}>
            <FitText title={card.title}>
              <span className="metallic-text">{card.title}</span>
            </FitText>
          </h4>
          {card.spec && (
            <div className="text-[9px] text-white/45 font-mono mt-1 line-clamp-2">{card.spec}</div>
          )}
        </div>
      </div>

      <div className="relative p-4 space-y-3">
        <div>
          <div className="flex justify-between text-[9px] tracking-[0.28em] uppercase text-white/45 mb-1.5" style={NEVERA}>
            <span>Ownership available</span>
            <span style={{ color: `${accent}cc` }}>{card.available}%</span>
          </div>
          <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${card.available}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, #fff6, ${accent})` }}
            />
          </div>
        </div>

        <FitTextGroup>
          <div className="grid grid-cols-3 gap-2">
            {[
              { l: rentalNoun, v: card.rentalYield,   c: "text-secondary"     },
              { l: "Growth",   v: card.capitalGrowth, c: "metallic-text"      },
              { l: "ROI",      v: card.totalRoi,      c: "metallic-warm-text" },
            ].map((d) => (
              <div
                key={d.l}
                className="rounded p-2 text-center flex flex-col justify-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(220,225,235,0.06)" }}
              >
                <FitText align="center" className="text-[8px] tracking-[0.24em] uppercase text-white/35 mb-1" style={NEVERA}>{d.l}</FitText>
                <FitText share align="center" className="h-[15px] text-[13px]" style={SHARKON}><span className={d.c}>{d.v}</span></FitText>
              </div>
            ))}
          </div>
        </FitTextGroup>

        <button
          onClick={onAcquire}
          tabIndex={interactive ? undefined : -1}
          className="btn-metal w-full py-2.5 rounded-sm text-[10px] font-bold tracking-[0.28em] uppercase"
          style={NEVERA}
        >
          Acquire equity interest · from ${card.price}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────── Coming soon ─────────────────────── */
function ComingSoon() {
  return (
    <div className="mt-24 md:mt-28">
      <div className="relative rounded-2xl overflow-hidden p-6 sm:p-10 md:p-14"
        style={{
          background: "linear-gradient(160deg, rgba(20,28,48,0.8) 0%, rgba(12,18,32,0.8) 100%)",
          border: "1px solid rgba(220,225,235,0.12)",
        }}
      >
        {/* grid texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]
          bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]
          bg-[size:3rem_3rem]" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,rgba(11,181,190,0.08)_0%,transparent_70%)]" />

        <div className="relative text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full"
            style={{ background: "rgba(11,181,190,0.1)", border: "1px solid rgba(11,181,190,0.35)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <span className="text-[9px] tracking-[0.32em] uppercase text-secondary/90" style={NEVERA}>
              On the roadmap
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl tracking-wide mb-3" style={SHARKON}>
            <span className="metallic-text">More to</span>{" "}
            <span className="metallic-warm-text">own</span>
          </h3>
          <p className="text-white/55 text-base sm:text-lg md:text-xl max-w-xl mx-auto" style={SERIF}>
            New asset classes are entering the vault. Reserve your seat before the drop.
          </p>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
          {COMING_SOON.map((c, idx) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                className="group relative rounded-xl p-5 sm:p-6 overflow-hidden"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(220,225,235,0.1)" }}
              >
                <div className="pointer-events-none absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-50 transition-opacity group-hover:opacity-80"
                  style={{ background: `${c.accent}26` }}
                />
                <div className="relative flex items-center justify-between mb-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg"
                    style={{ background: `${c.accent}1a`, border: `1px solid ${c.accent}59` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: c.accent }} />
                  </span>
                  <span className="inline-flex items-center gap-1 text-[8px] tracking-[0.28em] uppercase px-2 py-1 rounded-full text-white/55"
                    style={{ ...NEVERA, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(220,225,235,0.14)" }}
                  >
                    <Lock className="w-2.5 h-2.5" /> Soon
                  </span>
                </div>
                <h4 className="relative leading-tight mb-1.5 text-base sm:text-lg" style={SHARKON}>
                  <MarqueeText>
                    <span className="metallic-text">{c.label}</span>
                  </MarqueeText>
                </h4>
                <p className="relative text-white/45 text-xs sm:text-[13px] leading-relaxed">{c.blurb}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="relative text-center">
          <a
            href="#waitlist"
            className="btn-metal inline-flex items-center gap-2.5 px-7 py-3.5 rounded-sm"
            style={NEVERA}
          >
            <span className="text-[10.5px] font-bold tracking-[0.28em] uppercase text-[#1a0e02]">
              Join the waitlist
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#1a0e02]" />
          </a>
        </div>
      </div>
    </div>
  );
}
