import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { Link } from "wouter";
import {
  Store, TrendingUp, TrendingDown, Tag, ShoppingCart, X as XIcon,
  Wallet, Search, ArrowUpDown, ChevronRight,
} from "lucide-react";
import {
  getListings, buyListing, cancelListing, lookupProperty, fairValuePerShare,
  type Listing,
} from "@/lib/portfolio";
import { useWallet } from "@/components/WalletContext";
import { CITIES } from "@/data/cities";

const SHARKON = { fontFamily: "Sharkon, Nevera, sans-serif" };
const NEVERA  = { fontFamily: "Nevera, Inter, sans-serif" };

const fmtUsd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

type SortKey = "newest" | "discount" | "yield" | "price_asc" | "price_desc";

export default function Marketplace() {
  const { address, isConnected } = useAccount();
  const { openWallet } = useWallet();
  const [listings, setListings] = useState<Listing[]>([]);
  const [tab, setTab] = useState<"all" | "mine">("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [search, setSearch] = useState("");
  const [buyState, setBuyState] = useState<{ listing: Listing; qty: number } | null>(null);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  useEffect(() => { setListings(getListings()); }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    let l = [...listings];
    if (tab === "mine" && address) l = l.filter((x) => x.seller === address.toLowerCase());
    if (cityFilter !== "all") l = l.filter((x) => lookupProperty(x.propertyId)?.city === cityFilter);
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
      case "discount":   enriched.sort((a, b) => b.discount - a.discount); break;
      case "yield":      enriched.sort((a, b) => b.yld - a.yld); break;
      case "price_asc":  enriched.sort((a, b) => a.listing.askPerShare - b.listing.askPerShare); break;
      case "price_desc": enriched.sort((a, b) => b.listing.askPerShare - a.listing.askPerShare); break;
      default:           enriched.sort((a, b) => b.listing.createdAt - a.listing.createdAt);
    }
    return enriched;
  }, [listings, tab, cityFilter, sort, search, address]);

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

  return (
    <div className="min-h-screen pt-28 md:pt-32 pb-24">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl space-y-8">

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
            <h1 className="text-4xl md:text-5xl leading-[1.05]" style={SHARKON}>
              <span className="metallic-text">Marketplace.</span>{" "}
              <span className="metallic-warm-text">Trade ownership.</span>
            </h1>
            <p className="text-white/55 text-sm max-w-2xl leading-relaxed" style={NEVERA}>
              Peer-to-peer order book for OPA equity tokens. Lift an ask from another investor,
              or list your own position with a one-line confirmation. Settlement is atomic and on-chain.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/portfolio" className="px-4 py-2.5 text-[10px] tracking-[0.22em] text-primary hover:text-primary uppercase border border-primary/40 hover:bg-primary/10 rounded-sm transition-colors" style={NEVERA}>
              List shares for sale →
            </Link>
            <Link href="/" className="px-4 py-2.5 text-[10px] tracking-[0.22em] text-white/55 hover:text-white uppercase border border-white/10 hover:border-white/25 rounded-sm transition-colors" style={NEVERA}>
              ← Home
            </Link>
          </div>
        </motion.div>

        {/* Market stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Open listings",      value: String(totals.count),       icon: Tag,        tone: "text-white" },
            { label: "Liquidity (USD)",    value: fmtUsd(totals.tvl),         icon: TrendingUp, tone: "text-primary" },
            { label: "Shares available",   value: totals.tot.toLocaleString(), icon: Store,      tone: "text-secondary" },
            { label: "Your listings",      value: String(totals.mineCount),   icon: Wallet,     tone: "text-emerald-300" },
          ].map((s) => (
            <div key={s.label}
              className="rounded-lg p-4"
              style={{ background: "rgba(20,28,48,0.5)", border: "1px solid rgba(220,225,235,0.08)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[8.5px] tracking-[0.32em] uppercase text-white/40" style={NEVERA}>{s.label}</span>
                <s.icon className={`w-3.5 h-3.5 ${s.tone}`} />
              </div>
              <div className={`text-2xl ${s.tone}`} style={SHARKON}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          {/* Tabs */}
          <div className="inline-flex p-1 rounded-md border border-white/10 bg-[rgba(20,28,48,0.4)] shrink-0">
            {(["all", "mine"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                disabled={t === "mine" && !isConnected}
                className={`px-4 py-2 text-[10px] tracking-[0.24em] uppercase transition-colors rounded-sm ${tab === t ? "bg-primary/15 text-primary" : "text-white/55 hover:text-white"} disabled:opacity-30 disabled:cursor-not-allowed`}
                style={NEVERA}
                data-testid={`tab-${t}`}
              >
                {t === "all" ? "All listings" : "My listings"}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/35" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search property or token…"
              className="w-full pl-9 pr-3 py-2.5 text-[12px] bg-[rgba(20,28,48,0.4)] border border-white/10 focus:border-primary/40 outline-none rounded-md text-white/85 placeholder:text-white/30"
              style={NEVERA}
            />
          </div>

          {/* City filter */}
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-2.5 text-[11px] tracking-[0.18em] uppercase bg-[rgba(20,28,48,0.4)] border border-white/10 hover:border-white/25 rounded-md text-white/75 outline-none cursor-pointer"
            style={NEVERA}
          >
            <option value="all">All cities</option>
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Sort */}
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/35 pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="pl-8 pr-3 py-2.5 text-[11px] tracking-[0.18em] uppercase bg-[rgba(20,28,48,0.4)] border border-white/10 hover:border-white/25 rounded-md text-white/75 outline-none cursor-pointer"
              style={NEVERA}
            >
              <option value="newest">Newest</option>
              <option value="discount">Best discount</option>
              <option value="yield">Highest yield</option>
              <option value="price_asc">Price ↑</option>
              <option value="price_desc">Price ↓</option>
            </select>
          </div>
        </div>

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
                      <Link href={`/city/${city}`} className="text-[15px] text-white font-medium hover:text-primary transition-colors" style={SHARKON}>
                        {prop.title}
                      </Link>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-[8.5px] tracking-[0.28em] uppercase text-white/35" style={NEVERA}>Ask / share</div>
                        <div className="text-lg text-white" style={SHARKON}>{fmtUsd(listing.askPerShare)}</div>
                      </div>
                      <div>
                        <div className="text-[8.5px] tracking-[0.28em] uppercase text-white/35" style={NEVERA}>Fair value</div>
                        <div className="text-lg text-white/65" style={SHARKON}>{fmtUsd(fair)}</div>
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
                        <button
                          onClick={() => isConnected ? setBuyState({ listing, qty: Math.min(1, listing.shares) }) : openWallet()}
                          data-testid={`buy-${listing.id}`}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[10.5px] tracking-[0.22em] uppercase text-[#050810] bg-primary hover:bg-primary/90 rounded-sm transition-colors amber-glow font-bold"
                          style={{ fontFamily: "BankGothic, sans-serif" }}
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Buy
                        </button>
                      )}
                      <Link
                        href={`/city/${city}`}
                        className="px-3 py-2.5 text-[10.5px] tracking-[0.22em] uppercase text-white/55 hover:text-white border border-white/10 hover:border-white/25 rounded-sm transition-colors flex items-center"
                        style={NEVERA}
                      >
                        <ChevronRight className="w-3 h-3" />
                      </Link>
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
              const total = buyState.qty * buyState.listing.askPerShare;
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
                      <div className="h-px bg-white/10 my-1" />
                      <Row label="Total"       value={fmtUsd(total)} accent />
                    </div>
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
                      className="flex-1 px-5 py-3 text-[11px] font-bold tracking-[0.22em] uppercase text-[#050810] bg-primary hover:bg-primary/90 rounded-sm amber-glow"
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
