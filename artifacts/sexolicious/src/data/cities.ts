import dubaiImg from "@/assets/images/dubai.png";
import londonImg from "@/assets/images/london.png";
import newYorkImg from "@/assets/images/new-york.png";
import hongKongImg from "@/assets/images/hong-kong.png";
import parisImg from "@/assets/images/paris.png";
import singaporeImg from "@/assets/images/singapore.png";
import tokyoImg from "@/assets/images/tokyo.png";
import miamiImg from "@/assets/images/miami.png";

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

export const CITIES: City[] = [
  {
    id: "dubai", name: "Dubai", country: "UAE", code: "DXB", image: dubaiImg,
    avgYield: "7.4%", source: "Knight Frank / JLL · 2024",
    properties: [
      { id: "dxb-1", title: "Burj Khalifa Penthouse",   token: "OPA-DXB-01", price: 150, available: 12, rentalYield: "7.4%", capitalGrowth: "+17.2%", totalRoi: "~24.6%", tier: "Tier I" },
      { id: "dxb-2", title: "Palm Jumeirah Signature",  token: "OPA-DXB-02", price: 180, available: 8,  rentalYield: "6.8%", capitalGrowth: "+15.4%", totalRoi: "~22.2%", tier: "Tier I" },
      { id: "dxb-3", title: "Marina Sky Tower 88",      token: "OPA-DXB-03", price: 120, available: 28, rentalYield: "8.1%", capitalGrowth: "+12.6%", totalRoi: "~20.7%", tier: "Tier II" },
    ],
  },
  {
    id: "london", name: "London", country: "UK", code: "LDN", image: londonImg,
    avgYield: "3.8%", source: "Savills Prime · 2024",
    properties: [
      { id: "ldn-1", title: "Mayfair Townhouse",        token: "OPA-LDN-01", price: 200, available: 8,  rentalYield: "3.8%", capitalGrowth: "+4.1%",  totalRoi: "~7.9%",  tier: "Tier I" },
      { id: "ldn-2", title: "Knightsbridge Residence",  token: "OPA-LDN-02", price: 240, available: 4,  rentalYield: "3.4%", capitalGrowth: "+3.8%",  totalRoi: "~7.2%",  tier: "Tier I" },
      { id: "ldn-3", title: "Belgravia Crescent",       token: "OPA-LDN-03", price: 175, available: 16, rentalYield: "4.0%", capitalGrowth: "+5.2%",  totalRoi: "~9.2%",  tier: "Tier II" },
    ],
  },
  {
    id: "newyork", name: "New York", country: "USA", code: "NYC", image: newYorkImg,
    avgYield: "4.2%", source: "StreetEasy / REBNY · 2024",
    properties: [
      { id: "nyc-1", title: "Manhattan Sky-rise",       token: "OPA-NYC-01", price: 180, available: 24, rentalYield: "4.2%", capitalGrowth: "+4.8%",  totalRoi: "~9.0%",  tier: "Tier I" },
      { id: "nyc-2", title: "Central Park West",        token: "OPA-NYC-02", price: 220, available: 11, rentalYield: "3.9%", capitalGrowth: "+5.4%",  totalRoi: "~9.3%",  tier: "Tier I" },
      { id: "nyc-3", title: "Tribeca Loft Collection",  token: "OPA-NYC-03", price: 145, available: 19, rentalYield: "4.6%", capitalGrowth: "+6.1%",  totalRoi: "~10.7%", tier: "Tier II" },
    ],
  },
  {
    id: "hongkong", name: "Hong Kong", country: "HK SAR", code: "HKG", image: hongKongImg,
    avgYield: "2.8%", source: "Centaline / JLL · 2024",
    properties: [
      { id: "hkg-1", title: "Victoria Harbour Suite",   token: "OPA-HKG-01", price: 160, available: 5,  rentalYield: "2.8%", capitalGrowth: "+2.1%", totalRoi: "~4.9%", tier: "Tier I" },
      { id: "hkg-2", title: "The Peak Residence",       token: "OPA-HKG-02", price: 195, available: 3,  rentalYield: "2.5%", capitalGrowth: "+2.8%", totalRoi: "~5.3%", tier: "Tier I" },
      { id: "hkg-3", title: "Causeway Bay Tower",       token: "OPA-HKG-03", price: 135, available: 14, rentalYield: "3.2%", capitalGrowth: "+3.4%", totalRoi: "~6.6%", tier: "Tier II" },
    ],
  },
  {
    id: "paris", name: "Paris", country: "France", code: "PAR", image: parisImg,
    avgYield: "3.6%", source: "BNP Paribas RE · 2024",
    properties: [
      { id: "par-1", title: "8th Arrondissement",       token: "OPA-PAR-01", price: 140, available: 31, rentalYield: "3.6%", capitalGrowth: "+3.2%", totalRoi: "~6.8%", tier: "Tier I" },
      { id: "par-2", title: "Champs-Élysées Hôtel",     token: "OPA-PAR-02", price: 175, available: 9,  rentalYield: "3.4%", capitalGrowth: "+4.1%", totalRoi: "~7.5%", tier: "Tier I" },
      { id: "par-3", title: "Le Marais Maison",         token: "OPA-PAR-03", price: 115, available: 22, rentalYield: "4.1%", capitalGrowth: "+3.6%", totalRoi: "~7.7%", tier: "Tier II" },
    ],
  },
  {
    id: "singapore", name: "Singapore", country: "SG", code: "SGP", image: singaporeImg,
    avgYield: "4.1%", source: "URA / Savills · 2024",
    properties: [
      { id: "sgp-1", title: "Marina Bay Condo",         token: "OPA-SGP-01", price: 170, available: 18, rentalYield: "4.1%", capitalGrowth: "+7.3%", totalRoi: "~11.4%", tier: "Tier I" },
      { id: "sgp-2", title: "Orchard Road Residence",   token: "OPA-SGP-02", price: 195, available: 7,  rentalYield: "3.8%", capitalGrowth: "+6.5%", totalRoi: "~10.3%", tier: "Tier I" },
      { id: "sgp-3", title: "Sentosa Cove Villa",       token: "OPA-SGP-03", price: 215, available: 4,  rentalYield: "3.6%", capitalGrowth: "+8.2%", totalRoi: "~11.8%", tier: "Tier I" },
    ],
  },
  {
    id: "tokyo", name: "Tokyo", country: "Japan", code: "TKY", image: tokyoImg,
    avgYield: "4.5%", source: "MLIT / CBRE · 2024",
    properties: [
      { id: "tky-1", title: "Shibuya Prime",            token: "OPA-TKY-01", price: 130, available: 42, rentalYield: "4.5%", capitalGrowth: "+9.6%",  totalRoi: "~14.1%", tier: "Tier I" },
      { id: "tky-2", title: "Roppongi Sky Tower",       token: "OPA-TKY-02", price: 160, available: 18, rentalYield: "4.2%", capitalGrowth: "+10.4%", totalRoi: "~14.6%", tier: "Tier I" },
      { id: "tky-3", title: "Ginza Heritage Suite",     token: "OPA-TKY-03", price: 195, available: 6,  rentalYield: "3.8%", capitalGrowth: "+11.2%", totalRoi: "~15.0%", tier: "Tier I" },
    ],
  },
  {
    id: "miami", name: "Miami", country: "USA", code: "MIA", image: miamiImg,
    avgYield: "5.8%", source: "Miami Realtors · 2024",
    properties: [
      { id: "mia-1", title: "South Beach Oceanfront",   token: "OPA-MIA-01", price: 120, available: 2,  rentalYield: "5.8%", capitalGrowth: "+8.4%", totalRoi: "~14.2%", tier: "Tier I" },
      { id: "mia-2", title: "Brickell Sky Penthouse",   token: "OPA-MIA-02", price: 155, available: 11, rentalYield: "5.4%", capitalGrowth: "+9.1%", totalRoi: "~14.5%", tier: "Tier I" },
      { id: "mia-3", title: "Coconut Grove Estate",     token: "OPA-MIA-03", price: 105, available: 26, rentalYield: "6.1%", capitalGrowth: "+7.8%", totalRoi: "~13.9%", tier: "Tier II" },
    ],
  },
];

export const getCityById = (id: string): City | undefined =>
  CITIES.find(c => c.id === id);
