import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import {
  ArrowLeft, ArrowRight, Building2, Car, Coins, Gavel, MapPin, Plane,
  Ship, TrendingUp, Wallet, ChevronRight, Layers3, X,
} from "lucide-react";
import { getCategory, type AssetCategory } from "@/data/assets";
import {
  bidBounds,
  buyListing,
  createBid,
  fairValuePerShare,
  FEES,
  fmtUsdCompact,
  getHoldings,
  getListings,
  lookupProperty,
  type Listing,
} from "@/lib/portfolio";
import { useWallet } from "@/components/WalletContext";
import FitText, { FitTextGroup } from "@/components/FitText";
import { useOpasPrice, fmtOpas, usdToOpas, fmtOpasRate } from "@/lib/opasPrice";

const SHARKON = { fontFamily: "Sharkon, Nevera, sans-serif" };
const NEVERA = { fontFamily: "Nevera, Inter, sans-serif" };
const SERIF = { fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" as const };

const fmtUsd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const ICONS: Record<AssetCategory, React.ComponentType<{ className?: string }>> = {
  "real-estate": Building2,
  supercars: Car,
  yachts: Ship,
  jets: Plane,
};

export default function AssetDetail() {
  const [, params] = useRoute<{ assetId: string }>("/asset/:assetId");
  const [, navigate] = useLocation();
  const { address, isConnected } = useAccount();
  const { openWallet } = useWallet();
  const { price: opasPrice } = useOpasPrice();
  const meta = params?.assetId ? lookupProperty(params.assetId) : undefined;
  const [buyQty, setBuyQty] = useState(1);
  const [showBuy, setShowBuy] = useState(false);
  const [showBid, setShowBid] = useState(false);
  const [bidQty, setBidQty] = useState(1);
  const [bidPerShare, setBidPerShare] = useState(0);
  const [marketTick, setMarketTick] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [params?.assetId]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const listings = useMemo(() => {
    if (!meta) return [] as Listing[];
    const owner = address?.toLowerCase();
    return getListings()
      .filter((l) => l.propertyId === meta.prop.id && l.seller !== owner)
      .sort((a, b) => a.askPerShare - b.askPerShare || b.shares - a.shares);
  }, [meta, address, marketTick]);

  const userHolding = useMemo(() => {
    if (!meta || !address) return undefined;
    return getHoldings(address).find((h) => h.propertyId === meta.prop.id);
  }, [meta, address, marketTick]);

  if (!meta) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-background">
        <h1 className="text-3xl text-white mb-3" style={SHARKON}>Asset not found</h1>
        <p className="text-white/55 max-w-md mb-6" style={NEVERA}>
          The asset route exists, but this asset id does not. Marketplace links should point to a real catalog item.
        </p>
        <button
          onClick={() => navigate("/marketplace")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-primary/35 text-primary hover:bg-primary/10"
          style={NEVERA}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to marketplace
        </button>
      </div>
    );
  }

  const { prop, city } = meta;
  const catMeta = getCategory(prop.category);
  const Icon = ICONS[prop.category];
  const fair = fairValuePerShare(prop.id);
  const liveAsks = listings.length;
  const bestAsk = listings[0];
  const totalListed = listings.reduce((sum, l) => sum + l.shares, 0);
  const maxOrderUsd = bestAsk ? bestAsk.askPerShare * bestAsk.shares : 0;
  const priceDelta = bestAsk && fair ? ((bestAsk.askPerShare - fair) / fair) * 100 : 0;
  const actionBase = `/marketplace?asset=${encodeURIComponent(prop.id)}`;
  const gallery = prop.gallery?.length ? prop.gallery : [prop.image];
  const activeImage = gallery[galleryIndex] ?? prop.image;
  const buyTotalUsd = bestAsk ? buyQty * bestAsk.askPerShare * (1 + FEES.buySell) : 0;
  const { min: bidFloor, max: bidCeil } = bidBounds(prop.id);
  const clampedBid = Math.max(bidFloor, Math.min(bidCeil, bidPerShare || Math.round(fair)));

  useEffect(() => {
    setBuyQty(1);
    setBidQty(1);
    setBidPerShare(Math.round(fair));
    setShowBuy(false);
    setShowBid(false);
    setGalleryIndex(0);
  }, [prop.id, fair]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const intent = new URLSearchParams(window.location.search).get("intent");
    if (!intent || !isConnected) return;
    if (intent === "buy" && bestAsk) setShowBuy(true);
    if (intent === "bid") setShowBid(true);
  }, [isConnected, bestAsk, prop.id]);

  const openBuy = () => {
    if (!isConnected) {
      openWallet();
      return;
    }
    if (!bestAsk) {
      setToast({ kind: "err", msg: "No live ask available. Place a bid instead." });
      return;
    }
    setBuyQty(1);
    setShowBuy(true);
  };

  const openBid = () => {
    if (!isConnected) {
      openWallet();
      return;
    }
    setBidQty(1);
    setBidPerShare(Math.round(fair));
    setShowBid(true);
  };

  const handleBuy = () => {
    if (!bestAsk || !address) return;
    const res = buyListing(bestAsk.id, address, buyQty);
    if (!res.ok) {
      setToast({ kind: "err", msg: res.reason ?? "Trade failed." });
      return;
    }
    setMarketTick((x) => x + 1);
    setShowBuy(false);
    setToast({ kind: "ok", msg: `Acquired ${buyQty} share${buyQty === 1 ? "" : "s"} in ${prop.token}.` });
  };

  const handleBid = () => {
    if (!address) return;
    const res = createBid(address, prop.id, bidQty, clampedBid);
    if (!res.ok) {
      setToast({ kind: "err", msg: res.reason ?? "Bid failed." });
      return;
    }
    setMarketTick((x) => x + 1);
    setShowBid(false);
    setToast({ kind: "ok", msg: `Bid placed for ${bidQty} share${bidQty === 1 ? "" : "s"} of ${prop.token}.` });
  };

  return (
    <div className="relative min-h-screen max-w-full bg-background overflow-x-clip pb-40 sm:pb-44 lg:pb-0">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none
        bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]
        bg-[size:5rem_5rem]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(234,141,14,0.16),transparent_30%),radial-gradient(circle_at_78%_26%,rgba(11,181,190,0.12),transparent_24%),radial-gradient(circle_at_50%_72%,rgba(255,255,255,0.06),transparent_34%)] pointer-events-none" />

      <section className="relative min-h-[58vh] md:min-h-[48rem] xl:min-h-[50rem] overflow-visible">
        <motion.img
          key={activeImage}
          src={activeImage}
          alt={prop.title}
          initial={{ scale: 1.06, opacity: 0.55 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.45) saturate(1.02)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/45 to-background/75" />

        <div className="relative z-10 container mx-auto min-w-0 px-4 sm:px-6 md:px-12 pt-20 sm:pt-24 md:pt-22 pb-10 md:pb-8">
          <div className="flex flex-wrap items-center gap-2.5 mb-6 md:mb-8">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-white/75 hover:text-primary border border-white/12 hover:border-primary/35 bg-[rgba(8,12,24,0.55)] text-[10px] sm:text-[11px] tracking-[0.2em] uppercase"
              style={NEVERA}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Marketplace
            </Link>
            {city && (
              <Link
                href={`/city/${city}`}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-white/65 hover:text-white border border-white/10 hover:border-white/20 bg-[rgba(8,12,24,0.45)] text-[10px] sm:text-[11px] tracking-[0.2em] uppercase"
                style={NEVERA}
              >
                <MapPin className="w-3.5 h-3.5" />
                City collection
              </Link>
            )}
          </div>

          <div className="grid min-w-0 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,390px)] gap-5 sm:gap-6 xl:gap-10 items-start">
            <div className="max-w-4xl space-y-5 md:space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] sm:text-[10px] tracking-[0.22em] uppercase font-mono"
                  style={{ color: catMeta.accent, border: `1px solid ${catMeta.accent}55`, background: `${catMeta.accent}16` }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {catMeta.label}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] tracking-[0.24em] uppercase text-white/70 border border-white/12 bg-[rgba(8,12,24,0.45)] font-mono">
                  {prop.token}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] tracking-[0.24em] uppercase text-white/55 border border-white/10 bg-[rgba(8,12,24,0.35)] font-mono">
                  {prop.tier}
                </span>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="sm:hidden">
                  <h1
                    className="max-w-full break-words text-[1.6rem] leading-[0.92] text-white"
                    style={SHARKON}
                    title={prop.title}
                  >
                    <span className="metallic-text">{prop.title}</span>
                  </h1>
                </div>
                <FitText
                  className="hidden sm:flex text-5xl md:text-6xl lg:text-[4.65rem] leading-[0.92] text-white max-w-4xl"
                  style={SHARKON}
                  title={prop.title}
                >
                  <span className="metallic-text">{prop.title}</span>
                </FitText>

                <p className="text-base sm:text-lg md:text-2xl text-white/78 max-w-3xl leading-snug" style={SERIF}>
                {prop.spec ? `${prop.location ?? prop.subtitle} · ${prop.spec}` : (prop.location ?? prop.subtitle)}
              </p>

              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3 max-w-4xl min-w-0">
                <SignalCard label="Launch" value={fmtUsd(prop.price)} accent="#F5F7FB" />
                <SignalCard label="Best ask" value={bestAsk ? fmtUsd(bestAsk.askPerShare) : "Bid only"} accent={catMeta.accent} />
                <SignalCard label="Net yield" value={prop.rentalYield} accent="#0BB5BE" />
                <SignalCard label="Capital growth" value={prop.capitalGrowth} accent="#EA8D0E" />
              </div>

              <div className="block">
                <HeroGallery
                  gallery={gallery}
                  activeImage={activeImage}
                  galleryIndex={galleryIndex}
                  setGalleryIndex={setGalleryIndex}
                  title={prop.title}
                  categoryLabel={catMeta.label}
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:hidden">
                <QuickPill label="Fair value" value={fmtUsd(fair)} />
                <QuickPill label="Shares live" value={String(totalListed)} />
                <QuickPill label="OPAS / share" value={fmtOpas(usdToOpas(bestAsk?.askPerShare ?? fair, opasPrice))} />
                <QuickPill label="Market tone" value={bestAsk ? `${priceDelta > 0 ? "+" : ""}${priceDelta.toFixed(1)}%` : "Bid"} accent={priceDelta > 0 ? "#fda4af" : "#6ee7b7"} />
              </div>

              <div
                className="lg:hidden rounded-2xl p-4 backdrop-blur-xl min-w-0 max-w-full"
                style={{
                  background: "linear-gradient(180deg, rgba(10,16,32,0.86) 0%, rgba(8,12,24,0.92) 100%)",
                  border: "1px solid rgba(220,225,235,0.14)",
                  boxShadow: "0 20px 50px -34px rgba(0,0,0,0.86), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="min-w-0">
                    <div className="text-[9px] tracking-[0.3em] uppercase text-white/40 mb-1" style={NEVERA}>Market access</div>
                    <div className="text-lg text-white leading-none" style={SHARKON}>Live detail</div>
                  </div>
                  <div className="inline-flex w-fit shrink-0 items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-[10px] tracking-[0.14em] uppercase font-mono">
                    <Layers3 className="w-3.5 h-3.5" />
                    {liveAsks} asks
                  </div>
                </div>

                <FitTextGroup>
                  <div className="grid grid-cols-1 gap-3 mb-4 min-w-0">
                    <MetricTile label="Best ask" value={bestAsk ? fmtUsd(bestAsk.askPerShare) : "No ask"} />
                    <MetricTile label="Fair value" value={fmtUsd(fair)} />
                    <MetricTile label="Shares live" value={String(totalListed)} />
                    <MetricTile label="Est. OPAS / share" value={fmtOpas(usdToOpas(bestAsk?.askPerShare ?? fair, opasPrice))} />
                  </div>
                </FitTextGroup>

                <div className="rounded-xl px-4 py-3 border border-white/8 bg-[rgba(255,255,255,0.03)]">
                  <div className="flex flex-col gap-1.5 text-[10px] tracking-[0.18em] uppercase mb-2" style={NEVERA}>
                    <span className="text-white/42">Current market tone</span>
                    <span className={priceDelta > 0 ? "text-rose-300" : "text-emerald-300"}>
                      {bestAsk ? `${priceDelta > 0 ? "+" : ""}${priceDelta.toFixed(1)}% vs fair` : "Bid-driven"}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/62 leading-6 break-words" style={NEVERA}>
                    {bestAsk
                      ? `Best live paper is ${fmtUsd(bestAsk.askPerShare)} per share across ${bestAsk.shares} shares. Live rate ${fmtOpasRate(opasPrice)}/OPAS.`
                      : `No live seller right now. This asset is still bid-capable and can be entered through the marketplace order flow.`}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="hidden lg:block rounded-2xl p-4 sm:p-6 backdrop-blur-xl min-w-0 max-w-full lg:sticky lg:top-24 lg:mt-[17.8rem]"
              style={{
                background: "linear-gradient(180deg, rgba(10,16,32,0.86) 0%, rgba(8,12,24,0.92) 100%)",
                border: "1px solid rgba(220,225,235,0.14)",
                boxShadow: "0 28px 80px -48px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div className="min-w-0">
                  <div className="text-[9px] tracking-[0.3em] uppercase text-white/40 mb-1" style={NEVERA}>Market access</div>
                  <div className="text-lg sm:text-xl text-white leading-none" style={SHARKON}>Live detail</div>
                </div>
                <div className="inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-[10px] tracking-[0.2em] uppercase font-mono">
                  <Layers3 className="w-3.5 h-3.5" />
                  {liveAsks} asks
                </div>
              </div>

              <FitTextGroup>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 min-w-0">
                  <MetricTile label="Best ask" value={bestAsk ? fmtUsd(bestAsk.askPerShare) : "No ask"} />
                  <MetricTile label="Fair value" value={fmtUsd(fair)} />
                  <MetricTile label="Shares live" value={String(totalListed)} />
                  <MetricTile label="Est. OPAS / share" value={fmtOpas(usdToOpas(bestAsk?.askPerShare ?? fair, opasPrice))} />
                </div>
              </FitTextGroup>

              <div className="rounded-xl px-4 py-3 mb-5 border border-white/8 bg-[rgba(255,255,255,0.03)]">
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 text-[10px] tracking-[0.24em] uppercase mb-1" style={NEVERA}>
                  <span className="text-white/42">Current market tone</span>
                  <span className={priceDelta > 0 ? "text-rose-300" : "text-emerald-300"}>
                    {bestAsk ? `${priceDelta > 0 ? "+" : ""}${priceDelta.toFixed(1)}% vs fair` : "Bid-driven"}
                  </span>
                </div>
                <p className="text-[12px] text-white/62 leading-relaxed break-words" style={NEVERA}>
                  {bestAsk
                    ? `Best live paper is ${fmtUsd(bestAsk.askPerShare)} per share across ${bestAsk.shares} shares. Live rate ${fmtOpasRate(opasPrice)}/OPAS.`
                    : `No live seller right now. This asset is still bid-capable and can be entered through the marketplace order flow.`}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 min-w-0">
                <Link
                  href={`${actionBase}&intent=buy`}
                  onClick={(event) => {
                    event.preventDefault();
                    openBuy();
                  }}
                  className="btn-metal inline-flex min-w-0 max-w-full items-center justify-center gap-2 px-4 py-3 rounded-md text-[9px] sm:text-[10.5px] tracking-[0.08em] sm:tracking-[0.22em] uppercase text-[#050810] font-bold text-center leading-tight whitespace-normal break-words"
                  style={{ fontFamily: "BankGothic, sans-serif" }}
                >
                  <Wallet className="w-3.5 h-3.5 shrink-0" />
                  <span className="min-w-0 break-words">Buy now</span>
                </Link>
                <Link
                  href={`${actionBase}&intent=bid`}
                  onClick={(event) => {
                    event.preventDefault();
                    openBid();
                  }}
                  className="inline-flex min-w-0 max-w-full items-center justify-center gap-2 px-4 py-3 rounded-md text-[9px] sm:text-[10.5px] tracking-[0.08em] sm:tracking-[0.22em] uppercase border border-primary/35 text-primary hover:bg-primary/10 text-center leading-tight whitespace-normal break-words"
                  style={NEVERA}
                >
                  <Gavel className="w-3.5 h-3.5 shrink-0" />
                  <span className="min-w-0 break-words">Place bid</span>
                </Link>
              </div>

              {isConnected && userHolding && (
                <div className="mt-4 pt-4 border-t border-white/8 text-[11px] text-white/55 leading-6 break-words" style={NEVERA}>
                  You hold <span className="text-white">{userHolding.shares} shares</span> in this asset with
                  a basis of <span className="text-white">{fmtUsd(userHolding.costBasisUsd)}</span>.
                </div>
              )}
              {!isConnected && (
                <button
                  onClick={openWallet}
                  className="mt-4 w-full inline-flex min-w-0 items-center justify-center gap-2 px-4 py-2.5 rounded-md text-[10px] tracking-[0.12em] sm:tracking-[0.22em] uppercase border border-white/10 text-white/70 hover:text-white hover:border-white/20 text-center leading-tight"
                  style={NEVERA}
                >
                  <Coins className="w-3.5 h-3.5 shrink-0" />
                  <span className="min-w-0 break-words">Connect wallet for live holdings</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-14 md:-mt-[3.75rem] md:pt-0 md:pb-18">
        <div className="container mx-auto min-w-0 px-4 sm:px-6 md:px-12 grid xl:grid-cols-[minmax(0,1fr)_360px] gap-8">
          <div className="space-y-6">
            <Panel title="Asset brief" eyebrow="Investment note">
              <p className="text-[15px] text-white/70 leading-7" style={NEVERA}>
                {prop.title} sits inside the {catMeta.label.toLowerCase()} sleeve of the OPAS marketplace.
                The position is tokenized at a launch reference of {fmtUsd(prop.price)} per share, with live secondary
                paper, net-income distribution in USDT, and on-platform execution in OPAS.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                <InfoRow label="Asset class" value={catMeta.label} />
                <InfoRow label="Signature" value={prop.spec ?? prop.subtitle} />
                <InfoRow label="Location" value={prop.location ?? prop.subtitle} />
                <InfoRow label="Address / base" value={prop.address ?? "Private inventory"} />
                {prop.area ? <InfoRow label="Area / profile" value={prop.area} /> : null}
                <InfoRow label="Primary launch" value={fmtUsd(prop.price)} />
                <InfoRow label="Catalog availability" value={`${prop.available} shares`} />
              </div>
            </Panel>

            {prop.highlights?.length ? (
              <Panel title="Key highlights" eyebrow="Asset memo">
                <div className="grid gap-3 sm:grid-cols-3">
                  {prop.highlights.map((item) => (
                    <div key={item} className="rounded-xl px-4 py-3 border border-white/8 bg-[rgba(255,255,255,0.03)] text-[13px] text-white/68 leading-6" style={NEVERA}>
                      {item}
                    </div>
                  ))}
                </div>
              </Panel>
            ) : null}

            <Panel title="Live marketplace depth" eyebrow="Secondary market">
              {listings.length === 0 ? (
                <div className="rounded-xl px-4 py-4 border border-white/8 bg-[rgba(255,255,255,0.03)]">
                  <p className="text-[13px] text-white/60 leading-6" style={NEVERA}>
                    No live asks are posted right now. The correct action is to place a bid so existing holders can respond directly.
                  </p>
                  <Link
                    href={`${actionBase}&intent=bid`}
                    onClick={(event) => {
                      event.preventDefault();
                      openBid();
                    }}
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-md text-[10px] tracking-[0.22em] uppercase border border-primary/35 text-primary hover:bg-primary/10"
                    style={NEVERA}
                  >
                    Place bid from marketplace
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {listings.slice(0, 4).map((listing, idx) => (
                    <div
                      key={listing.id}
                      className="rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-white/8 bg-[rgba(255,255,255,0.03)]"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] tracking-[0.22em] uppercase text-white/35 font-mono">
                            Ask {idx + 1}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] tracking-[0.18em] uppercase font-mono ${listing.seller === "vault" ? "text-secondary border border-secondary/35 bg-secondary/10" : "text-white/55 border border-white/10 bg-white/5"}`}>
                            {listing.seller === "vault" ? "Vault" : "P2P"}
                          </span>
                        </div>
                        <div className="text-white text-[15px]" style={SHARKON}>{fmtUsd(listing.askPerShare)} / share</div>
                        <div className="text-[11px] text-white/45 font-mono break-words">
                          {listing.shares} shares available · order notional {fmtUsd(listing.askPerShare * listing.shares)}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <Link
                          href={`${actionBase}&intent=buy`}
                          onClick={(event) => {
                            event.preventDefault();
                            openBuy();
                          }}
                          className="btn-metal inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-[10px] tracking-[0.2em] uppercase text-[#050810] font-bold"
                          style={{ fontFamily: "BankGothic, sans-serif" }}
                        >
                          Buy
                        </Link>
                        <Link
                          href="/marketplace"
                          className="inline-flex items-center gap-2 px-3 py-2.5 rounded-md border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-[10px] tracking-[0.2em] uppercase"
                          style={NEVERA}
                        >
                          Full book
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel title="Performance stack" eyebrow="Return profile">
              <div className="space-y-3">
                <InfoRow label="Net yield stream" value={prop.rentalYield} accent={catMeta.accent} />
                <InfoRow label="Capital growth" value={prop.capitalGrowth} accent="#EA8D0E" />
                <InfoRow label="Indicative total return" value={prop.totalRoi} accent="#D6E3F4" />
                <InfoRow label="Best live notional" value={fmtUsdCompact(maxOrderUsd)} />
              </div>
            </Panel>

            {prop.facts?.length ? (
              <Panel title="Dossier facts" eyebrow="Profile data">
                <div className="space-y-3">
                  {prop.facts.map((fact) => (
                    <InfoRow key={`${fact.label}-${fact.value}`} label={fact.label} value={fact.value} />
                  ))}
                </div>
                {prop.sourceNote ? (
                  <div className="mt-4 pt-4 border-t border-white/8 text-[11px] text-white/45 leading-6" style={NEVERA}>
                    Source note: {prop.sourceNote}
                  </div>
                ) : null}
              </Panel>
            ) : null}

          </div>

          <div className="xl:col-span-2">
            <Panel title="Execution path" eyebrow="Trade flow">
              <ol className="space-y-3 text-[13px] text-white/68 leading-6" style={NEVERA}>
                <li>1. Review the asset here and confirm the live market paper.</li>
                <li>2. Move to marketplace in buy mode or bid mode, already scoped to this asset.</li>
                <li>3. Settle the order in OPAS; yield distributions continue in USDT.</li>
              </ol>
              <div className="mt-4 grid gap-2 min-w-0 lg:grid-cols-2">
                <Link
                  href={`${actionBase}&intent=buy`}
                  onClick={(event) => {
                    event.preventDefault();
                    openBuy();
                  }}
                  className="inline-flex min-w-0 max-w-full items-center justify-between gap-3 px-4 py-3 rounded-xl border border-primary/30 bg-primary/8 text-primary hover:bg-primary/12"
                  style={NEVERA}
                >
                  <span className="min-w-0 break-words">Open marketplace in buy mode</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
                <Link
                  href={`${actionBase}&intent=bid`}
                  onClick={(event) => {
                    event.preventDefault();
                    openBid();
                  }}
                  className="inline-flex min-w-0 max-w-full items-center justify-between gap-3 px-4 py-3 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.03)] text-white/72 hover:text-white"
                  style={NEVERA}
                >
                  <span className="min-w-0 break-words">Open marketplace in bid mode</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              </div>
            </Panel>
          </div>
        </div>
      </section>

      {toast && (
        <div className="fixed bottom-[5.5rem] right-4 left-4 md:left-auto md:bottom-5 md:right-5 z-50 md:max-w-sm rounded-xl border border-white/10 bg-[rgba(8,12,24,0.92)] px-4 py-3 text-[12px] text-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]" style={NEVERA}>
          <span className={toast.kind === "ok" ? "text-emerald-300" : "text-rose-300"}>{toast.msg}</span>
        </div>
      )}

      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 overflow-hidden border-t border-white/10 bg-[rgba(6,10,20,0.92)] backdrop-blur-xl px-4 pb-[max(env(safe-area-inset-bottom),1rem)] pt-3 shadow-[0_-20px_50px_-30px_rgba(0,0,0,0.95)]">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="text-[8px] tracking-[0.18em] uppercase text-white/35" style={NEVERA}>Live access</div>
            <div className="text-lg text-white leading-none" style={SHARKON}>
              {bestAsk ? fmtUsd(bestAsk.askPerShare) : fmtUsd(fair)}
            </div>
          </div>
          <div className="min-w-0 text-right">
            <div className="text-[7px] tracking-[0.14em] uppercase text-white/35" style={NEVERA}>Shares live</div>
            <div className="text-sm text-primary" style={SHARKON}>{totalListed}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <button type="button" onClick={openBuy} className="btn-metal min-w-0 px-3 py-3 rounded-xl text-[#050810] font-bold tracking-[0.08em] uppercase text-[10px] leading-tight" style={NEVERA}>
            <span className="block break-words">Buy now</span>
          </button>
          <button type="button" onClick={openBid} className="min-w-0 px-3 py-3 rounded-xl border border-primary/35 bg-primary/10 text-primary tracking-[0.08em] uppercase text-[10px] leading-tight" style={NEVERA}>
            <span className="block break-words">Place bid</span>
          </button>
        </div>
      </div>

      {showBuy && bestAsk && (
        <TradeModal title="Acquire live paper" onClose={() => setShowBuy(false)}>
          <div className="space-y-4">
            <p className="text-[13px] text-white/62 leading-6" style={NEVERA}>
              You are buying from the best live ask on this asset. Settlement includes the 7% platform fee and credits shares directly into your wallet portfolio.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <MetricTile label="Best ask" value={fmtUsd(bestAsk.askPerShare)} />
              <MetricTile label="Shares live" value={String(bestAsk.shares)} />
            </div>
            <div className="rounded-xl border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="text-[10px] tracking-[0.24em] uppercase text-white/38" style={NEVERA}>Quantity</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setBuyQty((q) => Math.max(1, q - 1))} className="w-8 h-8 rounded-md border border-white/10 text-white/70 hover:text-white">-</button>
                  <span className="min-w-[2ch] text-center text-lg text-white" style={SHARKON}>{buyQty}</span>
                  <button type="button" onClick={() => setBuyQty((q) => Math.min(bestAsk.shares, q + 1))} className="w-8 h-8 rounded-md border border-white/10 text-white/70 hover:text-white">+</button>
                </div>
              </div>
              <div className="space-y-2 text-[12px]" style={NEVERA}>
                <div className="flex items-center justify-between"><span className="text-white/45">Gross</span><span className="text-white">{fmtUsd(buyQty * bestAsk.askPerShare)}</span></div>
                <div className="flex items-center justify-between"><span className="text-white/45">Platform fee</span><span className="text-white">{fmtUsd(buyQty * bestAsk.askPerShare * FEES.buySell)}</span></div>
                <div className="flex items-center justify-between pt-2 border-t border-white/8"><span className="text-white/45">Total debit</span><span className="text-primary">{fmtUsd(buyTotalUsd)}</span></div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button type="button" onClick={() => setShowBuy(false)} className="px-4 py-3 rounded-md border border-white/10 text-white/70 hover:text-white" style={NEVERA}>Cancel</button>
              <button type="button" onClick={handleBuy} className="btn-metal px-4 py-3 rounded-md text-[#050810] font-bold tracking-[0.22em] uppercase text-[10px]" style={NEVERA}>Confirm purchase</button>
            </div>
          </div>
        </TradeModal>
      )}

      {showBid && (
        <TradeModal title="Place acquisition bid" onClose={() => setShowBid(false)}>
          <div className="space-y-4">
            <p className="text-[13px] text-white/62 leading-6" style={NEVERA}>
              No direct seller is required here. Submit your bid from the catalogue and existing holders can respond from the marketplace.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <MetricTile label="Fair value" value={fmtUsd(fair)} />
              <MetricTile label="Bid band" value={`${fmtUsd(bidFloor)} - ${fmtUsd(bidCeil)}`} />
            </div>
            <div className="grid gap-3">
              <label className="rounded-xl border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                <div className="text-[10px] tracking-[0.24em] uppercase text-white/38 mb-2" style={NEVERA}>Shares wanted</div>
                <input type="number" min={1} value={bidQty} onChange={(e) => setBidQty(Math.max(1, Number(e.target.value) || 1))} className="w-full bg-transparent text-xl text-white outline-none" style={SHARKON} />
              </label>
              <label className="rounded-xl border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
                <div className="text-[10px] tracking-[0.24em] uppercase text-white/38 mb-2" style={NEVERA}>Bid per share</div>
                <input type="number" min={bidFloor} max={bidCeil} value={clampedBid} onChange={(e) => setBidPerShare(Number(e.target.value) || Math.round(fair))} className="w-full bg-transparent text-xl text-white outline-none" style={SHARKON} />
              </label>
            </div>
            <div className="rounded-xl border border-white/8 bg-[rgba(255,255,255,0.03)] p-4 text-[12px] flex items-center justify-between gap-3" style={NEVERA}>
              <span className="text-white/45">Indicative bid notional</span>
              <span className="text-primary">{fmtUsd(bidQty * clampedBid)}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button type="button" onClick={() => setShowBid(false)} className="px-4 py-3 rounded-md border border-white/10 text-white/70 hover:text-white" style={NEVERA}>Cancel</button>
              <button type="button" onClick={handleBid} className="px-4 py-3 rounded-md border border-primary/35 bg-primary/10 text-primary tracking-[0.22em] uppercase text-[10px]" style={NEVERA}>Submit bid</button>
            </div>
          </div>
        </TradeModal>
      )}
    </div>
  );
}

function TradeModal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/72 p-4 backdrop-blur-md" onClick={onClose}>
      <div
        className="w-full max-w-xl rounded-2xl border border-white/12 bg-[linear-gradient(180deg,rgba(14,20,36,0.96)_0%,rgba(8,12,24,0.98)_100%)] p-5 sm:p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.95)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 mb-5">
          <h3 className="text-2xl text-white" style={SHARKON}>{title}</h3>
          <button type="button" onClick={onClose} className="w-9 h-9 rounded-md border border-white/10 text-white/60 hover:text-white hover:border-white/20 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function HeroGallery({
  gallery,
  activeImage,
  galleryIndex,
  setGalleryIndex,
  title,
  categoryLabel,
}: {
  gallery: string[];
  activeImage: string;
  galleryIndex: number;
  setGalleryIndex: React.Dispatch<React.SetStateAction<number>>;
  title: string;
  categoryLabel: string;
}) {
  const touchStartX = useRef<number | null>(null);
  const swipeThreshold = 36;

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX ?? null;
    touchStartX.current = null;
    if (startX == null || endX == null) return;
    const delta = endX - startX;
    if (Math.abs(delta) < swipeThreshold) return;
    if (delta < 0) {
      setGalleryIndex((idx) => (idx + 1) % gallery.length);
    } else {
      setGalleryIndex((idx) => (idx - 1 + gallery.length) % gallery.length);
    }
  };

  return (
    <div className="min-w-0 overflow-hidden rounded-[1.25rem] border border-white/12 bg-[linear-gradient(180deg,rgba(14,20,36,0.72)_0%,rgba(8,12,24,0.82)_100%)] shadow-[0_24px_60px_-32px_rgba(0,0,0,0.85)]">
      <div
        className="relative aspect-[16/10] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: "pan-y" }}
      >
        <img
          key={activeImage}
          src={activeImage}
          alt={`${title} feature`}
          className="h-full w-full object-cover"
          style={{ filter: "saturate(1.04) brightness(0.94)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute left-4 right-4 bottom-4 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="text-[8px] sm:text-[9px] tracking-[0.18em] sm:tracking-[0.24em] uppercase text-white/45 mb-1" style={NEVERA}>Catalogue frame</div>
            <div className="max-w-full text-[0.95rem] sm:text-base leading-tight text-white break-words" style={SHARKON}>{title}</div>
          </div>
          <div className="max-w-full inline-flex items-center gap-2 rounded-full border border-white/10 bg-[rgba(8,12,24,0.65)] px-3 py-1.5 text-[9px] tracking-[0.16em] sm:tracking-[0.22em] uppercase text-primary" style={NEVERA}>
            <span>{galleryIndex + 1}</span>
            <span className="text-white/28">/</span>
            <span>{gallery.length}</span>
            <span className="min-w-0 break-words text-white/55">{categoryLabel}</span>
          </div>
        </div>
      </div>
      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto px-3 py-3 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          {gallery.map((image, idx) => (
            <button
              key={`${image}-${idx}-hero`}
              type="button"
              onClick={() => setGalleryIndex(idx)}
              className={`relative shrink-0 w-20 sm:w-24 aspect-[4/3] overflow-hidden rounded-xl border ${idx === galleryIndex ? "border-primary/60" : "border-white/10"}`}
            >
              <img
                src={image}
                alt={`${title} preview ${idx + 1}`}
                className="h-full w-full object-cover"
                style={{ filter: idx === galleryIndex ? "saturate(1) brightness(0.96)" : "saturate(0.76) brightness(0.72)" }}
              />
              <div className={`absolute inset-0 ${idx === galleryIndex ? "opacity-0" : "opacity-35"} bg-black transition-opacity`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Panel({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div
      className="min-w-0 max-w-full overflow-hidden rounded-2xl p-5 sm:p-6"
      style={{
        background: "linear-gradient(180deg, rgba(14,20,36,0.82) 0%, rgba(8,12,24,0.88) 100%)",
        border: "1px solid rgba(220,225,235,0.12)",
        boxShadow: "0 18px 50px -34px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div className="text-[9px] tracking-[0.28em] uppercase text-white/38 mb-2" style={NEVERA}>{eyebrow}</div>
      <h2 className="mb-4 max-w-full break-words text-[1.32rem] leading-tight text-white sm:text-2xl" style={SHARKON}>{title}</h2>
      {children}
    </div>
  );
}

function SignalCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div
      className="rounded-xl min-w-0 overflow-hidden px-3 sm:px-4 py-3"
      style={{
        background: "rgba(8,12,24,0.48)",
        border: "1px solid rgba(220,225,235,0.12)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div className="text-[9px] tracking-[0.26em] uppercase text-white/38 mb-1" style={NEVERA}>{label}</div>
      <FitText share className="text-base sm:text-xl" style={{ ...SHARKON, color: accent }}>{value}</FitText>
    </div>
  );
}

function QuickPill({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-[rgba(255,255,255,0.03)] px-3 py-3 min-w-0">
      <div className="text-[8px] tracking-[0.24em] uppercase text-white/34 mb-1" style={NEVERA}>{label}</div>
      <FitText share className="text-[0.9rem] sm:text-base min-w-0" style={{ ...SHARKON, color: accent ?? "#F5F7FB" }}>{value}</FitText>
    </div>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl px-4 py-3 border border-white/8 bg-[rgba(255,255,255,0.03)] min-w-0 max-w-full overflow-hidden">
      <div className="text-[8.5px] tracking-[0.24em] uppercase text-white/35 mb-1" style={NEVERA}>{label}</div>
      <FitText share className="text-[0.92rem] sm:text-lg text-white min-w-0" style={SHARKON}>{value}</FitText>
    </div>
  );
}

function InfoRow({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 rounded-xl px-4 py-3 border border-white/8 bg-[rgba(255,255,255,0.03)] min-w-0 max-w-full overflow-hidden">
      <span className="text-[10px] tracking-[0.2em] sm:tracking-[0.24em] uppercase text-white/38 break-words" style={NEVERA}>{label}</span>
      <span className="min-w-0 text-[12px] sm:text-[14px] sm:text-right break-words leading-tight" style={{ ...SHARKON, color: accent ?? "#F5F7FB" }}>{value}</span>
    </div>
  );
}
