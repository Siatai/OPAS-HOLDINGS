import { CITIES, type Property } from "@/data/cities";

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

const PROP_INDEX = new Map<string, { city: string; prop: Property }>();
CITIES.forEach((c) => c.properties.forEach((p) => PROP_INDEX.set(p.id, { city: c.id, prop: p })));

export const lookupProperty = (id: string) => PROP_INDEX.get(id);

const KEY = (addr: string) => `opas:portfolio:${addr.toLowerCase()}`;
const PROP_KEY = "opas:proposals";

const SEED_HOLDINGS: Omit<Holding, "acquiredAt">[] = [
  { propertyId: "dxb-1", cityId: "dubai",   shares: 24, costBasisUsd: 3_600 },
  { propertyId: "ldn-1", cityId: "london",  shares: 12, costBasisUsd: 2_400 },
  { propertyId: "nyc-3", cityId: "new-york", shares: 18, costBasisUsd: 2_700 },
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
    id: "prop-ldn1-rent",
    propertyId: "ldn-1",
    kind: "rent_increase",
    title: "Increase monthly rent from £18,500 → £21,200",
    detail: "Market study by Savills supports a 14.6% uplift on renewal. Vacancy risk modelled at <4% based on Mayfair Q1-26 comps.",
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
  const next = all.map((p) =>
    p.id === proposalId
      ? { ...p, votes: { ...p.votes, [voter.toLowerCase()]: { choice, weight } } }
      : p,
  );
  window.localStorage.setItem(PROP_KEY, JSON.stringify(next));
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
    const meta = lookupProperty(h.propertyId);
    if (!meta) continue;
    const pricePerShare = (meta.prop.price * 1000) / TOTAL_SUPPLY * 6.66;
    const value = h.shares * pricePerShare;
    totalValue += value;
    totalCost  += h.costBasisUsd;
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

const LIST_KEY = "opas:marketplace";

const SEED_LISTINGS: Omit<Listing, "id" | "createdAt">[] = [
  { propertyId: "dxb-2", seller: "vault", shares: 8,  askPerShare: 165 },
  { propertyId: "dxb-5", seller: "vault", shares: 4,  askPerShare: 232 },
  { propertyId: "ldn-2", seller: "vault", shares: 12, askPerShare: 248 },
  { propertyId: "nyc-1", seller: "vault", shares: 18, askPerShare: 142 },
  { propertyId: "par-3", seller: "vault", shares: 22, askPerShare: 118 },
  { propertyId: "hkg-2", seller: "vault", shares: 14, askPerShare: 196 },
  { propertyId: "sgp-4", seller: "vault", shares: 10, askPerShare: 174 },
  { propertyId: "mia-1", seller: "vault", shares: 26, askPerShare: 128 },
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

  return { ok: true, listings: nextListings, holdings: nextBuyer };
}

export function fairValuePerShare(propertyId: string) {
  const meta = lookupProperty(propertyId);
  if (!meta) return 0;
  return (meta.prop.price * 1000) / TOTAL_SUPPLY * 6.66;
}
