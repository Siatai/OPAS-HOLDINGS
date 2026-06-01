import React, { useState } from "react";
import { Link } from "wouter";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Wallet } from "lucide-react";
import { useAccount } from "wagmi";
import { useWallet } from "./WalletContext";
import OpasPriceTag from "./OpasPriceTag";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { openWallet } = useWallet();
  const { address, isConnected } = useAccount();
  const shortAddr = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 60);
  });

  const navLinks = [
    { label: "Collection",  href: "#properties" },
    { label: "Marketplace", href: "/marketplace", internal: true },
    { label: "Protocol",    href: "#how-it-works" },
    { label: "FAQ",         href: "#faq" },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? "bg-[#050810]/90 backdrop-blur-xl border-b border-white/5 py-3"
          : "bg-transparent py-5"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <img
            src="/opas-logo.png"
            alt="Opas"
            className="w-9 h-9 object-contain drop-shadow-[0_0_12px_rgba(234,141,14,0.6)] group-hover:drop-shadow-[0_0_20px_rgba(234,141,14,0.9)] transition-all duration-300"
          />
          <div className="flex items-baseline gap-2 leading-none">
            <span
              className="opas-3d text-[18px] tracking-[0.14em] uppercase"
              style={{ fontFamily: "DuneRise, Sharkon, sans-serif" }}
            >
              OPAS
            </span>
            <span
              className="text-[11px] tracking-[0.24em] text-primary/80 uppercase"
              style={{ fontFamily: "DuneRise, Sharkon, sans-serif" }}
            >
              HOLDINGS
            </span>
          </div>
          <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono font-bold bg-secondary/15 text-secondary border border-secondary/30 rounded-full tracking-widest uppercase">
            BETA
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => link.internal ? (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs text-white/55 hover:text-primary transition-colors duration-200 tracking-[0.15em] uppercase"
              style={{ fontFamily: "Neuropol, sans-serif" }}
            >
              {link.label}
            </Link>
          ) : (
            <a
              key={link.label}
              href={link.href}
              className="text-xs text-white/55 hover:text-primary transition-colors duration-200 tracking-[0.15em] uppercase"
              style={{ fontFamily: "Neuropol, sans-serif" }}
            >
              {link.label}
            </a>
          ))}
          <OpasPriceTag withSparkline />
          <div className="w-px h-5 bg-white/10" />
          {isConnected ? (
            <div className="flex items-center gap-2">
              <NotificationBell />
              <Link
                href="/dashboard"
                className="btn-metal-silver px-4 py-2 text-[10.5px] tracking-[0.22em] uppercase rounded-sm"
                style={{ fontFamily: "Neuropol, sans-serif" }}
              >
                Dashboard
              </Link>
              <button
                onClick={openWallet}
                className="btn-metal-silver flex items-center gap-2 px-4 py-2 text-[10.5px] tracking-[0.18em] uppercase rounded-sm font-mono"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {shortAddr}
              </button>
            </div>
          ) : (
            <button
              onClick={openWallet}
              className="btn-metal relative group overflow-hidden px-5 py-2.5 text-[11px] font-bold tracking-[0.2em] text-[#050810] uppercase rounded-sm"
              style={{ fontFamily: "BankGothic, sans-serif" }}
            >
              <motion.span
                className="absolute inset-0 border border-primary/60 rounded-sm"
                animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
              />
              <span className="relative z-10">Connect Wallet</span>
            </button>
          )}
        </nav>

        {/* ── Mobile actions ── */}
        <div className="md:hidden flex items-center gap-2">
          {isConnected && <NotificationBell />}
          <button
            className="text-white/70 hover:text-white p-2 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 right-0 bg-[#050810]/98 backdrop-blur-2xl border-b border-white/5 px-6 py-8 flex flex-col gap-6"
        >
          <OpasPriceTag withSparkline className="self-start" />
          {navLinks.map((link) => link.internal ? (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm tracking-[0.25em] text-white/60 hover:text-primary transition-colors uppercase"
              style={{ fontFamily: "Neuropol, sans-serif" }}
            >
              {link.label}
            </Link>
          ) : (
            <a
              key={link.label}
              href={link.href}
              className="text-sm tracking-[0.25em] text-white/60 hover:text-primary transition-colors uppercase"
              style={{ fontFamily: "Neuropol, sans-serif" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          {isConnected && (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 text-xs tracking-[0.22em] uppercase text-white/80 border border-white/10 rounded-sm"
              style={{ fontFamily: "Neuropol, sans-serif" }}
            >
              Dashboard
            </Link>
          )}
          <button
            onClick={() => { setMobileMenuOpen(false); openWallet(); }}
            className="btn-metal w-full py-3.5 text-xs font-bold tracking-[0.2em] text-[#050810] uppercase rounded-sm mt-2 flex items-center justify-center gap-2"
            style={{ fontFamily: "BankGothic, sans-serif" }}
          >
            <Wallet className="w-3.5 h-3.5" />
            {isConnected ? shortAddr : "Connect Wallet"}
          </button>
        </motion.div>
      )}
    </motion.header>
  );
}
