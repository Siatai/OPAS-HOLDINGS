import React from "react";
import { Hexagon } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-black pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 group mb-6">
              <Hexagon className="w-6 h-6 text-primary" />
              <span className="text-xl font-serif font-semibold tracking-wide text-white">SEXOLICIOUS</span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Elite real estate meets democratic access. Own a piece of the world's most iconic properties.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-serif mb-6 text-lg tracking-wide">Invest</h4>
            <ul className="space-y-4">
              <li><a href="#properties" className="text-white/50 hover:text-primary text-sm transition-colors">Properties</a></li>
              <li><a href="#how-it-works" className="text-white/50 hover:text-primary text-sm transition-colors">How it Works</a></li>
              <li><a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">Secondary Market</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-serif mb-6 text-lg tracking-wide">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">About Us</a></li>
              <li><a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">Careers</a></li>
              <li><a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">Press</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-serif mb-6 text-lg tracking-wide">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">Risk Disclosure</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Sexolicious Ltd. All rights reserved.
          </p>
          <p className="text-white/30 text-xs text-center md:text-right max-w-2xl">
            Fractional real estate investments carry risk. Past performance is not indicative of future results. Information provided is for educational purposes and should not be considered financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
