import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { Link } from "wouter";
import {
  Store, TrendingUp, TrendingDown, Tag, ShoppingCart, X as XIcon,
  Wallet, Search, ArrowUpDown, ChevronRight, Gavel, Minus, Plus, Loader2,
} from "lucide-react";
import {
  getListings, buyListing, cancelListing, lookupProperty, fairValuePerShare,
  fmtUsdCompact, FEES,
  getBids, createBid, cancelBid, settleBid, bidBounds, BID_VARIANCE,
  type Listing, type Bid,
} from "@/lib/portfolio";
import { useWallet } from "@/components/WalletContext";
import MarqueeText from "@/components/MarqueeText";
import OpasPriceTag from "@/components/OpasPriceTag";
import { useOpasPrice, usdToOpas, fmtOpas, fmtOpasRate } from "@/lib/opasPrice";
import { CATEGORIES, getCategory, categoryOf, type AssetCategory } from "@/data/assets";

const SHARKON = { fontFamily: "Sharkon, Nevera, sans-serif" };
const NEVERA  = { fontFamily: "Nevera, Inter, sans-serif" };

const fmtUsd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

type SortKey = "available" | "newest" | "discount" | "yield" | "price_asc" | "price_desc";

export default function Marketplace() {
  const { address, isConnected } = useAccount();
  const { openWallet } = useWallet();
  const { price: opasPrice } = useOpasPrice();
  const [listings, setListings] = useState<Listing[]>([]);
  const [tab, setTab] = useState<"all" | "mine">("all");
  const [catFilter, setCatFilter] = useState<AssetCategory | "all">("all");
  const [sort, setSort] = useState<SortKey>("available");
  const [search, setSearch] = useState("");
  const [buyState, setBuyState] = useState<{ listing: Listing; qty: number } | null>(null);
  const [bidState, setBidState] = useState<{ propertyId: string; qty: number; perShare: number } | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  useEffect(() => { setListings(getListings()); }, []);
  useEffect(() => { setBids(address ? getBids(address) : []); }, [address]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    let l = [...listings];
    if (tab === "mine" && address) l = l.filter((x) => x.seller === address.toLowerCase());
    if (catFilter !== "all") l = l.filter((x) => categoryOf(x.propertyId) === catFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      l = l.filter((x) => {
        const m = lookupProperty(x.propertyId);
        return m && (m.prop.title.toLowerCase().includes(q) || m.prop.token.toLowerCase().includes(q));
      });
    }
    const enriched = l.map((x) => {
      const meta = lookupProperty(x.propertyId);
      const fair = fairValuePerShare(x.propertyId);
      const discount = fair ? ((fair - x.askPerShare) / fair) * 100 : 0;
      const yld = meta ? parseFloat(meta.prop.rentalYield) : 0;
      return { listing: x, fair, discount, yld };
    });
    switch (sort) {
      case "available":  enriched.sort((a, b) => b.listing.shares - a.listing.shares); break;
      case "discount":   enriched.sort((a, b) => b.discount - a.discount); break;
      case "yield":      enriched.sort((a, b) => b.yld - a.yld); break;
      case "price_asc":  enriched.sort((a, b) => a.listing.askPerShare - b.listing.askPerShare); break;
      case "price_desc": enriched.sort((a, b) => b.listing.askPerShare - a.listing.askPerShare); break;
      default:           enriched.sort((a, b) => b.listing.createdAt - a.listing.createdAt);
    }
    return enriched;
  }, [listings, tab, catFilter, sort, search, address]);

  // Per-class listing counts (respect the active tab + search, ignore the class filter itself).
  const catCounts = useMemo(() => {
    let base = [...listings];
    if (tab === "mine" && address) base = base.filter((x) => x.seller === address.toLowerCase());
    if (search.trim()) {
      const q = search.toLowerCase();
      base = base.filter((x) => {
        const m = lookupProperty(x.propertyId);
        return m && (m.prop.title.toLowerCase().includes(q) || m.prop.token.toLowerCase().includes(q));
      });
    }
    const counts: Record<string, number> = { all: base.length };
    for (const c of CATEGORIES) counts[c.id] = base.filter((x) => categoryOf(x.propertyId) === c.id).length;
    return counts;
  }, [listings, tab, search, address]);

  const totals = useMemo(() => {
    const tvl = listings.reduce((a, l) => a + l.shares * l.askPerShare, 0);
    const tot = listings.reduce((a, l) => a + l.shares, 0);
    const mineCount = address ? listings.filter((l) => l.seller === address.toLowerCase()).length : 0;
    return { tvl, tot, mineCount, count: listings.length };
  }, [listings, address]);

  const handleBuy = () => {
    if (!buyState || !address) return;
    const res = buyListing(buyState.listing.id, address, buyState.qty);
    if (!res.ok) {
      setToast({ kind: "err", msg: res.reason ?? "Trade failed." });
      return;
    }
    setListings(res.listings!);
    setToast({ kind: "ok", msg: `Acquired ${buyState.qty} share${buyState.qty === 1 ? "" : "s"}.` });
    setBuyState(null);
  };

  const handleCancel = (listing: Listing) => {
    if (!address) return;
    const next = cancelListing(listing.id, address);
    setListings(next);
    setToast({ kind: "ok", msg: "Listing cancelled. Shares returned to vault." });
  };

  const openBid = (propertyId: string) => {
    if (!isConnected) { openWallet(); return; }
    setBidState({ propertyId, qty: 1, perShare: Math.round(fairValuePerShare(propertyId)) });
  };

  const handleBid = () => {
    if (!bidState || !address) return;
    const res = createBid(address, bidState.propertyId, bidState.qty, bidState.perShare);
    if (!res.ok) { setToast({ kind: "err", msg: res.reason ?? "Bid failed." }); return; }
    setBids(res.bids!);
    setToast({ kind: "ok", msg: `Bid placed for ${bidState.qty} share${bidState.qty === 1 ? "" : "s"}.` });
    setBidState(null);
  };

  const handleCancelBid = (id: string) => {
    if (!address) return;
    setBids(cancelBid(address, id));
    setToast({ kind: "ok", msg: "Bid withdrawn." });
  };

  // Simulated order book: a seller fills the user's pending bids after a moment.
  const bidTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  useEffect(() => {
    if (!address) return;
    const acct = address;
    bids
      .filter((b) => b.status === "pending")
      .forEach((b) => {
        if (bidTimers.current.has(b.id)) return;
        const delay = Math.max(2500, 6000 - (Date.now() - b.createdAt));
        const t = setTimeout(() => {
          bidTimers.current.delete(b.id);
          const res = settleBid(acct, b.id);
          if (res.ok) {
            setBids(res.bids ?? getBids(acct));
            setToast({ kind: "ok", msg: "Seller accepted — bid filled." });
          }
        }, delay);
        bidTimers.current.set(b.id, t);
      });
  }, [bids, address]);

  // Cancel any in-flight fill timers on unmount or wallet switch so a stale
  // callback can't settle against the previous wallet's bids.
  useEffect(() => {
    const timers = bidTimers.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, [address]);

  const myBids = useMemo(
    () => bids.filter((b) => b.status === "pending" || b.status === "filled").slice(0, 6),
    [bids],
  );

  return (
    <div className="min-h-screen pt-28 md:pt-32 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl space-y-6 md:space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div className="space-y-3">
            <div className="metallic-border inline-flex items-center gap-2 px-3 py-1 rounded-full">
              <span className="w-1 h-1 rounded-full bg-secondary animate-pulse" />
              <span className="text-[8.5px] tracking-[0.32em] uppercase metallic-text" style={NEVERA}>
                Secondary market · 24/7
              </span>
            </div>
            <h1 className="text-[17px] sm:text-3xl md:text-5xl leading-[1.2]" style={SHARKON}>
              <span className="metallic-text block">Marketplace.</span>
              <span className="metallic-warm-text block">Trade ownership.</span>
            </h1>
            <p className="text-white/55 text-sm max-w-2xl leading-relaxed" style={NEVERA}>
              Peer-to-peer order book for OPA equity tokens. Lift an ask from another investor,
              or list your own position with a one-line confirmation. Settlement is atomic and on-chain.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <OpasPriceTag withSparkline />
            <Link href="/portfolio" className="btn-metal-silver px-3 sm:px-4 py-2 sm:py-2.5 text-[9.5px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.22em] uppercase rounded-sm" style={NEVERA}>
              List shares for sale →
            </Link>
            <Link href="/" className="px-3 sm:px-4 py-2 sm:py-2.5 text-[9.5px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.22em] text-white/55 hover:text-white uppercase border border-white/10 hover:border-white/25 rounded-sm transition-colors" style={NEVERA}>
              ← Home
            </Link>
          </div>
        </motion.div>

        {/* Market stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          {[
            { label: "Open listings",      value: String(totals.count),       icon: Tag,        tone: "text-white" },
            { label: "Liquidity (USD)",    value: fmtUsdCompact(totals.tvl),  icon: TrendingUp, tone: "text-primary" },
            { label: "Shares available",   value: totals.tot.toLocaleString(), icon: Store,      tone: "text-secondary" },
            { label: "Your listings",      value: String(totals.mineCount),   icon: Wallet,     tone: "text-emerald-300" },
          ].map((s) => (
            <div key={s.label}
              className="rounded-lg p-3 sm:p-4 min-w-0"
              style={{ background: "rgba(20,28,48,0.5)", border: "1px solid rgba(220,225,235,0.08)" }}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2 min-w-0">
                <MarqueeText className="text-[7.5px] sm:text-[8.5px] tracking-[0.24em] sm:tracking-[0.32em] uppercase text-white/40 min-w-0 flex-1" style={NEVERA}>{s.label}</MarqueeText>
                <s.icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${s.tone}`} />
              </div>
              <div className={`text-base sm:text-xl md:text-2xl truncate ${s.tone}`} style={SHARKON}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            {/* Tabs */}
            <div className="inline-flex p-1 rounded-md border border-white/10 bg-[rgba(20,28,48,0.4)] shrink-0 self-start">
              {(["all", "mine"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  disabled={t === "mine" && !isConnected}
                  className={`px-3 sm:px-4 py-2 text-[10px] tracking-[0.2em] sm:tracking-[0.24em] uppercase transition-colors rounded-sm ${tab === t ? "bg-primary/15 text-primary" : "text-white/55 hover:text-white"} disabled:opacity-30 disabled:cursor-not-allowed`}
                  style={NEVERA}
                  data-testid={`tab-${t}`}
                >
                  {t === "all" ? "All" : "Mine"}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/35" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search asset or token…"
                className="w-full pl-9 pr-3 py-2.5 text-[12px] bg-[rgba(20,28,48,0.4)] border border-white/10 focus:border-primary/40 outline-none rounded-md text-white/85 placeholder:text-white/30"
                style={NEVERA}
              />
            </div>

            {/* Sort */}
            <div className="relative w-full lg:w-56 min-w-0 shrink-0">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/35 pointer-events-none" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="w-full pl-8 pr-2 py-2.5 text-[11px] tracking-[0.18em] uppercase bg-[rgba(20,28,48,0.4)] border border-white/10 hover:border-white/25 rounded-md text-white/75 outline-none cursor-pointer"
                style={NEVERA}
              >
                <option value="available">Most available</option>
                <option value="newest">Newest</option>
                <option value="discount">Best discount</option>
                <option value="yield">Highest yield</option>
                <option value="price_asc">Price ↑</option>
                <option value="price_desc">Price ↓</option>
              </select>
            </div>
          </div>

          {/* Asset-class filter chips */}
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by asset class">
            <span className="text-[8.5px] tracking-[0.3em] uppercase text-white/30 mr-1 hidden sm:inline" style={NEVERA}>Filter</span>
            <button
              onClick={() => setCatFilter("all")}
              data-testid="catfilter-all"
              aria-pressed={catFilter === "all"}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-[9.5px] sm:text-[10px] tracking-[0.2em] uppercase rounded-md border transition-colors ${catFilter === "all" ? "text-primary border-primary/55 bg-primary/10" : "text-white/55 hover:text-white border-white/10 hover:border-white/25"}`}
              style={NEVERA}
            >
              All classes
              <span className="text-[9px] opacity-60">{catCounts.all}</span>
            </button>
            {CATEGORIES.map((c) => {
              const active = catFilter === c.id;
              const n = catCounts[c.id] ?? 0;
              return (
                <button
                  key={c.id}
                  onClick={() => setCatFilter(c.id)}
                  data-testid={`catfilter-${c.id}`}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-[9.5px] sm:text-[10px] tracking-[0.2em] uppercase rounded-md border transition-colors ${active ? "" : "text-white/55 hover:text-white border-white/10 hover:border-white/25"} ${n === 0 ? "opacity-40" : ""}`}
                  style={active ? { ...NEVERA, color: c.accent, borderColor: `${c.accent}66`, background: `${c.accent}14` } : NEVERA}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.accent }} />
                  {c.label}
                  <span className="text-[9px] opacity-60">{n}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* My bids */}
        {myBids.length > 0 && (
          <div className="rounded-lg p-4 space-y-3"
            style={{ background: "rgba(20,28,48,0.4)", border: "1px solid rgba(234,141,14,0.18)" }}
            data-testid="my-bids"
          >
            <div className="flex items-center gap-2">
              <Gavel className="w-3.5 h-3.5 text-primary" />
              <span className="text-[9.5px] tracking-[0.3em] uppercase text-white/55" style={NEVERA}>Your bids</span>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
              {myBids.map((b) => {
                const m = lookupProperty(b.propertyId);
                const pending = b.status === "pending";
                return (
                  <div key={b.id} className="flex items-center justify-between gap-3 rounded-md px-3 py-2.5"
                    style={{ background: "rgba(8,12,24,0.6)", border: "1px solid rgba(220,225,235,0.06)" }}
                  >
                    <div className="min-w-0">
                      <div className="text-[12px] text-white truncate" style={SHARKON}>{m?.prop.token ?? b.propertyId}</div>
                      <div className="text-[9.5px] text-white/45 font-mono truncate">
                        {b.shares} × {fmtUsd(b.bidPerShare)}/sh
                      </div>
                    </div>
                    {pending ? (
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="flex items-center gap-1 text-[9px] tracking-[0.18em] uppercase text-primary font-mono">
                          <Loader2 className="w-3 h-3 animate-spin" /> Live
                        </span>
                        <button
                          onClick={() => handleCancelBid(b.id)}
                          data-testid={`cancel-bid-${b.id}`}
                          className="text-white/40 hover:text-rose-300"
                          aria-label="Withdraw bid"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="shrink-0 text-[9px] tracking-[0.18em] uppercase text-emerald-300 font-mono">Filled</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Listings grid */}
        {filtered.length === 0 ? (
          <div className="rounded-lg p-12 text-center"
            style={{ background: "rgba(20,28,48,0.4)", border: "1px solid rgba(220,225,235,0.06)" }}
          >
            <Store className="w-8 h-8 mx-auto mb-3 text-white/25" />
            <div className="text-white/55 text-sm" style={NEVERA}>
              {tab === "mine" ? "You have no active listings." : "No listings match your filters."}
            </div>
            {tab === "mine" && (
              <Link href="/portfolio" className="inline-block mt-4 text-[11px] tracking-[0.22em] uppercase text-primary hover:text-primary/80" style={NEVERA}>
                Go to portfolio →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(({ listing, fair, discount, yld }) => {
              const meta = lookupProperty(listing.propertyId);
              if (!meta) return null;
              const { prop, city } = meta;
              const catMeta = getCategory(prop.category);
              const TitleTag: any = city ? Link : "span";
              const titleProps = city ? { href: `/city/${city}` } : {};
              const mine = address && listing.seller === address.toLowerCase();
              const isPremium = discount < 0;
              return (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg overflow-hidden group flex flex-col"
                  style={{ background: "rgba(20,28,48,0.55)", border: "1px solid rgba(220,225,235,0.08)" }}
                  data-testid={`listing-${listing.id}`}
                >
                  <div className="relative h-36 overflow-hidden">
                    <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/40 to-transparent" />
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                      <div className="px-2 py-0.5 rounded-sm text-[8.5px] tracking-[0.28em] uppercase text-primary border border-primary/40 bg-[#050810]/60 font-mono">
                        {prop.token}
                      </div>
                      {mine ? (
                        <div className="px-2 py-0.5 rounded-sm text-[8.5px] tracking-[0.28em] uppercase text-emerald-300 border border-emerald-400/40 bg-emerald-400/10 font-mono">
                          Your ask
                        </div>
                      ) : listing.seller === "vault" ? (
                        <div className="px-2 py-0.5 rounded-sm text-[8.5px] tracking-[0.28em] uppercase text-secondary border border-secondary/40 bg-secondary/10 font-mono">
                          Vault
                        </div>
                      ) : (
                        <div className="px-2 py-0.5 rounded-sm text-[8.5px] tracking-[0.28em] uppercase text-white/55 border border-white/20 bg-[#050810]/60 font-mono">
                          P2P
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <TitleTag {...titleProps} className={`text-[15px] text-white font-medium transition-colors block leading-tight ${city ? "hover:text-primary" : ""}`} style={SHARKON}>
                        <MarqueeText title={prop.title}>{prop.title}</MarqueeText>
                      </TitleTag>
                      <div className="text-[9.5px] text-white/55 line-clamp-2 font-mono">{prop.spec ?? prop.subtitle}</div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="shrink-0 px-2 py-0.5 rounded-full text-[8px] tracking-[0.22em] uppercase font-mono"
                        style={{ color: catMeta.accent, border: `1px solid ${catMeta.accent}55`, background: `${catMeta.accent}14` }}
                      >
                        {catMeta.label}
                      </span>
                      <MarqueeText className="text-[8px] tracking-[0.22em] uppercase text-white/35 font-mono min-w-0 flex-1">{prop.tier}</MarqueeText>
                    </div>
                    <div className="grid grid-cols-2 gap-3 min-w-0">
                      <div className="min-w-0">
                        <div className="text-[8.5px] tracking-[0.28em] uppercase text-white/35" style={NEVERA}>Ask / share</div>
                        <div className="text-base sm:text-lg text-white truncate" style={SHARKON}>{fmtUsd(listing.askPerShare)}</div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[8.5px] tracking-[0.28em] uppercase text-white/35" style={NEVERA}>Fair value</div>
                        <div className="text-base sm:text-lg text-white/65 truncate" style={SHARKON}>{fmtUsd(fair)}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10.5px]" style={NEVERA}>
                      <span className="tracking-[0.22em] uppercase text-white/40">Available</span>
                      <span className="text-white">{listing.shares} share{listing.shares === 1 ? "" : "s"}</span>
                    </div>

                    <div className="flex items-center justify-between text-[10.5px]" style={NEVERA}>
                      <span className="tracking-[0.22em] uppercase text-white/40">Yield</span>
                      <span className="text-white">{prop.rentalYield}</span>
                    </div>

                    <div className={`flex items-center justify-between text-[10.5px] font-mono`}>
                      <span className="tracking-[0.22em] uppercase text-white/40">vs Fair</span>
                      <span className={`flex items-center gap-1 ${isPremium ? "text-rose-300" : "text-emerald-300"}`}>
                        {isPremium ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {isPremium ? "+" : ""}{(-discount).toFixed(1)}% {isPremium ? "premium" : "discount"}
                      </span>
                    </div>

                    <div className="mt-auto pt-3 border-t border-white/5 flex gap-2">
                      {mine ? (
                        <button
                          onClick={() => handleCancel(listing)}
                          data-testid={`cancel-${listing.id}`}
                          className="flex-1 px-4 py-2.5 text-[10.5px] tracking-[0.22em] uppercase border border-rose-400/40 text-rose-300 hover:bg-rose-400/10 rounded-sm transition-colors"
                          style={NEVERA}
                        >
                          Cancel listing
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => isConnected ? setBuyState({ listing, qty: Math.min(1, listing.shares) }) : openWallet()}
                            data-testid={`buy-${listing.id}`}
                            className="btn-metal flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[10.5px] tracking-[0.22em] uppercase text-[#050810] rounded-sm font-bold"
                            style={{ fontFamily: "BankGothic, sans-serif" }}
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Buy
                          </button>
                          <button
                            onClick={() => openBid(listing.propertyId)}
                            data-testid={`bid-${listing.id}`}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[10.5px] tracking-[0.22em] uppercase text-primary border border-primary/40 hover:bg-primary/10 rounded-sm transition-colors"
                            style={NEVERA}
                          >
                            <Gavel className="w-3.5 h-3.5" />
                            Bid
                          </button>
                        </>
                      )}
                      {city && (
                        <Link
                          href={`/city/${city}`}
                          className="px-3 py-2.5 text-[10.5px] tracking-[0.22em] uppercase text-white/55 hover:text-white border border-white/10 hover:border-white/25 rounded-sm transition-colors flex items-center"
                          style={NEVERA}
                        >
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Buy modal */}
      {buyState && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          onClick={() => setBuyState(null)}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="metallic-border relative w-full max-w-md rounded-xl p-7 space-y-5"
            style={{
              background: "linear-gradient(160deg, rgba(12,18,32,0.96) 0%, rgba(8,12,24,0.96) 100%)",
            }}
            data-testid="buy-modal"
          >
            <button
              onClick={() => setBuyState(null)}
              className="absolute top-4 right-4 text-white/40 hover:text-primary"
            >
              <XIcon className="w-5 h-5" />
            </button>

            {(() => {
              const meta = lookupProperty(buyState.listing.propertyId);
              if (!meta) return null;
              const subtotal = buyState.qty * buyState.listing.askPerShare;
              const buyFee = subtotal * FEES.buySell;
              const total = subtotal + buyFee;
              return (
                <>
                  <div>
                    <div className="text-[8.5px] tracking-[0.32em] uppercase text-primary mb-1 font-mono">
                      {meta.prop.token} · Buy order
                    </div>
                    <h3 className="text-2xl text-white" style={SHARKON}>{meta.prop.title}</h3>
                  </div>

                  <div className="space-y-3">
                    <label className="block">
                      <span className="text-[8.5px] tracking-[0.32em] uppercase text-white/45" style={NEVERA}>Quantity (max {buyState.listing.shares})</span>
                      <input
                        type="number"
                        min={1}
                        max={buyState.listing.shares}
                        value={buyState.qty}
                        onChange={(e) => setBuyState({ listing: buyState.listing, qty: Math.max(1, Math.min(buyState.listing.shares, parseInt(e.target.value || "1", 10))) })}
                        data-testid="buy-qty"
                        className="mt-1 w-full px-3 py-2.5 text-lg bg-[rgba(20,28,48,0.6)] border border-white/10 focus:border-primary/40 outline-none rounded-md text-white"
                        style={SHARKON}
                      />
                    </label>

                    <div className="rounded-md p-3 space-y-1.5"
                      style={{ background: "rgba(20,28,48,0.6)", border: "1px solid rgba(220,225,235,0.08)" }}
                    >
                      <Row label="Ask / share" value={fmtUsd(buyState.listing.askPerShare)} />
                      <Row label="Quantity"    value={`${buyState.qty} × shares`} />
                      <Row label="Subtotal"    value={fmtUsd(subtotal)} />
                      <Row label="Platform fee · 7%" value={fmtUsd(buyFee)} />
                      <div className="h-px bg-white/10 my-1" />
                      <Row label="Total"       value={fmtUsd(total)} accent />
                      <Row label="≈ OPAS required" value={fmtOpas(usdToOpas(total, opasPrice))} accent />
                    </div>
                    <p className="text-[10px] text-white/40 leading-relaxed" style={NEVERA}>
                      Paid in <span className="text-primary">$OPAS</span> at the live rate
                      ({fmtOpasRate(opasPrice)}/OPAS). Yield distributions
                      are settled in <span className="text-secondary">USDT</span>.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setBuyState(null)}
                      className="flex-1 px-5 py-3 text-[10.5px] tracking-[0.22em] uppercase text-white/60 border border-white/10 hover:border-white/25 rounded-sm"
                      style={NEVERA}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBuy}
                      data-testid="confirm-buy"
                      className="btn-metal flex-1 px-5 py-3 text-[11px] font-bold tracking-[0.22em] uppercase text-[#050810] rounded-sm"
                      style={{ fontFamily: "BankGothic, sans-serif" }}
                    >
                      Confirm trade
                    </button>
                  </div>
                </>
              );
            })()}
          </motion.div>
        </div>
      )}

      {/* Bid modal */}
      {bidState && (() => {
        const meta = lookupProperty(bidState.propertyId);
        if (!meta) return null;
        const { fair, min, max } = bidBounds(bidState.propertyId);
        const subtotal = bidState.qty * bidState.perShare;
        const bidFee = subtotal * FEES.buySell;
        const total = subtotal + bidFee;
        const deltaPct = fair ? ((bidState.perShare - fair) / fair) * 100 : 0;
        const clampPrice = (v: number) => Math.min(max, Math.max(min, v));
        const setPrice = (v: number) => setBidState({ ...bidState, perShare: Math.round(clampPrice(v)) });
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
            onClick={() => setBidState(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="metallic-border relative w-full max-w-md rounded-xl p-7 space-y-5"
              style={{ background: "linear-gradient(160deg, rgba(12,18,32,0.96) 0%, rgba(8,12,24,0.96) 100%)" }}
              data-testid="bid-modal"
            >
              <button
                onClick={() => setBidState(null)}
                className="absolute top-4 right-4 text-white/40 hover:text-primary"
              >
                <XIcon className="w-5 h-5" />
              </button>

              <div>
                <div className="text-[8.5px] tracking-[0.32em] uppercase text-primary mb-1 font-mono">
                  {meta.prop.token} · Place bid
                </div>
                <h3 className="text-2xl text-white" style={SHARKON}>{meta.prop.title}</h3>
              </div>

              <div className="space-y-3">
                <label className="block">
                  <span className="text-[8.5px] tracking-[0.32em] uppercase text-white/45" style={NEVERA}>Quantity</span>
                  <input
                    type="number"
                    min={1}
                    value={bidState.qty}
                    onChange={(e) => setBidState({ ...bidState, qty: Math.max(1, parseInt(e.target.value || "1", 10)) })}
                    data-testid="bid-qty"
                    className="mt-1 w-full px-3 py-2.5 text-lg bg-[rgba(20,28,48,0.6)] border border-white/10 focus:border-primary/40 outline-none rounded-md text-white"
                    style={SHARKON}
                  />
                </label>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[8.5px] tracking-[0.32em] uppercase text-white/45" style={NEVERA}>Bid / share</span>
                    <span className={`text-[10px] font-mono ${deltaPct >= 0 ? "text-rose-300" : "text-emerald-300"}`}>
                      {deltaPct >= 0 ? "+" : ""}{deltaPct.toFixed(1)}% vs fair
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPrice(bidState.perShare - 1)}
                      className="shrink-0 w-9 h-9 flex items-center justify-center border border-white/10 hover:border-primary/40 rounded-md text-white/70"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      value={bidState.perShare}
                      onChange={(e) => setPrice(parseFloat(e.target.value || "0"))}
                      data-testid="bid-price"
                      className="flex-1 min-w-0 px-3 py-2 text-lg text-center bg-[rgba(20,28,48,0.6)] border border-white/10 focus:border-primary/40 outline-none rounded-md text-white"
                      style={SHARKON}
                    />
                    <button
                      onClick={() => setPrice(bidState.perShare + 1)}
                      className="shrink-0 w-9 h-9 flex items-center justify-center border border-white/10 hover:border-primary/40 rounded-md text-white/70"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="range"
                    min={Math.floor(min)}
                    max={Math.ceil(max)}
                    value={bidState.perShare}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                    data-testid="bid-slider"
                    className="mt-3 w-full accent-[#EA8D0E]"
                  />
                  <div className="flex items-center justify-between text-[9px] text-white/40 font-mono mt-1">
                    <span>{fmtUsd(min)}</span>
                    <span className="text-white/55">Fair {fmtUsd(fair)}</span>
                    <span>{fmtUsd(max)}</span>
                  </div>
                </div>

                <div className="rounded-md p-3 space-y-1.5"
                  style={{ background: "rgba(20,28,48,0.6)", border: "1px solid rgba(220,225,235,0.08)" }}
                >
                  <Row label="Bid / share" value={fmtUsd(bidState.perShare)} />
                  <Row label="Quantity"    value={`${bidState.qty} × shares`} />
                  <Row label="Subtotal"    value={fmtUsd(subtotal)} />
                  <Row label="Platform fee · 7%" value={fmtUsd(bidFee)} />
                  <div className="h-px bg-white/10 my-1" />
                  <Row label="Max total"   value={fmtUsd(total)} accent />
                  <Row label="≈ OPAS (max)" value={fmtOpas(usdToOpas(total, opasPrice))} accent />
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed" style={NEVERA}>
                  Bids are capped to <span className="text-primary">±{(BID_VARIANCE * 100).toFixed(0)}%</span> of fair
                  value. Paid in <span className="text-primary">$OPAS</span> at the live rate
                  ({fmtOpasRate(opasPrice)}/OPAS); yield distributions settled in{" "}
                  <span className="text-secondary">USDT</span>.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setBidState(null)}
                  className="flex-1 px-5 py-3 text-[10.5px] tracking-[0.22em] uppercase text-white/60 border border-white/10 hover:border-white/25 rounded-sm"
                  style={NEVERA}
                >
                  Cancel
                </button>
                <button
                  onClick={handleBid}
                  data-testid="confirm-bid"
                  className="btn-metal flex-1 px-5 py-3 text-[11px] font-bold tracking-[0.22em] uppercase text-[#050810] rounded-sm"
                  style={{ fontFamily: "BankGothic, sans-serif" }}
                >
                  Place bid
                </button>
              </div>
            </motion.div>
          </div>
        );
      })()}

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-md text-[12px] font-mono tracking-wider ${toast.kind === "ok" ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200" : "border-rose-400/40 bg-rose-400/10 text-rose-200"} border`}
        >
          {toast.msg}
        </motion.div>
      )}
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[9.5px] tracking-[0.28em] uppercase text-white/45" style={NEVERA}>{label}</span>
      <span className={`text-[13px] ${accent ? "text-primary" : "text-white/90"}`} style={SHARKON}>{value}</span>
    </div>
  );
}
