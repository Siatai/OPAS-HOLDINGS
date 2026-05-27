import React from "react";
import { motion } from "framer-motion";
import { useWallet } from "./WalletContext";

import dubaiImg from "@/assets/images/dubai.png";
import londonImg from "@/assets/images/london.png";
import newYorkImg from "@/assets/images/new-york.png";
import hongKongImg from "@/assets/images/hong-kong.png";
import parisImg from "@/assets/images/paris.png";
import singaporeImg from "@/assets/images/singapore.png";
import tokyoImg from "@/assets/images/tokyo.png";
import miamiImg from "@/assets/images/miami.png";

const properties = [
  { id: 1, city: "Dubai", title: "Burj Khalifa Penthouse", image: dubaiImg, price: 150, yield: "8.2%", available: 12, token: "OPA-DXB" },
  { id: 2, city: "London", title: "Mayfair Townhouse", image: londonImg, price: 200, yield: "6.5%", available: 8, token: "OPA-LDN" },
  { id: 3, city: "New York", title: "Manhattan Sky-rise", image: newYorkImg, price: 180, yield: "7.1%", available: 24, token: "OPA-NYC" },
  { id: 4, city: "Hong Kong", title: "Victoria Harbour Suite", image: hongKongImg, price: 160, yield: "6.8%", available: 5, token: "OPA-HKG" },
  { id: 5, city: "Paris", title: "8th Arr. Balcony", image: parisImg, price: 140, yield: "5.9%", available: 31, token: "OPA-PAR" },
  { id: 6, city: "Singapore", title: "Marina Bay Condo", image: singaporeImg, price: 170, yield: "7.4%", available: 18, token: "OPA-SGP" },
  { id: 7, city: "Tokyo", title: "Shibuya Minimalist", image: tokyoImg, price: 130, yield: "6.2%", available: 42, token: "OPA-TKY" },
  { id: 8, city: "Miami", title: "South Beach Oceanfront", image: miamiImg, price: 120, yield: "9.1%", available: 2, token: "OPA-MIA" },
];

export default function Properties() {
  const { openWallet } = useWallet();

  return (
    <section id="properties" className="py-32 bg-background relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3 mb-4"
            >
              <div className="w-12 h-px bg-secondary" />
              <span className="text-secondary tracking-widest uppercase text-xs font-mono font-semibold">Live Markets</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-display font-bold text-white max-w-2xl leading-tight uppercase tracking-wide mb-2"
            >
              Asset <span className="text-primary">Portfolio</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif italic text-white/70 text-2xl"
            >
              Curated Masterpieces
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <button className="text-white/70 hover:text-primary transition-colors uppercase tracking-widest text-sm font-mono border-b border-primary pb-1">
              View Data Terminal
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
              className="group cursor-pointer bg-card border border-white/5 hover:border-primary/30 transition-all rounded-lg overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
                  <div className="px-2 py-1 bg-secondary/20 backdrop-blur-md border border-secondary text-secondary font-mono text-[10px] uppercase font-bold tracking-wider rounded">
                    TOKEN AVAILABLE
                  </div>
                  <div className="px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-white font-mono text-[10px] tracking-wider rounded">
                    {property.token}
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-4 z-20 bg-gradient-to-t from-black to-transparent">
                  <div className="text-white/70 text-sm font-display tracking-wider mb-1">{property.city}</div>
                  <h3 className="text-lg font-sans font-bold text-white truncate">{property.title}</h3>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="mb-4">
                  <div className="flex justify-between text-[10px] font-mono text-white/50 mb-1">
                    <span>Ownership Available</span>
                    <span>{property.available}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${property.available}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <div className="bg-white/5 p-2 rounded">
                    <div className="text-white/40 text-[10px] uppercase font-mono tracking-widest mb-1">Est. Annual Yield</div>
                    <div className="text-white font-mono font-bold">{property.yield}</div>
                  </div>
                  <div className="bg-white/5 p-2 rounded">
                    <div className="text-white/40 text-[10px] uppercase font-mono tracking-widest mb-1">Min. Investment</div>
                    <div className="text-primary font-mono font-bold">${property.price}</div>
                  </div>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); openWallet(); }} 
                  className="w-full mt-4 py-2 border border-white/10 text-white font-mono text-xs uppercase hover:bg-primary hover:text-black hover:border-primary transition-colors rounded"
                >
                  Acquire {property.token}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
