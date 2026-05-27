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
  { id: 1, city: "Dubai", title: "Burj Khalifa Penthouse", image: dubaiImg, price: 150, yield: "8.2%", available: 12 },
  { id: 2, city: "London", title: "Mayfair Townhouse", image: londonImg, price: 200, yield: "6.5%", available: 8 },
  { id: 3, city: "New York", title: "Manhattan Sky-rise", image: newYorkImg, price: 180, yield: "7.1%", available: 24 },
  { id: 4, city: "Hong Kong", title: "Victoria Harbour Suite", image: hongKongImg, price: 160, yield: "6.8%", available: 5 },
  { id: 5, city: "Paris", title: "8th Arr. Balcony", image: parisImg, price: 140, yield: "5.9%", available: 31 },
  { id: 6, city: "Singapore", title: "Marina Bay Condo", image: singaporeImg, price: 170, yield: "7.4%", available: 18 },
  { id: 7, city: "Tokyo", title: "Shibuya Minimalist", image: tokyoImg, price: 130, yield: "6.2%", available: 42 },
  { id: 8, city: "Miami", title: "South Beach Oceanfront", image: miamiImg, price: 120, yield: "9.1%", available: 2 },
];

export default function Properties() {
  const { openWallet } = useWallet();

  return (
    <section id="properties" className="py-32 bg-black relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3 mb-4"
            >
              <div className="w-12 h-px bg-primary" />
              <span className="text-primary tracking-widest uppercase text-xs font-semibold">The Collection</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif text-white max-w-2xl leading-tight"
            >
              Curated Assets of <span className="luxury-gradient-text">Unrivaled Prestige</span>
            </motion.h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <button className="text-white/70 hover:text-primary transition-colors uppercase tracking-widest text-sm border-b border-primary pb-1">
              View All Properties
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] overflow-hidden mb-6 border border-white/10 group-hover:border-primary/50 transition-colors duration-500">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500 z-10" />
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
                />
                
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <div className="px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 text-white text-xs tracking-wider uppercase">
                    {property.city}
                  </div>
                  {property.available < 10 && (
                    <div className="px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary text-primary text-xs tracking-wider uppercase">
                      Almost Sold Out
                    </div>
                  )}
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 z-20 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-xl font-serif text-white mb-1">{property.title}</h3>
                  <div className="h-0 group-hover:h-12 opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden flex items-end pt-4">
                    <button onClick={(e) => { e.stopPropagation(); openWallet(); }} className="w-full py-2 bg-primary text-black font-semibold text-xs tracking-widest uppercase hover:bg-white transition-colors">
                      Acquire Fraction
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-4">
                <div>
                  <div className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Price/Frac</div>
                  <div className="text-primary font-serif text-lg">${property.price}</div>
                </div>
                <div>
                  <div className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Est. Yield</div>
                  <div className="text-white font-serif text-lg">{property.yield}</div>
                </div>
                <div>
                  <div className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Available</div>
                  <div className="text-white font-serif text-lg">{property.available}%</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
