"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { label: "หน้าแรก", href: "/" },
  { label: "บริการ", href: "/#services" },
  { label: "ช่างของเรา", href: "/#barbers" },
  { label: "รีวิว", href: "/#reviews" },
  { label: "เกี่ยวกับเรา", href: "/about" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-black/95 backdrop-blur-md border-b border-[#FFC800]/15 shadow-xl shadow-black/50"
          : "bg-black/80 backdrop-blur-sm border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            {/* Scissor emblem */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFC800] to-[#977600] flex items-center justify-center shadow-lg shadow-[#FFC800]/25 group-hover:scale-105 transition-transform duration-200">
              <span className="text-black text-lg leading-none">✂</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-white font-bold text-base tracking-widest uppercase group-hover:text-[#FFC800] transition-colors duration-200">
                VEERA <span className="text-[#FFC800]">BARBER</span>
              </span>
              <span className="text-[#A4A4A4] text-[10px] tracking-wider font-normal hidden sm:block">
                แจ้งวัฒนะ 28 · นนทบุรี
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-[#C8C8C8] hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-0 bg-[#FFC800] group-hover:w-4 transition-all duration-300 rounded-full" />
              </Link>
            ))}
          </nav>

          {/* ── Desktop CTA Buttons ── */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/try"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-black rounded-xl bg-gradient-to-r from-[#FFC800] to-[#977600] hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#FFC800]/20"
            >
              <span>✨</span>
              <span>ให้ลุงช่วยเลือกทรง</span>
            </Link>
            <Link
              href="/book"
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-bold text-black bg-white hover:bg-gray-100 active:scale-95 rounded-xl transition-all shadow-md"
            >
              จองคิว
            </Link>
          </div>

          {/* ── Mobile: Preview + Hamburger ── */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/book"
              className="px-3 py-1.5 text-xs font-bold text-black bg-white hover:bg-gray-100 rounded-lg transition-all"
            >
              จองคิว
            </Link>
            <button
              onClick={() => setMobileMenuOpen((p) => !p)}
              className="p-2 rounded-lg text-[#C8C8C8] hover:text-white hover:bg-white/8 transition-all"
              aria-label="เปิดเมนู"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Dropdown ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/8 bg-black/98 px-4 py-4">
          <nav className="flex flex-col gap-1 mb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-[#C8C8C8] hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-white/8 flex flex-col gap-2">
            <Link
              href="/try"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#FFC800] to-[#977600] text-black text-sm font-bold shadow-md"
            >
              <span>✨</span>
              <span>ให้ลุงช่วยเลือกทรง (AI)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}