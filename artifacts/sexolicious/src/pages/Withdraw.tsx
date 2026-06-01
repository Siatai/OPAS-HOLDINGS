import React, { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import {
  Wallet, Banknote, ArrowDownRight, ArrowUpRight, ShieldCheck,
  Receipt, Tag, CheckCircle2, AlertTriangle,
} from "lucide-react";
import {
  getActivity, proceedsFromActivity, withdrawProceeds, lookupProperty,
  type Activity,
} from "@/lib/portfolio";
import { useWallet } from "@/components/WalletContext";
import MarqueeText from "@/components/MarqueeText";

const SHARKON = { fontFamily: "Sharkon, Nevera, sans-serif" };
const NEVERA  = { fontFamily: "Nevera, Inter, sans-serif" };

const fmtUsd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

function timeAgo(t: number) {
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60)    return `${s}s ago`;
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function Withdraw() {
  const { address, isConnected } = useAccount();
  const { openWallet } = useWallet();

  const [activity, setActivity] = useState<Activity[]>([]);
  const [amount, setAmount]      = useState("");
  const [dest, setDest]          = useState("");
  const [toast, setToast]        = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  const refresh = () => {
    if (address) setActivity(getActivity(address));
  };

  useEffect(() => {
    if (!address) return;
    setActivity(getActivity(address));
    setDest(address);
  }, [address]);

  const proceeds = useMemo(() => proceedsFromActivity(activity), [activity]);

  const withdrawals = useMemo(
    () => activity.filter((a) => a.kind === "withdraw").slice(0, 8),
    [activity],
  );

  const distributions = useMemo(
    () => activity.filter((a) => a.kind === "rent" || a.kind === "sell").slice(0, 6),
    [activity],
  );

  const amt = parseFloat(amount) || 0;
  const invalidAmt = amt > 0 && amt > proceeds.available + 1e-6;

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  function handleWithdraw() {
    if (!address) return;
    const res = withdrawProceeds(address, amt, dest);
    if (!res.ok) {
      setToast({ kind: "err", msg: res.reason || "Withdrawal failed." });
      return;
    }
    setToast({ kind: "ok", msg: `${fmtUsd(amt)} sent in USDT.` });
    setAmount("");
    refresh();
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="max-w-md text-center space-y-5 px-6">
          <Wallet className="w-12 h-12 mx-auto text-secondary/70" />
          <h2 className="text-3xl text-white" style={SHARKON}>
            <span className="metallic-text">Connect to withdraw</span>
          </h2>
          <p className="text-white/55 text-sm" style={NEVERA}>
            Your USDT distribution balance and cash-out controls appear here once a wallet is connected.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={openWallet}
              className="btn-metal px-7 py-3.5 text-[11px] font-bold tracking-[0.22em] text-[#050810] uppercase rounded-sm"
              style={{ fontFamily: "BankGothic, sans-serif" }}
              data-testid="withdraw-connect"
            >
              Connect Wallet
            </button>
            <Link
              href="/dashboard"
              className="px-7 py-3.5 text-[11px] tracking-[0.22em] uppercase text-white/65 hover:text-white border border-white/15 hover:border-white/35 rounded-sm transition-colors"
              style={NEVERA}
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 md:pt-32 pb-24 overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-5xl space-y-8 md:space-y-10 min-w-0">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div className="space-y-3 min-w-0">
            <div className="metallic-border inline-flex items-center gap-2 px-3 py-1 rounded-full">
              <span className="w-1 h-1 rounded-full bg-secondary animate-pulse" />
              <span className="text-[8.5px] tracking-[0.32em] uppercase metallic-text" style={NEVERA}>
                Proceeds · USDT settlement
              </span>
            </div>
            <h1 className="text-[22px] sm:text-3xl md:text-4xl lg:text-5xl leading-[1.1]" style={SHARKON}>
              <span className="metallic-text">Withdraw</span>{" "}
              <span className="metallic-warm-text">proceeds.</span>
            </h1>
            <p className="text-white/55 text-sm max-w-lg" style={NEVERA}>
              Cash out your accumulated rental, charter and sale distributions in USDT to any wallet, 24/7.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard" className="px-3 sm:px-4 py-2 sm:py-2.5 text-[9.5px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.22em] text-white/55 hover:text-white uppercase border border-white/10 hover:border-white/25 rounded-sm transition-colors" style={NEVERA}>
              ← Dashboard
            </Link>
          </div>
        </motion.div>

        {/* ── Balance + form ── */}
        <div className="grid lg:grid-cols-5 gap-5 md:gap-6">

          {/* Balance card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="lg:col-span-2 rounded-xl p-5 sm:p-6 flex flex-col justify-between min-w-0"
            style={{
              background: "linear-gradient(155deg, rgba(11,181,190,0.14), rgba(20,28,48,0.5))",
              border: "1px solid rgba(11,181,190,0.3)",
            }}
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[9.5px] tracking-[0.32em] uppercase text-secondary font-mono">
                <Banknote className="w-3.5 h-3.5" /> Available to withdraw
              </div>
              <div className="text-3xl sm:text-4xl text-white" style={SHARKON} data-testid="available-balance">
                {fmtUsd(proceeds.available)}
              </div>
              <div className="text-[10.5px] tracking-[0.2em] uppercase text-white/40 font-mono">USDT</div>
            </div>

            <div className="mt-6 pt-4 space-y-2.5 border-t border-white/10">
              <div className="flex items-center justify-between text-[11.5px]" style={NEVERA}>
                <span className="text-white/50 flex items-center gap-1.5"><ArrowDownRight className="w-3.5 h-3.5 text-emerald-300" /> Lifetime earned</span>
                <span className="text-emerald-300" style={SHARKON}>{fmtUsd(proceeds.earned)}</span>
              </div>
              <div className="flex items-center justify-between text-[11.5px]" style={NEVERA}>
                <span className="text-white/50 flex items-center gap-1.5"><ArrowUpRight className="w-3.5 h-3.5 text-secondary" /> Total withdrawn</span>
                <span className="text-secondary" style={SHARKON}>{fmtUsd(proceeds.withdrawn)}</span>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3 rounded-xl p-5 sm:p-6 space-y-5 min-w-0"
            style={{ background: "rgba(20,28,48,0.5)", border: "1px solid rgba(220,225,235,0.08)" }}
          >
            {/* Amount */}
            <div className="space-y-2">
              <label className="text-[9.5px] tracking-[0.28em] uppercase text-white/50 font-mono">Amount · USDT</label>
              <div className="flex items-stretch gap-2">
                <div className="flex-1 flex items-center rounded-sm bg-black/30 border border-white/10 focus-within:border-secondary/50 px-3">
                  <span className="text-white/40 text-lg" style={SHARKON}>$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    data-testid="withdraw-amount"
                    className="w-full bg-transparent py-3 px-2 text-white text-lg outline-none placeholder:text-white/25"
                    style={SHARKON}
                  />
                </div>
                <button
                  onClick={() => setAmount(String(Math.floor(proceeds.available * 100) / 100))}
                  className="px-4 text-[10px] tracking-[0.22em] uppercase text-secondary border border-secondary/40 hover:bg-secondary/10 rounded-sm transition-colors font-mono shrink-0"
                  data-testid="withdraw-max"
                >
                  Max
                </button>
              </div>
              {invalidAmt && (
                <p className="text-[10.5px] text-rose-300 flex items-center gap-1.5" style={NEVERA}>
                  <AlertTriangle className="w-3.5 h-3.5" /> Exceeds available balance of {fmtUsd(proceeds.available)}.
                </p>
              )}
            </div>

            {/* Destination */}
            <div className="space-y-2">
              <label className="text-[9.5px] tracking-[0.28em] uppercase text-white/50 font-mono">Destination wallet</label>
              <input
                type="text"
                value={dest}
                onChange={(e) => setDest(e.target.value)}
                placeholder="0x…"
                data-testid="withdraw-dest"
                className="w-full rounded-sm bg-black/30 border border-white/10 focus:border-secondary/50 py-3 px-3 text-white/85 text-[12.5px] outline-none placeholder:text-white/25 font-mono"
              />
              <p className="text-[10px] text-white/35" style={NEVERA}>
                Defaults to your connected wallet. USDT is sent on the network when payouts ship with mainnet — this cycle is recorded locally.
              </p>
            </div>

            <button
              onClick={handleWithdraw}
              disabled={!(amt > 0) || invalidAmt}
              data-testid="confirm-withdraw"
              className="btn-metal w-full px-5 py-3.5 text-[11px] font-bold tracking-[0.22em] uppercase text-[#050810] rounded-sm disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: "BankGothic, sans-serif" }}
            >
              Withdraw {amt > 0 ? fmtUsd(amt) : ""} in USDT
            </button>

            <div className="flex items-start gap-2 text-[10.5px] text-white/45" style={NEVERA}>
              <ShieldCheck className="w-3.5 h-3.5 mt-px text-secondary shrink-0" />
              <span>
                Distributions are paid in USDT; your capital remains deployed in $OPAS-denominated equity interests until you sell.
              </span>
            </div>
          </motion.div>
        </div>

        {/* ── Recent distributions ── */}
        <section className="grid lg:grid-cols-2 gap-5 md:gap-6">
          <div className="space-y-3 min-w-0">
            <h2 className="text-base sm:text-lg flex items-center gap-2" style={SHARKON}>
              <Receipt className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="metallic-text">Recent distributions</span>
            </h2>
            <div className="rounded-lg overflow-hidden" style={{ background: "rgba(20,28,48,0.5)", border: "1px solid rgba(220,225,235,0.08)" }}>
              {distributions.length === 0 ? (
                <div className="p-6 text-center text-white/40 text-sm" style={NEVERA}>No distributions yet.</div>
              ) : (
                <div className="divide-y divide-white/5">
                  {distributions.map((a) => {
                    const meta = lookupProperty(a.propertyId);
                    return (
                      <div key={a.id} className="flex items-center gap-3 p-3 sm:p-3.5">
                        <div className="w-8 h-8 rounded-md flex items-center justify-center border shrink-0 text-amber-300 border-amber-400/40 bg-amber-400/10">
                          {a.kind === "sell" ? <Tag className="w-3.5 h-3.5" /> : <Receipt className="w-3.5 h-3.5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <MarqueeText className="text-[11.5px] text-white min-w-0" style={NEVERA}>
                            {meta ? meta.prop.token : a.kind === "sell" ? "Sale proceeds" : "Distribution"}
                          </MarqueeText>
                          <div className="text-[10px] text-white/40 font-mono">{timeAgo(a.at)}</div>
                        </div>
                        <div className="text-[12.5px] text-emerald-300 shrink-0" style={SHARKON}>+{fmtUsd(a.usd || 0)}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Withdrawal history ── */}
          <div className="space-y-3 min-w-0">
            <h2 className="text-base sm:text-lg flex items-center gap-2" style={SHARKON}>
              <Banknote className="w-4 h-4 text-secondary shrink-0" />
              <span className="metallic-text">Withdrawal history</span>
            </h2>
            <div className="rounded-lg overflow-hidden" style={{ background: "rgba(20,28,48,0.5)", border: "1px solid rgba(220,225,235,0.08)" }} data-testid="withdrawal-history">
              {withdrawals.length === 0 ? (
                <div className="p-6 text-center text-white/40 text-sm" style={NEVERA}>No withdrawals yet.</div>
              ) : (
                <div className="divide-y divide-white/5">
                  {withdrawals.map((a) => (
                    <div key={a.id} className="flex items-center gap-3 p-3 sm:p-3.5" data-testid="withdrawal-row">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center border shrink-0 text-secondary border-secondary/40 bg-secondary/10">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <MarqueeText className="text-[11.5px] text-white min-w-0" style={NEVERA}>{a.note || "Withdrawal"}</MarqueeText>
                        <div className="text-[10px] text-white/40 font-mono">{timeAgo(a.at)}</div>
                      </div>
                      <div className="text-[12.5px] text-secondary shrink-0" style={SHARKON}>−{fmtUsd(a.usd || 0)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-md text-[12px] font-mono tracking-wider border ${toast.kind === "ok" ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200" : "border-rose-400/40 bg-rose-400/10 text-rose-200"}`}
          data-testid="withdraw-toast"
        >
          {toast.msg}
        </motion.div>
      )}
    </div>
  );
}
