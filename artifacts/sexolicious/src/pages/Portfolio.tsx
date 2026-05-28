import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAccount, useChainId } from "wagmi";
import { Link } from "wouter";
import {
  TrendingUp, Wallet, Building2, Coins, Vote, AlertTriangle,
  ChevronRight, ShieldCheck, Clock,
} from "lucide-react";
import {
  getHoldings, getProposals, castVote, lookupProperty,
  ownershipPct, portfolioStats, tally,
  createListing, fairValuePerShare,
  type Holding, type Proposal,
} from "@/lib/portfolio";
import { Tag } from "lucide-react";
import { useWallet } from "@/components/WalletContext";

const SHARKON = { fontFamily: "Sharkon, Nevera, sans-serif" };
const NEVERA  = { fontFamily: "Nevera, Inter, sans-serif" };

const fmtUsd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const fmtPct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;

const KIND_BADGE: Record<Proposal["kind"], { label: string; tone: string }> = {
  sell:           { label: "Sell asset",      tone: "text-rose-300 border-rose-400/30 bg-rose-400/5" },
  rent_increase:  { label: "Rent uplift",     tone: "text-emerald-300 border-emerald-400/30 bg-emerald-400/5" },
  refurbish:      { label: "Capex / refurb",  tone: "text-amber-300 border-amber-400/30 bg-amber-400/5" },
  refinance:      { label: "Refinance",       tone: "text-sky-300 border-sky-400/30 bg-sky-400/5" },
};

function timeLeft(end: number) {
  const ms = end - Date.now();
  if (ms <= 0) return "Voting closed";
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  return d > 0 ? `${d}d ${h}h left` : `${h}h left`;
}

export default function Portfolio() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { openWallet } = useWallet();

  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [listFor, setListFor] = useState<{ propertyId: string; qty: number; ask: number } | null>(null);
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
    }
  }, [address]);

  const stats = useMemo(() => portfolioStats(holdings), [holdings]);

  const sharesByProp = useMemo(() => {
    const m = new Map<string, number>();
    holdings.forEach((h) => m.set(h.propertyId, h.shares));
    return m;
  }, [holdings]);

  const onVote = (proposalId: string, choice: "for" | "against" | "abstain") => {
    if (!address) return;
    const p = proposals.find((x) => x.id === proposalId);
    if (!p) return;
    const weight = sharesByProp.get(p.propertyId) ?? 0;
    if (weight === 0) return;
    setProposals(castVote(proposalId, address, choice, weight));
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
            Your portfolio, ownership stake and governance votes are scoped to your wallet address.
            Connect MetaMask or Trust Wallet to continue.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={openWallet}
              className="px-7 py-3.5 text-[11px] font-bold tracking-[0.22em] text-[#050810] bg-primary uppercase rounded-sm amber-glow"
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
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl space-y-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div className="space-y-3">
            <div className="metallic-border inline-flex items-center gap-2 px-3 py-1 rounded-full">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[8.5px] tracking-[0.32em] uppercase metallic-text" style={NEVERA}>
                Vault · Live
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl leading-[1.05]" style={SHARKON}>
              <span className="metallic-text">Your equity </span>
              <span className="metallic-warm-text">interest.</span>
            </h1>
            <div className="flex items-center gap-2 text-[10px] tracking-[0.32em] uppercase text-white/40 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-primary/70" />
              {address?.slice(0, 6)}…{address?.slice(-4)} · chain {chainId}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/marketplace" className="px-4 py-2.5 text-[10px] tracking-[0.22em] text-primary hover:text-primary uppercase border border-primary/40 hover:bg-primary/10 rounded-sm transition-colors" style={NEVERA}>
              Open marketplace →
            </Link>
            <Link href="/" className="px-4 py-2.5 text-[10px] tracking-[0.22em] text-white/55 hover:text-white uppercase border border-white/10 hover:border-white/25 rounded-sm transition-colors" style={NEVERA}>
              ← Back to home
            </Link>
          </div>
        </motion.div>

        {/* Stat tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Vault value", value: fmtUsd(stats.totalValue), icon: Coins,       tone: "text-primary" },
            { label: "Net P&L",     value: fmtUsd(stats.pnl),         sub: fmtPct(stats.pnlPct), icon: TrendingUp, tone: stats.pnl >= 0 ? "text-emerald-300" : "text-rose-300" },
            { label: "Monthly yield", value: fmtUsd(stats.monthlyYield), icon: Wallet,    tone: "text-secondary" },
            { label: "Properties",  value: String(stats.properties),  icon: Building2,   tone: "text-white" },
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
              {"sub" in s && s.sub && (
                <div className={`text-[10px] mt-1 font-mono ${s.tone}`}>{s.sub}</div>
              )}
            </div>
          ))}
        </div>

        {/* Holdings */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl" style={SHARKON}>
              <span className="metallic-text">Holdings</span>
            </h2>
            <span className="text-[10px] tracking-[0.32em] uppercase text-white/30" style={NEVERA}>
              {holdings.length} active position{holdings.length === 1 ? "" : "s"}
            </span>
          </div>

          {holdings.length === 0 ? (
            <div className="rounded-lg p-8 text-center text-white/45 text-sm"
              style={{ background: "rgba(20,28,48,0.4)", border: "1px solid rgba(220,225,235,0.06)" }}
              data-testid="empty-holdings"
            >
              You don't hold any positions yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {holdings.map((h) => {
                const meta = lookupProperty(h.propertyId);
                if (!meta) return null;
                const { prop, city } = meta;
                const pct = ownershipPct(h.shares);
                const pricePerShare = (prop.price * 1000) / 1000 * 6.66;
                const value = h.shares * pricePerShare;
                const cost  = h.costBasisUsd;
                const pnl   = value - cost;
                return (
                  <motion.div
                    key={h.propertyId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg overflow-hidden group"
                    style={{ background: "rgba(20,28,48,0.55)", border: "1px solid rgba(220,225,235,0.08)" }}
                    data-testid={`holding-${h.propertyId}`}
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/30 to-transparent" />
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded-sm text-[8.5px] tracking-[0.28em] uppercase text-primary border border-primary/40 bg-[#050810]/60 font-mono">
                        {prop.token}
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <Link href={`/city/${city}`} className="text-[15px] text-white font-medium hover:text-primary transition-colors" style={SHARKON}>
                          {prop.title}
                        </Link>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] tracking-[0.22em] uppercase text-white/45" style={NEVERA}>
                          <span>Ownership</span>
                          <span className="text-primary">{pct.toFixed(2)}%</span>
                        </div>
                        <div className="relative h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(pct * 2, 100)}%` }}
                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-y-0 left-0"
                            style={{ background: "linear-gradient(90deg, #ea8d0e, #0bb5be)" }}
                          />
                        </div>
                        <div className="text-[9px] tracking-[0.28em] uppercase text-white/30 font-mono">
                          {h.shares} / 1000 shares
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <div>
                          <div className="text-[8.5px] tracking-[0.28em] uppercase text-white/35" style={NEVERA}>Value</div>
                          <div className="text-sm text-white" style={SHARKON}>{fmtUsd(value)}</div>
                        </div>
                        <div>
                          <div className="text-[8.5px] tracking-[0.28em] uppercase text-white/35" style={NEVERA}>Cost</div>
                          <div className="text-sm text-white/70" style={SHARKON}>{fmtUsd(cost)}</div>
                        </div>
                        <div>
                          <div className="text-[8.5px] tracking-[0.28em] uppercase text-white/35" style={NEVERA}>P&L</div>
                          <div className={`text-sm ${pnl >= 0 ? "text-emerald-300" : "text-rose-300"}`} style={SHARKON}>
                            {fmtUsd(pnl)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="text-[9px] tracking-[0.28em] uppercase text-white/35 font-mono">
                          Yield {prop.rentalYield} · {prop.tier}
                        </div>
                        <Link href={`/city/${city}`} className="flex items-center gap-1 text-[10px] tracking-[0.22em] uppercase text-primary/80 hover:text-primary" style={NEVERA}>
                          View <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>

                      <button
                        onClick={() => openListModal(h.propertyId)}
                        data-testid={`list-${h.propertyId}`}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-[10px] tracking-[0.22em] uppercase border border-secondary/40 text-secondary hover:bg-secondary/10 rounded-sm transition-colors"
                        style={NEVERA}
                      >
                        <Tag className="w-3 h-3" /> List for sale
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* DAO governance */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl flex items-center gap-3" style={SHARKON}>
              <Vote className="w-5 h-5 text-primary" />
              <span className="metallic-text">DAO governance</span>
            </h2>
            <span className="text-[10px] tracking-[0.32em] uppercase text-white/30" style={NEVERA}>
              {proposals.length} active
            </span>
          </div>

          <div className="rounded-md p-3 flex items-start gap-2 text-[11px] text-white/55"
            style={{ background: "rgba(11,181,190,0.05)", border: "1px solid rgba(11,181,190,0.18)" }}
          >
            <AlertTriangle className="w-3.5 h-3.5 mt-px text-secondary shrink-0" />
            <span style={NEVERA}>
              Votes are weighted by your share count in the relevant property. Quorum is reached at 51% of voting weight cast.
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
              return (
                <div key={p.id}
                  className="rounded-lg p-5 md:p-6 space-y-4"
                  style={{ background: "rgba(20,28,48,0.55)", border: "1px solid rgba(220,225,235,0.08)" }}
                  data-testid={`proposal-${p.id}`}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-sm text-[8.5px] tracking-[0.28em] uppercase border font-mono ${badge.tone}`}>
                          {badge.label}
                        </span>
                        {meta && (
                          <Link href={`/city/${meta.city}`} className="text-[9px] tracking-[0.28em] uppercase text-white/40 hover:text-primary font-mono">
                            {meta.prop.token} · {meta.prop.title}
                          </Link>
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
                      <div key={row.label} className="grid grid-cols-[80px_1fr_70px] items-center gap-3">
                        <span className="text-[9.5px] tracking-[0.28em] uppercase text-white/50" style={NEVERA}>{row.label}</span>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${row.pct}%` }}
                            transition={{ duration: 0.6 }}
                            className="h-full"
                            style={{ background: row.color }}
                          />
                        </div>
                        <span className="text-[10px] tracking-[0.22em] uppercase text-white/55 font-mono text-right">
                          {row.weight} · {row.pct.toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2 border-t border-white/5">
                    <div className="text-[10px] tracking-[0.28em] uppercase text-white/45 font-mono">
                      {userShares > 0
                        ? `Your weight: ${userShares} share${userShares === 1 ? "" : "s"}`
                        : "You don't own shares of this property"}
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

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-[8.5px] tracking-[0.32em] uppercase text-white/45" style={NEVERA}>Quantity (max {holding.shares})</span>
                  <input
                    type="number"
                    min={1}
                    max={holding.shares}
                    value={listFor.qty}
                    onChange={(e) => setListFor({ ...listFor, qty: Math.max(1, Math.min(holding.shares, parseInt(e.target.value || "1", 10))) })}
                    data-testid="list-qty"
                    className="mt-1 w-full px-3 py-2.5 text-lg bg-[rgba(20,28,48,0.6)] border border-white/10 focus:border-primary/40 outline-none rounded-md text-white"
                    style={SHARKON}
                  />
                </label>
                <label className="block">
                  <span className="text-[8.5px] tracking-[0.32em] uppercase text-white/45" style={NEVERA}>Ask / share (USD)</span>
                  <input
                    type="number"
                    min={1}
                    value={listFor.ask}
                    onChange={(e) => setListFor({ ...listFor, ask: Math.max(1, parseInt(e.target.value || "0", 10)) })}
                    data-testid="list-ask"
                    className="mt-1 w-full px-3 py-2.5 text-lg bg-[rgba(20,28,48,0.6)] border border-white/10 focus:border-primary/40 outline-none rounded-md text-white"
                    style={SHARKON}
                  />
                </label>
              </div>

              <div className="rounded-md p-3 space-y-1.5"
                style={{ background: "rgba(20,28,48,0.6)", border: "1px solid rgba(220,225,235,0.08)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] tracking-[0.28em] uppercase text-white/45" style={NEVERA}>Gross proceeds</span>
                  <span className="text-[13px] text-primary" style={SHARKON}>{fmtUsd(total)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] tracking-[0.28em] uppercase text-white/45" style={NEVERA}>vs Fair value</span>
                  <span className={`text-[11px] font-mono ${delta >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                    {delta >= 0 ? "+" : ""}{delta.toFixed(1)}% {delta >= 0 ? "premium" : "discount"}
                  </span>
                </div>
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
                  className="flex-1 px-5 py-3 text-[11px] font-bold tracking-[0.22em] uppercase text-[#050810] bg-primary hover:bg-primary/90 rounded-sm amber-glow"
                  style={{ fontFamily: "BankGothic, sans-serif" }}
                >
                  List on market
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
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-md text-[12px] font-mono tracking-wider border ${toast.kind === "ok" ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200" : "border-rose-400/40 bg-rose-400/10 text-rose-200"}`}
        >
          {toast.msg}
        </motion.div>
      )}
    </div>
  );
}
