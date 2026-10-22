"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface EditorialNavbarProps {
  onScanClick?: () => void;
}

export default function EditorialNavbar({ onScanClick: _onScanClick }: EditorialNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 sm:px-6 pt-4 sm:pt-6 pointer-events-none">
      {/* Pill Container */}
      <div
        className={`pointer-events-auto w-full max-w-5xl transition-all duration-300 rounded-full border ${
          scrolled
            ? "bg-[#07151A]/90 backdrop-blur-md border-white/15 shadow-2xl shadow-black/60 py-2.5 px-4 sm:px-6"
            : "bg-[#07151A]/60 backdrop-blur-sm border-white/10 py-3 px-5 sm:px-7 shadow-lg shadow-black/20"
        } flex items-center justify-between gap-4`}
      >
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#F08A2B] flex items-center justify-center text-[#07151A] font-black text-sm tracking-tighter group-hover:scale-105 transition-transform">
            AI
          </div>
          <div className="flex flex-col">
            <span className="text-white text-sm sm:text-base font-extrabold tracking-[0.16em] uppercase">
              BARBER <span className="text-[#F08A2B]">AI</span>
            </span>
            <span className="text-white/40 text-[9px] font-mono tracking-widest uppercase hidden sm:block">
              EDITION 2026 · VEERA STUDIO
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-xs font-medium text-white/70">
          <a
            href="#demo"
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors"
          >
            Try-On Studio
          </a>
          <a
            href="#problem"
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors"
          >
            Philosophy
          </a>
          <a
            href="#comparison"
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors"
          >
            Before & After
          </a>
          <a
            href="#features"
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors"
          >
            Features
          </a>
          <a
            href="#capabilities"
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors"
          >
            Matrix
          </a>
          <a
            href="#faq"
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-2">
          <Link
            href="/try"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full border border-white/20 text-white hover:bg-white/10 active:scale-95 transition-all"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#355A3A]" />
            Scan Face
          </Link>

          <Link
            href="/book"
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-1.5 sm:py-2 text-xs font-bold rounded-full bg-[#F08A2B] text-[#07151A] hover:bg-[#ff9738] active:scale-95 transition-all shadow-md shadow-[#F08A2B]/20"
          >
            Book Chair
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle navigation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto absolute top-20 inset-x-4 max-w-md mx-auto p-4 rounded-3xl bg-[#07151A]/95 backdrop-blur-xl border border-white/15 shadow-2xl md:hidden flex flex-col gap-2">
          <a
            href="#demo"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2.5 rounded-2xl text-sm font-medium text-white/90 hover:bg-white/10 transition-colors"
          >
            Try-On Studio
          </a>
          <a
            href="#problem"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2.5 rounded-2xl text-sm font-medium text-white/90 hover:bg-white/10 transition-colors"
          >
            Philosophy
          </a>
          <a
            href="#comparison"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2.5 rounded-2xl text-sm font-medium text-white/90 hover:bg-white/10 transition-colors"
          >
            Before & After
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2.5 rounded-2xl text-sm font-medium text-white/90 hover:bg-white/10 transition-colors"
          >
            Core Features
          </a>
          <a
            href="#capabilities"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2.5 rounded-2xl text-sm font-medium text-white/90 hover:bg-white/10 transition-colors"
          >
            Capabilities Matrix
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2.5 rounded-2xl text-sm font-medium text-white/90 hover:bg-white/10 transition-colors"
          >
            FAQ
          </a>

          <div className="pt-2 border-t border-white/10 flex gap-2">
            <Link
              href="/try"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2.5 rounded-full border border-white/20 text-xs font-semibold text-white"
            >
              Scan Face
            </Link>
            <Link
              href="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2.5 rounded-full bg-[#F08A2B] text-xs font-bold text-[#07151A]"
            >
              Book Chair
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
