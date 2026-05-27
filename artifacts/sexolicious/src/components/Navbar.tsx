import React, { useState } from "react";
import { Link } from "wouter";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useWallet } from "./WalletContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { openWallet } = useWallet();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const navLinks = [
    { label: "Properties", href: "#properties" },
    { label: "Technology", href: "#technology" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Markets", href: "#markets" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-white/5 py-4" : "bg-transparent py-6"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <img src="/opas-logo.png" alt="Opas Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(232,137,12,0.5)]" />
          <div className="flex items-center gap-1">
            <span className="text-2xl font-display font-bold tracking-widest text-white">OPAS</span>
            <span className="text-xl font-display text-primary/80 font-normal tracking-[0.3em]">PROPERTIES</span>
            <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-secondary/20 text-secondary border border-secondary/40 rounded-full tracking-widest uppercase">BETA</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-white/70 hover:text-primary transition-colors tracking-wide"
            >
              {link.label}
            </a>
          ))}
          <div className="w-px h-6 bg-white/10" />
          
          <button
            onClick={openWallet}
            className="relative group px-6 py-2.5 text-sm font-bold tracking-wider text-background bg-primary rounded hover:bg-primary/90 transition-all duration-300 uppercase overflow-hidden"
          >
            <motion.div 
              className="absolute inset-0 rounded border border-primary/50"
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            <span className="relative z-10">Connect Wallet</span>
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-white/5 p-6 flex flex-col space-y-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-lg font-sans font-medium text-white hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openWallet();
            }}
            className="relative w-full py-4 text-sm font-bold tracking-wider text-background bg-primary rounded uppercase mt-4 overflow-hidden"
          >
            <span className="relative z-10">Connect Wallet</span>
          </button>
        </div>
      )}
    </motion.header>
  );
}
