"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  const isBooking = pathname === "/book" || pathname === "/booking";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isBooking) {
    return (
      <header className="w-full h-[64px] bg-[#0B1F1F] shadow-sm z-50 sticky top-0 font-thai-looped text-white">
        <div className="w-full max-w-[1200px] h-full mx-auto px-[clamp(16px,4vw,48px)] flex items-center justify-between">
          {/* Left: Wordmark + location with inline SVG scissors */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <svg
              className="w-5 h-5 text-white shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="6" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <line x1="20" y1="4" x2="8.12" y2="15.88" />
              <line x1="14.47" y1="14.48" x2="20" y2="20" />
              <line x1="8.12" y1="8.12" x2="12" y2="12" />
            </svg>
            <div className="flex flex-col leading-tight">
              <span className="text-white font-serif tracking-[0.22em] font-bold text-base uppercase">
                VEERA BARBER
              </span>
              <span className="text-white/50 text-[11px] tracking-wider mt-0.5">
                แจ้งวัฒนะ 28 · นนทบุรี
              </span>
            </div>
          </Link>

          {/* Center (desktop): 5 links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[15px] font-semibold text-white/90 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right (desktop): Outline pill "ให้จองช่วยเลือกทรง" + solid white "จองคิว" */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/try"
              className="btn-premium px-5 py-2 text-xs font-semibold gap-2"
            >
              <svg
                className="w-4 h-4 shrink-0 text-[#E8C98A]"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
              <span>ให้จองช่วยเลือกทรง</span>
            </Link>
            <Link
              href="/book"
              className="px-5 py-2 rounded-full bg-white text-[#0B1F1F] font-bold text-xs hover:bg-[#F4F1EC] transition-all shadow-sm"
            >
              จองคิว
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              href="/book"
              className="px-3.5 py-1.5 rounded-full bg-white text-[#0B1F1F] font-bold text-xs"
            >
              จองคิว
            </Link>
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-1.5 text-white/80 hover:text-white"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-[#0B1F1F] border-t border-white/10 px-6 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-white/90 py-1"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/try"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-premium w-full min-h-[44px] py-2.5 px-4 text-xs font-semibold gap-2"
            >
              <svg
                className="w-4 h-4 shrink-0 text-[#E8C98A]"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
              <span>ให้จองช่วยเลือกทรง</span>
            </Link>
          </div>
        )}
      </header>
    );
  }

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl">
      {/* Floating Pill */}
      <div
        className={`w-full h-[56px] px-3 rounded-full backdrop-blur-md border border-white/15 transition-colors duration-300 flex items-center justify-between gap-2 sm:gap-4 ${
          scrolled ? "bg-[#07151A]/95 shadow-xl" : "bg-[#07151A]/40"
        }`}
      >
        {/* Left: Wordmark + location with inline SVG scissors */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <svg
            className="w-4 h-4 text-white shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="6" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <line x1="20" y1="4" x2="8.12" y2="15.88" />
            <line x1="14.47" y1="14.48" x2="20" y2="20" />
            <line x1="8.12" y1="8.12" x2="12" y2="12" />
          </svg>
          <div className="flex flex-col leading-none">
            <span className="text-white font-bold text-sm tracking-wide uppercase">
              VEERA BARBER
            </span>
            <span className="text-white/60 text-[10px] hidden sm:block mt-0.5">
              แจ้งวัฒนะ 28 · นนทบุรี
            </span>
          </div>
        </Link>

        {/* Center (desktop): 5 links, no underline animation, just opacity change on hover */}
        <nav className="hidden lg:flex items-center gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs sm:text-sm font-medium text-white/70 hover:opacity-100 hover:text-white transition-opacity"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right (desktop): AI link as .btn-premium + white .btn-primary "จองคิว" */}
        <div className="hidden lg:flex items-center gap-2">
          <Link
            href="/try"
            className="btn-premium text-xs sm:text-sm py-1.5! px-3.5! gap-2"
          >
            <svg
              className="w-4 h-4 shrink-0 text-[#E8C98A]"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
            <span>ให้ลุงช่วยเลือกทรง</span>
          </Link>
          <Link
            href="/book"
            className="btn-primary bg-white! text-[#07151A]! text-xs sm:text-sm py-1.5! px-4!"
          >
            จองคิว
          </Link>
        </div>

        {/* Mobile: wordmark (left), "จองคิว" pill, and menu button */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            href="/book"
            className="btn-primary bg-white! text-[#07151A]! text-xs py-1.5! px-3.5!"
          >
            จองคิว
          </Link>
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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
      </div>

      {/* Mobile: rounded panel under the pill with existing links */}
      {mobileMenuOpen && (
        <div className="w-full mt-2 rounded-[20px] bg-[#07151A]/95 backdrop-blur-md border border-white/15 p-4 shadow-xl lg:hidden flex flex-col gap-1">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2 mt-2 border-t border-white/10 flex flex-col gap-2">
            <Link
              href="/try"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-premium w-full min-h-[44px] py-2.5 px-4 text-xs sm:text-sm text-center gap-2"
            >
              <svg
                className="w-4 h-4 shrink-0 text-[#E8C98A]"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
              <span>ให้ลุงช่วยเลือกทรง</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
