import React, { useEffect, useMemo } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import {
  ArrowLeft, ArrowRight, Building2, Car, Coins, Gavel, MapPin, Plane,
  Ship, TrendingUp, Wallet, ChevronRight, Layers3,
} from "lucide-react";
import { getCategory, type AssetCategory } from "@/data/assets";
import {
  fairValuePerShare,
  fmtUsdCompact,
  getHoldings,
  getListings,
  lookupProperty,
  type Listing,
} from "@/lib/portfolio";
import { useWallet } from "@/components/WalletContext";
import MarqueeText from "@/components/MarqueeText";
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

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [params?.assetId]);

  const listings = useMemo(() => {
    if (!meta) return [] as Listing[];
    const owner = address?.toLowerCase();
    return getListings()
      .filter((l) => l.propertyId === meta.prop.id && l.seller !== owner)
      .sort((a, b) => a.askPerShare - b.askPerShare || b.shares - a.shares);
  }, [meta, address]);

  const userHolding = useMemo(() => {
    if (!meta || !address) return undefined;
    return getHoldings(address).find((h) => h.propertyId === meta.prop.id);
  }, [meta, address]);

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

  return (
    <div className="relative min-h-screen max-w-full bg-background overflow-x-clip">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none
        bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]
        bg-[size:5rem_5rem]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(234,141,14,0.16),transparent_30%),radial-gradient(circle_at_78%_26%,rgba(11,181,190,0.12),transparent_24%),radial-gradient(circle_at_50%_72%,rgba(255,255,255,0.06),transparent_34%)] pointer-events-none" />

      <section className="relative min-h-[72vh] overflow-hidden">
        <motion.img
          src={prop.image}
          alt={prop.title}
          initial={{ scale: 1.06, opacity: 0.55 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.45) saturate(1.02)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/45 to-background/75" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-12 pt-24 md:pt-28 pb-14 md:pb-18">
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-white/75 hover:text-primary border border-white/12 hover:border-primary/35 bg-[rgba(8,12,24,0.55)]"
              style={NEVERA}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Marketplace
            </Link>
            {city && (
              <Link
                href={`/city/${city}`}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-white/65 hover:text-white border border-white/10 hover:border-white/20 bg-[rgba(8,12,24,0.45)]"
                style={NEVERA}
              >
                <MapPin className="w-3.5 h-3.5" />
                City collection
              </Link>
            )}
          </div>

          <div className="grid xl:grid-cols-[minmax(0,1.15fr)_390px] gap-8 xl:gap-10 items-end">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] tracking-[0.24em] uppercase font-mono"
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

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.65rem] leading-[0.94] text-white mb-4" style={SHARKON}>
                <MarqueeText desktopStatic title={prop.title}>{prop.title}</MarqueeText>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-white/78 max-w-2xl" style={SERIF}>
                {prop.spec ? `${prop.subtitle} · ${prop.spec}` : prop.subtitle}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3 max-w-3xl">
                <SignalCard label="Net yield" value={prop.rentalYield} accent="#0BB5BE" />
                <SignalCard label="Capital growth" value={prop.capitalGrowth} accent="#EA8D0E" />
                <SignalCard label="Indicative ROI" value={prop.totalRoi} accent="#D6E3F4" />
              </div>
            </div>

            <div
              className="rounded-2xl p-4 sm:p-6 backdrop-blur-xl min-w-0 max-w-full"
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
                  className="btn-metal inline-flex min-w-0 max-w-full items-center justify-center gap-2 px-4 py-3 rounded-md text-[9px] sm:text-[10.5px] tracking-[0.12em] sm:tracking-[0.22em] uppercase text-[#050810] font-bold text-center leading-tight whitespace-normal break-words"
                  style={{ fontFamily: "BankGothic, sans-serif" }}
                >
                  <Wallet className="w-3.5 h-3.5" />
                  Buy now
                </Link>
                <Link
                  href={`${actionBase}&intent=bid`}
                  className="inline-flex min-w-0 max-w-full items-center justify-center gap-2 px-4 py-3 rounded-md text-[9px] sm:text-[10.5px] tracking-[0.12em] sm:tracking-[0.22em] uppercase border border-primary/35 text-primary hover:bg-primary/10 text-center leading-tight whitespace-normal break-words"
                  style={NEVERA}
                >
                  <Gavel className="w-3.5 h-3.5" />
                  Place bid
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
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-[10px] tracking-[0.22em] uppercase border border-white/10 text-white/70 hover:text-white hover:border-white/20"
                  style={NEVERA}
                >
                  <Coins className="w-3.5 h-3.5" />
                  Connect wallet for live holdings
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-14 md:py-18">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 grid xl:grid-cols-[minmax(0,1fr)_360px] gap-8 min-w-0">
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
                <InfoRow label="Primary launch" value={fmtUsd(prop.price)} />
                <InfoRow label="Catalog availability" value={`${prop.available} shares`} />
              </div>
            </Panel>

            <Panel title="Live marketplace depth" eyebrow="Secondary market">
              {listings.length === 0 ? (
                <div className="rounded-xl px-4 py-4 border border-white/8 bg-[rgba(255,255,255,0.03)]">
                  <p className="text-[13px] text-white/60 leading-6" style={NEVERA}>
                    No live asks are posted right now. The correct action is to place a bid so existing holders can respond directly.
                  </p>
                  <Link
                    href={`${actionBase}&intent=bid`}
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

            <Panel title="Execution path" eyebrow="Trade flow">
              <ol className="space-y-3 text-[13px] text-white/68 leading-6" style={NEVERA}>
                <li>1. Review the asset here and confirm the live market paper.</li>
                <li>2. Move to marketplace in buy mode or bid mode, already scoped to this asset.</li>
                <li>3. Settle the order in OPAS; yield distributions continue in USDT.</li>
              </ol>
              <div className="mt-4 flex flex-col gap-2 min-w-0">
                <Link
                  href={`${actionBase}&intent=buy`}
                  className="inline-flex min-w-0 max-w-full items-center justify-between gap-3 px-4 py-3 rounded-xl border border-primary/30 bg-primary/8 text-primary hover:bg-primary/12"
                  style={NEVERA}
                >
                  <span className="min-w-0 break-words">Open marketplace in buy mode</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
                <Link
                  href={`${actionBase}&intent=bid`}
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
    </div>
  );
}

function Panel({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-5 sm:p-6"
      style={{
        background: "linear-gradient(180deg, rgba(14,20,36,0.82) 0%, rgba(8,12,24,0.88) 100%)",
        border: "1px solid rgba(220,225,235,0.12)",
        boxShadow: "0 18px 50px -34px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div className="text-[9px] tracking-[0.28em] uppercase text-white/38 mb-2" style={NEVERA}>{eyebrow}</div>
      <h2 className="text-2xl text-white mb-4" style={SHARKON}>{title}</h2>
      {children}
    </div>
  );
}

function SignalCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background: "rgba(8,12,24,0.48)",
        border: "1px solid rgba(220,225,235,0.12)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div className="text-[9px] tracking-[0.26em] uppercase text-white/38 mb-1" style={NEVERA}>{label}</div>
      <div className="text-xl" style={{ ...SHARKON, color: accent }}>{value}</div>
    </div>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl px-4 py-3 border border-white/8 bg-[rgba(255,255,255,0.03)] min-w-0 max-w-full overflow-hidden">
      <div className="text-[8.5px] tracking-[0.24em] uppercase text-white/35 mb-1" style={NEVERA}>{label}</div>
      <FitText share className="text-base sm:text-lg text-white min-w-0" style={SHARKON}>{value}</FitText>
    </div>
  );
}

function InfoRow({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 rounded-xl px-4 py-3 border border-white/8 bg-[rgba(255,255,255,0.03)] min-w-0 max-w-full overflow-hidden">
      <span className="text-[10px] tracking-[0.2em] sm:tracking-[0.24em] uppercase text-white/38 break-words" style={NEVERA}>{label}</span>
      <span className="min-w-0 text-[13px] sm:text-[14px] sm:text-right break-words leading-tight" style={{ ...SHARKON, color: accent ?? "#F5F7FB" }}>{value}</span>
    </div>
  );
}
