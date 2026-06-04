import { CITIES, type Property } from "@/data/cities";

// New asset-class imagery (generated luxury pool)
import carHyper from "@/assets/images/assets/car_hyper.png";
import carFerrari from "@/assets/images/assets/car_ferrari.png";
import carLambo from "@/assets/images/assets/car_lambo.png";
import carRolls from "@/assets/images/assets/car_rolls.png";
import yachtSuper from "@/assets/images/assets/yacht_super.png";
import yachtRiva from "@/assets/images/assets/yacht_riva.png";
import yachtMarina from "@/assets/images/assets/yacht_marina.png";
import yachtMega from "@/assets/images/assets/yacht_mega.png";
import jetGulfstream from "@/assets/images/assets/jet_gulfstream.png";
import jetSky from "@/assets/images/assets/jet_sky.png";
import jetHangar from "@/assets/images/assets/jet_hangar.png";
import jetCabin from "@/assets/images/assets/jet_cabin.png";

export type AssetCategory = "real-estate" | "supercars" | "yachts" | "jets";

// Asset is a superset of the existing real-estate Property so every existing
// consumer (lookupProperty, portfolioStats, cards) keeps working unchanged.
export type Asset = Property & {
  category: AssetCategory;
  cityId?: string; // only set for real-estate (drives /city/:id route)
  subtitle: string; // location / marque / builder line under the title
  spec?: string; // short headline spec (engine, length, range)
};

export type CategoryMeta = {
  id: AssetCategory;
  label: string; // "Real Estate"
  singular: string; // "Property"
  icon: "Building2" | "Car" | "Ship" | "Plane"; // lucide name, resolved in UI
  accent: string; // hex accent for the segment
  rentalNoun: string; // "Rent" | "Charter"
  blurb: string;
  metric: string; // small label describing the income stream
};

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "real-estate",
    label: "Real Estate",
    singular: "Property",
    icon: "Building2",
    accent: "#EA8D0E",
    rentalNoun: "Rent",
    blurb: "Prime residences across eight global gateway cities.",
    metric: "Net rental yield",
  },
  {
    id: "supercars",
    label: "Supercars",
    singular: "Supercar",
    icon: "Car",
    accent: "#F59E0B",
    rentalNoun: "Charter",
    blurb: "Hypercars & collectibles earning daily charter income.",
    metric: "Charter yield",
  },
  {
    id: "yachts",
    label: "Yachts",
    singular: "Yacht",
    icon: "Ship",
    accent: "#0BB5BE",
    rentalNoun: "Charter",
    blurb: "Superyachts chartered across the Med & Caribbean.",
    metric: "Charter yield",
  },
  {
    id: "jets",
    label: "Private Jets",
    singular: "Jet",
    icon: "Plane",
    accent: "#22D3EE",
    rentalNoun: "Charter",
    blurb: "Long-range jets on managed charter programmes.",
    metric: "Charter yield",
  },
];

export const getCategory = (id: AssetCategory): CategoryMeta =>
  CATEGORIES.find((c) => c.id === id)!;

const cycle = <T,>(pool: T[], i: number) => pool[i % pool.length];

function carProfile(title: string, idx: number) {
  const vaults = [
    "OPAS Geneva Freeport vault, Switzerland",
    "OPAS Monaco collector storage, Monaco",
    "OPAS Mayfair collector suite, London",
    "OPAS DIFC collector vault, Dubai",
  ];
  const years = ["2022", "2023", "2024", "2025"];
  const colors = ["Nero Noctis over Cuoio", "Blu Tour de France over Sabbia", "Arancio Atlas over Nero", "Gunmetal over Mandarin"];
  return {
    address: vaults[idx % vaults.length],
    location: vaults[idx % vaults.length],
    area: "Climate-controlled collector storage",
    sourceNote: "Manufacturer specifications and market positioning from official marque releases",
    highlights: ["Managed concierge storage", "Collector-grade documentation", "Event and charter allocation ready"],
    facts: [
      { label: "Model year", value: years[idx % years.length] },
      { label: "Storage", value: vaults[idx % vaults.length] },
      { label: "Spec finish", value: colors[idx % colors.length] },
      { label: "Use case", value: "Collector reserve / curated access" },
    ],
  };
}

function yachtProfile(title: string, idx: number) {
  const berths = [
    "Port Hercule, Monaco",
    "Porto Cervo Marina, Sardinia",
    "Dubai Harbour Marina, Dubai",
    "Port de Saint-Tropez, France",
  ];
  const seasons = ["Med summer circuit", "Monaco Grand Prix week", "Cannes / Antibes charter season", "Winter Gulf program"];
  return {
    address: berths[idx % berths.length],
    location: berths[idx % berths.length],
    area: "Full-service berth and crew management",
    sourceNote: "Builder specifications and charter profile aligned to official yard data",
    highlights: ["Managed charter calendar", "Crewed operations", "Premium marina positioning"],
    facts: [
      { label: "Home berth", value: berths[idx % berths.length] },
      { label: "Program", value: seasons[idx % seasons.length] },
      { label: "Crew", value: `${5 + idx} professional crew` },
      { label: "Use case", value: "Charter income / owner weeks" },
    ],
  };
}

function jetProfile(title: string, idx: number) {
  const bases = [
    "Farnborough Airport, UK",
    "DWC Al Maktoum, Dubai",
    "Le Bourget Airport, Paris",
    "Teterboro Airport, New Jersey",
  ];
  const cabins = ["4 living zones", "4-zone flagship cabin", "3-zone executive cabin", "Forward galley + aft stateroom"];
  return {
    address: bases[idx % bases.length],
    location: bases[idx % bases.length],
    area: "Managed hangar and dispatch operations",
    sourceNote: "Range and cabin figures aligned to official OEM program data",
    highlights: ["Managed charter dispatch", "Signature FBO handling", "Long-range executive routing"],
    facts: [
      { label: "Home base", value: bases[idx % bases.length] },
      { label: "Cabin plan", value: cabins[idx % cabins.length] },
      { label: "Program", value: "Managed charter / owner block hours" },
      { label: "Use case", value: "Intercontinental executive lift" },
    ],
  };
}

// ── Real estate (flattened from cities.ts) ──────────────────────────────
const realEstate: Asset[] = CITIES.flatMap((c) =>
  c.properties.map((p) => ({
    ...p,
    category: "real-estate" as const,
    cityId: c.id,
    subtitle: `${c.name}, ${c.country}`,
  })),
);

// ── Supercars ───────────────────────────────────────────────────────────
const CAR_POOL = [carHyper, carFerrari, carLambo, carRolls];
type RawAsset = Omit<Asset, "image" | "category" | "subtitle"> & { subtitle: string };

const cars: Asset[] = (
  [
    { id: "car-1", title: "Bugatti Chiron Profilée", token: "OPA-CAR-01", price: 95,  available: 14, rentalYield: "11.2%", capitalGrowth: "+18.5%", totalRoi: "~29.7%", tier: "Hyper",     subtitle: "Molsheim · 1 of 1", spec: "1500 hp · W16" },
    { id: "car-2", title: "Ferrari LaFerrari Aperta", token: "OPA-CAR-02", price: 120, available: 6,  rentalYield: "12.6%", capitalGrowth: "+22.4%", totalRoi: "~35.0%", tier: "Hyper",     subtitle: "Maranello · Limited", spec: "963 hp · V12 hybrid" },
    { id: "car-3", title: "Lamborghini Revuelto",     token: "OPA-CAR-03", price: 70,  available: 22, rentalYield: "10.4%", capitalGrowth: "+9.8%",  totalRoi: "~20.2%", tier: "Flagship",  subtitle: "Sant'Agata · Flagship", spec: "1001 hp · V12" },
    { id: "car-4", title: "Pagani Utopia",            token: "OPA-CAR-04", price: 110, available: 4,  rentalYield: "9.8%",  capitalGrowth: "+16.2%", totalRoi: "~26.0%", tier: "Hyper",     subtitle: "Modena · Bespoke", spec: "852 hp · V12" },
    { id: "car-5", title: "Rolls-Royce Spectre",      token: "OPA-CAR-05", price: 85,  available: 18, rentalYield: "8.6%",  capitalGrowth: "+6.4%",  totalRoi: "~15.0%", tier: "Grand",     subtitle: "Goodwood · Coachbuilt", spec: "577 hp · Electric" },
    { id: "car-6", title: "Koenigsegg Jesko",         token: "OPA-CAR-06", price: 135, available: 3,  rentalYield: "10.1%", capitalGrowth: "+19.6%", totalRoi: "~29.7%", tier: "Hyper",     subtitle: "Ängelholm · 1 of 125", spec: "1600 hp · V8" },
  ] as RawAsset[]
).map((r, i) => ({ ...r, ...carProfile(r.title, i), category: "supercars" as const, image: cycle(CAR_POOL, i) }));

// ── Yachts ──────────────────────────────────────────────────────────────
const YACHT_POOL = [yachtSuper, yachtRiva, yachtMarina, yachtMega];
const yachts: Asset[] = (
  [
    { id: "yacht-1", title: "Benetti Oasis 40M",    token: "OPA-YHT-01", price: 240, available: 9,  rentalYield: "9.4%",  capitalGrowth: "+3.8%", totalRoi: "~13.2%", tier: "Superyacht", subtitle: "Livorno · Tri-deck", spec: "40m · 10 guests" },
    { id: "yacht-2", title: "Sunseeker 90 Ocean",   token: "OPA-YHT-02", price: 180, available: 14, rentalYield: "10.2%", capitalGrowth: "+2.6%", totalRoi: "~12.8%", tier: "Flybridge",  subtitle: "Poole · Flybridge", spec: "27m · 8 guests" },
    { id: "yacht-3", title: "Riva 76 Perseo Super", token: "OPA-YHT-03", price: 150, available: 20, rentalYield: "11.0%", capitalGrowth: "+2.1%", totalRoi: "~13.1%", tier: "Sport",      subtitle: "Sarnico · Open", spec: "23m · 6 guests" },
    { id: "yacht-4", title: "Feadship Symphony",    token: "OPA-YHT-04", price: 360, available: 3,  rentalYield: "8.2%",  capitalGrowth: "+4.4%", totalRoi: "~12.6%", tier: "Mega",       subtitle: "Aalsmeer · Custom", spec: "101m · 16 guests" },
    { id: "yacht-5", title: "Azimut Grande 35M",    token: "OPA-YHT-05", price: 210, available: 7,  rentalYield: "9.0%",  capitalGrowth: "+3.2%", totalRoi: "~12.2%", tier: "Superyacht", subtitle: "Viareggio · Tri-deck", spec: "35m · 12 guests" },
  ] as RawAsset[]
).map((r, i) => ({ ...r, ...yachtProfile(r.title, i), category: "yachts" as const, image: cycle(YACHT_POOL, i) }));

// ── Private jets ──────────────────────────────────────────────────────────
const JET_POOL = [jetGulfstream, jetSky, jetHangar, jetCabin];
const jets: Asset[] = (
  [
    { id: "jet-1", title: "Gulfstream G700",            token: "OPA-JET-01", price: 320, available: 8,  rentalYield: "8.8%",  capitalGrowth: "+2.4%", totalRoi: "~11.2%", tier: "Ultra-long", subtitle: "Savannah · Flagship", spec: "7500 nm · 19 pax" },
    { id: "jet-2", title: "Bombardier Global 7500",     token: "OPA-JET-02", price: 300, available: 11, rentalYield: "9.2%",  capitalGrowth: "+2.0%", totalRoi: "~11.2%", tier: "Ultra-long", subtitle: "Montréal · Flagship", spec: "7700 nm · 17 pax" },
    { id: "jet-3", title: "Dassault Falcon 8X",         token: "OPA-JET-03", price: 220, available: 16, rentalYield: "9.6%",  capitalGrowth: "+1.8%", totalRoi: "~11.4%", tier: "Heavy",      subtitle: "Bordeaux · Tri-jet", spec: "6450 nm · 16 pax" },
    { id: "jet-4", title: "Embraer Praetor 600",        token: "OPA-JET-04", price: 160, available: 24, rentalYield: "10.4%", capitalGrowth: "+1.6%", totalRoi: "~12.0%", tier: "Super-mid",  subtitle: "São José · Super-mid", spec: "4018 nm · 12 pax" },
    { id: "jet-5", title: "Cessna Citation Longitude",  token: "OPA-JET-05", price: 140, available: 19, rentalYield: "10.8%", capitalGrowth: "+1.4%", totalRoi: "~12.2%", tier: "Super-mid",  subtitle: "Wichita · Super-mid", spec: "3500 nm · 12 pax" },
  ] as RawAsset[]
).map((r, i) => ({ ...r, ...jetProfile(r.title, i), category: "jets" as const, image: cycle(JET_POOL, i) }));

// ── Unified catalog ───────────────────────────────────────────────────────
export const ASSETS: Asset[] = [...realEstate, ...cars, ...yachts, ...jets];

export const ASSET_INDEX = new Map<string, { city: string; prop: Asset }>();
ASSETS.forEach((a) => ASSET_INDEX.set(a.id, { city: a.cityId ?? "", prop: a }));

export const assetsByCategory = (cat: AssetCategory): Asset[] =>
  ASSETS.filter((a) => a.category === cat);

export const categoryOf = (id: string): AssetCategory | undefined =>
  ASSET_INDEX.get(id)?.prop.category;
