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
