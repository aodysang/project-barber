import Image from "next/image";
import Link from "next/link";
import { shop } from "@/data/shop";
import { services } from "@/data/services";

export default function Footer() {
  return (
    <footer className="relative bg-ink text-paper overflow-hidden">
      {/* Zigzag top edge (inline SVG in paper colour) */}
      <div className="w-full overflow-hidden leading-none z-20 relative bg-transparent">
        <svg
          className="w-full h-3 sm:h-5 text-paper fill-current block"
          viewBox="0 0 120 10"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon points="0,0 3,10 6,0 9,10 12,0 15,10 18,0 21,10 24,0 27,10 30,0 33,10 36,0 39,10 42,0 45,10 48,0 51,10 54,0 57,10 60,0 63,10 66,0 69,10 72,0 75,10 78,0 81,10 84,0 87,10 90,0 93,10 96,0 99,10 102,0 105,10 108,0 111,10 114,0 117,10 120,0 120,0 0,0" />
        </svg>
      </div>

      {/* Background with /images/hero-barber.jpg and .image-treatment */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/hero-barber.jpg"
          alt="บรรยากาศร้าน Veera Barber"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="image-treatment" />
        <div className="absolute inset-0 bg-[#07151A]/88 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          {/* Left: Existing brand name and description */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
                <svg
                  className="w-5 h-5"
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
              </div>
              <div className="flex flex-col">
                <span className="text-paper font-semibold tracking-widest uppercase text-sm">
                  VEERA BARBER
                </span>
                <span className="text-line/60 text-[10px] font-mono tracking-wider">
                  แจ้งวัฒนะ 28 · นนทบุรี
                </span>
              </div>
            </Link>

            <p className="text-line/70 text-sm leading-relaxed max-w-sm">
              {shop.description}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2.5 pt-1">
              {[
                {
                  label: "Facebook",
                  svg: (
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ),
                },
                {
                  label: "Instagram",
                  svg: (
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  ),
                },
                {
                  label: "LINE",
                  svg: (
                    <span className="font-mono text-xs font-bold tracking-tight">LINE</span>
                  ),
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  className="w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:border-accent/40 hover:bg-white/10 flex items-center justify-center text-line/80 hover:text-accent transition-colors"
                  aria-label={s.label}
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Right: Existing link columns */}
          {/* 1. บริการ */}
          <div>
            <span className="block font-mono text-[11px] text-accent tracking-wider uppercase mb-1">
              SERVICES
            </span>
            <h5 className="text-paper font-semibold text-sm mb-4 tracking-wider uppercase">
              บริการ
            </h5>
            <ul className="space-y-2.5">
              {services.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/book?service=${s.id}`}
                    className="text-line/70 text-sm hover:text-paper transition-colors"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. ลิงก์ด่วน */}
          <div>
            <span className="block font-mono text-[11px] text-accent tracking-wider uppercase mb-1">
              NAVIGATION
            </span>
            <h5 className="text-paper font-semibold text-sm mb-4 tracking-wider uppercase">
              ลิงก์ด่วน
            </h5>
            <ul className="space-y-2.5">
              {[
                { label: "หน้าแรก", href: "/" },
                { label: "จองคิวออนไลน์", href: "/book" },
                { label: "ช่างของเรา", href: "/barbers" },
                { label: "เกี่ยวกับเรา", href: "/about" },
                { label: "ให้ AI ช่วยเลือกทรง", href: "/try" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-line/70 text-sm hover:text-paper transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. ติดต่อ */}
          <div>
            <span className="block font-mono text-[11px] text-accent tracking-wider uppercase mb-1">
              VISIT US
            </span>
            <h5 className="text-paper font-semibold text-sm mb-4 tracking-wider uppercase">
              ติดต่อ
            </h5>
            <div className="space-y-3 text-sm text-line/70">
              <p className="leading-relaxed">{shop.address}</p>
              <div>
                <a
                  href={`tel:${shop.phone.replace(/[^0-9]/g, "")}`}
                  className="inline-flex items-center gap-2 text-paper hover:text-accent font-medium transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-accent"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                  {shop.phone}
                </a>
              </div>
              <div className="pt-1 space-y-1">
                {shop.openHours.map((h, i) => (
                  <p key={i}>
                    {h.day}: <span className="text-accent font-medium">{h.time}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Existing legal line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-line/50">
          <p>© {new Date().getFullYear()} Veera Barber. All rights reserved.</p>
          <Link href="/privacy" className="hover:text-line transition-colors">
            นโยบายความเป็นส่วนตัว
          </Link>
        </div>
      </div>
    </footer>
  );
}
