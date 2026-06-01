import { ASSET_INDEX } from "@/data/assets";

export type Holding = {
  propertyId: string;
  cityId: string;
  shares: number;
  acquiredAt: number;
  costBasisUsd: number;
};

export type Proposal = {
  id: string;
  propertyId: string;
  kind: "sell" | "rent_increase" | "refurbish" | "refinance";
  title: string;
  detail: string;
  createdAt: number;
  endsAt: number;
  votes: Record<string, { choice: "for" | "against" | "abstain"; weight: number }>;
};

export const lookupProperty = (id: string) => ASSET_INDEX.get(id);

const KEY = (addr: string) => `opas:portfolio:${addr.toLowerCase()}`;
const PROP_KEY = "opas:proposals";

const SEED_HOLDINGS: Omit<Holding, "acquiredAt">[] = [
  { propertyId: "dxb-1",   cityId: "dubai",    shares: 24, costBasisUsd: 3_600 },
  { propertyId: "ldn-1",   cityId: "london",   shares: 12, costBasisUsd: 2_400 },
  { propertyId: "nyc-3",   cityId: "newyork",  shares: 18, costBasisUsd: 2_700 },
  { propertyId: "car-2",   cityId: "",         shares: 30, costBasisUsd: 3_600 },
  { propertyId: "yacht-2", cityId: "",         shares: 16, costBasisUsd: 2_880 },
  { propertyId: "jet-4",   cityId: "",         shares: 20, costBasisUsd: 3_200 },
];

const SEED_PROPOSALS: Omit<Proposal, "votes" | "createdAt" | "endsAt">[] = [
  {
    id: "prop-dxb1-sell",
    propertyId: "dxb-1",
    kind: "sell",
    title: "Liquidate Burj Khalifa Penthouse at $4.8M",
    detail: "Off-market bid received from Knight Frank private client (35% premium to last valuation). Proceeds distributed pro-rata in USDT within 14 days.",
  },
  {
    id: "prop-car2-sell",
    propertyId: "car-2",
    kind: "sell",
    title: "Accept $4.2M collector bid on LaFerrari Aperta",
    detail: "RM Sotheby's private treaty offer at a 26% premium to last appraisal. Settlement in USDT, proceeds distributed pro-rata to token holders within 10 days.",
  },
  {
    id: "prop-yht2-rent",
    propertyId: "yacht-2",
    kind: "rent_increase",
    title: "Raise peak-week charter rate €185k → €210k",
    detail: "Med summer demand study supports a 13.5% uplift on the Sunseeker 90 charter rate. Occupancy modelled at 18 of 22 prime weeks.",
  },
  {
    id: "prop-ldn1-rent",
    propertyId: "ldn-1",
    kind: "rent_increase",
    title: "Increase monthly rent from £18,500 → £21,200",
    detail: "Market study by Savills supports a 14.6% uplift on renewal. Vacancy risk modelled at <4% based on Mayfair Q1-26 comps.",
  },
  {
    id: "prop-jet4-refurb",
    propertyId: "jet-4",
    kind: "refurbish",
    title: "Approve $1.1M cabin refit on Praetor 600",
    detail: "Full interior refresh and Ka-band connectivity upgrade funded from reserves. Projected charter rate uplift +9% and improved utilisation.",
  },
  {
    id: "prop-nyc3-refurb",
    propertyId: "nyc-3",
    kind: "refurbish",
    title: "Approve $420k full-floor refurbishment",
    detail: "Capex funded from operating reserves. Projected post-refurb yield uplift +1.8pp; capital growth +6-9%. ETA 5 months.",
  },
];

export function getHoldings(address: string): Holding[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY(address));
    if (raw) return JSON.parse(raw) as Holding[];
  } catch {}
  const seeded: Holding[] = SEED_HOLDINGS.map((h) => ({ ...h, acquiredAt: Date.now() - 1000 * 60 * 60 * 24 * 30 }));
  window.localStorage.setItem(KEY(address), JSON.stringify(seeded));
  return seeded;
}

export function setHoldings(address: string, h: Holding[]) {
  window.localStorage.setItem(KEY(address), JSON.stringify(h));
}

export function getProposals(): Proposal[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PROP_KEY);
    if (raw) return JSON.parse(raw) as Proposal[];
  } catch {}
  const now = Date.now();
  const seeded: Proposal[] = SEED_PROPOSALS.map((p, i) => ({
    ...p,
    createdAt: now - (i + 1) * 1000 * 60 * 60 * 24 * 2,
    endsAt:    now + (5 - i) * 1000 * 60 * 60 * 24,
    votes: {},
  }));
  window.localStorage.setItem(PROP_KEY, JSON.stringify(seeded));
  return seeded;
}

export function castVote(
  proposalId: string,
  voter: string,
  choice: "for" | "against" | "abstain",
  weight: number,
): Proposal[] {
  const all = getProposals();
  const target = all.find((p) => p.id === proposalId);
  const next = all.map((p) =>
    p.id === proposalId
      ? { ...p, votes: { ...p.votes, [voter.toLowerCase()]: { choice, weight } } }
      : p,
  );
  window.localStorage.setItem(PROP_KEY, JSON.stringify(next));
  if (target) {
    logActivity(voter, {
      kind: "vote",
      propertyId: target.propertyId,
      note: `Voted ${choice.toUpperCase()} · ${target.title}`,
    });
  }
  return next;
}

export function tally(p: Proposal) {
  const v = Object.values(p.votes);
  const sum = (c: "for" | "against" | "abstain") =>
    v.filter((x) => x.choice === c).reduce((a, b) => a + b.weight, 0);
  const fr = sum("for"), ag = sum("against"), ab = sum("abstain");
  const total = fr + ag + ab;
  return { fr, ag, ab, total };
}

const TOTAL_SUPPLY = 1000;

export function ownershipPct(shares: number) {
  return (shares / TOTAL_SUPPLY) * 100;
}

export function portfolioStats(holdings: Holding[]) {
  let totalValue = 0;
  let totalCost  = 0;
  let monthlyYield = 0;
  for (const h of holdings) {
    const value = h.shares * fairValuePerShare(h.propertyId);
    totalValue += value;
    totalCost  += h.costBasisUsd;
    const meta = lookupProperty(h.propertyId);
    if (!meta) continue;
    const ry = parseFloat(meta.prop.rentalYield) || 0;
    monthlyYield += (value * (ry / 100)) / 12;
  }
  return {
    totalValue,
    totalCost,
    pnl: totalValue - totalCost,
    pnlPct: totalCost ? ((totalValue - totalCost) / totalCost) * 100 : 0,
    monthlyYield,
    properties: holdings.length,
  };
}

export const TOTAL_SUPPLY_CONST = TOTAL_SUPPLY;

// ─────────────────────────────────────────────────────────────
// Platform fees
//   buySell      — 7% charged on every primary/secondary buy & sell
//   trade        — none; equity-for-equity swaps settle free
//   maintenance  — 5% monthly fee the operator takes from gross income
// ─────────────────────────────────────────────────────────────
export const FEES = {
  buySell: 0.07,
  trade: 0,
  maintenanceMonthly: 0.05,
} as const;

export const FEE_LABEL = {
  buySell: "7%",
  trade: "Free",
  maintenance: "5%",
} as const;

// ─────────────────────────────────────────────────────────────
// Secondary market
// ─────────────────────────────────────────────────────────────

export type Listing = {
  id: string;
  propertyId: string;
  seller: string;          // wallet address (lowercased) — "vault" for synthetic liquidity
  shares: number;
  askPerShare: number;     // USD
  escrowBasisUsd?: number; // original cost basis of escrowed shares (user listings)
  createdAt: number;
};

const LIST_KEY = "opas:marketplace:v2";

const SEED_LISTINGS: Omit<Listing, "id" | "createdAt">[] = [
  { propertyId: "dxb-2", seller: "vault", shares: 8,  askPerShare: 165 },
  { propertyId: "dxb-5", seller: "vault", shares: 4,  askPerShare: 232 },
  { propertyId: "ldn-2", seller: "vault", shares: 12, askPerShare: 248 },
  { propertyId: "nyc-1", seller: "vault", shares: 18, askPerShare: 142 },
  { propertyId: "par-3", seller: "vault", shares: 22, askPerShare: 118 },
  { propertyId: "hkg-2", seller: "vault", shares: 14, askPerShare: 196 },
  { propertyId: "sgp-4", seller: "vault", shares: 10, askPerShare: 174 },
  { propertyId: "mia-1", seller: "vault", shares: 26, askPerShare: 128 },
  { propertyId: "car-1",   seller: "vault", shares: 12, askPerShare: 102 },
  { propertyId: "car-2",   seller: "vault", shares: 5,  askPerShare: 128 },
  { propertyId: "car-3",   seller: "vault", shares: 20, askPerShare: 68 },
  { propertyId: "car-4",   seller: "vault", shares: 4,  askPerShare: 116 },
  { propertyId: "car-5",   seller: "vault", shares: 16, askPerShare: 82 },
  { propertyId: "car-6",   seller: "vault", shares: 3,  askPerShare: 152 },
  { propertyId: "yacht-1", seller: "vault", shares: 9,  askPerShare: 246 },
  { propertyId: "yacht-2", seller: "vault", shares: 12, askPerShare: 188 },
  { propertyId: "yacht-3", seller: "vault", shares: 18, askPerShare: 148 },
  { propertyId: "yacht-4", seller: "vault", shares: 3,  askPerShare: 372 },
  { propertyId: "yacht-5", seller: "vault", shares: 6,  askPerShare: 204 },
  { propertyId: "jet-1",   seller: "vault", shares: 7,  askPerShare: 328 },
  { propertyId: "jet-2",   seller: "vault", shares: 9,  askPerShare: 312 },
  { propertyId: "jet-3",   seller: "vault", shares: 14, askPerShare: 214 },
  { propertyId: "jet-4",   seller: "vault", shares: 20, askPerShare: 168 },
  { propertyId: "jet-5",   seller: "vault", shares: 16, askPerShare: 136 },
];

function rid() {
  return `lst_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function getListings(): Listing[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LIST_KEY);
    if (raw) return JSON.parse(raw) as Listing[];
  } catch {}
  const now = Date.now();
  const seeded: Listing[] = SEED_LISTINGS.map((l, i) => ({
    ...l,
    id: rid() + "_" + i,
    createdAt: now - (i + 1) * 1000 * 60 * 60 * 3,
  }));
  window.localStorage.setItem(LIST_KEY, JSON.stringify(seeded));
  return seeded;
}

function saveListings(l: Listing[]) {
  window.localStorage.setItem(LIST_KEY, JSON.stringify(l));
}

export function createListing(
  seller: string,
  propertyId: string,
  shares: number,
  askPerShare: number,
): { ok: boolean; reason?: string; listings?: Listing[] } {
  const holdings = getHoldings(seller);
  const h = holdings.find((x) => x.propertyId === propertyId);
  if (!h)               return { ok: false, reason: "You don't own this property." };
  if (shares <= 0)      return { ok: false, reason: "Shares must be greater than zero." };
  if (shares > h.shares) return { ok: false, reason: `You only hold ${h.shares} shares.` };
  if (askPerShare <= 0) return { ok: false, reason: "Ask price must be positive." };

  // Escrow: remove shares and their proportional cost basis from holdings.
  const escrowBasisUsd = h.shares > 0 ? h.costBasisUsd * (shares / h.shares) : 0;
  const next = holdings
    .map((x) => x.propertyId === propertyId ? { ...x, shares: x.shares - shares, costBasisUsd: x.costBasisUsd - escrowBasisUsd } : x)
    .filter((x) => x.shares > 0);
  setHoldings(seller, next);

  const all = getListings();
  const created: Listing = {
    id: rid(),
    propertyId,
    seller: seller.toLowerCase(),
    shares,
    askPerShare,
    escrowBasisUsd,
    createdAt: Date.now(),
  };
  const updated = [created, ...all];
  saveListings(updated);
  logActivity(seller, {
    kind: "list", propertyId, shares, usd: shares * askPerShare,
    note: `Listed @ ${askPerShare}/share`,
  });
  return { ok: true, listings: updated };
}

export function cancelListing(listingId: string, caller: string): Listing[] {
  const all = getListings();
  const target = all.find((l) => l.id === listingId);
  if (!target) return all;
  if (target.seller !== caller.toLowerCase() && target.seller !== "vault") return all;

  // Return shares to seller (if not synthetic)
  if (target.seller !== "vault") {
    const holdings = getHoldings(target.seller);
    const existing = holdings.find((h) => h.propertyId === target.propertyId);
    // Restore the escrowed shares at their original cost basis.
    const restoreBasis = target.escrowBasisUsd ?? target.shares * target.askPerShare;
    const next = existing
      ? holdings.map((h) => h.propertyId === target.propertyId ? { ...h, shares: h.shares + target.shares, costBasisUsd: h.costBasisUsd + restoreBasis } : h)
      : [...holdings, {
          propertyId: target.propertyId,
          cityId: lookupProperty(target.propertyId)?.city ?? "",
          shares: target.shares,
          acquiredAt: Date.now(),
          costBasisUsd: restoreBasis,
        } as Holding];
    setHoldings(target.seller, next);
  }
  const filtered = all.filter((l) => l.id !== listingId);
  saveListings(filtered);
  if (target.seller !== "vault") {
    logActivity(caller, {
      kind: "cancel", propertyId: target.propertyId, shares: target.shares,
      note: "Listing cancelled · shares returned",
    });
  }
  return filtered;
}

export function buyListing(
  listingId: string,
  buyer: string,
  buyShares: number,
): { ok: boolean; reason?: string; listings?: Listing[]; holdings?: Holding[] } {
  if (buyShares <= 0) return { ok: false, reason: "Quantity must be positive." };
  const all = getListings();
  const idx = all.findIndex((l) => l.id === listingId);
  if (idx === -1) return { ok: false, reason: "Listing no longer exists." };
  const listing = all[idx];
  if (listing.seller === buyer.toLowerCase()) return { ok: false, reason: "You can't buy your own listing." };
  if (buyShares > listing.shares) return { ok: false, reason: `Only ${listing.shares} shares available.` };

  // Credit buyer — buyer pays the ask plus a 7% platform fee
  const buyerHoldings = getHoldings(buyer);
  const cost = buyShares * listing.askPerShare;
  const fee = cost * FEES.buySell;
  const total = cost + fee;
  const existing = buyerHoldings.find((h) => h.propertyId === listing.propertyId);
  const nextBuyer: Holding[] = existing
    ? buyerHoldings.map((h) =>
        h.propertyId === listing.propertyId
          ? { ...h, shares: h.shares + buyShares, costBasisUsd: h.costBasisUsd + total }
          : h,
      )
    : [
        ...buyerHoldings,
        {
          propertyId: listing.propertyId,
          cityId: lookupProperty(listing.propertyId)?.city ?? "",
          shares: buyShares,
          acquiredAt: Date.now(),
          costBasisUsd: total,
        },
      ];
  setHoldings(buyer, nextBuyer);

  // Decrement / remove listing. On a partial fill, scale the escrowed basis to
  // the unsold portion so a later cancel only restores the unsold slice's basis.
  const remaining = listing.shares - buyShares;
  const remainingBasis = listing.escrowBasisUsd != null && listing.shares > 0
    ? listing.escrowBasisUsd * (remaining / listing.shares)
    : listing.escrowBasisUsd;
  const nextListings = remaining > 0
    ? all.map((l, i) => i === idx ? { ...l, shares: remaining, escrowBasisUsd: remainingBasis } : l)
    : all.filter((_, i) => i !== idx);
  saveListings(nextListings);

  logActivity(buyer, {
    kind: "buy", propertyId: listing.propertyId, shares: buyShares, usd: total,
    note: `Incl. 7% fee ${fmtUsdCompact(fee)} · ${listing.seller === "vault" ? "vault liquidity" : `from ${listing.seller.slice(0, 6)}…`}`,
  });
  if (listing.seller !== "vault") {
    const sellFee = cost * FEES.buySell;
    logActivity(listing.seller, {
      kind: "sell", propertyId: listing.propertyId, shares: buyShares, usd: cost - sellFee,
      note: `Net of 7% fee ${fmtUsdCompact(sellFee)} · to ${buyer.slice(0, 6)}…`,
    });
  }
  return { ok: true, listings: nextListings, holdings: nextBuyer };
}

// Fair value/share = primary launch price compounded by the property's
// real capital-growth figure (Knight Frank / JLL data baked into cities.ts).
// e.g. Burj Khalifa Penthouse: $150 × (1 + 17.2%) = $175.80/share.
export function fairValuePerShare(propertyId: string) {
  const meta = lookupProperty(propertyId);
  if (!meta) return 0;
  const growthStr = (meta.prop as any).capitalGrowth ?? "0%";
  const growth = parseFloat(String(growthStr).replace(/[+%\s]/g, "")) || 0;
  return meta.prop.price * (1 + growth / 100);
}

// Display helper: compact $K / $M / $B formatting for stat tiles & headers.
export function fmtUsdCompact(n: number): string {
  if (!isFinite(n)) return "$0";
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(abs >= 1e10 ? 1 : 2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(abs >= 1e7 ? 1 : 2)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(abs >= 1e4 ? 1 : 2)}K`;
  return `${sign}$${abs.toFixed(0)}`;
}

// ─────────────────────────────────────────────────────────────
// Activity ledger (per-wallet)
// ─────────────────────────────────────────────────────────────

export type ActivityKind = "buy" | "sell" | "list" | "cancel" | "rent" | "vote" | "swap" | "withdraw" | "bid";

export type Activity = {
  id: string;
  kind: ActivityKind;
  propertyId: string;
  at: number;
  shares?: number;
  usd?: number;       // gross USD value
  note?: string;
};

const ACT_KEY = (addr: string) => `opas:activity:${addr.toLowerCase()}`;

function aid() {
  return `act_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function readActivity(address: string): Activity[] {
  if (typeof window === "undefined" || !address) return [];
  try {
    const raw = window.localStorage.getItem(ACT_KEY(address));
    if (raw) return JSON.parse(raw) as Activity[];
  } catch {}
  return [];
}

function writeActivity(address: string, a: Activity[]) {
  window.localStorage.setItem(ACT_KEY(address), JSON.stringify(a.slice(0, 200)));
}

export function logActivity(address: string, ev: Omit<Activity, "id" | "at"> & { at?: number }) {
  if (!address) return;
  const all = readActivity(address);
  const item: Activity = { id: aid(), at: ev.at ?? Date.now(), ...ev };
  writeActivity(address, [item, ...all]);
}

const ACT_SEEDED = (addr: string) => `opas:activity:seeded:${addr.toLowerCase()}`;

export function getActivity(address: string): Activity[] {
  if (typeof window === "undefined" || !address) return [];
  const existing = readActivity(address);
  // Seed historical rental + buy events once per wallet
  if (!window.localStorage.getItem(ACT_SEEDED(address))) {
    const holdings = getHoldings(address);
    const now = Date.now();
    const day = 1000 * 60 * 60 * 24;
    const seeded: Activity[] = [];
    holdings.forEach((h, i) => {
      const meta = lookupProperty(h.propertyId);
      if (!meta) return;
      const fair = fairValuePerShare(h.propertyId);
      const grossMonthly = (h.shares * fair * (parseFloat(meta.prop.rentalYield) || 0) / 100) / 12;
      // Distributions are net of the 5% monthly maintenance fee.
      const netMonthly = grossMonthly * (1 - FEES.maintenanceMonthly);
      // initial buy receipt
      seeded.push({
        id: aid(),
        kind: "buy",
        propertyId: h.propertyId,
        at: h.acquiredAt,
        shares: h.shares,
        usd: h.costBasisUsd,
        note: "Initial position",
      });
      // 3 monthly rent collections (net of maintenance)
      for (let m = 1; m <= 3; m++) {
        seeded.push({
          id: aid(),
          kind: "rent",
          propertyId: h.propertyId,
          at: now - m * 30 * day + i * day,
          usd: Math.round(netMonthly),
          note: `Month ${4 - m} distribution · net of 5% maintenance`,
        });
      }
    });
    seeded.sort((a, b) => b.at - a.at);
    writeActivity(address, [...seeded, ...existing]);
    window.localStorage.setItem(ACT_SEEDED(address), "1");
    return readActivity(address);
  }
  return existing;
}

// ─────────────────────────────────────────────────────────────
// Withdrawable proceeds (USDT)
//   Distributions (rent/charter + sale proceeds) accrue to a USDT
//   balance the holder can withdraw to an external wallet.
// ─────────────────────────────────────────────────────────────
export function proceedsFromActivity(acts: Activity[]): { available: number; earned: number; withdrawn: number } {
  let earned = 0;
  let withdrawn = 0;
  for (const a of acts) {
    if (a.kind === "rent" || a.kind === "sell") earned += a.usd || 0;
    else if (a.kind === "withdraw") withdrawn += a.usd || 0;
  }
  return { available: Math.max(0, earned - withdrawn), earned, withdrawn };
}

export function proceedsBalance(address: string): { available: number; earned: number; withdrawn: number } {
  return proceedsFromActivity(getActivity(address));
}

export function withdrawProceeds(
  address: string,
  amountUsd: number,
  destination: string,
): { ok: boolean; reason?: string; balance?: number } {
  if (!address) return { ok: false, reason: "Connect a wallet first." };
  if (!(amountUsd > 0)) return { ok: false, reason: "Enter an amount greater than zero." };
  const dest = destination.trim();
  if (!/^0x[a-fA-F0-9]{40}$/.test(dest)) return { ok: false, reason: "Enter a valid wallet address (0x…)." };
  const { available } = proceedsBalance(address);
  if (amountUsd > available + 1e-6) return { ok: false, reason: `Only ${fmtUsdCompact(available)} available.` };
  logActivity(address, {
    kind: "withdraw", propertyId: "", usd: amountUsd,
    note: `Withdrawn in USDT to ${dest.slice(0, 6)}…${dest.slice(-4)}`,
  });
  return { ok: true, balance: proceedsBalance(address).available };
}

export function rentalSummary(holdings: Holding[]) {
  let monthly = 0;
  let annual = 0;
  const perProperty: { propertyId: string; monthly: number; net: number; yield: number }[] = [];
  for (const h of holdings) {
    const meta = lookupProperty(h.propertyId);
    if (!meta) continue;
    const fair = fairValuePerShare(h.propertyId);
    const yld = parseFloat(meta.prop.rentalYield) || 0;
    const m = (h.shares * fair * (yld / 100)) / 12;
    monthly += m;
    annual += m * 12;
    perProperty.push({ propertyId: h.propertyId, monthly: m, net: m * (1 - FEES.maintenanceMonthly), yield: yld });
  }
  const maintenance = monthly * FEES.maintenanceMonthly;
  const net = monthly - maintenance;
  return { monthly, annual, maintenance, net, netAnnual: net * 12, perProperty };
}

// ─────────────────────────────────────────────────────────────
// Equity-for-equity swap protocol
//   A holder can list a position to exchange for another asset's equity.
//   The counterparty is notified and can accept (assets switch hands) or
//   decline. Swaps settle free — no trade fee.
// ─────────────────────────────────────────────────────────────

export type SwapStatus = "pending" | "accepted" | "declined" | "cancelled";

export type SwapOffer = {
  id: string;
  direction: "incoming" | "outgoing"; // relative to the current wallet
  counterparty: string;               // short display label
  giveId: string;                     // asset the current wallet gives up
  giveShares: number;
  receiveId: string;                  // asset the current wallet receives
  receiveShares: number;
  feeUsd: number;                     // trade fee on notional (swaps are free → 0)
  escrowBasisUsd?: number;            // original cost basis of escrowed (given) shares
  status: SwapStatus;
  createdAt: number;
};

// Simulated counterparties that fill outgoing offers from the open order book.
const SIM_TAKERS = ["0x9a4C…71Bd", "0x3Df0…E29a", "0xB7c1…05Fe", "0x52aE…cc83"];

const SWAP_KEY = (addr: string) => `opas:swaps:${addr.toLowerCase()}`;
const SWAP_SEEDED = (addr: string) => `opas:swaps:seeded:${addr.toLowerCase()}`;

function sid() {
  return `swp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function swapNotional(propertyId: string, shares: number) {
  return shares * fairValuePerShare(propertyId);
}

export function swapFee(propertyId: string, shares: number) {
  return swapNotional(propertyId, shares) * FEES.trade;
}

function readSwaps(address: string): SwapOffer[] {
  if (typeof window === "undefined" || !address) return [];
  try {
    const raw = window.localStorage.getItem(SWAP_KEY(address));
    if (raw) return JSON.parse(raw) as SwapOffer[];
  } catch {}
  return [];
}

function writeSwaps(address: string, s: SwapOffer[]) {
  window.localStorage.setItem(SWAP_KEY(address), JSON.stringify(s));
  notifyChanged();
}

export function getSwapOffers(address: string): SwapOffer[] {
  if (typeof window === "undefined" || !address) return [];
  const existing = readSwaps(address);
  if (window.localStorage.getItem(SWAP_SEEDED(address))) return existing;

  // Seed a few incoming requests so the holder is notified to switch assets.
  const holdings = getHoldings(address);
  const now = Date.now();
  const find = (id: string) => holdings.find((h) => h.propertyId === id);
  const seeds: SwapOffer[] = [];
  const mk = (cp: string, giveId: string, receiveId: string, receiveShares: number, ageH: number) => {
    const give = find(giveId);
    if (!give) return;
    const giveShares = Math.max(1, Math.round(give.shares / 2));
    seeds.push({
      id: sid(),
      direction: "incoming",
      counterparty: cp,
      giveId,
      giveShares,
      receiveId,
      receiveShares,
      feeUsd: swapFee(giveId, giveShares),
      status: "pending",
      createdAt: now - ageH * 3_600_000,
    });
  };
  mk("0x7F3a…b2E1", "car-2", "yacht-1", 6, 5);
  mk("0xC19d…84Aa", "ldn-1", "par-3", 14, 20);
  mk("0x2bE7…F0c4", "jet-4", "nyc-1", 12, 41);

  const merged = [...seeds, ...existing];
  writeSwaps(address, merged);
  window.localStorage.setItem(SWAP_SEEDED(address), "1");
  return merged;
}

function addShares(address: string, propertyId: string, shares: number, costUsd: number) {
  const h = getHoldings(address);
  const existing = h.find((x) => x.propertyId === propertyId);
  const next: Holding[] = existing
    ? h.map((x) => x.propertyId === propertyId ? { ...x, shares: x.shares + shares, costBasisUsd: x.costBasisUsd + costUsd } : x)
    : [...h, {
        propertyId,
        cityId: lookupProperty(propertyId)?.city ?? "",
        shares,
        acquiredAt: Date.now(),
        costBasisUsd: costUsd,
      }];
  setHoldings(address, next);
}

// Removes shares and the proportional slice of cost basis. Returns the basis
// removed (so callers can carry it forward), or null if the holding is short.
function removeShares(address: string, propertyId: string, shares: number): number | null {
  const h = getHoldings(address);
  const existing = h.find((x) => x.propertyId === propertyId);
  if (!existing || existing.shares < shares) return null;
  const basisRemoved = existing.shares > 0 ? existing.costBasisUsd * (shares / existing.shares) : 0;
  const next = h
    .map((x) => x.propertyId === propertyId ? { ...x, shares: x.shares - shares, costBasisUsd: x.costBasisUsd - basisRemoved } : x)
    .filter((x) => x.shares > 0);
  setHoldings(address, next);
  return basisRemoved;
}

export function createSwapOffer(
  address: string,
  giveId: string,
  giveShares: number,
  receiveId: string,
  receiveShares: number,
): { ok: boolean; reason?: string; offers?: SwapOffer[] } {
  if (!address) return { ok: false, reason: "Connect a wallet first." };
  if (giveId === receiveId) return { ok: false, reason: "Choose a different asset to receive." };
  if (giveShares <= 0 || receiveShares <= 0) return { ok: false, reason: "Share amounts must be positive." };
  const held = getHoldings(address).find((h) => h.propertyId === giveId);
  if (!held) return { ok: false, reason: "You don't hold that asset." };
  if (giveShares > held.shares) return { ok: false, reason: `You only hold ${held.shares} shares.` };

  const basis = removeShares(address, giveId, giveShares); // escrow offered shares
  if (basis === null) return { ok: false, reason: "You no longer hold enough shares." };

  const offer: SwapOffer = {
    id: sid(),
    direction: "outgoing",
    counterparty: "Awaiting counterparty…",
    giveId, giveShares, receiveId, receiveShares,
    feeUsd: swapFee(giveId, giveShares),
    escrowBasisUsd: basis,
    status: "pending",
    createdAt: Date.now(),
  };
  const next = [offer, ...readSwaps(address)];
  writeSwaps(address, next);
  logActivity(address, {
    kind: "swap", propertyId: giveId, shares: giveShares, usd: swapNotional(giveId, giveShares),
    note: `Swap offered for ${lookupProperty(receiveId)?.prop.token ?? receiveId}`,
  });
  return { ok: true, offers: next };
}

export function respondSwapOffer(
  address: string,
  id: string,
  action: "accept" | "decline",
): { ok: boolean; reason?: string; offers?: SwapOffer[] } {
  const all = readSwaps(address);
  const offer = all.find((o) => o.id === id);
  if (!offer) return { ok: false, reason: "Offer no longer exists." };
  if (offer.status !== "pending") return { ok: false, reason: "Offer already settled." };

  if (action === "decline") {
    const next = all.map((o) => o.id === id ? { ...o, status: "declined" as SwapStatus } : o);
    writeSwaps(address, next);
    return { ok: true, offers: next };
  }

  // accept (incoming): give up giveId, receive receiveId — swaps are free.
  const basisRemoved = removeShares(address, offer.giveId, offer.giveShares);
  if (basisRemoved === null) return { ok: false, reason: "You no longer hold the shares for this swap." };
  // Like-kind exchange: carry the given position's basis into the received
  // asset. Swaps are free, so no fee is added even for legacy offers that
  // stored a non-zero feeUsd before the fee was removed.
  addShares(address, offer.receiveId, offer.receiveShares, basisRemoved);
  const next = all.map((o) => o.id === id ? { ...o, status: "accepted" as SwapStatus } : o);
  writeSwaps(address, next);
  logActivity(address, {
    kind: "swap", propertyId: offer.receiveId, shares: offer.receiveShares, usd: swapNotional(offer.receiveId, offer.receiveShares),
    note: `Swapped ${lookupProperty(offer.giveId)?.prop.token ?? offer.giveId} → ${lookupProperty(offer.receiveId)?.prop.token ?? offer.receiveId} · no swap fee`,
  });
  return { ok: true, offers: next };
}

export function cancelSwapOffer(
  address: string,
  id: string,
): { ok: boolean; reason?: string; offers?: SwapOffer[] } {
  const all = readSwaps(address);
  const offer = all.find((o) => o.id === id);
  if (!offer) return { ok: false, reason: "Offer no longer exists." };
  if (offer.direction !== "outgoing" || offer.status !== "pending")
    return { ok: false, reason: "Only your own pending offers can be cancelled." };
  // Return escrowed shares at their original cost basis.
  addShares(address, offer.giveId, offer.giveShares, offer.escrowBasisUsd ?? swapNotional(offer.giveId, offer.giveShares));
  const next = all.map((o) => o.id === id ? { ...o, status: "cancelled" as SwapStatus } : o);
  writeSwaps(address, next);
  logActivity(address, {
    kind: "swap", propertyId: offer.giveId, shares: offer.giveShares,
    note: "Swap offer cancelled · shares returned",
  });
  return { ok: true, offers: next };
}

// Simulated order-book fill: a counterparty accepts the user's outgoing offer.
// The escrowed asset is gone; the requested asset is credited, carrying the
// escrowed basis (swaps are free, so no fee is added).
export function settleOutgoingSwap(
  address: string,
  id: string,
): { ok: boolean; reason?: string; offers?: SwapOffer[] } {
  const all = readSwaps(address);
  const offer = all.find((o) => o.id === id);
  if (!offer || offer.direction !== "outgoing" || offer.status !== "pending")
    return { ok: false, reason: "Offer not settleable." };
  // Swaps are free — ignore any legacy stored feeUsd in the basis carryover.
  const carriedBasis = offer.escrowBasisUsd ?? swapNotional(offer.giveId, offer.giveShares);
  addShares(address, offer.receiveId, offer.receiveShares, carriedBasis);
  const taker = SIM_TAKERS[Math.floor(Math.random() * SIM_TAKERS.length)];
  const next = all.map((o) => o.id === id ? { ...o, status: "accepted" as SwapStatus, counterparty: taker } : o);
  writeSwaps(address, next);
  logActivity(address, {
    kind: "swap", propertyId: offer.receiveId, shares: offer.receiveShares, usd: swapNotional(offer.receiveId, offer.receiveShares),
    note: `Swap filled by ${taker} · ${lookupProperty(offer.giveId)?.prop.token ?? offer.giveId} → ${lookupProperty(offer.receiveId)?.prop.token ?? offer.receiveId} · no swap fee`,
  });
  return { ok: true, offers: next };
}

// Simulated arrival: a counterparty proposes a swap on an asset the wallet
// holds, offering one of their own in exchange. Fires the change signal via
// writeSwaps so the navbar bell and Marketplace inbox light up the moment the
// proposal lands. Returns the updated offers, or null when the wallet holds
// nothing to swap.
export function simulateIncomingSwap(address: string): SwapOffer[] | null {
  if (!address) return null;
  const holdings = getHoldings(address);
  if (holdings.length === 0) return null;
  const give = holdings[Math.floor(Math.random() * holdings.length)];
  const candidates = Array.from(ASSET_INDEX.keys()).filter((id) => id !== give.propertyId);
  if (candidates.length === 0) return null;
  const receiveId = candidates[Math.floor(Math.random() * candidates.length)];
  const giveShares = Math.max(1, Math.round(give.shares * (0.3 + Math.random() * 0.5)));
  const receiveShares = Math.max(1, Math.round(giveShares * (0.6 + Math.random() * 0.8)));
  const offer: SwapOffer = {
    id: sid(),
    direction: "incoming",
    counterparty: SIM_TAKERS[Math.floor(Math.random() * SIM_TAKERS.length)],
    giveId: give.propertyId,
    giveShares,
    receiveId,
    receiveShares,
    feeUsd: 0,
    status: "pending",
    createdAt: Date.now(),
  };
  const next = [offer, ...readSwaps(address)];
  writeSwaps(address, next);
  return next;
}

// ─────────────────────────────────────────────────────────────
// Bids — buy-side offers priced within ±2% of an asset's fair value
//   A holder/investor names a price per share they're willing to pay; the
//   platform only accepts bids inside a tight ±2% band around fair value so
//   quotes stay anchored to the real valuation. A simulated seller from the
//   open order book fills the bid, charging the standard 7% buy fee.
// ─────────────────────────────────────────────────────────────

export const BID_VARIANCE = 0.02; // ±2% around fair value per share

export type BidStatus = "pending" | "filled" | "cancelled";

export type Bid = {
  id: string;
  propertyId: string;
  bidder: string;        // wallet address (lowercased)
  shares: number;
  bidPerShare: number;   // USD — constrained to fairValue ± 2%
  status: BidStatus;
  counterparty?: string; // simulated seller, set on fill
  createdAt: number;
};

// Allowed bid band: fair value per share ± BID_VARIANCE.
export function bidBounds(propertyId: string) {
  const fair = fairValuePerShare(propertyId);
  return {
    fair,
    min: fair * (1 - BID_VARIANCE),
    max: fair * (1 + BID_VARIANCE),
  };
}

// Single source of truth for what a valid bid is. Used at creation AND at
// settlement so a tampered localStorage bid (out-of-band price, NaN/Infinity,
// non-positive) can never be filled. Returns null when valid, else a reason.
const BID_EPS = 0.005;
function validateBid(
  propertyId: string,
  shares: number,
  bidPerShare: number,
): string | null {
  if (!lookupProperty(propertyId)) return "Unknown asset.";
  if (!Number.isFinite(shares) || shares <= 0) return "Shares must be greater than zero.";
  if (!Number.isFinite(bidPerShare) || bidPerShare <= 0) return "Bid price must be positive.";
  const { min, max } = bidBounds(propertyId);
  if (bidPerShare < min - BID_EPS || bidPerShare > max + BID_EPS) {
    return `Bid must be within ±2% of fair value (${fmtUsdCompact(min)}–${fmtUsdCompact(max)}/share).`;
  }
  return null;
}

const BID_KEY = (addr: string) => `opas:bids:${addr.toLowerCase()}`;

function bidId() {
  return `bid_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function readBids(address: string): Bid[] {
  if (typeof window === "undefined" || !address) return [];
  try {
    const raw = window.localStorage.getItem(BID_KEY(address));
    if (raw) return JSON.parse(raw) as Bid[];
  } catch {}
  return [];
}

function writeBids(address: string, b: Bid[]) {
  window.localStorage.setItem(BID_KEY(address), JSON.stringify(b));
}

export function getBids(address: string): Bid[] {
  return readBids(address);
}

export function createBid(
  address: string,
  propertyId: string,
  shares: number,
  bidPerShare: number,
): { ok: boolean; reason?: string; bids?: Bid[] } {
  if (!address) return { ok: false, reason: "Connect a wallet first." };
  const invalid = validateBid(propertyId, shares, bidPerShare);
  if (invalid) return { ok: false, reason: invalid };

  const bid: Bid = {
    id: bidId(),
    propertyId,
    bidder: address.toLowerCase(),
    shares,
    bidPerShare,
    status: "pending",
    createdAt: Date.now(),
  };
  const next = [bid, ...readBids(address)];
  writeBids(address, next);
  logActivity(address, {
    kind: "bid", propertyId, shares, usd: shares * bidPerShare,
    note: `Bid placed @ ${fmtUsdCompact(bidPerShare)}/share · within ±2% of fair`,
  });
  return { ok: true, bids: next };
}

export function cancelBid(address: string, id: string): Bid[] {
  const all = readBids(address);
  const target = all.find((b) => b.id === id);
  // No cash/shares are escrowed for a bid, so cancelling is a pure status flip.
  const next = all.map((b) => b.id === id ? { ...b, status: "cancelled" as BidStatus } : b);
  writeBids(address, next);
  if (target && target.status === "pending") {
    logActivity(address, {
      kind: "cancel", propertyId: target.propertyId, shares: target.shares,
      note: "Bid withdrawn",
    });
  }
  return next;
}

// Simulated order-book fill: a seller accepts the user's bid. The buyer is
// credited the shares at the bid price plus the standard 7% buy fee (cost basis
// = bid total incl. fee, mirroring buyListing).
export function settleBid(
  address: string,
  id: string,
): { ok: boolean; reason?: string; bids?: Bid[] } {
  const all = readBids(address);
  const bid = all.find((b) => b.id === id);
  if (!bid || bid.status !== "pending") return { ok: false, reason: "Bid not fillable." };
  // Re-validate against the live ±2% band before crediting shares — a tampered
  // localStorage bid (out-of-band price, NaN) must never settle.
  if (validateBid(bid.propertyId, bid.shares, bid.bidPerShare)) {
    return { ok: false, reason: "Bid is no longer within the ±2% band." };
  }

  const cost = bid.shares * bid.bidPerShare;
  const fee = cost * FEES.buySell;
  const total = cost + fee;
  addShares(address, bid.propertyId, bid.shares, total);

  const seller = SIM_TAKERS[Math.floor(Math.random() * SIM_TAKERS.length)];
  const next = all.map((b) => b.id === id ? { ...b, status: "filled" as BidStatus, counterparty: seller } : b);
  writeBids(address, next);
  logActivity(address, {
    kind: "buy", propertyId: bid.propertyId, shares: bid.shares, usd: total,
    note: `Bid filled by ${seller} @ ${fmtUsdCompact(bid.bidPerShare)}/share · incl. 7% fee ${fmtUsdCompact(fee)}`,
  });
  return { ok: true, bids: next };
}

// ─────────────────────────────────────────────────────────────
// Interest inbox — buyers signalling interest in YOUR listings.
//   A buyer can Bid, Express interest (no price) or propose a Swap on a
//   listing. The listing owner is notified via this per-wallet inbox.
//   This is the seller-side mirror of bids/swaps: messages here are interest
//   RECEIVED on the current wallet's own listings (simulated counterparties).
// ─────────────────────────────────────────────────────────────

export type InterestKind = "bid" | "interest" | "swap";

export type InterestMessage = {
  id: string;
  propertyId: string;        // the listed asset a buyer is interested in
  listingId?: string;
  kind: InterestKind;
  from: string;              // short counterparty label
  shares?: number;           // bid / swap quantity
  perShare?: number;         // bid price
  swapForId?: string;        // swap: asset the buyer would give
  swapForShares?: number;
  note: string;
  createdAt: number;
  read: boolean;
};

const INTEREST_BUYERS = ["0x6Ad2…91Cf", "0xE4b8…2207", "0x1c97…aB3e", "0x9F50…6d14", "0x83Ce…77Da"];

const INT_KEY = (addr: string) => `opas:interest:${addr.toLowerCase()}`;
const INT_SEEDED = (addr: string) => `opas:interest:seeded:${addr.toLowerCase()}`;

function intId() {
  return `int_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function readInterest(address: string): InterestMessage[] {
  if (typeof window === "undefined" || !address) return [];
  try {
    const raw = window.localStorage.getItem(INT_KEY(address));
    if (raw) return JSON.parse(raw) as InterestMessage[];
  } catch {}
  return [];
}

function writeInterest(address: string, m: InterestMessage[]) {
  window.localStorage.setItem(INT_KEY(address), JSON.stringify(m.slice(0, 50)));
  notifyChanged();
}

// Builds one simulated interest message for a given listing.
function buildInterest(listing: Listing): InterestMessage {
  const from = INTEREST_BUYERS[Math.floor(Math.random() * INTEREST_BUYERS.length)];
  const roll = Math.random();
  const kind: InterestKind = roll < 0.45 ? "bid" : roll < 0.75 ? "interest" : "swap";
  const token = lookupProperty(listing.propertyId)?.prop.token ?? listing.propertyId;
  const base = {
    id: intId(),
    propertyId: listing.propertyId,
    listingId: listing.id,
    from,
    createdAt: Date.now(),
    read: false,
  };
  if (kind === "bid") {
    const shares = Math.max(1, Math.round(listing.shares * (0.3 + Math.random() * 0.6)));
    const { min, max } = bidBounds(listing.propertyId);
    const perShare = Math.round((min + Math.random() * (max - min)) * 100) / 100;
    return { ...base, kind, shares, perShare, note: `Bid ${shares} × ${fmtUsdCompact(perShare)}/sh on your ${token} listing` };
  }
  if (kind === "swap") {
    const ids = Array.from(ASSET_INDEX.keys()).filter((id) => id !== listing.propertyId);
    const swapForId = ids[Math.floor(Math.random() * ids.length)];
    const swapForShares = Math.max(1, Math.round(listing.shares * (0.4 + Math.random() * 0.6)));
    const swapToken = lookupProperty(swapForId)?.prop.token ?? swapForId;
    const shares = Math.max(1, Math.round(listing.shares * (0.3 + Math.random() * 0.5)));
    return { ...base, kind, shares, swapForId, swapForShares, note: `Wants to swap ${swapForShares} × ${swapToken} for ${shares} × your ${token}` };
  }
  return { ...base, kind, note: `Expressed interest in your ${token} listing` };
}

// Reads the inbox, seeding one message per own listing the first time so a
// holder with active listings immediately sees who is interested.
export function getInterest(address: string): InterestMessage[] {
  if (typeof window === "undefined" || !address) return [];
  const existing = readInterest(address);
  if (window.localStorage.getItem(INT_SEEDED(address))) return existing;

  const own = getListings().filter((l) => l.seller === address.toLowerCase());
  const seeds = own.slice(0, 3).map((l, i) => {
    const m = buildInterest(l);
    return { ...m, createdAt: Date.now() - (i + 1) * 47 * 60 * 1000 };
  });
  const merged = [...seeds, ...existing];
  writeInterest(address, merged);
  window.localStorage.setItem(INT_SEEDED(address), "1");
  return merged;
}

// Simulated arrival: a buyer signals interest in one of the wallet's own
// listings. Returns the updated inbox, or null when there are no own listings.
export function simulateIncomingInterest(address: string): InterestMessage[] | null {
  if (!address) return null;
  const own = getListings().filter((l) => l.seller === address.toLowerCase());
  if (own.length === 0) return null;
  const listing = own[Math.floor(Math.random() * own.length)];
  const next = [buildInterest(listing), ...readInterest(address)];
  writeInterest(address, next);
  return next;
}

export function markInterestRead(address: string, id: string): InterestMessage[] {
  const next = readInterest(address).map((m) => m.id === id ? { ...m, read: true } : m);
  writeInterest(address, next);
  return next;
}

export function markAllInterestRead(address: string): InterestMessage[] {
  const next = readInterest(address).map((m) => ({ ...m, read: true }));
  writeInterest(address, next);
  return next;
}

export function dismissInterest(address: string, id: string): InterestMessage[] {
  const next = readInterest(address).filter((m) => m.id !== id);
  writeInterest(address, next);
  return next;
}

export function unreadInterestCount(messages: InterestMessage[]): number {
  return messages.reduce((n, m) => n + (m.read ? 0 : 1), 0);
}

// Buyer-side: signal interest in someone else's listing. There is no price and
// nothing is escrowed — it just pings the listing owner. Records a buyer-side
// activity entry so the action shows in the user's own ledger.
export function expressInterest(
  buyer: string,
  listing: Listing,
): { ok: boolean; reason?: string } {
  if (!buyer) return { ok: false, reason: "Connect a wallet first." };
  if (listing.seller === buyer.toLowerCase()) return { ok: false, reason: "This is your own listing." };
  const token = lookupProperty(listing.propertyId)?.prop.token ?? listing.propertyId;
  logActivity(buyer, {
    kind: "bid", propertyId: listing.propertyId, shares: listing.shares,
    note: `Expressed interest in ${token} · owner notified`,
  });
  return { ok: true };
}

// ─────────────────────────────────────────────────────────────
// Unified notification feed — a single attention inbox aggregating
// everything that needs the holder's eyes:
//   • interest on their own listings (bid / express / swap)   — interest store
//   • incoming swap offers on assets they hold                — swap store
// Backs the global navbar bell AND the Marketplace inbox so the same
// notifications surface everywhere. Incoming swap offers are seeded by
// default, so a swap notification is visible immediately on first load.
// ─────────────────────────────────────────────────────────────

export type AppNotification = {
  id: string;
  kind: InterestKind;            // "bid" | "interest" | "swap"
  source: "interest" | "swap";   // originating store
  from: string;                  // short counterparty label
  note: string;
  createdAt: number;
  read: boolean;
  href: string;                  // route to act on it
};

// Lightweight cross-component change signal. Any mutation to the interest or
// swap store fires this so the navbar bell and inbox refresh live.
export function notifyChanged() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("opas:notify"));
}

const SWAP_READ_KEY = (addr: string) => `opas:swapread:${addr.toLowerCase()}`;

function readSwapReadSet(address: string): Set<string> {
  if (typeof window === "undefined" || !address) return new Set();
  try {
    const raw = window.localStorage.getItem(SWAP_READ_KEY(address));
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch {}
  return new Set();
}

function writeSwapReadSet(address: string, set: Set<string>) {
  window.localStorage.setItem(SWAP_READ_KEY(address), JSON.stringify([...set]));
}

// An incoming offer: the counterparty wants YOUR giveId, offering their receiveId.
function swapOfferNote(o: SwapOffer): string {
  const giveToken = lookupProperty(o.giveId)?.prop.token ?? o.giveId;
  const recvToken = lookupProperty(o.receiveId)?.prop.token ?? o.receiveId;
  return `Wants ${o.giveShares} × your ${giveToken} for ${o.receiveShares} × ${recvToken}`;
}

export function getNotifications(address: string): AppNotification[] {
  if (typeof window === "undefined" || !address) return [];
  const interest: AppNotification[] = getInterest(address).map((m) => ({
    id: m.id,
    kind: m.kind,
    source: "interest" as const,
    from: m.from,
    note: m.note,
    createdAt: m.createdAt,
    read: m.read,
    href: "/marketplace",
  }));
  const readSet = readSwapReadSet(address);
  const swaps: AppNotification[] = getSwapOffers(address)
    .filter((o) => o.direction === "incoming" && o.status === "pending")
    .map((o) => ({
      id: o.id,
      kind: "swap" as const,
      source: "swap" as const,
      from: o.counterparty,
      note: swapOfferNote(o),
      createdAt: o.createdAt,
      read: readSet.has(o.id),
      href: "/portfolio",
    }));
  return [...interest, ...swaps].sort((a, b) => b.createdAt - a.createdAt);
}

export function unreadNotificationCount(address: string): number {
  return getNotifications(address).reduce((n, x) => n + (x.read ? 0 : 1), 0);
}

export function markNotificationRead(address: string, n: AppNotification): void {
  if (n.source === "interest") {
    markInterestRead(address, n.id);
  } else {
    const set = readSwapReadSet(address);
    set.add(n.id);
    writeSwapReadSet(address, set);
    notifyChanged();
  }
}

export function markAllNotificationsRead(address: string): void {
  markAllInterestRead(address);
  const set = readSwapReadSet(address);
  getSwapOffers(address)
    .filter((o) => o.direction === "incoming" && o.status === "pending")
    .forEach((o) => set.add(o.id));
  writeSwapReadSet(address, set);
  notifyChanged();
}

// Dismiss removes an interest message; a real pending swap offer can't be
// deleted from the feed (it lives in the swap book) so we just mark it read.
export function dismissNotification(address: string, n: AppNotification): void {
  if (n.source === "interest") dismissInterest(address, n.id);
  else markNotificationRead(address, n);
}
