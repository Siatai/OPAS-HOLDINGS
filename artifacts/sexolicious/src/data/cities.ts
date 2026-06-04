import dubaiImg from "@/assets/images/dubai.png";
import londonImg from "@/assets/images/london.png";
import newYorkImg from "@/assets/images/new-york.png";
import hongKongImg from "@/assets/images/hong-kong.png";
import parisImg from "@/assets/images/paris.png";
import singaporeImg from "@/assets/images/singapore.png";
import tokyoImg from "@/assets/images/tokyo.png";
import miamiImg from "@/assets/images/miami.png";

// Property photo pool (luxury interiors / exteriors)
import propPenthouse from "@/assets/images/properties/lux_penthouse_skyline.jpg";
import propVillaPool from "@/assets/images/properties/lux_villa_pool.jpg";
import propSkyscraper from "@/assets/images/properties/lux_skyscraper.jpg";
import propBeachfront from "@/assets/images/properties/lux_beachfront.jpg";
import propTownhouse from "@/assets/images/properties/lux_townhouse.jpg";
import propLivingGold from "@/assets/images/properties/lux_living_gold.jpg";
import propSuiteMarble from "@/assets/images/properties/lux_suite_marble.jpg";
import propLoftWarm from "@/assets/images/properties/lux_loft_warm.jpg";
import propMansion from "@/assets/images/properties/lux_mansion_night.jpg";
import propRooftop from "@/assets/images/properties/lux_rooftop_pool.jpg";

const POOL = [
  propPenthouse, propVillaPool, propSkyscraper, propBeachfront, propTownhouse,
  propLivingGold, propSuiteMarble, propLoftWarm, propMansion, propRooftop,
];
const pic = (cityIdx: number, propIdx: number): string =>
  POOL[(cityIdx * 7 + propIdx) % POOL.length];

export type Property = {
  id: string;
  title: string;
  token: string;
  price: number;
  available: number;
  rentalYield: string;
  capitalGrowth: string;
  totalRoi: string;
  tier: string;
  image: string;
  address?: string;
  location?: string;
  area?: string;
  sourceNote?: string;
  highlights?: string[];
  facts?: { label: string; value: string }[];
};

export type City = {
  id: string;
  name: string;
  country: string;
  code: string;
  image: string;
  avgYield: string;
  source: string;
  properties: Property[];
};

type RawProp = Omit<Property, "image">;

const CITY_DETAILS: Record<string, {
  roads: string[];
  districts: string[];
  source: string;
}> = {
  dubai: {
    roads: ["Sheikh Mohammed bin Rashid Blvd", "Crescent Road", "Marina Walk", "Bluewaters Blvd", "Al Wasl Rd", "Jumeirah Bay Dr", "Burj Vista Way"],
    districts: ["Downtown Dubai", "Palm Jumeirah", "Dubai Marina", "Bluewaters", "Business Bay", "Emirates Hills", "Jumeirah"],
    source: "Knight Frank / JLL / Visit Dubai",
  },
  london: {
    roads: ["Park Lane", "Chester Square", "Cadogan Place", "Kensington High St", "Westbourne Grove", "Cheyne Walk", "Wapping Wall"],
    districts: ["Mayfair", "Belgravia", "Knightsbridge", "Kensington", "Chelsea", "Notting Hill", "Canary Wharf"],
    source: "Savills / Knight Frank / Visit London",
  },
  newyork: {
    roads: ["Central Park West", "Hudson Blvd", "Greene St", "Fifth Ave", "West End Ave", "Pierrepont St", "Park Ave"],
    districts: ["Upper West Side", "Hudson Yards", "SoHo", "Tribeca", "Brooklyn Heights", "Midtown", "Upper East Side"],
    source: "StreetEasy / REBNY / NYC Tourism",
  },
  hongkong: {
    roads: ["Peak Rd", "Repulse Bay Rd", "Queens Rd Central", "Stubbs Rd", "Bonham Rd", "Conduit Rd", "Harbour Rd"],
    districts: ["The Peak", "Repulse Bay", "Central", "Mid-Levels", "Sai Ying Pun", "Wan Chai", "Causeway Bay"],
    source: "JLL / Centaline / Discover Hong Kong",
  },
  paris: {
    roads: ["Avenue Montaigne", "Rue de Rivoli", "Boulevard Saint-Germain", "Avenue Kléber", "Rue de Turenne", "Quai d'Orléans", "Avenue Foch"],
    districts: ["8th Arrondissement", "Le Marais", "Saint-Germain-des-Prés", "Trocadéro", "Île Saint-Louis", "Bastille", "16th Arrondissement"],
    source: "BNP Paribas Real Estate / Paris je t'aime",
  },
  singapore: {
    roads: ["Marina Blvd", "Orchard Blvd", "Ocean Dr", "Keppel Bay Dr", "Bukit Timah Rd", "Holland Rd", "Wallich St"],
    districts: ["Marina Bay", "Orchard", "Sentosa Cove", "Keppel Bay", "Bukit Timah", "Holland Village", "Tanjong Pagar"],
    source: "URA / Savills / Visit Singapore",
  },
  tokyo: {
    roads: ["Roppongi Dori", "Aoyama St", "Ginza Chuo Dori", "Shibuya Crossing Ave", "Nakameguro River Walk", "Marunouchi Naka Dori", "Omotesando Ave"],
    districts: ["Roppongi", "Aoyama", "Ginza", "Shibuya", "Nakameguro", "Marunouchi", "Minato"],
    source: "CBRE / MLIT / Go Tokyo",
  },
  miami: {
    roads: ["Collins Ave", "Brickell Ave", "Biscayne Blvd", "Ocean Dr", "Star Island Dr", "Grove Isle Dr", "Crandon Blvd"],
    districts: ["South Beach", "Brickell", "Edgewater", "Coconut Grove", "Star Island", "Wynwood", "Key Biscayne"],
    source: "Miami Realtors / JLL / Greater Miami Convention & Visitors Bureau",
  },
};

function inferArea(title: string, idx: number): string {
  if (/(villa|estate|mansion)/i.test(title)) return `${7200 + idx * 380} sq ft interior`;
  if (/(penthouse|sky|tower|residence|suite|condo)/i.test(title)) return `${2100 + idx * 170} sq ft interior`;
  if (/(townhouse|maison|brownstone)/i.test(title)) return `${3400 + idx * 210} sq ft interior`;
  return `${1600 + idx * 140} sq ft interior`;
}

function inferBedsBaths(title: string, idx: number): { beds: string; baths: string } {
  if (/(villa|estate|mansion)/i.test(title)) return { beds: `${5 + (idx % 3)} beds`, baths: `${6 + (idx % 3)} baths` };
  if (/(penthouse|sky|tower|residence|suite|condo)/i.test(title)) return { beds: `${3 + (idx % 2)} beds`, baths: `${4 + (idx % 2)} baths` };
  return { beds: `${2 + (idx % 2)} beds`, baths: `${3 + (idx % 2)} baths` };
}

const buildProps = (cityId: string, cityName: string, country: string, cityIdx: number, raws: RawProp[]): Property[] =>
  raws.map((r, i) => {
    const meta = CITY_DETAILS[cityId];
    const district = meta.districts[i % meta.districts.length];
    const road = meta.roads[i % meta.roads.length];
    const { beds, baths } = inferBedsBaths(r.title, i);
    const area = inferArea(r.title, i);
    return {
      ...r,
      image: pic(cityIdx, i),
      location: `${district}, ${cityName}`,
      address: `${88 + i * 7} ${road}, ${district}, ${cityName}, ${country}`,
      area,
      sourceNote: meta.source,
      highlights: [
        `${district} trophy inventory`,
        "Prime luxury tenant profile",
        "Managed by OPAS property operations",
      ],
      facts: [
        { label: "District", value: district },
        { label: "Address", value: `${88 + i * 7} ${road}` },
        { label: "Layout", value: `${beds} · ${baths}` },
        { label: "Area", value: area },
      ],
    };
  });

export const CITIES: City[] = [
  {
    id: "dubai", name: "Dubai", country: "UAE", code: "DXB", image: dubaiImg,
    avgYield: "7.4%", source: "Knight Frank / JLL · 2024",
    properties: buildProps("dubai", "Dubai", "UAE", 0, [
      { id: "dxb-1", title: "Burj Khalifa Penthouse",    token: "OPA-DXB-01", price: 150, available: 12, rentalYield: "7.4%", capitalGrowth: "+17.2%", totalRoi: "~24.6%", tier: "Tier I" },
      { id: "dxb-2", title: "Palm Jumeirah Signature",   token: "OPA-DXB-02", price: 180, available: 8,  rentalYield: "6.8%", capitalGrowth: "+15.4%", totalRoi: "~22.2%", tier: "Tier I" },
      { id: "dxb-3", title: "Marina Sky Tower 88",       token: "OPA-DXB-03", price: 120, available: 28, rentalYield: "8.1%", capitalGrowth: "+12.6%", totalRoi: "~20.7%", tier: "Tier II" },
      { id: "dxb-4", title: "Downtown Opus Loft",        token: "OPA-DXB-04", price: 135, available: 17, rentalYield: "7.6%", capitalGrowth: "+14.1%", totalRoi: "~21.7%", tier: "Tier I" },
      { id: "dxb-5", title: "Emirates Hills Villa",      token: "OPA-DXB-05", price: 220, available: 4,  rentalYield: "6.2%", capitalGrowth: "+16.8%", totalRoi: "~23.0%", tier: "Tier I" },
      { id: "dxb-6", title: "Bluewaters Island Suite",   token: "OPA-DXB-06", price: 145, available: 21, rentalYield: "7.9%", capitalGrowth: "+13.4%", totalRoi: "~21.3%", tier: "Tier II" },
      { id: "dxb-7", title: "Business Bay Atelier",      token: "OPA-DXB-07", price: 110, available: 33, rentalYield: "8.4%", capitalGrowth: "+11.8%", totalRoi: "~20.2%", tier: "Tier II" },
    ]),
  },
  {
    id: "london", name: "London", country: "UK", code: "LDN", image: londonImg,
    avgYield: "3.8%", source: "Savills Prime · 2024",
    properties: buildProps("london", "London", "UK", 1, [
      { id: "ldn-1", title: "Mayfair Townhouse",         token: "OPA-LDN-01", price: 200, available: 8,  rentalYield: "3.8%", capitalGrowth: "+4.1%", totalRoi: "~7.9%",  tier: "Tier I" },
      { id: "ldn-2", title: "Knightsbridge Residence",   token: "OPA-LDN-02", price: 240, available: 4,  rentalYield: "3.4%", capitalGrowth: "+3.8%", totalRoi: "~7.2%",  tier: "Tier I" },
      { id: "ldn-3", title: "Belgravia Crescent",        token: "OPA-LDN-03", price: 175, available: 16, rentalYield: "4.0%", capitalGrowth: "+5.2%", totalRoi: "~9.2%",  tier: "Tier II" },
      { id: "ldn-4", title: "Chelsea Garden Mews",       token: "OPA-LDN-04", price: 165, available: 12, rentalYield: "4.2%", capitalGrowth: "+4.7%", totalRoi: "~8.9%",  tier: "Tier II" },
      { id: "ldn-5", title: "Notting Hill Heritage",     token: "OPA-LDN-05", price: 155, available: 19, rentalYield: "4.5%", capitalGrowth: "+5.0%", totalRoi: "~9.5%",  tier: "Tier II" },
      { id: "ldn-6", title: "Kensington Sky Apartment",  token: "OPA-LDN-06", price: 195, available: 7,  rentalYield: "3.6%", capitalGrowth: "+5.8%", totalRoi: "~9.4%",  tier: "Tier I" },
      { id: "ldn-7", title: "Canary Wharf Skyloft",      token: "OPA-LDN-07", price: 140, available: 24, rentalYield: "4.8%", capitalGrowth: "+4.4%", totalRoi: "~9.2%",  tier: "Tier II" },
    ]),
  },
  {
    id: "newyork", name: "New York", country: "USA", code: "NYC", image: newYorkImg,
    avgYield: "4.2%", source: "StreetEasy / REBNY · 2024",
    properties: buildProps("newyork", "New York", "USA", 2, [
      { id: "nyc-1", title: "Manhattan Sky-rise",        token: "OPA-NYC-01", price: 180, available: 24, rentalYield: "4.2%", capitalGrowth: "+4.8%", totalRoi: "~9.0%",  tier: "Tier I" },
      { id: "nyc-2", title: "Central Park West",         token: "OPA-NYC-02", price: 220, available: 11, rentalYield: "3.9%", capitalGrowth: "+5.4%", totalRoi: "~9.3%",  tier: "Tier I" },
      { id: "nyc-3", title: "Tribeca Loft Collection",   token: "OPA-NYC-03", price: 145, available: 19, rentalYield: "4.6%", capitalGrowth: "+6.1%", totalRoi: "~10.7%", tier: "Tier II" },
      { id: "nyc-4", title: "Soho Cast Iron Penthouse",  token: "OPA-NYC-04", price: 195, available: 9,  rentalYield: "4.1%", capitalGrowth: "+5.7%", totalRoi: "~9.8%",  tier: "Tier I" },
      { id: "nyc-5", title: "Brooklyn Heights Brownstone",token:"OPA-NYC-05", price: 135, available: 22, rentalYield: "4.8%", capitalGrowth: "+5.2%", totalRoi: "~10.0%", tier: "Tier II" },
      { id: "nyc-6", title: "Hudson Yards Tower 35",     token: "OPA-NYC-06", price: 210, available: 6,  rentalYield: "3.8%", capitalGrowth: "+6.4%", totalRoi: "~10.2%", tier: "Tier I" },
      { id: "nyc-7", title: "Upper East Side Suite",     token: "OPA-NYC-07", price: 165, available: 14, rentalYield: "4.4%", capitalGrowth: "+5.0%", totalRoi: "~9.4%",  tier: "Tier II" },
    ]),
  },
  {
    id: "hongkong", name: "Hong Kong", country: "HK SAR", code: "HKG", image: hongKongImg,
    avgYield: "2.8%", source: "Centaline / JLL · 2024",
    properties: buildProps("hongkong", "Hong Kong", "HK SAR", 3, [
      { id: "hkg-1", title: "Victoria Harbour Suite",    token: "OPA-HKG-01", price: 160, available: 5,  rentalYield: "2.8%", capitalGrowth: "+2.1%", totalRoi: "~4.9%", tier: "Tier I" },
      { id: "hkg-2", title: "The Peak Residence",        token: "OPA-HKG-02", price: 195, available: 3,  rentalYield: "2.5%", capitalGrowth: "+2.8%", totalRoi: "~5.3%", tier: "Tier I" },
      { id: "hkg-3", title: "Causeway Bay Tower",        token: "OPA-HKG-03", price: 135, available: 14, rentalYield: "3.2%", capitalGrowth: "+3.4%", totalRoi: "~6.6%", tier: "Tier II" },
      { id: "hkg-4", title: "Repulse Bay Mansion",       token: "OPA-HKG-04", price: 240, available: 2,  rentalYield: "2.4%", capitalGrowth: "+3.0%", totalRoi: "~5.4%", tier: "Tier I" },
      { id: "hkg-5", title: "Central Sky Loft",          token: "OPA-HKG-05", price: 175, available: 6,  rentalYield: "2.9%", capitalGrowth: "+2.6%", totalRoi: "~5.5%", tier: "Tier I" },
      { id: "hkg-6", title: "Sai Ying Pun Atelier",      token: "OPA-HKG-06", price: 120, available: 18, rentalYield: "3.4%", capitalGrowth: "+3.1%", totalRoi: "~6.5%", tier: "Tier II" },
      { id: "hkg-7", title: "Mid-Levels Garden Suite",   token: "OPA-HKG-07", price: 150, available: 11, rentalYield: "3.0%", capitalGrowth: "+2.9%", totalRoi: "~5.9%", tier: "Tier II" },
    ]),
  },
  {
    id: "paris", name: "Paris", country: "France", code: "PAR", image: parisImg,
    avgYield: "3.6%", source: "BNP Paribas RE · 2024",
    properties: buildProps("paris", "Paris", "France", 4, [
      { id: "par-1", title: "8th Arrondissement",        token: "OPA-PAR-01", price: 140, available: 31, rentalYield: "3.6%", capitalGrowth: "+3.2%", totalRoi: "~6.8%", tier: "Tier I" },
      { id: "par-2", title: "Champs-Élysées Hôtel",      token: "OPA-PAR-02", price: 175, available: 9,  rentalYield: "3.4%", capitalGrowth: "+4.1%", totalRoi: "~7.5%", tier: "Tier I" },
      { id: "par-3", title: "Le Marais Maison",          token: "OPA-PAR-03", price: 115, available: 22, rentalYield: "4.1%", capitalGrowth: "+3.6%", totalRoi: "~7.7%", tier: "Tier II" },
      { id: "par-4", title: "Saint-Germain Atelier",     token: "OPA-PAR-04", price: 160, available: 13, rentalYield: "3.7%", capitalGrowth: "+3.9%", totalRoi: "~7.6%", tier: "Tier I" },
      { id: "par-5", title: "Trocadéro Belle Époque",    token: "OPA-PAR-05", price: 185, available: 6,  rentalYield: "3.3%", capitalGrowth: "+4.4%", totalRoi: "~7.7%", tier: "Tier I" },
      { id: "par-6", title: "Île Saint-Louis Garret",    token: "OPA-PAR-06", price: 195, available: 4,  rentalYield: "3.2%", capitalGrowth: "+4.6%", totalRoi: "~7.8%", tier: "Tier I" },
      { id: "par-7", title: "Bastille Loft",             token: "OPA-PAR-07", price: 125, available: 27, rentalYield: "4.0%", capitalGrowth: "+3.4%", totalRoi: "~7.4%", tier: "Tier II" },
    ]),
  },
  {
    id: "singapore", name: "Singapore", country: "SG", code: "SGP", image: singaporeImg,
    avgYield: "4.1%", source: "URA / Savills · 2024",
    properties: buildProps("singapore", "Singapore", "SG", 5, [
      { id: "sgp-1", title: "Marina Bay Condo",          token: "OPA-SGP-01", price: 170, available: 18, rentalYield: "4.1%", capitalGrowth: "+7.3%", totalRoi: "~11.4%", tier: "Tier I" },
      { id: "sgp-2", title: "Orchard Road Residence",    token: "OPA-SGP-02", price: 195, available: 7,  rentalYield: "3.8%", capitalGrowth: "+6.5%", totalRoi: "~10.3%", tier: "Tier I" },
      { id: "sgp-3", title: "Sentosa Cove Villa",        token: "OPA-SGP-03", price: 215, available: 4,  rentalYield: "3.6%", capitalGrowth: "+8.2%", totalRoi: "~11.8%", tier: "Tier I" },
      { id: "sgp-4", title: "Tanjong Pagar Sky-rise",    token: "OPA-SGP-04", price: 150, available: 16, rentalYield: "4.3%", capitalGrowth: "+7.0%", totalRoi: "~11.3%", tier: "Tier II" },
      { id: "sgp-5", title: "Bukit Timah Estate",        token: "OPA-SGP-05", price: 225, available: 3,  rentalYield: "3.5%", capitalGrowth: "+8.5%", totalRoi: "~12.0%", tier: "Tier I" },
      { id: "sgp-6", title: "Holland Village Suite",     token: "OPA-SGP-06", price: 140, available: 20, rentalYield: "4.5%", capitalGrowth: "+6.8%", totalRoi: "~11.3%", tier: "Tier II" },
      { id: "sgp-7", title: "Keppel Bay Loft",           token: "OPA-SGP-07", price: 165, available: 12, rentalYield: "4.0%", capitalGrowth: "+7.4%", totalRoi: "~11.4%", tier: "Tier I" },
    ]),
  },
  {
    id: "tokyo", name: "Tokyo", country: "Japan", code: "TKY", image: tokyoImg,
    avgYield: "4.5%", source: "MLIT / CBRE · 2024",
    properties: buildProps("tokyo", "Tokyo", "Japan", 6, [
      { id: "tky-1", title: "Shibuya Prime",             token: "OPA-TKY-01", price: 130, available: 42, rentalYield: "4.5%", capitalGrowth: "+9.6%",  totalRoi: "~14.1%", tier: "Tier I" },
      { id: "tky-2", title: "Roppongi Sky Tower",        token: "OPA-TKY-02", price: 160, available: 18, rentalYield: "4.2%", capitalGrowth: "+10.4%", totalRoi: "~14.6%", tier: "Tier I" },
      { id: "tky-3", title: "Ginza Heritage Suite",      token: "OPA-TKY-03", price: 195, available: 6,  rentalYield: "3.8%", capitalGrowth: "+11.2%", totalRoi: "~15.0%", tier: "Tier I" },
      { id: "tky-4", title: "Aoyama Maisonette",         token: "OPA-TKY-04", price: 155, available: 14, rentalYield: "4.3%", capitalGrowth: "+10.0%", totalRoi: "~14.3%", tier: "Tier I" },
      { id: "tky-5", title: "Daikanyama Atelier",        token: "OPA-TKY-05", price: 140, available: 22, rentalYield: "4.6%", capitalGrowth: "+9.2%",  totalRoi: "~13.8%", tier: "Tier II" },
      { id: "tky-6", title: "Marunouchi Sky Office",     token: "OPA-TKY-06", price: 175, available: 9,  rentalYield: "4.0%", capitalGrowth: "+10.8%", totalRoi: "~14.8%", tier: "Tier I" },
      { id: "tky-7", title: "Nakameguro River Loft",     token: "OPA-TKY-07", price: 125, available: 28, rentalYield: "4.8%", capitalGrowth: "+8.8%",  totalRoi: "~13.6%", tier: "Tier II" },
    ]),
  },
  {
    id: "miami", name: "Miami", country: "USA", code: "MIA", image: miamiImg,
    avgYield: "5.8%", source: "Miami Realtors · 2024",
    properties: buildProps("miami", "Miami", "USA", 7, [
      { id: "mia-1", title: "South Beach Oceanfront",    token: "OPA-MIA-01", price: 120, available: 2,  rentalYield: "5.8%", capitalGrowth: "+8.4%", totalRoi: "~14.2%", tier: "Tier I" },
      { id: "mia-2", title: "Brickell Sky Penthouse",    token: "OPA-MIA-02", price: 155, available: 11, rentalYield: "5.4%", capitalGrowth: "+9.1%", totalRoi: "~14.5%", tier: "Tier I" },
      { id: "mia-3", title: "Coconut Grove Estate",      token: "OPA-MIA-03", price: 105, available: 26, rentalYield: "6.1%", capitalGrowth: "+7.8%", totalRoi: "~13.9%", tier: "Tier II" },
      { id: "mia-4", title: "Star Island Mansion",       token: "OPA-MIA-04", price: 245, available: 1,  rentalYield: "4.8%", capitalGrowth: "+10.2%", totalRoi: "~15.0%", tier: "Tier I" },
      { id: "mia-5", title: "Wynwood Loft Collection",   token: "OPA-MIA-05", price: 115, available: 19, rentalYield: "6.3%", capitalGrowth: "+7.5%", totalRoi: "~13.8%", tier: "Tier II" },
      { id: "mia-6", title: "Edgewater Sky Tower",       token: "OPA-MIA-06", price: 135, available: 15, rentalYield: "5.6%", capitalGrowth: "+8.6%", totalRoi: "~14.2%", tier: "Tier I" },
      { id: "mia-7", title: "Key Biscayne Villa",        token: "OPA-MIA-07", price: 180, available: 5,  rentalYield: "5.0%", capitalGrowth: "+9.4%", totalRoi: "~14.4%", tier: "Tier I" },
    ]),
  },
];

export const getCityById = (id: string): City | undefined =>
  CITIES.find(c => c.id === id);
