import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useAccount, useChainId } from "wagmi";
import { Link } from "wouter";
import {
  TrendingUp, Wallet, Building2, Car, Ship, Plane, Coins, Vote, AlertTriangle,
  ChevronRight, ShieldCheck, Clock, Layers, Tag, Plus, ArrowLeftRight, Check, X,
} from "lucide-react";
import {
  getHoldings, getProposals, castVote, lookupProperty,
  ownershipPct, portfolioStats, tally,
  createListing, fairValuePerShare, fmtUsdCompact,
  getSwapOffers, createSwapOffer, respondSwapOffer, cancelSwapOffer, settleOutgoingSwap,
  swapNotional, swapFee,
  type Holding, type Proposal, type SwapOffer,
} from "@/lib/portfolio";
import {
  CATEGORIES, getCategory, ASSETS, type AssetCategory,
} from "@/data/assets";
import { useWallet } from "@/components/WalletContext";
import MarqueeText from "@/components/MarqueeText";
import OpasPriceTag from "@/components/OpasPriceTag";
import { useOpasPrice, usdToOpas, fmtOpas, fmtOpasRate } from "@/lib/opasPrice";

const SHARKON = { fontFamily: "Sharkon, Nevera, sans-serif" };
const NEVERA  = { fontFamily: "Nevera, Inter, sans-serif" };

const ICONS: Record<CategoryMetaIcon, React.ComponentType<{ className?: string }>> = {
  Building2, Car, Ship, Plane,
};
type CategoryMetaIcon = "Building2" | "Car" | "Ship" | "Plane";

const fmtUsd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const fmtPct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;

const KIND_BADGE: Record<Proposal["kind"], { label: string; tone: string }> = {
  sell:           { label: "Sell asset",      tone: "text-rose-300 border-rose-400/30 bg-rose-400/5" },
  rent_increase:  { label: "Income uplift",   tone: "text-emerald-300 border-emerald-400/30 bg-emerald-400/5" },
  refurbish:      { label: "Capex / refit",   tone: "text-amber-300 border-amber-400/30 bg-amber-400/5" },
  refinance:      { label: "Refinance",       tone: "text-sky-300 border-sky-400/30 bg-sky-400/5" },
};

function timeLeft(end: number) {
  const ms = end - Date.now();
  if (ms <= 0) return "Voting closed";
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  return d > 0 ? `${d}d ${h}h left` : `${h}h left`;
}

type Enriched = {
  holding: Holding;
  category: AssetCategory;
  value: number;
  cost: number;
  pnl: number;
  monthly: number;
};

export default function Portfolio() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { price: opasPrice } = useOpasPrice();
  const { openWallet } = useWallet();

  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [listFor, setListFor] = useState<{ propertyId: string; qty: number; ask: number } | null>(null);
  const [swaps, setSwaps] = useState<SwapOffer[]>([]);
  const [swapFor, setSwapFor] = useState<{ giveId: string; giveShares: number; receiveId: string; receiveShares: number } | null>(null);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const openListModal = (propertyId: string) => {
    const fair = Math.round(fairValuePerShare(propertyId));
    setListFor({ propertyId, qty: 1, ask: fair });
  };

  const submitListing = () => {
    if (!listFor || !address) return;
    const res = createListing(address, listFor.propertyId, listFor.qty, listFor.ask);
    if (!res.ok) {
      setToast({ kind: "err", msg: res.reason ?? "Listing failed." });
      return;
    }
    setHoldings(getHoldings(address));
    setListFor(null);
    setToast({ kind: "ok", msg: `Listed ${listFor.qty} share${listFor.qty === 1 ? "" : "s"} on the marketplace.` });
  };

  useEffect(() => {
    if (address) {
      setHoldings(getHoldings(address));
      setProposals(getProposals());
      setSwaps(getSwapOffers(address));
    }
  }, [address]);

  const stats = useMemo(() => portfolioStats(holdings), [holdings]);

  const sharesByProp = useMemo(() => {
    const m = new Map<string, number>();
    holdings.forEach((h) => m.set(h.propertyId, h.shares));
    return m;
  }, [holdings]);

  // Group holdings into asset-class segments with per-position economics.
  const segments = useMemo(() => {
    const enriched: Enriched[] = holdings.flatMap((h) => {
      const meta = lookupProperty(h.propertyId);
      if (!meta) return [];
      const fair = fairValuePerShare(h.propertyId);
      const value = h.shares * fair;
      const yld = parseFloat(meta.prop.rentalYield) || 0;
      const monthly = (value * (yld / 100)) / 12;
      return [{
        holding: h,
        category: meta.prop.category,
        value,
        cost: h.costBasisUsd,
        pnl: value - h.costBasisUsd,
        monthly,
      }];
    });

    return CATEGORIES.map((cat) => {
      const items = enriched.filter((e) => e.category === cat.id);
      const value = items.reduce((a, b) => a + b.value, 0);
      const monthly = items.reduce((a, b) => a + b.monthly, 0);
      const pnl = items.reduce((a, b) => a + b.pnl, 0);
      return { cat, items, value, monthly, pnl };
    });
  }, [holdings]);

  const activeSegments = segments.filter((s) => s.items.length > 0);

  const onVote = (proposalId: string, choice: "for" | "against" | "abstain") => {
    if (!address) return;
    const p = proposals.find((x) => x.id === proposalId);
    if (!p) return;
    const weight = sharesByProp.get(p.propertyId) ?? 0;
    if (weight === 0) return;
    setProposals(castVote(proposalId, address, choice, weight));
  };

  // ── Swaps ──
  const openSwapModal = (giveId: string) => {
    const held = holdings.find((h) => h.propertyId === giveId);
    const firstOther = ASSETS.find((a) => a.id !== giveId);
    setSwapFor({
      giveId,
      giveShares: Math.min(1, held?.shares ?? 1) || 1,
      receiveId: firstOther?.id ?? giveId,
      receiveShares: 1,
    });
  };

  const submitSwap = () => {
    if (!swapFor || !address) return;
    const res = createSwapOffer(address, swapFor.giveId, swapFor.giveShares, swapFor.receiveId, swapFor.receiveShares);
    if (!res.ok) { setToast({ kind: "err", msg: res.reason ?? "Swap failed." }); return; }
    setHoldings(getHoldings(address));
    setSwaps(res.offers ?? getSwapOffers(address));
    setSwapFor(null);
    setToast({ kind: "ok", msg: "Swap offer published — counterparty notified." });
  };

  const onRespondSwap = (id: string, action: "accept" | "decline") => {
    if (!address) return;
    const res = respondSwapOffer(address, id, action);
    if (!res.ok) { setToast({ kind: "err", msg: res.reason ?? "Action failed." }); return; }
    setHoldings(getHoldings(address));
    setSwaps(res.offers ?? getSwapOffers(address));
    setToast({ kind: "ok", msg: action === "accept" ? "Swap accepted — assets switched." : "Swap declined." });
  };

  const onCancelSwap = (id: string) => {
    if (!address) return;
    const res = cancelSwapOffer(address, id);
    if (!res.ok) { setToast({ kind: "err", msg: res.reason ?? "Cancel failed." }); return; }
    setHoldings(getHoldings(address));
    setSwaps(res.offers ?? getSwapOffers(address));
    setToast({ kind: "ok", msg: "Offer cancelled — shares returned." });
  };

  // Simulated order book: a counterparty fills the user's outgoing offers.
  const settleTimers = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!address) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    swaps
      .filter((s) => s.direction === "outgoing" && s.status === "pending")
      .forEach((s) => {
        if (settleTimers.current.has(s.id)) return;
        settleTimers.current.add(s.id);
        const delay = Math.max(2500, 6000 - (Date.now() - s.createdAt));
        const t = setTimeout(() => {
          const res = settleOutgoingSwap(address, s.id);
          settleTimers.current.delete(s.id);
          if (res.ok) {
            setHoldings(getHoldings(address));
            setSwaps(res.offers ?? getSwapOffers(address));
            setToast({ kind: "ok", msg: "Counterparty accepted — swap settled." });
          }
        }, delay);
        timers.push(t);
      });
    return () => timers.forEach(clearTimeout);
  }, [swaps, address]);

  const pendingIncoming = useMemo(
    () => swaps.filter((s) => s.direction === "incoming" && s.status === "pending"),
    [swaps],
  );
  const sortedSwaps = useMemo(() => {
    const rank = (s: SwapOffer) =>
      (s.status === "pending" ? 0 : 1) * 10 + (s.direction === "incoming" ? 0 : 1);
    return [...swaps].sort((a, b) => rank(a) - rank(b) || b.createdAt - a.createdAt);
  }, [swaps]);

  const renderSwapRow = (s: SwapOffer) => {
    const give = lookupProperty(s.giveId);
    const recv = lookupProperty(s.receiveId);
    const incoming = s.direction === "incoming";
    const statusTone =
      s.status === "pending"  ? "text-amber-300 border-amber-400/40 bg-amber-400/10"
    : s.status === "accepted" ? "text-emerald-300 border-emerald-400/40 bg-emerald-400/10"
    : s.status === "declined" ? "text-rose-300 border-rose-400/40 bg-rose-400/10"
    :                           "text-white/50 border-white/15 bg-white/5";
    return (
      <div key={s.id}
        className="rounded-lg p-4 md:p-5 space-y-3"
        style={{ background: "rgba(20,28,48,0.55)", border: "1px solid rgba(220,225,235,0.08)" }}
        data-testid={`swap-${s.id}`}
      >
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`px-2 py-0.5 rounded-sm text-[8.5px] tracking-[0.28em] uppercase border font-mono ${incoming ? "text-secondary border-secondary/40 bg-secondary/5" : "text-primary border-primary/40 bg-primary/5"}`}>
              {incoming ? "Incoming" : "Outgoing"}
            </span>
            <span className="text-[9.5px] tracking-[0.24em] uppercase text-white/40 font-mono truncate">{s.counterparty}</span>
          </div>
          <span className={`px-2 py-0.5 rounded-sm text-[8.5px] tracking-[0.28em] uppercase border font-mono ${statusTone}`}>{s.status}</span>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {give && <img src={give.prop.image} alt="" className="w-10 h-10 rounded-md object-cover shrink-0" />}
            <div className="min-w-0">
              <div className="text-[8px] tracking-[0.24em] uppercase text-white/35 font-mono">You give</div>
              <div className="text-[12px] text-white truncate" style={SHARKON}>{give?.prop.title ?? s.giveId}</div>
              <div className="text-[9px] tracking-[0.2em] uppercase text-rose-300/80 font-mono">{s.giveShares} shares</div>
            </div>
          </div>
          <ArrowLeftRight className="w-4 h-4 text-white/40 shrink-0" />
          <div className="flex items-center gap-2 min-w-0 justify-end text-right">
            <div className="min-w-0">
              <div className="text-[8px] tracking-[0.24em] uppercase text-white/35 font-mono">You receive</div>
              <div className="text-[12px] text-white truncate" style={SHARKON}>{recv?.prop.title ?? s.receiveId}</div>
              <div className="text-[9px] tracking-[0.2em] uppercase text-emerald-300/80 font-mono">{s.receiveShares} shares</div>
            </div>
            {recv && <img src={recv.prop.image} alt="" className="w-10 h-10 rounded-md object-cover shrink-0" />}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <span className="text-[9.5px] tracking-[0.22em] uppercase text-white/40 font-mono">Trade fee</span>
          <span className="text-[12px] text-emerald-300" style={SHARKON}>Free</span>
        </div>

        {s.status === "pending" && (
          <div className="flex gap-2">
            {incoming ? (
              <>
                <button
                  onClick={() => onRespondSwap(s.id, "decline")}
                  data-testid={`swap-decline-${s.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-[10px] tracking-[0.2em] uppercase border border-rose-400/40 text-rose-300 hover:bg-rose-400/10 rounded-sm transition-colors"
                  style={NEVERA}
                >
                  <X className="w-3 h-3" /> Decline
                </button>
                <button
                  onClick={() => onRespondSwap(s.id, "accept")}
                  data-testid={`swap-accept-${s.id}`}
                  className="btn-metal flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase text-[#050810] rounded-sm"
                  style={{ fontFamily: "BankGothic, sans-serif" }}
                >
                  <Check className="w-3 h-3" /> Accept
                </button>
              </>
            ) : (
              <button
                onClick={() => onCancelSwap(s.id)}
                data-testid={`swap-cancel-${s.id}`}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-[10px] tracking-[0.2em] uppercase border border-white/15 text-white/60 hover:border-white/35 rounded-sm transition-colors"
                style={NEVERA}
              >
                <X className="w-3 h-3" /> Cancel offer
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!isConnected) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6 pt-32 pb-24">
        <div className="max-w-md text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30">
            <Wallet className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl leading-[1.05]" style={SHARKON}>
            <span className="metallic-text">Connect to view </span>
            <span className="metallic-warm-text">your vault.</span>
          </h1>
          <p className="text-white/55 text-sm leading-relaxed" style={NEVERA}>
            Your multi-asset portfolio, ownership stake and governance votes are scoped to your wallet address.
            Connect MetaMask or Trust Wallet to continue.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={openWallet}
              className="btn-metal px-7 py-3.5 text-[11px] font-bold tracking-[0.22em] text-[#050810] uppercase rounded-sm"
              style={{ fontFamily: "BankGothic, sans-serif" }}
            >
              Connect Wallet
            </button>
            <Link
              href="/"
              className="px-7 py-3.5 text-[11px] tracking-[0.22em] uppercase text-white/65 hover:text-white border border-white/15 hover:border-white/35 rounded-sm transition-colors"
              style={NEVERA}
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 md:pt-32 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl space-y-8 md:space-y-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div className="space-y-3 min-w-0">
            <div className="metallic-border inline-flex items-center gap-2 px-3 py-1 rounded-full">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[8.5px] tracking-[0.32em] uppercase metallic-text" style={NEVERA}>
                Multi-asset vault · Live
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl leading-[1.05]" style={SHARKON}>
              <span className="metallic-text block">Your asset</span>
              <span className="metallic-warm-text block">portfolio.</span>
            </h1>
            <div className="flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-white/40 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-primary/70 shrink-0" />
              <span className="truncate">{address?.slice(0, 6)}…{address?.slice(-4)} · chain {chainId}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <OpasPriceTag withSparkline />
            <Link href="/marketplace" className="btn-metal-silver px-3 sm:px-4 py-2 sm:py-2.5 text-[9.5px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.22em] uppercase rounded-sm" style={NEVERA}>
              Open marketplace →
            </Link>
            <Link href="/" className="px-3 sm:px-4 py-2 sm:py-2.5 text-[9.5px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.22em] text-white/55 hover:text-white uppercase border border-white/10 hover:border-white/25 rounded-sm transition-colors" style={NEVERA}>
              ← Home
            </Link>
          </div>
        </motion.div>

        {/* Stat tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          {[
            { label: "Vault value",    value: fmtUsdCompact(stats.totalValue), icon: Coins,      tone: "text-primary" },
            { label: "Net P&L",        value: fmtUsdCompact(stats.pnl), sub: fmtPct(stats.pnlPct), icon: TrendingUp, tone: stats.pnl >= 0 ? "text-emerald-300" : "text-rose-300" },
            { label: "Monthly income", value: fmtUsdCompact(stats.monthlyYield), icon: Wallet,    tone: "text-secondary" },
            { label: "Asset classes",  value: `${activeSegments.length} / ${CATEGORIES.length}`, icon: Layers, tone: "text-white" },
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
              {"sub" in s && s.sub && (
                <div className={`text-[9px] sm:text-[10px] mt-1 font-mono ${s.tone}`}>{s.sub}</div>
              )}
            </div>
          ))}
        </div>

        {/* Asset-class segments */}
        {holdings.length === 0 ? (
          <div className="rounded-lg p-10 text-center text-white/45 text-sm"
            style={{ background: "rgba(20,28,48,0.4)", border: "1px solid rgba(220,225,235,0.06)" }}
            data-testid="empty-holdings"
          >
            You don't hold any positions yet.{" "}
            <Link href="/marketplace" className="text-primary hover:text-primary/80">Browse the marketplace →</Link>
          </div>
        ) : (
          <div className="space-y-10 md:space-y-14">
            {segments.map(({ cat, items, value, monthly }) => {
              const Icon = ICONS[cat.icon];
              const empty = items.length === 0;
              return (
                <section key={cat.id} className="space-y-5" data-testid={`segment-${cat.id}`}>
                  {/* Segment header */}
                  <div
                    className="relative overflow-hidden rounded-xl p-4 sm:p-5"
                    style={{
                      background: `linear-gradient(135deg, ${cat.accent}1f 0%, rgba(12,18,32,0.55) 60%)`,
                      border: `1px solid ${cat.accent}33`,
                    }}
                  >
                    <div
                      className="pointer-events-none absolute -right-10 -top-10 w-44 h-44 rounded-full blur-3xl opacity-30"
                      style={{ background: cat.accent }}
                    />
                    <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className="flex items-center justify-center w-11 h-11 rounded-lg shrink-0"
                          style={{ background: `${cat.accent}22`, border: `1px solid ${cat.accent}55` }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <h2 className="text-xl sm:text-2xl min-w-0 flex-1" style={SHARKON}>
                              <MarqueeText>
                                <span className="metallic-text">{cat.label}</span>
                              </MarqueeText>
                            </h2>
                            <span
                              className="shrink-0 px-2 py-0.5 rounded-full text-[8.5px] tracking-[0.22em] uppercase font-mono"
                              style={{ color: cat.accent, border: `1px solid ${cat.accent}55`, background: `${cat.accent}14` }}
                            >
                              {items.length} held
                            </span>
                          </div>
                          <p className="text-white/45 text-[11px] sm:text-xs mt-0.5 line-clamp-2" style={NEVERA}>{cat.blurb}</p>
                        </div>
                      </div>

                      {!empty && (
                        <div className="flex items-center gap-5 shrink-0">
                          <div className="min-w-0">
                            <div className="text-[8px] tracking-[0.26em] uppercase text-white/35" style={NEVERA}>Segment value</div>
                            <div className="text-lg sm:text-xl text-white truncate" style={SHARKON}>{fmtUsdCompact(value)}</div>
                          </div>
                          <div className="min-w-0">
                            <div className="text-[8px] tracking-[0.26em] uppercase text-white/35" style={NEVERA}>{cat.rentalNoun} / mo</div>
                            <div className="text-lg sm:text-xl truncate" style={{ ...SHARKON, color: cat.accent }}>{fmtUsdCompact(monthly)}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Segment cards */}
                  {empty ? (
                    <Link
                      href="/marketplace"
                      className="flex items-center justify-center gap-2 rounded-lg p-6 text-[11px] tracking-[0.22em] uppercase text-white/45 hover:text-white transition-colors"
                      style={{ ...NEVERA, background: "rgba(20,28,48,0.35)", border: "1px dashed rgba(220,225,235,0.12)" }}
                    >
                      <Plus className="w-3.5 h-3.5" /> Tokenize your first {cat.singular.toLowerCase()}
                    </Link>
                  ) : (
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {items.map(({ holding: h, value, cost, pnl, monthly }) => {
                        const meta = lookupProperty(h.propertyId)!;
                        const { prop, city } = meta;
                        const pct = ownershipPct(h.shares);
                        const TitleTag: any = city ? Link : "span";
                        const titleProps = city ? { href: `/city/${city}` } : {};
                        return (
                          <motion.div
                            key={h.propertyId}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="rounded-lg overflow-hidden group flex flex-col"
                            style={{ background: "rgba(20,28,48,0.55)", border: "1px solid rgba(220,225,235,0.08)" }}
                            data-testid={`holding-${h.propertyId}`}
                          >
                            <div className="relative h-36 overflow-hidden">
                              <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/30 to-transparent" />
                              <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                                <div className="px-2 py-0.5 rounded-sm text-[8.5px] tracking-[0.28em] uppercase text-primary border border-primary/40 bg-[#050810]/60 font-mono">
                                  {prop.token}
                                </div>
                                <div
                                  className="px-2 py-0.5 rounded-sm text-[8px] tracking-[0.2em] uppercase font-mono"
                                  style={{ color: cat.accent, border: `1px solid ${cat.accent}55`, background: "#050810aa" }}
                                >
                                  {prop.tier}
                                </div>
                              </div>
                              <div className="absolute bottom-3 left-3 right-3">
                                <TitleTag {...titleProps} className={`text-[15px] text-white font-medium transition-colors block leading-tight ${city ? "hover:text-primary" : ""}`} style={SHARKON}>
                                  <MarqueeText title={prop.title}>{prop.title}</MarqueeText>
                                </TitleTag>
                                <div className="text-[9.5px] text-white/55 line-clamp-2 font-mono">{prop.spec ?? prop.subtitle}</div>
                              </div>
                            </div>

                            <div className="p-4 space-y-3 flex-1 flex flex-col">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[10px] tracking-[0.22em] uppercase text-white/45" style={NEVERA}>
                                  <span>Ownership</span>
                                  <span style={{ color: cat.accent }}>{pct.toFixed(2)}%</span>
                                </div>
                                <div className="relative h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${Math.min(pct * 2, 100)}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                    className="absolute inset-y-0 left-0"
                                    style={{ background: `linear-gradient(90deg, ${cat.accent}, #0bb5be)` }}
                                  />
                                </div>
                                <div className="text-[9px] tracking-[0.28em] uppercase text-white/30 font-mono">
                                  {h.shares} / 1000 shares
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-2 pt-1 min-w-0">
                                <div className="min-w-0">
                                  <div className="text-[8px] sm:text-[8.5px] tracking-[0.22em] sm:tracking-[0.28em] uppercase text-white/35" style={NEVERA}>Value</div>
                                  <div className="text-[13px] sm:text-sm text-white truncate" style={SHARKON}>{fmtUsd(value)}</div>
                                </div>
                                <div className="min-w-0">
                                  <div className="text-[8px] sm:text-[8.5px] tracking-[0.22em] sm:tracking-[0.28em] uppercase text-white/35" style={NEVERA}>Cost</div>
                                  <div className="text-[13px] sm:text-sm text-white/70 truncate" style={SHARKON}>{fmtUsd(cost)}</div>
                                </div>
                                <div className="min-w-0">
                                  <div className="text-[8px] sm:text-[8.5px] tracking-[0.22em] sm:tracking-[0.28em] uppercase text-white/35" style={NEVERA}>P&L</div>
                                  <div className={`text-[13px] sm:text-sm truncate ${pnl >= 0 ? "text-emerald-300" : "text-rose-300"}`} style={SHARKON}>
                                    {fmtUsd(pnl)}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[9.5px] tracking-[0.24em] uppercase font-mono">
                                <span className="text-white/35">{cat.rentalNoun} {prop.rentalYield}</span>
                                <span style={{ color: cat.accent }}>{fmtUsd(monthly)}/mo</span>
                              </div>

                              <div className="mt-auto pt-1 space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    onClick={() => openListModal(h.propertyId)}
                                    data-testid={`list-${h.propertyId}`}
                                    className="flex items-center justify-center gap-2 px-3 py-2 text-[10px] tracking-[0.2em] uppercase border border-secondary/40 text-secondary hover:bg-secondary/10 rounded-sm transition-colors"
                                    style={NEVERA}
                                  >
                                    <Tag className="w-3 h-3" /> Sell
                                  </button>
                                  <button
                                    onClick={() => openSwapModal(h.propertyId)}
                                    data-testid={`swap-open-${h.propertyId}`}
                                    className="flex items-center justify-center gap-2 px-3 py-2 text-[10px] tracking-[0.2em] uppercase border border-white/15 text-white/70 hover:border-white/35 rounded-sm transition-colors"
                                    style={NEVERA}
                                  >
                                    <ArrowLeftRight className="w-3 h-3" /> Swap
                                  </button>
                                </div>
                                <Link
                                  href="/marketplace"
                                  className="btn-metal-silver w-full flex items-center justify-center gap-2 px-3 py-2 text-[10px] tracking-[0.2em] uppercase rounded-sm"
                                  style={NEVERA}
                                >
                                  <Plus className="w-3 h-3" /> Buy more
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}

        {/* Equity swaps */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl md:text-2xl flex items-center gap-3 min-w-0" style={SHARKON}>
              <ArrowLeftRight className="w-5 h-5 text-secondary shrink-0" />
              <MarqueeText className="min-w-0 flex-1">
                <span className="metallic-text">Equity swaps</span>
              </MarqueeText>
            </h2>
            <span className="shrink-0 text-[10px] tracking-[0.32em] uppercase text-white/30" style={NEVERA}>
              {pendingIncoming.length} pending
            </span>
          </div>

          <div className="rounded-md p-3 flex items-start gap-2 text-[11px] text-white/55"
            style={{ background: "rgba(11,181,190,0.05)", border: "1px solid rgba(11,181,190,0.18)" }}
          >
            <ArrowLeftRight className="w-3.5 h-3.5 mt-px text-secondary shrink-0" />
            <span style={NEVERA}>
              Exchange equity in one asset for equity in another. The counterparty is notified and must accept before
              assets switch hands. Swaps settle free — no trade fee.
            </span>
          </div>

          {sortedSwaps.length === 0 ? (
            <div className="rounded-lg p-8 text-center text-white/40 text-sm"
              style={{ background: "rgba(20,28,48,0.4)", border: "1px solid rgba(220,225,235,0.06)" }}
              data-testid="empty-swaps"
            >
              No swap offers yet — use “Swap” on any holding to propose an exchange.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {sortedSwaps.map((s) => renderSwapRow(s))}
            </div>
          )}
        </section>

        {/* DAO governance */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl flex items-center gap-3 min-w-0" style={SHARKON}>
              <Vote className="w-5 h-5 text-primary shrink-0" />
              <MarqueeText className="min-w-0 flex-1">
                <span className="metallic-text">DAO governance</span>
              </MarqueeText>
            </h2>
            <span className="shrink-0 text-[10px] tracking-[0.32em] uppercase text-white/30" style={NEVERA}>
              {proposals.length} active
            </span>
          </div>

          <div className="rounded-md p-3 flex items-start gap-2 text-[11px] text-white/55"
            style={{ background: "rgba(11,181,190,0.05)", border: "1px solid rgba(11,181,190,0.18)" }}
          >
            <AlertTriangle className="w-3.5 h-3.5 mt-px text-secondary shrink-0" />
            <span style={NEVERA}>
              Votes are weighted by your share count in the relevant asset. Quorum is reached at 51% of voting weight cast.
              Votes are recorded locally in this beta — on-chain governance ships with mainnet.
            </span>
          </div>

          <div className="space-y-3">
            {proposals.map((p) => {
              const meta = lookupProperty(p.propertyId);
              const userShares = sharesByProp.get(p.propertyId) ?? 0;
              const t = tally(p);
              const myVote = address ? p.votes[address.toLowerCase()] : undefined;
              const forPct = t.total ? (t.fr / t.total) * 100 : 0;
              const agPct  = t.total ? (t.ag / t.total) * 100 : 0;
              const abPct  = t.total ? (t.ab / t.total) * 100 : 0;
              const badge = KIND_BADGE[p.kind];
              const accent = meta ? getCategory(meta.prop.category).accent : "#EA8D0E";
              return (
                <div key={p.id}
                  className="rounded-lg p-5 md:p-6 space-y-4"
                  style={{ background: "rgba(20,28,48,0.55)", border: "1px solid rgba(220,225,235,0.08)" }}
                  data-testid={`proposal-${p.id}`}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-sm text-[8.5px] tracking-[0.28em] uppercase border font-mono ${badge.tone}`}>
                          {badge.label}
                        </span>
                        {meta && (
                          <span className="text-[9px] tracking-[0.28em] uppercase font-mono" style={{ color: accent }}>
                            {meta.prop.token} · {meta.prop.title}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg md:text-xl text-white leading-snug" style={SHARKON}>
                        {p.title}
                      </h3>
                      <p className="text-white/55 text-[13px] leading-relaxed max-w-3xl" style={NEVERA}>
                        {p.detail}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[9.5px] tracking-[0.28em] uppercase text-white/40 font-mono shrink-0">
                      <Clock className="w-3 h-3" /> {timeLeft(p.endsAt)}
                    </div>
                  </div>

                  {/* Bars */}
                  <div className="space-y-2">
                    {[
                      { label: "For",     pct: forPct, weight: t.fr, color: "#10b981" },
                      { label: "Against", pct: agPct,  weight: t.ag, color: "#f43f5e" },
                      { label: "Abstain", pct: abPct,  weight: t.ab, color: "#94a3b8" },
                    ].map((row) => (
                      <div key={row.label} className="grid grid-cols-[64px_1fr_64px] sm:grid-cols-[80px_1fr_70px] items-center gap-2 sm:gap-3">
                        <span className="text-[9.5px] tracking-[0.22em] sm:tracking-[0.28em] uppercase text-white/50" style={NEVERA}>{row.label}</span>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${row.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="h-full"
                            style={{ background: row.color }}
                          />
                        </div>
                        <span className="text-[10px] tracking-[0.18em] uppercase text-white/55 font-mono text-right">
                          {row.weight} · {row.pct.toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2 border-t border-white/5">
                    <div className="text-[10px] tracking-[0.24em] uppercase text-white/45 font-mono">
                      {userShares > 0
                        ? `Your weight: ${userShares} share${userShares === 1 ? "" : "s"}`
                        : "You don't own shares of this asset"}
                      {myVote && <span className="text-primary"> · voted {myVote.choice}</span>}
                    </div>
                    <div className="flex gap-2">
                      {(["for", "against", "abstain"] as const).map((choice) => {
                        const active = myVote?.choice === choice;
                        const tone =
                          choice === "for"     ? "border-emerald-400/40 text-emerald-300 hover:bg-emerald-400/10"
                        : choice === "against" ? "border-rose-400/40 text-rose-300 hover:bg-rose-400/10"
                        :                        "border-white/15 text-white/55 hover:bg-white/5";
                        return (
                          <button
                            key={choice}
                            onClick={() => onVote(p.id, choice)}
                            disabled={userShares === 0}
                            data-testid={`vote-${p.id}-${choice}`}
                            className={`px-4 py-2 text-[10px] tracking-[0.24em] uppercase border rounded-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${tone} ${active ? "bg-white/10" : ""}`}
                            style={NEVERA}
                          >
                            {choice}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* List-for-sale modal */}
      {listFor && (() => {
        const meta = lookupProperty(listFor.propertyId);
        const holding = holdings.find((h) => h.propertyId === listFor.propertyId);
        if (!meta || !holding) return null;
        const fair = fairValuePerShare(listFor.propertyId);
        const total = listFor.qty * listFor.ask;
        const delta = fair ? ((listFor.ask - fair) / fair) * 100 : 0;
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
            onClick={() => setListFor(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="metallic-border relative w-full max-w-md rounded-xl p-7 space-y-5"
              style={{ background: "linear-gradient(160deg, rgba(12,18,32,0.96) 0%, rgba(8,12,24,0.96) 100%)" }}
              data-testid="list-modal"
            >
              <div>
                <div className="text-[8.5px] tracking-[0.32em] uppercase text-secondary mb-1 font-mono">
                  {meta.prop.token} · List ask
                </div>
                <h3 className="text-2xl text-white" style={SHARKON}>{meta.prop.title}</h3>
                <div className="text-[11px] text-white/45 mt-1" style={NEVERA}>
                  You hold {holding.shares} shares · Fair value {fmtUsd(fair)} / share
                </div>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-[8.5px] tracking-[0.32em] uppercase text-white/45" style={NEVERA}>Shares to list (max {holding.shares})</span>
                  <input
                    type="number"
                    min={1}
                    max={holding.shares}
                    value={listFor.qty}
                    onChange={(e) => setListFor({ ...listFor, qty: Math.max(1, Math.min(holding.shares, parseInt(e.target.value || "1", 10))) })}
                    data-testid="list-qty"
                    className="mt-1 w-full px-3 py-2.5 text-lg bg-[rgba(20,28,48,0.6)] border border-white/10 focus:border-secondary/40 outline-none rounded-md text-white"
                    style={SHARKON}
                  />
                </label>
                <label className="block">
                  <span className="text-[8.5px] tracking-[0.32em] uppercase text-white/45" style={NEVERA}>Ask price / share (USD)</span>
                  <input
                    type="number"
                    min={1}
                    value={listFor.ask}
                    onChange={(e) => setListFor({ ...listFor, ask: Math.max(1, parseInt(e.target.value || "1", 10)) })}
                    data-testid="list-ask"
                    className="mt-1 w-full px-3 py-2.5 text-lg bg-[rgba(20,28,48,0.6)] border border-white/10 focus:border-secondary/40 outline-none rounded-md text-white"
                    style={SHARKON}
                  />
                  <span className={`text-[10px] mt-1 inline-block font-mono ${delta >= 0 ? "text-rose-300" : "text-emerald-300"}`}>
                    {delta >= 0 ? "+" : ""}{delta.toFixed(1)}% vs fair value
                  </span>
                </label>

                <div className="rounded-md p-3 space-y-1.5"
                  style={{ background: "rgba(20,28,48,0.6)", border: "1px solid rgba(220,225,235,0.08)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] tracking-[0.28em] uppercase text-white/45" style={NEVERA}>Proceeds</span>
                    <span className="text-[15px] text-secondary" style={SHARKON}>{fmtUsd(total)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] tracking-[0.28em] uppercase text-white/45" style={NEVERA}>≈ In $OPAS</span>
                    <span className="text-[13px] text-primary" style={SHARKON}>{fmtOpas(usdToOpas(total, opasPrice))}</span>
                  </div>
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed" style={NEVERA}>
                  Sold in <span className="text-primary">$OPAS</span> at the live rate
                  ({fmtOpasRate(opasPrice)}/OPAS); proceeds settle to{" "}
                  <span className="text-secondary">USDT</span>.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setListFor(null)}
                  className="flex-1 px-5 py-3 text-[10.5px] tracking-[0.22em] uppercase text-white/60 border border-white/10 hover:border-white/25 rounded-sm"
                  style={NEVERA}
                >
                  Cancel
                </button>
                <button
                  onClick={submitListing}
                  data-testid="confirm-list"
                  className="flex-1 px-5 py-3 text-[11px] font-bold tracking-[0.22em] uppercase text-[#050810] bg-secondary hover:bg-secondary/90 rounded-sm"
                  style={{ fontFamily: "BankGothic, sans-serif" }}
                >
                  List for sale
                </button>
              </div>
            </motion.div>
          </div>
        );
      })()}

      {/* Swap modal */}
      {swapFor && (() => {
        const giveMeta = lookupProperty(swapFor.giveId);
        const held = holdings.find((h) => h.propertyId === swapFor.giveId);
        if (!giveMeta || !held) return null;
        const recvMeta = lookupProperty(swapFor.receiveId);
        const giveValue = swapNotional(swapFor.giveId, swapFor.giveShares);
        const recvValue = swapNotional(swapFor.receiveId, swapFor.receiveShares);
        const fee = swapFee(swapFor.giveId, swapFor.giveShares);
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
            onClick={() => setSwapFor(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="metallic-border relative w-full max-w-md rounded-xl p-7 space-y-5"
              style={{ background: "linear-gradient(160deg, rgba(12,18,32,0.96) 0%, rgba(8,12,24,0.96) 100%)" }}
              data-testid="swap-modal"
            >
              <div>
                <div className="text-[8.5px] tracking-[0.32em] uppercase text-secondary mb-1 font-mono">
                  {giveMeta.prop.token} · Propose swap
                </div>
                <h3 className="text-2xl text-white" style={SHARKON}>{giveMeta.prop.title}</h3>
                <div className="text-[11px] text-white/45 mt-1" style={NEVERA}>
                  You hold {held.shares} shares · Fair value {fmtUsd(fairValuePerShare(swapFor.giveId))} / share
                </div>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-[8.5px] tracking-[0.32em] uppercase text-white/45" style={NEVERA}>Shares to give (max {held.shares})</span>
                  <input
                    type="number"
                    min={1}
                    max={held.shares}
                    value={swapFor.giveShares}
                    onChange={(e) => setSwapFor({ ...swapFor, giveShares: Math.max(1, Math.min(held.shares, parseInt(e.target.value || "1", 10))) })}
                    data-testid="swap-give-qty"
                    className="mt-1 w-full px-3 py-2.5 text-lg bg-[rgba(20,28,48,0.6)] border border-white/10 focus:border-secondary/40 outline-none rounded-md text-white"
                    style={SHARKON}
                  />
                </label>
                <label className="block">
                  <span className="text-[8.5px] tracking-[0.32em] uppercase text-white/45" style={NEVERA}>Asset to receive</span>
                  <select
                    value={swapFor.receiveId}
                    onChange={(e) => setSwapFor({ ...swapFor, receiveId: e.target.value })}
                    data-testid="swap-receive-asset"
                    className="mt-1 w-full px-3 py-2.5 text-sm bg-[rgba(20,28,48,0.6)] border border-white/10 focus:border-secondary/40 outline-none rounded-md text-white"
                    style={NEVERA}
                  >
                    {ASSETS.filter((a) => a.id !== swapFor.giveId).map((a) => (
                      <option key={a.id} value={a.id} className="bg-[#0b1220] text-white">
                        {a.token} · {a.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-[8.5px] tracking-[0.32em] uppercase text-white/45" style={NEVERA}>Shares to receive</span>
                  <input
                    type="number"
                    min={1}
                    value={swapFor.receiveShares}
                    onChange={(e) => setSwapFor({ ...swapFor, receiveShares: Math.max(1, parseInt(e.target.value || "1", 10)) })}
                    data-testid="swap-receive-qty"
                    className="mt-1 w-full px-3 py-2.5 text-lg bg-[rgba(20,28,48,0.6)] border border-white/10 focus:border-secondary/40 outline-none rounded-md text-white"
                    style={SHARKON}
                  />
                </label>

                <div className="rounded-md p-3 space-y-1.5"
                  style={{ background: "rgba(20,28,48,0.6)", border: "1px solid rgba(220,225,235,0.08)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] tracking-[0.28em] uppercase text-white/45" style={NEVERA}>You give · value</span>
                    <span className="text-[13px] text-white/90" style={SHARKON}>{fmtUsd(giveValue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] tracking-[0.28em] uppercase text-white/45" style={NEVERA}>
                      You receive{recvMeta ? ` · ${recvMeta.prop.token}` : ""}
                    </span>
                    <span className="text-[13px] text-white/90" style={SHARKON}>{fmtUsd(recvValue)}</span>
                  </div>
                  <div className="h-px bg-white/10 my-1" />
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] tracking-[0.28em] uppercase text-white/45" style={NEVERA}>Trade fee</span>
                    <span className="text-[13px] text-emerald-300" style={SHARKON}>Free</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSwapFor(null)}
                  className="flex-1 px-5 py-3 text-[10.5px] tracking-[0.22em] uppercase text-white/60 border border-white/10 hover:border-white/25 rounded-sm"
                  style={NEVERA}
                >
                  Cancel
                </button>
                <button
                  onClick={submitSwap}
                  data-testid="confirm-swap"
                  className="btn-metal flex-1 px-5 py-3 text-[11px] font-bold tracking-[0.22em] uppercase text-[#050810] rounded-sm"
                  style={{ fontFamily: "BankGothic, sans-serif" }}
                >
                  Publish swap
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
