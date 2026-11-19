"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { shop } from "@/data/shop";

const navLinks = [
  { label: "หน้าแรก", href: "/" },
  { label: "บริการและราคา", href: "/#services" },
  { label: "ทีมช่างของเรา", href: "/#barbers" },
  { label: "มาตรฐานร้าน", href: "/#standards" },
  { label: "รีวิวลูกค้า", href: "/#reviews" },
  { label: "เกี่ยวกับร้าน", href: "/#about" },
  { label: "ติดต่อ & แผนที่", href: "/#contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isBookingPage = pathname === "/book" || pathname === "/booking";

  return (
    <>
      {/* ================= DESKTOP LEFT SIDEBAR (Fixed 260px) ================= */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-[260px] bg-[#161616] border-r border-white/[0.08] z-50 flex-col justify-between px-7 py-8 select-none">
        <div>
          <Link href="/" className="group block">
            <div className="flex items-center gap-3">
              <img
                src="/project-barber/hairstyles/logo.png"
                alt="Veera Barber Logo"
                className="w-11 h-11 object-contain invert mix-blend-screen shrink-0 transition-transform duration-300 group-hover:scale-105"
              />
              <div>
                <span className="block font-serif text-xl font-semibold tracking-[0.2em] text-white uppercase leading-none">
                  VEERA
                </span>
                <span className="block mt-1.5 text-[10px] tracking-[0.2em] text-[#C4A470] uppercase font-medium">
                  BARBER STUDIO · 28
                </span>
              </div>
            </div>
          </Link>

          <div className="my-6 h-px bg-white/[0.08]" />

          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href === "/" && pathname === "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group flex items-center justify-between py-2.5 px-3 rounded-md text-[14px] transition-all ${
                    isActive
                      ? "text-white font-medium bg-white/[0.06]"
                      : "text-white/65 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <span>{link.label}</span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-opacity ${
                      isActive
                        ? "bg-[#C4A470] opacity-100"
                        : "bg-[#C4A470] opacity-0 group-hover:opacity-60"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Premium Action Buttons */}
        <div className="space-y-4">
          <div className="space-y-3">
            {/* 1. AI Hair Try-On Button */}
            <Link
              href="/try"
              className="group relative w-full flex items-center justify-between py-3 px-4 rounded-lg border border-[#C4A470]/45 bg-gradient-to-r from-[#C4A470]/15 via-[#C4A470]/10 to-transparent hover:border-[#C4A470] hover:from-[#C4A470]/25 text-white text-xs font-medium transition-all duration-300 shadow-[0_0_20px_-6px_rgba(196,164,112,0.3)]"
            >
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5C68E] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C4A470]" />
                </span>
                <span className="text-[#F3DFB9] group-hover:text-white transition-colors">
                  ให้ลุงช่วยเลือกทรง (AI)
                </span>
              </span>
              <span className="text-[#C4A470] text-sm leading-none transition-transform duration-200 group-hover:translate-x-0.5">
                ✦
              </span>
            </Link>

            {/* 2. Primary Booking CTA Button */}
            <Link
              href="/book"
              className="group relative overflow-hidden w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg bg-gradient-to-b from-[#D8BA84] to-[#B59156] hover:from-[#E2C692] hover:to-[#C09C61] text-[#14120E] font-bold text-xs tracking-[0.14em] uppercase ring-1 ring-[#F2DC9F]/50 shadow-[0_8px_24px_-4px_rgba(196,164,112,0.45)] hover:shadow-[0_10px_28px_-2px_rgba(196,164,112,0.65)] active:scale-[0.98] transition-all duration-300"
            >
              {/* Subtle Hover Shine Sweep */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <span>จองคิวตัดผมทันที</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          <div className="pt-4 border-t border-white/[0.08] text-[11px] text-white/45 space-y-1">
            <p className="text-white/75 font-medium">{shop.shortAddress}</p>
            <p>เปิดทุกวัน · โทร {shop.phone}</p>
          </div>
        </div>
      </aside>

      {/* ================= MOBILE / TABLET TOP BAR (< 1024px) ================= */}
      <header className="lg:hidden sticky top-0 z-50 bg-[#161616]/95 backdrop-blur-md border-b border-white/[0.08] px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2.5"
        >
          <img
            src="/project-barber/hairstyles/logo.png"
            alt="Veera Barber Logo"
            className="w-8 h-8 object-contain invert mix-blend-screen shrink-0"
          />
          <div className="leading-none">
            <span className="font-serif font-semibold tracking-[0.18em] text-sm text-white uppercase">
              VEERA BARBER
            </span>
            <span className="block text-[10px] text-[#C4A470] mt-0.5">
              แจ้งวัฒนะ 28 · นนทบุรี
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${shop.phone.replace(/-/g, "")}`}
            className="px-2.5 py-1.5 rounded-md border border-white/15 text-white/80 hover:text-white text-[11px] font-medium"
          >
            โทรร้าน
          </a>
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-md text-white/85 hover:text-white bg-white/[0.06] active:scale-95 transition-transform"
            aria-label="เปิดเมนู"
            aria-expanded={mobileMenuOpen}
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

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <>
            <div
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-14 bg-black/65 backdrop-blur-xs z-40"
            />
            <div className="absolute top-14 left-0 right-0 z-50 bg-[#161616] border-b border-white/10 px-5 py-5 shadow-2xl flex flex-col gap-1.5 max-h-[calc(100svh-3.5rem)] overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 px-3.5 rounded-md text-sm font-medium text-white/85 hover:text-white active:bg-white/10 flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <span className="text-white/35 text-xs">→</span>
                </Link>
              ))}

              <div className="pt-3 mt-2 border-t border-white/10 text-xs text-white/55 px-3.5 space-y-1">
                <p className="text-white/85 font-medium">{shop.address}</p>
                <p>เปิดทุกวัน 08:30–21:00 น. · โทร {shop.phone}</p>
              </div>
            </div>
          </>
        )}
      </header>

      {/* ================= MOBILE STICKY BOTTOM BAR ================= */}
      {!isBookingPage && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#161616]/95 backdrop-blur-md border-t border-white/10 px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] flex items-center gap-2.5 shadow-[0_-8px_24px_rgba(0,0,0,0.5)]">
          <Link
            href="/try"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border border-[#C4A470]/45 bg-[#C4A470]/12 text-[#F3DFB9] active:scale-95 transition-transform text-xs font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C4A470] shrink-0" />
            <span className="truncate">AI เลือกทรง</span>
          </Link>

          <Link
            href="/book"
            className="flex-[1.3] flex items-center justify-center gap-1 py-2.5 px-4 rounded-lg bg-gradient-to-b from-[#D8BA84] to-[#B59156] text-[#14120E] font-bold text-xs sm:text-sm ring-1 ring-[#F2DC9F]/50 shadow-[0_4px_16px_rgba(196,164,112,0.4)] active:scale-95 transition-transform"
          >
            <span>จองคิวทันที</span>
            <span>→</span>
          </Link>
        </div>
      )}
    </>
  );
}