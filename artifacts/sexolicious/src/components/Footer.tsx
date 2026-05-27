import React from "react";
import { Link } from "wouter";
import { Twitter, Linkedin, Send } from "lucide-react"; // Send used for Telegram

export default function Footer() {
  return (
    <footer className="bg-background pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-3 group mb-4">
              <img src="/opas-logo.png" alt="Opas Logo" className="w-10 h-10 object-contain" />
              <span className="text-xl font-sans font-bold tracking-wide text-white">OPAS PROPERTIES</span>
            </Link>
            <p className="text-primary font-mono text-xs uppercase tracking-widest mb-6">
              PropTech · Global Real Estate · Web3
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-primary hover:border-primary transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-primary hover:border-primary transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-primary hover:border-primary transition-all">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-sans font-bold mb-6 text-sm uppercase tracking-widest">Platform</h4>
            <ul className="space-y-4">
              <li><a href="#properties" className="text-white/50 hover:text-primary text-sm transition-colors">Data Terminal</a></li>
              <li><a href="#how-it-works" className="text-white/50 hover:text-primary text-sm transition-colors">The Protocol</a></li>
              <li><a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">Secondary Market</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-sans font-bold mb-6 text-sm uppercase tracking-widest">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">About Us</a></li>
              <li><a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">Careers</a></li>
              <li><a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">API Docs</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-sans font-bold mb-6 text-sm uppercase tracking-widest">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-white/50 hover:text-primary text-sm transition-colors">Smart Contract Audit</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs font-mono">
            © {new Date().getFullYear()} Opas Properties Ltd. All rights reserved.
          </p>
          <p className="text-white/30 text-[10px] text-center md:text-right max-w-2xl font-mono uppercase tracking-wide">
            Fractional real estate investments carry risk. Past performance is not indicative of future results. Information provided is for educational purposes and should not be considered financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
