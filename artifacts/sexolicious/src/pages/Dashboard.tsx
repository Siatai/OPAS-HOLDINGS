import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAccount, useChainId } from "wagmi";
import {
  Wallet, Building2, Store, Vote, Coins, TrendingUp, TrendingDown,
  Tag, ShoppingCart, ShieldCheck, Receipt, ArrowUpRight, ArrowDownRight,
  Activity as ActivityIcon, ChevronRight, BadgePercent, ArrowLeftRight, Banknote, Gavel,
} from "lucide-react";
import {
  getHoldings, getProposals, getListings, getActivity,
  portfolioStats, rentalSummary, lookupProperty, fmtUsdCompact, proceedsFromActivity,
  type Holding, type Proposal, type Listing, type Activity, type ActivityKind,
} from "@/lib/portfolio";
import { useWallet } from "@/components/WalletContext";
import MarqueeText from "@/components/MarqueeText";

const SHARKON = { fontFamily: "Sharkon, Nevera, sans-serif" };
const NEVERA  = { fontFamily: "Nevera, Inter, sans-serif" };

const fmtUsd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const fmtPct = (n: number) =>
  `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;

function timeAgo(t: number) {
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60)    return `${s}s ago`;
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

const ACT_META: Record<ActivityKind, { icon: any; tone: string; label: string }> = {
  buy:    { icon: ShoppingCart, tone: "text-emerald-300 border-emerald-400/40 bg-emerald-400/10", label: "Buy" },
  sell:   { icon: Tag,          tone: "text-secondary border-secondary/40 bg-secondary/10",       label: "Sell" },
  list:   { icon: Tag,          tone: "text-primary border-primary/40 bg-primary/10",             label: "Listed" },
  cancel: { icon: Tag,          tone: "text-white/55 border-white/15 bg-white/5",                 label: "Cancel" },
  rent:   { icon: Receipt,      tone: "text-amber-300 border-amber-400/40 bg-amber-400/10",       label: "Rent" },
  vote:   { icon: Vote,         tone: "text-secondary border-secondary/40 bg-secondary/10",       label: "Vote" },
  swap:   { icon: ArrowLeftRight, tone: "text-secondary border-secondary/40 bg-secondary/10",     label: "Swap" },
  withdraw: { icon: Banknote,    tone: "text-secondary border-secondary/40 bg-secondary/10",     label: "Withdraw" },
  bid:    { icon: Gavel,        tone: "text-primary border-primary/40 bg-primary/10",             label: "Bid" },
};

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { openWallet } = useWallet();
  const [, setLocation] = useLocation();

  const [holdings, setHoldings]   = useState<Holding[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [listings, setListings]   = useState<Listing[]>([]);
  const [activity, setActivity]   = useState<Activity[]>([]);

  useEffect(() => {
    if (!address) return;
    setHoldings(getHoldings(address));
    setProposals(getProposals());
    setListings(getListings());
    setActivity(getActivity(address));
  }, [address]);

  const stats = useMemo(() => portfolioStats(holdings), [holdings]);
  const rentals = useMemo(() => rentalSummary(holdings), [holdings]);
  const myListings = useMemo(
    () => address ? listings.filter((l) => l.seller === address.toLowerCase()) : [],
    [listings, address],
  );
  const openProposals = useMemo(
    () => proposals.filter((p) => p.endsAt > Date.now()),
    [proposals],
  );
  const rentLifetime = useMemo(
    () => activity.filter((a) => a.kind === "rent").reduce((s, a) => s + (a.usd || 0), 0),
    [activity],
  );
  const proceeds = useMemo(() => proceedsFromActivity(activity), [activity]);

  if (!isConnected) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="max-w-md text-center space-y-5 px-6">
          <Wallet className="w-12 h-12 mx-auto text-primary/70" />
          <h2 className="text-3xl text-white" style={SHARKON}>
            <span className="metallic-warm-text">Connect to enter</span>
          </h2>
          <p className="text-white/55 text-sm" style={NEVERA}>
            Your dashboard, vault and governance feed appear here once a wallet is connected.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={openWallet}
              className="btn-metal px-7 py-3.5 text-[11px] font-bold tracking-[0.22em] text-[#050810] uppercase rounded-sm"
              style={{ fontFamily: "BankGothic, sans-serif" }}
              data-testid="dashboard-connect"
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

  const navCards = [
    {
      label: "Portfolio",
      desc: "Holdings, ownership %, P&L",
      icon: Building2,
      href: "/portfolio",
      tone: "from-primary/25 to-primary/5 border-primary/30",
      iconTone: "text-primary",
      meta: `${stats.properties} position${stats.properties === 1 ? "" : "s"}`,
    },
    {
      label: "Marketplace",
      desc: "Buy & sell OPA shares",
      icon: Store,
      href: "/marketplace",
      tone: "from-secondary/25 to-secondary/5 border-secondary/30",
      iconTone: "text-secondary",
      meta: `${listings.length} open · ${myListings.length} mine`,
    },
    {
      label: "Rentals",
      desc: "Monthly yield distributions",
      icon: Receipt,
      href: "#rentals",
      tone: "from-amber-400/20 to-amber-400/0 border-amber-400/30",
      iconTone: "text-amber-300",
      meta: `${fmtUsdCompact(rentals.monthly)} / mo`,
    },
    {
      label: "Withdraw",
      desc: "Cash out USDT proceeds",
      icon: Banknote,
      href: "/withdraw",
      tone: "from-secondary/25 to-secondary/5 border-secondary/30",
      iconTone: "text-secondary",
      meta: `${fmtUsdCompact(proceeds.available)} available`,
    },
    {
      label: "Governance",
      desc: "DAO proposals & votes",
      icon: Vote,
      href: "/portfolio#governance",
      tone: "from-emerald-400/20 to-emerald-400/0 border-emerald-400/30",
      iconTone: "text-emerald-300",
      meta: `${openProposals.length} open vote${openProposals.length === 1 ? "" : "s"}`,
    },
  ];

  const recent = activity.slice(0, 10);

  return (
    <div className="min-h-screen pt-28 md:pt-32 pb-24 overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl space-y-8 md:space-y-10 min-w-0">

        {/* ── Header ── */}
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
                Vault dashboard · Live
              </span>
            </div>
            <h1 className="text-[22px] sm:text-3xl md:text-4xl lg:text-5xl leading-[1.1]" style={SHARKON}>
              <span className="metallic-text">Welcome back,</span>{" "}
              <span className="metallic-warm-text">investor.</span>
            </h1>
            <div className="flex items-center gap-2 text-[9px] sm:text-[10px] tracking-[0.22em] sm:tracking-[0.32em] uppercase text-white/40 font-mono min-w-0">
              <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary/70 shrink-0" />
              <span className="truncate">{address?.slice(0, 6)}…{address?.slice(-4)} · chain {chainId}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={openWallet}
              className="px-3 sm:px-4 py-2 sm:py-2.5 text-[9.5px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.22em] text-secondary uppercase border border-secondary/40 hover:bg-secondary/10 rounded-sm transition-colors font-mono"
            >
              Wallet
            </button>
            <Link href="/" className="px-3 sm:px-4 py-2 sm:py-2.5 text-[9.5px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.22em] text-white/55 hover:text-white uppercase border border-white/10 hover:border-white/25 rounded-sm transition-colors" style={NEVERA}>
              ← Home
            </Link>
          </div>
        </motion.div>

        {/* ── Snapshot stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          {[
            { label: "Vault value",   value: fmtUsdCompact(stats.totalValue),   icon: Coins,      tone: "text-primary" },
            { label: "Net P&L",       value: fmtUsdCompact(stats.pnl),           sub: fmtPct(stats.pnlPct), icon: stats.pnl >= 0 ? TrendingUp : TrendingDown, tone: stats.pnl >= 0 ? "text-emerald-300" : "text-rose-300" },
            { label: "Monthly yield", value: fmtUsdCompact(rentals.monthly),     icon: Receipt,    tone: "text-amber-300" },
            { label: "Rent collected",value: fmtUsdCompact(rentLifetime),        icon: BadgePercent, tone: "text-secondary" },
          ].map((s) => (
            <div key={s.label}
              className="rounded-lg p-3 sm:p-4 min-w-0"
              style={{ background: "rgba(20,28,48,0.5)", border: "1px solid rgba(220,225,235,0.08)" }}
              data-testid={`dash-stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`}
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

        {/* ── Nav cards ── */}
        <section className="space-y-3 min-w-0">
          <div className="flex items-center justify-between gap-3 min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl min-w-0 flex-1" style={SHARKON}>
              <MarqueeText>
                <span className="metallic-text">Navigate</span>
              </MarqueeText>
            </h2>
            <span className="text-[9px] sm:text-[10px] tracking-[0.22em] sm:tracking-[0.32em] uppercase text-white/30 shrink-0" style={NEVERA}>4 modules</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            {navCards.map((c) => {
              const isAnchor = c.href.startsWith("#");
              const inner = (
                <motion.div
                  whileHover={{ y: -3 }}
                  className={`group relative rounded-xl p-3 sm:p-5 h-full overflow-hidden min-w-0 bg-gradient-to-br ${c.tone} border transition-shadow hover:shadow-[0_18px_50px_-20px_rgba(234,141,14,0.4)]`}
                  data-testid={`nav-${c.label.toLowerCase()}`}
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <c.icon className={`w-5 h-5 sm:w-7 sm:h-7 ${c.iconTone}`} />
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/30 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                  <MarqueeText className="text-[9px] sm:text-base md:text-lg leading-tight text-white mb-1" style={SHARKON} title={c.label}>{c.label}</MarqueeText>
                  <div className="text-[9.5px] sm:text-[10.5px] text-white/55 mb-2 sm:mb-3 leading-snug" style={NEVERA}>{c.desc}</div>
                  <MarqueeText className={`text-[8.5px] sm:text-[9.5px] tracking-[0.18em] sm:tracking-[0.24em] uppercase font-mono ${c.iconTone}`}>
                    {c.meta}
                  </MarqueeText>
                </motion.div>
              );
              return isAnchor ? (
                <a key={c.label} href={c.href === "#rentals" ? "#rentals" : c.href}
                  onClick={(e) => {
                    if (c.href === "/portfolio#governance") {
                      e.preventDefault();
                      setLocation("/portfolio");
                      setTimeout(() => {
                        const el = document.querySelector('[data-section="governance"]');
                        el?.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }
                  }}
                >
                  {inner}
                </a>
              ) : c.href.includes("#") ? (
                <a
                  key={c.label}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setLocation("/portfolio");
                  }}
                >
                  {inner}
                </a>
              ) : (
                <Link key={c.label} href={c.href}>{inner}</Link>
              );
            })}
          </div>
        </section>

        {/* ── Two columns: Rentals + Activity ── */}
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-4 md:gap-6">

          {/* Rentals */}
          <section id="rentals" className="space-y-3 min-w-0">
            <div className="flex items-center justify-between gap-2 min-w-0">
              <h2 className="text-base sm:text-xl md:text-2xl flex items-center gap-2 sm:gap-2.5 min-w-0" style={SHARKON}>
                <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 shrink-0" />
                <MarqueeText className="min-w-0 flex-1">
                  <span className="metallic-text">Rental income</span>
                </MarqueeText>
              </h2>
              <span className="text-[9px] sm:text-[10px] tracking-[0.22em] sm:tracking-[0.32em] uppercase text-white/30 shrink-0 font-mono" style={NEVERA}>
                {fmtUsdCompact(rentals.netAnnual)}/yr net
              </span>
            </div>

            <div className="rounded-lg overflow-hidden"
              style={{ background: "rgba(20,28,48,0.5)", border: "1px solid rgba(220,225,235,0.08)" }}
            >
              {rentals.perProperty.length === 0 ? (
                <div className="p-8 text-center text-white/40 text-sm" style={NEVERA}>
                  No yield-bearing positions yet.
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {rentals.perProperty.map((r) => {
                    const meta = lookupProperty(r.propertyId);
                    if (!meta) return null;
                    return (
                      <div key={r.propertyId} className="flex items-center gap-3 p-3 sm:p-4 hover:bg-white/[0.02] transition-colors">
                        <img src={meta.prop.image} alt="" className="w-12 h-12 rounded-md object-cover shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] sm:text-sm text-white leading-tight break-words" style={SHARKON}>
                            {meta.prop.title}
                          </div>
                          <div className="text-[9.5px] tracking-[0.24em] uppercase text-white/40 font-mono">
                            {meta.prop.token} · Yield {meta.prop.rentalYield}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[13px] sm:text-sm text-amber-300" style={SHARKON}>{fmtUsd(r.net)}</div>
                          <div className="text-[8.5px] tracking-[0.24em] uppercase text-white/35 font-mono">net / month</div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="px-4 py-3 space-y-1.5 bg-gradient-to-r from-amber-400/8 to-transparent">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] tracking-[0.24em] uppercase text-white/40 font-mono">Gross monthly</span>
                      <span className="text-[12px] text-white/70" style={SHARKON}>{fmtUsdCompact(rentals.monthly)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] tracking-[0.24em] uppercase text-white/40 font-mono">Maintenance · 5%</span>
                      <span className="text-[12px] text-rose-300/80" style={SHARKON}>−{fmtUsdCompact(rentals.maintenance)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-white/5">
                      <span className="text-[10px] tracking-[0.28em] uppercase text-amber-300/80 font-mono">Net monthly</span>
                      <span className="text-base sm:text-lg text-amber-300" style={SHARKON}>{fmtUsdCompact(rentals.net)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-md p-3 flex items-start gap-2 text-[11px] text-white/55"
              style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.18)" }}
            >
              <BadgePercent className="w-3.5 h-3.5 mt-px text-amber-300 shrink-0" />
              <span style={NEVERA}>
                Capital is deployed in $OPAS; net yield distributions stream automatically to your wallet in USDT on the
                1st of every month, after the 5% operator maintenance fee. On-chain payouts ship with mainnet — current cycle is recorded locally.
              </span>
            </div>
          </section>

          {/* Activity */}
          <section className="space-y-3 min-w-0">
            <div className="flex items-center justify-between gap-2 min-w-0">
              <h2 className="text-base sm:text-xl md:text-2xl flex items-center gap-2 sm:gap-2.5 min-w-0" style={SHARKON}>
                <ActivityIcon className="w-4 h-4 sm:w-5 sm:h-5 text-secondary shrink-0" />
                <MarqueeText className="min-w-0 flex-1">
                  <span className="metallic-text">Recent activity</span>
                </MarqueeText>
              </h2>
              <span className="text-[9px] sm:text-[10px] tracking-[0.22em] sm:tracking-[0.32em] uppercase text-white/30 shrink-0 font-mono" style={NEVERA}>
                {activity.length} events
              </span>
            </div>

            <div className="rounded-lg overflow-hidden"
              style={{ background: "rgba(20,28,48,0.5)", border: "1px solid rgba(220,225,235,0.08)" }}
              data-testid="activity-feed"
            >
              {recent.length === 0 ? (
                <div className="p-8 text-center text-white/40 text-sm" style={NEVERA}>
                  No activity yet — buy or list shares to start your ledger.
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {recent.map((a) => {
                    const m = ACT_META[a.kind];
                    const meta = lookupProperty(a.propertyId);
                    const isOut = a.kind === "buy" || a.kind === "list" || a.kind === "withdraw";
                    const isIn  = a.kind === "rent" || a.kind === "sell";
                    return (
                      <div key={a.id} className="flex items-center gap-3 p-3 sm:p-4 hover:bg-white/[0.02] transition-colors" data-testid={`activity-${a.kind}`}>
                        <div className={`w-9 h-9 rounded-md flex items-center justify-center border shrink-0 ${m.tone}`}>
                          <m.icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <MarqueeText className="text-[12px] text-white min-w-0 flex-1" style={NEVERA}>{m.label}</MarqueeText>
                            {meta && (
                              <span className="shrink-0 text-[9.5px] tracking-[0.22em] uppercase text-white/40 font-mono truncate">
                                {meta.prop.token}
                              </span>
                            )}
                          </div>
                          <div className="text-[10.5px] text-white/50 line-clamp-2" style={NEVERA}>{a.note}</div>
                        </div>
                        <div className="text-right shrink-0">
                          {a.usd != null && (
                            <div className={`text-[13px] flex items-center justify-end gap-1 ${isIn ? "text-emerald-300" : isOut ? "text-rose-300" : "text-white"}`} style={SHARKON}>
                              {isIn ? <ArrowDownRight className="w-3 h-3" /> : isOut ? <ArrowUpRight className="w-3 h-3" /> : null}
                              {fmtUsd(a.usd)}
                            </div>
                          )}
                          <div className="text-[8.5px] tracking-[0.24em] uppercase text-white/35 font-mono">{timeAgo(a.at)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
