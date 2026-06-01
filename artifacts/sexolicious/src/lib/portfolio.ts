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
    detail: "Off-market bid received from Knight Frank private client (35% premium to last valuation). Proceeds distributed pro-rata in USDC within 14 days.",
  },
  {
    id: "prop-car2-sell",
    propertyId: "car-2",
    kind: "sell",
    title: "Accept $4.2M collector bid on LaFerrari Aperta",
    detail: "RM Sotheby's private treaty offer at a 26% premium to last appraisal. Settlement in USDC, proceeds distributed pro-rata to token holders within 10 days.",
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
// Secondary market
// ─────────────────────────────────────────────────────────────

export type Listing = {
  id: string;
  propertyId: string;
  seller: string;          // wallet address (lowercased) — "vault" for synthetic liquidity
  shares: number;
  askPerShare: number;     // USD
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

  // Escrow: remove from holdings
  const next = holdings
    .map((x) => x.propertyId === propertyId ? { ...x, shares: x.shares - shares } : x)
    .filter((x) => x.shares > 0);
  setHoldings(seller, next);

  const all = getListings();
  const created: Listing = {
    id: rid(),
    propertyId,
    seller: seller.toLowerCase(),
    shares,
    askPerShare,
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
    const next = existing
      ? holdings.map((h) => h.propertyId === target.propertyId ? { ...h, shares: h.shares + target.shares } : h)
      : [...holdings, {
          propertyId: target.propertyId,
          cityId: lookupProperty(target.propertyId)?.city ?? "",
          shares: target.shares,
          acquiredAt: Date.now(),
          costBasisUsd: target.shares * target.askPerShare,
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

  // Credit buyer
  const buyerHoldings = getHoldings(buyer);
  const cost = buyShares * listing.askPerShare;
  const existing = buyerHoldings.find((h) => h.propertyId === listing.propertyId);
  const nextBuyer: Holding[] = existing
    ? buyerHoldings.map((h) =>
        h.propertyId === listing.propertyId
          ? { ...h, shares: h.shares + buyShares, costBasisUsd: h.costBasisUsd + cost }
          : h,
      )
    : [
        ...buyerHoldings,
        {
          propertyId: listing.propertyId,
          cityId: lookupProperty(listing.propertyId)?.city ?? "",
          shares: buyShares,
          acquiredAt: Date.now(),
          costBasisUsd: cost,
        },
      ];
  setHoldings(buyer, nextBuyer);

  // Decrement / remove listing
  const remaining = listing.shares - buyShares;
  const nextListings = remaining > 0
    ? all.map((l, i) => i === idx ? { ...l, shares: remaining } : l)
    : all.filter((_, i) => i !== idx);
  saveListings(nextListings);

  logActivity(buyer, {
    kind: "buy", propertyId: listing.propertyId, shares: buyShares, usd: cost,
    note: listing.seller === "vault" ? "Filled from vault liquidity" : `Filled from ${listing.seller.slice(0, 6)}…`,
  });
  if (listing.seller !== "vault") {
    logActivity(listing.seller, {
      kind: "sell", propertyId: listing.propertyId, shares: buyShares, usd: cost,
      note: `Settled to ${buyer.slice(0, 6)}…`,
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

export type ActivityKind = "buy" | "sell" | "list" | "cancel" | "rent" | "vote";

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
      const monthly = (h.shares * fair * (parseFloat(meta.prop.rentalYield) || 0) / 100) / 12;
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
      // 3 monthly rent collections
      for (let m = 1; m <= 3; m++) {
        seeded.push({
          id: aid(),
          kind: "rent",
          propertyId: h.propertyId,
          at: now - m * 30 * day + i * day,
          usd: Math.round(monthly),
          note: `Month ${4 - m} distribution`,
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

export function rentalSummary(holdings: Holding[]) {
  let monthly = 0;
  let annual = 0;
  const perProperty: { propertyId: string; monthly: number; yield: number }[] = [];
  for (const h of holdings) {
    const meta = lookupProperty(h.propertyId);
    if (!meta) continue;
    const fair = fairValuePerShare(h.propertyId);
    const yld = parseFloat(meta.prop.rentalYield) || 0;
    const m = (h.shares * fair * (yld / 100)) / 12;
    monthly += m;
    annual += m * 12;
    perProperty.push({ propertyId: h.propertyId, monthly: m, yield: yld });
  }
  return { monthly, annual, perProperty };
}
