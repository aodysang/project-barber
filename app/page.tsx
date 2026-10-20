"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { shop } from "@/data/shop";
import { services } from "@/data/services";
import { barbers } from "@/data/barbers";
import { reviews } from "@/data/reviews";

/* ────────────────────────────────────────────────────────── */
/*  Small reusable arrow icon                                  */
/* ────────────────────────────────────────────────────────── */
function ArrowRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Star Rating Row                                            */
/* ────────────────────────────────────────────────────────── */
function StarRow({ count = 5, size = "sm" }: { count?: number; size?: "xs" | "sm" }) {
  const cls = size === "xs" ? "w-3 h-3" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(count)].map((_, i) => (
        <svg key={i} className={`${cls} fill-[#FFC800] text-[#FFC800]`} viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Section header component                                   */
/* ────────────────────────────────────────────────────────── */
function SectionHeader({
  label,
  title,
  viewAllHref,
  viewAllLabel = "ดูทั้งหมด",
}: {
  label?: string;
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-8 lg:mb-10">
      <div>
        {label && (
          <p className="text-[#FFC800] text-xs font-semibold tracking-[0.2em] uppercase mb-1.5">
            {label}
          </p>
        )}
        <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
          {title}
        </h2>
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="shrink-0 flex items-center gap-1 text-sm text-[#C8C8C8] hover:text-[#FFC800] underline underline-offset-2 transition-colors"
        >
          {viewAllLabel}
        </Link>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  HOME PAGE                                                  */
/* ────────────────────────────────────────────────────────── */
export default function Home() {
  const [selectedBarber, setSelectedBarber] = useState<(typeof barbers)[0] | null>(null);
  const servicesScrollRef = useRef<HTMLDivElement>(null);
  const barbersScrollRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, dir: "prev" | "next") => {
    if (!ref.current) return;
    const amount = ref.current.clientWidth * 0.75;
    ref.current.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════
          1. HERO SECTION
      ══════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-barber.jpg"
            alt="Veera Barber Shop Atmosphere"
            fill
            priority
            className="object-cover object-center brightness-[0.35] scale-105"
          />
          {/* Layered overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          {/* Ambient gold glow */}
          <div className="absolute top-1/3 left-0 w-[600px] h-[600px] bg-[#FFC800]/8 rounded-full blur-[120px] pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            {/* Pre-title badge */}
            <div className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full border border-[#FFC800]/30 bg-[#FFC800]/8 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC800] animate-pulse" />
              <span className="text-[#FFC800] text-xs font-semibold tracking-[0.2em] uppercase">
                Veera Barber · แจ้งวัฒนะ 28
              </span>
            </div>

            {/* Main heading */}
            <div>
              <p className="text-white/70 text-lg font-medium tracking-wider uppercase mb-2">
                VEERA BARBER
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-white">
                ความคลาสสิก<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC800] via-yellow-200 to-[#977600]">
                  ที่ใส่ได้ทุกวัน
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-[#C8C8C8] text-base lg:text-lg leading-relaxed max-w-lg">
              {shop.description}
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-6 py-4 border-t border-white/10">
              {[
                { value: "20+", label: "ปีประสบการณ์" },
                { value: "4.9★", label: "คะแนนเฉลี่ย" },
                { value: "500+", label: "ลูกค้าประจำ" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-[#FFC800] text-xl font-bold">{stat.value}</span>
                  <span className="text-[#A4A4A4] text-xs">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/book"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-black text-base font-bold rounded-xl hover:bg-gray-100 active:scale-95 transition-all shadow-lg shadow-white/10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                จองคิว
              </Link>
              <Link
                href="/try"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#FFC800] to-[#977600] text-black text-base font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#FFC800]/25"
              >
                <span>✨</span>
                ให้ลุงช่วยเลือกทรง
              </Link>
            </div>

            {/* Location quick info */}
            <div className="flex items-center gap-2 text-sm text-[#A4A4A4]">
              <svg className="w-4 h-4 text-[#FFC800] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              {shop.shortAddress} · เปิดทุกวัน 08:30–21:00 น.
            </div>
          </div>

          {/* Right: floating price card (desktop only) */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative w-full max-w-sm">
              {/* Glow ring */}
              <div className="absolute -inset-4 bg-[#FFC800]/10 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl border border-[#FFC800]/20 bg-zinc-950/80 backdrop-blur-md p-6 shadow-2xl">
                <p className="text-[#FFC800] text-xs font-semibold tracking-widest uppercase mb-4">
                  ราคาบริการ
                </p>
                <div className="space-y-3">
                  {services.slice(0, 5).map((s) => (
                    <div key={s.id} className="flex items-center justify-between gap-4">
                      <span className="text-[#C8C8C8] text-sm">{s.name}</span>
                      <div className="flex-1 border-b border-dashed border-zinc-800" />
                      <span className="text-white font-bold text-sm shrink-0">{s.price} ฿</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/book"
                  className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#FFC800] to-[#977600] text-black font-bold text-sm hover:brightness-110 transition-all"
                >
                  จองคิวตอนนี้
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[#A4A4A4] text-xs tracking-widest uppercase">เลื่อนดูเพิ่มเติม</span>
          <svg className="w-4 h-4 text-[#FFC800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. SERVICES SECTION ("บริการของเรา")
      ══════════════════════════════════════════════════════════ */}
      <section id="services" className="scroll-mt-20 py-20 lg:py-28 relative">
        {/* Subtle section divider glow */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FFC800]/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-8 lg:mb-10">
            <div>
              <p className="text-[#FFC800] text-xs font-semibold tracking-[0.2em] uppercase mb-1.5">
                Services & Pricing
              </p>
              <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold">บริการของเรา</h2>
            </div>
            <div className="flex items-center gap-3">
              {/* Carousel arrows (visible on all sizes) */}
              <button
                onClick={() => scrollCarousel(servicesScrollRef, "prev")}
                className="w-9 h-9 rounded-full border border-zinc-700 bg-zinc-900 hover:border-[#FFC800]/50 hover:bg-zinc-800 text-white flex items-center justify-center transition-all"
                aria-label="ก่อนหน้า"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scrollCarousel(servicesScrollRef, "next")}
                className="w-9 h-9 rounded-full border border-zinc-700 bg-zinc-900 hover:border-[#FFC800]/50 hover:bg-zinc-800 text-white flex items-center justify-center transition-all"
                aria-label="ถัดไป"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <Link href="/book" className="hidden sm:flex items-center gap-1 text-sm text-[#C8C8C8] hover:text-[#FFC800] underline underline-offset-2 transition-colors ml-2">
                ดูทั้งหมด
              </Link>
            </div>
          </div>

          {/* Horizontal scroll carousel */}
          <div
            ref={servicesScrollRef}
            className="flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
          >
            {services.map((s) => (
              <div
                key={s.id}
                className="w-[280px] sm:w-[300px] shrink-0 relative rounded-2xl overflow-hidden group snap-start border border-zinc-800/60 hover:border-[#FFC800]/30 transition-all duration-300 shadow-xl"
                style={{ height: 280 }}
              >
                <Image
                  src={s.image}
                  alt={s.name}
                  fill
                  className="object-cover brightness-[0.55] group-hover:brightness-[0.65] group-hover:scale-105 transition-all duration-500"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Popular badge */}
                {s.popular && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#FFC800] to-[#977600] text-black text-[10px] font-bold tracking-wider uppercase z-10">
                    ยอดนิยม
                  </div>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10 flex items-end justify-between gap-2">
                  <div>
                    <h3 className="text-white font-semibold text-lg leading-tight">{s.name}</h3>
                    <p className="text-[#C8C8C8] text-sm mt-0.5">
                      {s.price} บาท · {s.duration} นาที
                    </p>
                  </div>
                  <Link
                    href={`/book?service=${s.id}`}
                    className="shrink-0 px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-100 active:scale-95 transition-all flex items-center gap-1"
                  >
                    จอง
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop grid fallback description */}
          <div className="hidden lg:grid grid-cols-4 gap-4 mt-10">
            {services.slice(0, 4).map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 hover:border-[#FFC800]/25 transition-all"
              >
                <p className="text-[#FFC800] text-xs font-semibold mb-1 uppercase tracking-wider">{s.category}</p>
                <h4 className="text-white font-semibold text-sm mb-1">{s.name}</h4>
                <p className="text-[#A4A4A4] text-xs leading-relaxed line-clamp-2">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. BARBERS SECTION ("ช่างของเรา")
      ══════════════════════════════════════════════════════════ */}
      <section id="barbers" className="scroll-mt-20 py-20 lg:py-28 bg-zinc-950/40 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FFC800]/15 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-8 lg:mb-10">
            <div>
              <p className="text-[#FFC800] text-xs font-semibold tracking-[0.2em] uppercase mb-1.5">
                Professional Barbers
              </p>
              <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold">ช่างของเรา</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollCarousel(barbersScrollRef, "prev")}
                className="w-9 h-9 rounded-full border border-zinc-700 bg-zinc-900 hover:border-[#FFC800]/50 hover:bg-zinc-800 text-white flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scrollCarousel(barbersScrollRef, "next")}
                className="w-9 h-9 rounded-full border border-zinc-700 bg-zinc-900 hover:border-[#FFC800]/50 hover:bg-zinc-800 text-white flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <Link href="/barbers" className="hidden sm:flex items-center gap-1 text-sm text-[#C8C8C8] hover:text-[#FFC800] underline underline-offset-2 transition-colors ml-2">
                ดูทั้งหมด
              </Link>
            </div>
          </div>

          {/* Carousel */}
          <div
            ref={barbersScrollRef}
            className="flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
          >
            {barbers.map((b) => (
              <div
                key={b.id}
                className="w-[260px] sm:w-[280px] shrink-0 snap-start group rounded-2xl border border-zinc-800 bg-zinc-950/70 overflow-hidden hover:border-[#FFC800]/40 transition-all duration-300 shadow-xl flex flex-col"
              >
                {/* Photo */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={b.photo}
                    alt={b.name}
                    fill
                    className="object-cover object-top brightness-90 group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold text-[#FFC800] bg-black/80 border border-[#FFC800]/30 rounded-full backdrop-blur-sm">
                    {b.badge}
                  </span>
                  {/* Rating */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/80 backdrop-blur-sm border border-zinc-700/60 px-2 py-1 rounded-full">
                    <svg className="w-3 h-3 fill-[#FFC800] text-[#FFC800]" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span className="text-white text-xs font-bold">{b.rating.toFixed(1)}</span>
                    <span className="text-[#A4A4A4] text-[10px]">({b.reviewCount})</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 p-4 gap-3">
                  <div>
                    <h3 className="text-white font-bold text-lg group-hover:text-[#FFC800] transition-colors">{b.name}</h3>
                    <p className="text-[#FFC800] text-xs font-medium mt-0.5">{b.title}</p>
                    <p className="text-[#A4A4A4] text-xs mt-1 leading-relaxed line-clamp-2">{b.specialty}</p>
                  </div>
                  <div className="mt-auto flex gap-2">
                    <button
                      onClick={() => setSelectedBarber(b)}
                      className="flex-1 py-2 text-xs font-semibold text-white border border-zinc-700 bg-zinc-800/80 hover:border-[#FFC800]/40 hover:bg-zinc-800 rounded-lg transition-all"
                    >
                      ดูโปรไฟล์
                    </button>
                    <Link
                      href={`/book?barber=${b.barberNumber}`}
                      className="flex-1 py-2 text-xs font-bold text-black bg-white hover:bg-gray-100 rounded-lg transition-all text-center"
                    >
                      จองช่างนี้
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. REVIEWS SECTION ("เสียงจากลูกค้า")
      ══════════════════════════════════════════════════════════ */}
      <section id="reviews" className="scroll-mt-20 py-20 lg:py-28 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FFC800]/15 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Verified Customer Reviews"
            title="เสียงจากลูกค้า"
          />

          {/* Overall rating bar */}
          <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-2xl border border-zinc-800/80 bg-zinc-950/60">
            <div className="text-center">
              <p className="text-6xl font-black text-white leading-none">4.9</p>
              <StarRow size="sm" />
              <p className="text-[#A4A4A4] text-xs mt-1">จาก 500+ รีวิว</p>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3].map((stars) => (
                <div key={stars} className="flex items-center gap-3 text-xs">
                  <span className="text-[#A4A4A4] w-4">{stars}★</span>
                  <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FFC800] to-[#977600] rounded-full"
                      style={{ width: stars === 5 ? "87%" : stars === 4 ? "10%" : "3%" }}
                    />
                  </div>
                  <span className="text-[#A4A4A4] w-8">{stars === 5 ? "87%" : stars === 4 ? "10%" : "3%"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="flex flex-col gap-4 p-5 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 hover:border-zinc-700 transition-all border-l-[3px] border-l-[#FFC800]"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#C8C8C8]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold leading-tight">{r.customerName}</p>
                    <StarRow size="xs" />
                  </div>
                </div>
                <p className="text-[#C8C8C8] text-sm leading-relaxed flex-1">"{r.comment}"</p>
                <div className="flex items-center justify-between text-[11px] text-[#A4A4A4] border-t border-zinc-800/80 pt-3">
                  <span className="text-[#FFC800]">{r.barberName} · {r.service}</span>
                  <span>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5. SERVICE STANDARDS ("มาตรฐานการบริการ")
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-zinc-950/40 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FFC800]/15 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader label="Quality Standards" title="มาตรฐานการบริการ" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                num: "01",
                title: "เข้าใจทรงก่อนเริ่มตัด",
                desc: "พูดคุยและออกแบบทรงผมที่เหมาะกับรูปหน้าและบุคลิกของคุณก่อนเริ่มลงมือ เพื่อผลลัพธ์ที่ตรงใจที่สุด",
                image: "/images/hero-barber.jpg",
              },
              {
                num: "02",
                title: "ใส่ใจทุกรายละเอียด",
                desc: "เก็บทุกมุม ทุกเส้น ด้วยความประณีตไม่เร่งรีบ ทั้งไทม์ไลน์ ไซด์เบิร์น และกรอบผมที่เนี้ยบสมบูรณ์",
                image: "/images/service-haircut.jpg",
              },
              {
                num: "03",
                title: "มอบความมั่นใจก่อนออกจากร้าน",
                desc: "เพราะทรงผมที่ดีช่วยเพิ่มความมั่นใจ เราจึงพิถีพิถันทุกขั้นตอน จนกว่าคุณจะพอใจ 100%",
                image: "/images/service-shave.jpg",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="group relative h-[380px] lg:h-[420px] rounded-2xl overflow-hidden border border-zinc-800 hover:border-[#FFC800]/30 transition-all duration-300 shadow-xl"
              >
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover brightness-[0.35] group-hover:brightness-[0.45] group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                {/* Step number watermark */}
                <div className="absolute top-5 right-5 text-[80px] font-black text-white/5 leading-none select-none">
                  {step.num}
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-[#FFC800] text-xs font-bold tracking-[0.2em] uppercase">
                    ขั้นตอนที่ {step.num}
                  </span>
                  <h3 className="text-white text-xl font-bold mt-1 mb-2 leading-tight">{step.title}</h3>
                  <p className="text-[#C8C8C8] text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          6. BUSINESS HOURS & EXPERIENCE SECTION
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FFC800]/15 to-transparent" />
        {/* Decorative glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#FFC800_0%,_transparent_70%)] opacity-[0.04] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* Left: Experience photo */}
            <div className="relative h-72 sm:h-96 lg:h-full min-h-[400px] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl group">
              <Image
                src="/images/barber-veera.jpg"
                alt="ประสบการณ์มากกว่า 20 ปี"
                fill
                className="object-cover object-top brightness-[0.5] group-hover:brightness-[0.6] group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white text-3xl font-bold leading-snug">
                  ประสบการณ์<br />
                  <span className="text-[#FFC800]">มากกว่า 20 ปี</span>
                </h3>
                <Link
                  href="/about"
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-100 transition-all"
                >
                  เกี่ยวกับเรา <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right: Hours + Highlights */}
            <div className="flex flex-col gap-6">
              {/* Hours card */}
              <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/60">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#FFC800]/10 border border-[#FFC800]/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#FFC800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-lg">เวลาทำการ</h3>
                </div>
                <div className="space-y-3">
                  {shop.openHours.map((h, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-[#C8C8C8] text-sm">{h.day}</span>
                      <span className="text-[#FFC800] font-bold text-sm">{h.time}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-zinc-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400 text-xs font-medium">เปิดให้บริการอยู่</span>
                  </div>
                </div>
                <Link
                  href="/book"
                  className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-gray-100 transition-all"
                >
                  จองคิวตอนนี้ <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Highlights / Why Us */}
              <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/60">
                <h3 className="text-white font-bold text-base mb-4">ทำไมต้อง Veera Barber?</h3>
                <ul className="space-y-3">
                  {shop.highlights.slice(0, 4).map((h, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#C8C8C8]">
                      <span className="w-5 h-5 rounded-full bg-[#FFC800]/15 border border-[#FFC800]/30 text-[#FFC800] flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                        ✓
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          7. AI PROMO BANNER
      ══════════════════════════════════════════════════════════ */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden border border-[#FFC800]/25 bg-gradient-to-r from-zinc-950 via-[#1a1400] to-zinc-950 p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-6 shadow-2xl">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#FFC800_0%,_transparent_60%)] opacity-10 pointer-events-none" />

            <div className="relative z-10 flex items-center gap-5 flex-1">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFC800] to-[#977600] flex items-center justify-center text-3xl shadow-xl shadow-[#FFC800]/25 shrink-0">
                💈
              </div>
              <div>
                <h3 className="text-white font-bold text-xl sm:text-2xl">ยังไม่รู้ว่าจะตัดทรงไหนดี?</h3>
                <p className="text-[#C8C8C8] text-sm mt-1">
                  ถ่ายรูป ให้ AI วิเคราะห์รูปหน้า แนะนำทรงผมที่เหมาะกับคุณฟรี!
                </p>
              </div>
            </div>
            <Link
              href="/try"
              className="relative z-10 shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#FFC800] to-[#977600] text-black font-bold text-base hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#FFC800]/25"
            >
              <span>✨</span>
              ให้ลุงช่วยเลือกทรง
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          8. LOCATION & MAP ("แล้วมาเจอกันที่ Veera Barber")
      ══════════════════════════════════════════════════════════ */}
      <section id="contact" className="scroll-mt-20 py-20 lg:py-28 bg-zinc-950/40 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FFC800]/15 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Find Us"
            title="แล้วมาเจอกันที่ Veera Barber"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Map Placeholder */}
            <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 flex flex-col items-center justify-center shadow-xl group">
              {/* Dot grid pattern background */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FFC800_1px,transparent_1px)] [background-size:20px_20px]" />

              {/* Animated pin */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border-2 border-[#FFC800]/40 bg-[#FFC800]/10 flex items-center justify-center mb-4 animate-pulse">
                  <svg className="w-9 h-9 text-[#FFC800]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>
                <h4 className="text-white font-bold text-lg text-center">Veera Barber</h4>
                <p className="text-[#FFC800] text-sm text-center mt-1">ซอยแจ้งวัฒนะ 28 · จ.นนทบุรี</p>
                <p className="text-[#A4A4A4] text-xs text-center mt-2 max-w-xs">ใกล้เซ็นทรัลแจ้งวัฒนะ · มีที่จอดรถ</p>
              </div>

              <a
                href={shop.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FFC800] to-[#977600] text-black font-bold text-sm rounded-xl hover:brightness-110 transition-all shadow-md whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                ดูแผนที่บน Google Maps
              </a>
            </div>

            {/* Address & Contact Info */}
            <div className="flex flex-col gap-4">
              {/* Address */}
              <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/60">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FFC800]/10 border border-[#FFC800]/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#FFC800]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <h4 className="text-white font-semibold">ที่อยู่ร้าน</h4>
                </div>
                <p className="text-[#C8C8C8] text-sm leading-relaxed">{shop.address}</p>
              </div>

              {/* Phone */}
              <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/60">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FFC800]/10 border border-[#FFC800]/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#FFC800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h4 className="text-white font-semibold">โทรศัพท์</h4>
                </div>
                <a href={`tel:${shop.phone.replace(/[^0-9]/g, "")}`} className="text-[#FFC800] font-bold text-lg hover:underline">
                  {shop.phone}
                </a>
              </div>

              {/* Hours quick view */}
              <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/60">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FFC800]/10 border border-[#FFC800]/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#FFC800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-white font-semibold">เวลาทำการ</h4>
                </div>
                {shop.openHours.map((h, i) => (
                  <div key={i} className="flex justify-between text-sm mb-1">
                    <span className="text-[#C8C8C8]">{h.day}</span>
                    <span className="text-[#FFC800] font-semibold">{h.time}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/book"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-gray-100 active:scale-95 transition-all shadow-md"
              >
                จองคิวออนไลน์ <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          9. FOOTER
      ══════════════════════════════════════════════════════════ */}
      <footer className="border-t border-zinc-800/80 bg-black py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-zinc-800/80">

            {/* Brand column */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFC800] to-[#977600] flex items-center justify-center">
                  <span className="text-black text-lg">✂</span>
                </div>
                <div>
                  <p className="text-white font-bold tracking-widest uppercase text-sm">
                    VEERA <span className="text-[#FFC800]">BARBER</span>
                  </p>
                </div>
              </div>
              <p className="text-[#A4A4A4] text-sm leading-relaxed mb-4">{shop.description}</p>
              {/* Social icons */}
              <div className="flex items-center gap-3">
                {[
                  { label: "Facebook", icon: "f" },
                  { label: "Instagram", icon: "in" },
                  { label: "LINE", icon: "L" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    className="w-8 h-8 rounded-lg border border-zinc-700 bg-zinc-900 hover:border-[#FFC800]/40 hover:bg-zinc-800 flex items-center justify-center text-[#C8C8C8] hover:text-[#FFC800] text-xs font-bold transition-all"
                    aria-label={s.label}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h5 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">บริการ</h5>
              <ul className="space-y-2">
                {services.slice(0, 5).map((s) => (
                  <li key={s.id}>
                    <Link href={`/book?service=${s.id}`} className="text-[#A4A4A4] text-sm hover:text-[#FFC800] transition-colors">
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick links */}
            <div>
              <h5 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">ลิงก์ด่วน</h5>
              <ul className="space-y-2">
                {[
                  { label: "หน้าแรก", href: "/" },
                  { label: "จองคิวออนไลน์", href: "/book" },
                  { label: "ช่างของเรา", href: "/barbers" },
                  { label: "เกี่ยวกับเรา", href: "/about" },
                  { label: "ให้ AI ช่วยเลือกทรง", href: "/try" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[#A4A4A4] text-sm hover:text-[#FFC800] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h5 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">ติดต่อ</h5>
              <div className="space-y-3 text-sm text-[#A4A4A4]">
                <p className="leading-relaxed">{shop.address}</p>
                <a href={`tel:${shop.phone.replace(/[^0-9]/g, "")}`} className="flex items-center gap-2 hover:text-[#FFC800] transition-colors">
                  📞 {shop.phone}
                </a>
                <div>
                  {shop.openHours.map((h, i) => (
                    <p key={i}>{h.day}: <span className="text-[#FFC800]">{h.time}</span></p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
            <p>© {new Date().getFullYear()} Veera Barber. All rights reserved.</p>
            <Link href="/privacy" className="hover:text-[#A4A4A4] transition-colors">
              นโยบายความเป็นส่วนตัว
            </Link>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════════
          MOBILE BOTTOM STICKY BAR
      ══════════════════════════════════════════════════════════ */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-black/95 backdrop-blur-lg border-t border-[#FFC800]/20 px-4 py-3 flex items-center gap-3 shadow-2xl shadow-black">
        <Link
          href="/try"
          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-r from-[#FFC800] to-[#977600] text-black text-xs font-bold shadow-md shadow-[#FFC800]/20 active:scale-95 transition-all"
        >
          <span>✨</span> ให้ลุงช่วยเลือกทรง
        </Link>
        <Link
          href="/book"
          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-white text-black text-xs font-bold active:scale-95 transition-all"
        >
          📅 จองคิว
        </Link>
      </div>

      {/* ══════════════════════════════════════════════════════════
          BARBER PROFILE MODAL
      ══════════════════════════════════════════════════════════ */}
      {selectedBarber && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setSelectedBarber(null)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-[#FFC800]/30 bg-zinc-950 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Photo header */}
            <div className="relative h-48 overflow-hidden">
              <Image src={selectedBarber.photo} alt={selectedBarber.name} fill className="object-cover object-top brightness-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
              <button
                onClick={() => setSelectedBarber(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 border border-zinc-700 text-white hover:text-[#FFC800] flex items-center justify-center text-sm transition-colors"
                aria-label="ปิด"
              >✕</button>
              <div className="absolute bottom-4 left-5">
                <span className="text-[10px] font-bold text-[#FFC800] uppercase tracking-widest">{selectedBarber.badge}</span>
                <h3 className="text-white text-2xl font-bold leading-tight">{selectedBarber.name}</h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <StarRow />
                <span className="text-[#FFC800] text-sm font-bold">{selectedBarber.rating.toFixed(1)}</span>
                <span className="text-[#A4A4A4] text-xs">({selectedBarber.reviewCount} รีวิว)</span>
              </div>
              <p className="text-[#A4A4A4] text-xs">{selectedBarber.title}</p>

              <div className="space-y-3 text-sm border-t border-zinc-800 pt-4">
                <div>
                  <p className="text-zinc-500 text-xs mb-1">ความถนัด</p>
                  <p className="text-[#C8C8C8] text-sm">{selectedBarber.specialty}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs mb-1">ทรงที่ชำนาญ</p>
                  <p className="text-[#FFC800] text-sm font-medium">{selectedBarber.favoriteCut}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs mb-1">ประวัติ</p>
                  <p className="text-[#C8C8C8] text-sm leading-relaxed">{selectedBarber.bio}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectedBarber(null)}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm font-semibold text-[#C8C8C8] hover:text-white transition-colors"
                >
                  ปิด
                </button>
                <Link
                  href={`/book?barber=${selectedBarber.barberNumber}`}
                  onClick={() => setSelectedBarber(null)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FFC800] to-[#977600] text-black text-sm font-bold text-center flex items-center justify-center shadow-md shadow-[#FFC800]/20"
                >
                  จองคิวกับช่างนี้
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}