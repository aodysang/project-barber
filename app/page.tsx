"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeroVideo from "@/components/HeroVideo";
import { shop } from "@/data/shop";
import { services } from "@/data/services";
import { barbers } from "@/data/barbers";
import { reviews } from "@/data/reviews";

const heroStats = [
  { value: "4.95", label: "คะแนนเฉลี่ยจากลูกค้า" },
  { value: "15 ปี", label: "ประสบการณ์ช่างอาวุโส" },
  { value: "5 ท่าน", label: "ช่างประจำร้าน" },
  { value: "100%", label: "ฆ่าเชื้ออุปกรณ์ทุกรอบ" },
];

const aiMarqueeWords = [
  "AI Face Scan",
  "Virtual Haircut",
  "Smart Style Match",
  "Live Try-On",
];

export default function Home() {
  const [selectedService, setSelectedService] = useState("");
  const [selectedBarber, setSelectedBarber] = useState("");
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);
  const [activeBarberIdx, setActiveBarberIdx] = useState(0);
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const reviewTrackRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const currentService = services[activeServiceIdx] || services[0];

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleQuickBook = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedService) params.set("service", selectedService);
    if (selectedBarber) params.set("barber", selectedBarber);
    const query = params.toString();
    router.push(query ? `/book?${query}` : "/book");
  };

  const scrollToReview = (index: number) => {
    const wrappedIndex = (index + reviews.length) % reviews.length;
    setActiveReviewIdx(wrappedIndex);
    const track = reviewTrackRef.current;
    if (!track) return;
    const target = track.children[wrappedIndex] as HTMLElement | undefined;
    if (target) {
      track.scrollTo({
        left: target.offsetLeft - track.offsetLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#1A1A1A] text-white overflow-x-clip">
      {/* ==================== AMBIENT SCROLL-PARALLAX BACKGROUND ==================== */}
      <div
        aria-hidden="true"
        className="fixed inset-0 lg:left-[260px] z-0 pointer-events-none overflow-hidden"
      >
        <img
          src="/project-barber/images/hero-barber.jpg"
          alt=""
          style={{
            transform: `translate3d(0, ${-(scrollY * 0.14) % 240}px, 0) scale(1.18)`,
          }}
          className="w-full h-[135vh] object-cover object-center grayscale contrast-125 opacity-[0.14] transition-transform duration-150 ease-out will-change-transform"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,#161616_88%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/75 via-[#161616]/55 to-[#161616]/85" />
      </div>

      {/* ==================== 1. HERO SECTION ==================== */}
      <section
        id="hero"
        className="relative z-10 min-h-[calc(100svh-3.5rem)] lg:min-h-[90svh] flex flex-col justify-center overflow-hidden border-b border-white/[0.08] bg-[#1A1A1A]"
      >
        <div className="absolute inset-0 z-0 grayscale contrast-105 brightness-90">
          <HeroVideo />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/90 via-[#1A1A1A]/55 to-[#1A1A1A]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-[#161616]/40" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-10 lg:px-12 py-12 sm:py-16">
          <div className="max-w-4xl">
            <div className="border-l border-[#C4A470]/60 pl-4 sm:pl-5 mb-6 max-w-lg">
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                {shop.description}
              </p>
              <p className="mt-2.5 font-serif italic text-xl sm:text-2xl text-[#C4A470]">
                Veera Barber
              </p>
            </div>

            <h1 className="text-3xl sm:text-5xl xl:text-7xl font-serif font-semibold tracking-tight leading-[1.1] text-white">
              ความคลาสสิกที่ใส่ได้ทุกวัน
            </h1>

            <form
              onSubmit={handleQuickBook}
              className="mt-6 sm:mt-8 p-2 rounded-lg bg-[#222222]/85 backdrop-blur-md border border-white/12 shadow-xl flex flex-col md:flex-row items-stretch md:items-center gap-2 max-w-2xl"
            >
              <div className="flex-1 relative">
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full bg-transparent text-white text-xs sm:text-sm px-3.5 py-2.5 sm:py-3 rounded-md appearance-none focus:outline-none cursor-pointer pr-8"
                >
                  <option value="" className="bg-[#222222]">
                    เลือกบริการ (ทั้งหมด 8 รายการ)
                  </option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#222222]">
                      {s.name} ({s.price}฿ · {s.duration} นาที)
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/45 text-[10px]">
                  ▼
                </span>
              </div>

              <div className="h-px md:h-7 w-full md:w-px bg-white/10" />

              <div className="flex-1 relative">
                <select
                  value={selectedBarber}
                  onChange={(e) => setSelectedBarber(e.target.value)}
                  className="w-full bg-transparent text-white text-xs sm:text-sm px-3.5 py-2.5 sm:py-3 rounded-md appearance-none focus:outline-none cursor-pointer pr-8"
                >
                  <option value="" className="bg-[#222222]">
                    เลือกช่างประจำร้าน (5 ท่าน)
                  </option>
                  {barbers.map((b) => (
                    <option
                      key={b.id}
                      value={b.barberNumber}
                      className="bg-[#222222]"
                    >
                      {b.name} — {b.badge}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/45 text-[10px]">
                  ▼
                </span>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-md bg-[#C4A470] hover:bg-[#b59460] active:scale-[0.98] text-white font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all shrink-0 cursor-pointer"
              >
                จองคิวเลย
              </button>
            </form>

            {/* 4-Column Stats Strip */}
            <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-[#C4A470]/30 grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#C4A470]/25 max-w-3xl">
              {heroStats.map((stat, idx) => (
                <div
                  key={idx}
                  className="py-3 sm:py-1 px-3 sm:px-6 text-center flex flex-col items-center justify-center"
                >
                  <span className="font-serif text-2xl sm:text-3xl font-medium text-[#C4A470]">
                    {stat.value}
                  </span>
                  <span className="mt-1.5 text-[11px] sm:text-xs text-white/60">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 2. SERVICES & PRICING SECTION ==================== */}
      <section
        id="services"
        className="relative z-10 px-4 sm:px-10 lg:px-12 py-16 sm:py-24 border-b border-white/[0.08] bg-[#1A1A1A]/80 backdrop-blur-[1px] scroll-mt-14 lg:scroll-mt-0"
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 sm:mb-12">
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-[#C4A470]" />
              <p className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#C4A470] font-medium">
                เมนูบริการ
              </p>
            </div>
            <h2 className="mt-2 text-2xl sm:text-4xl font-serif font-semibold text-white">
              บริการและอัตราค่าบริการ
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-8 space-y-5 sm:space-y-6">
              {services.map((service, idx) => {
                const isSelected = activeServiceIdx === idx;
                return (
                  <div
                    key={service.id}
                    onMouseEnter={() => setActiveServiceIdx(idx)}
                    onClick={() => setActiveServiceIdx(idx)}
                    className={`group cursor-pointer rounded-md transition-colors p-2 -mx-2 ${
                      isSelected ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-baseline gap-3">
                      <h3
                        className={`text-base sm:text-lg font-semibold transition-colors shrink-0 ${
                          isSelected
                            ? "text-[#C4A470]"
                            : "text-white group-hover:text-[#C4A470]"
                        }`}
                      >
                        {service.name}
                      </h3>

                      <div className="flex-1 border-b border-dotted border-white/20 translate-y-[-4px]" />

                      <span className="font-mono text-base sm:text-lg font-semibold text-[#C4A470] shrink-0">
                        {service.price}฿
                      </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between gap-4">
                      <p className="text-xs text-white/55">
                        {service.duration} นาที · {service.description}
                      </p>
                      <Link
                        href={`/book?service=${service.id}`}
                        className="text-[11px] text-[#C4A470] opacity-85 hover:opacity-100 hover:underline shrink-0"
                      >
                        จองบริการ →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-4">
              <div className="relative p-2.5 border border-[#C4A470]/45 bg-[#161616]/90">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#222222]">
                  <img
                    src={currentService.image}
                    alt={currentService.name}
                    className="w-full h-full object-cover grayscale-[20%] transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#C4A470] font-medium">
                      {currentService.category} · {currentService.duration} นาที
                    </span>
                    <div className="flex items-baseline justify-between gap-2 mt-1">
                      <h4 className="text-lg font-semibold text-white">
                        {currentService.name}
                      </h4>
                      <span className="font-mono text-lg font-bold text-[#C4A470]">
                        {currentService.price}฿
                      </span>
                    </div>
                    <Link
                      href={`/book?service=${currentService.id}`}
                      className="mt-3 block w-full text-center py-2.5 border border-[#C4A470] bg-[#161616]/85 hover:bg-[#C4A470] text-[#C4A470] hover:text-white text-xs font-semibold tracking-wider transition-all"
                    >
                      จอง{currentService.name}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. BARBERS TEAM SECTION ==================== */}
      <section
        id="barbers"
        className="relative z-10 px-4 sm:px-10 lg:px-12 py-16 sm:py-24 border-b border-white/[0.08] bg-[#161616]/75 scroll-mt-14 lg:scroll-mt-0"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
            <div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-[#C4A470]" />
                <p className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#C4A470] font-medium">
                  ช่างของเรา
                </p>
              </div>
              <h2 className="mt-2 text-2xl sm:text-4xl font-serif font-semibold text-white">
                ทีมช่างมืออาชีพ
              </h2>
            </div>

            <Link
              href="/barbers"
              className="text-xs font-medium text-[#C4A470] hover:underline"
            >
              ดูโปรไฟล์ช่างทั้งหมด →
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row border border-[#C4A470]/30 bg-[#1A1A1A]/85 backdrop-blur-xs lg:h-[520px] overflow-hidden">
            {barbers.map((barber, idx) => {
              const isExpanded = activeBarberIdx === idx;
              const numberLabel = String(idx + 1).padStart(2, "0");

              return (
                <div
                  key={barber.id}
                  onMouseEnter={() => setActiveBarberIdx(idx)}
                  onClick={() => setActiveBarberIdx(idx)}
                  className={`relative min-w-0 border-b lg:border-b-0 lg:border-r last:border-b-0 last:border-r-0 border-[#C4A470]/25 transition-all duration-500 ease-out cursor-pointer overflow-hidden flex flex-col justify-between ${
                    isExpanded
                      ? "lg:flex-[3.2] bg-[#1E1E1E]/90"
                      : "lg:flex-[1] bg-[#161616]/85 hover:bg-[#1B1B1B]/90"
                  }`}
                >
                  <div className="relative h-64 lg:absolute lg:inset-0 lg:h-full w-full overflow-hidden">
                    <img
                      src={barber.photo}
                      alt={barber.name}
                      className={`w-full h-full object-cover object-top transition-all duration-700 ${
                        isExpanded
                          ? "grayscale-0 scale-100 opacity-55 lg:opacity-65"
                          : "grayscale opacity-30 lg:opacity-35 scale-105"
                      }`}
                    />
                    <div
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        isExpanded
                          ? "bg-gradient-to-t from-[#161616] via-[#161616]/60 to-transparent"
                          : "bg-gradient-to-t from-[#161616] via-[#161616]/75 to-[#161616]/40"
                      }`}
                    />
                  </div>

                  <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between gap-2">
                    <span className="font-mono text-xs tracking-[0.2em] text-[#C4A470] shrink-0">
                      {numberLabel}
                    </span>
                    {isExpanded && (
                      <span className="px-2.5 py-0.5 text-[10px] border border-[#C4A470]/40 bg-[#161616]/80 text-[#C4A470] truncate">
                        {barber.badge}
                      </span>
                    )}
                  </div>

                  <div className="relative z-10 p-5 sm:p-6 mt-auto">
                    <h3 className="text-lg sm:text-xl font-semibold text-white truncate">
                      {barber.name}
                    </h3>
                    <p className="text-[11px] tracking-[0.12em] uppercase text-[#C4A470] mt-1 truncate">
                      {barber.title}
                    </p>

                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        isExpanded
                          ? "max-h-60 opacity-100 mt-3"
                          : "max-h-0 opacity-0 mt-0"
                      }`}
                    >
                      <p className="text-xs text-white/75 leading-relaxed line-clamp-2">
                        ประสบการณ์ {barber.experience} · เชี่ยวชาญ{" "}
                        {barber.favoriteCut}
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-xs text-white/80">
                        <span className="text-[#C4A470]">★</span>
                        <span className="font-mono">
                          {barber.rating.toFixed(1)} ({barber.reviewCount})
                        </span>
                      </div>

                      <div className="mt-4">
                        <Link
                          href={`/book?barber=${barber.barberNumber}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-block px-5 py-2.5 border border-[#C4A470] bg-[#161616]/85 hover:bg-[#C4A470] text-[#C4A470] hover:text-white text-xs font-semibold tracking-wider transition-all"
                        >
                          จองคิว{barber.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== 4. STANDARDS SECTION ==================== */}
      <section
        id="standards"
        className="relative z-10 px-4 sm:px-10 lg:px-12 py-14 sm:py-20 border-b border-white/[0.08] bg-[#1A1A1A]/80 scroll-mt-14 lg:scroll-mt-0"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-[#C4A470]" />
            <p className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#C4A470] font-medium">
              HYGIENE &amp; QUALITY
            </p>
          </div>
          <h2 className="mt-2 text-2xl sm:text-4xl font-serif font-semibold text-white mb-8 sm:mb-10">
            มาตรฐานความสะอาดและการบริการ
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {shop.standards.map((item, idx) => (
              <div
                key={item.id}
                className="p-5 sm:p-6 rounded-lg bg-[#222222]/90 border border-white/[0.08] flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-xs text-[#C4A470]">
                    0{idx + 1}
                  </span>
                  <h3 className="mt-2.5 text-base sm:text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-white/65 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 5. AI TRY-ON BANNER (พร้อมแถบตัวหนังสือวิ่งไปขวาด้านบน) ==================== */}
      <section className="relative z-10 border-b border-white/[0.08] bg-[#181715]/95 overflow-hidden">
        {/* Marquee Strip Flowing Right */}
        <div
          aria-hidden="true"
          className="py-5 sm:py-7 border-b border-white/[0.06] bg-[#141312] overflow-hidden select-none"
        >
          <div className="animate-marquee-right items-center">
            {[...Array(2)].map((_, loopIdx) => (
              <div key={loopIdx} className="flex items-center shrink-0">
                {aiMarqueeWords.map((word) => (
                  <div key={`${loopIdx}-${word}`} className="flex items-center">
                    <span className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white/95 px-6 sm:px-9 whitespace-nowrap">
                      {word}
                    </span>
                    <span className="font-serif text-2xl sm:text-4xl text-[#C4A470]/85 font-light">
                      /
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendation Content */}
        <div className="px-4 sm:px-10 lg:px-12 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8">
            <div className="max-w-2xl">
              <h2 className="text-xl sm:text-4xl font-serif font-semibold text-white leading-snug">
                ไม่แน่ใจว่าตัดทรงไหนดี? ให้ AI ช่วยวิเคราะห์โครงหน้าก่อนตัด
              </h2>
              <p className="mt-2.5 text-xs sm:text-sm text-white/70 leading-relaxed">
                สแกนรูปหน้าผ่านกล้องหรืออัปโหลดภาพ ระบบจะวิเคราะห์รูปหน้าและจำลองทรงผมยอดฮิตให้เห็นภาพจริงก่อนเดินเข้าร้าน
              </p>
            </div>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 shrink-0">
              <Link
                href="/try"
                className="w-full sm:w-auto text-center px-7 py-3.5 rounded-md bg-[#C4A470] hover:bg-[#b59460] text-white font-semibold text-xs sm:text-sm transition-all"
              >
                ลองทรงผมด้วย AI ฟรี
              </Link>
              <Link
                href="/hairstyles"
                className="w-full sm:w-auto text-center px-6 py-3.5 rounded-md border border-white/20 hover:border-white/50 text-white text-xs sm:text-sm font-medium transition-all"
              >
                ดูแคตตาล็อกทรงผม
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 6. CUSTOMER REVIEWS SECTION ==================== */}
      <section
        id="reviews"
        className="relative z-10 py-20 sm:py-28 border-b border-white/[0.08] overflow-hidden scroll-mt-14 lg:scroll-mt-0"
      >
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/project-barber/images/hero-barber.jpg"
            alt="บรรยากาศการตัดผม Veera Barber"
            className="w-full h-full object-cover object-center grayscale contrast-110 brightness-[0.35]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/95 via-[#141414]/75 to-[#141414]/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-[#1A1A1A]/70" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-10 lg:px-12">
          <div className="flex items-end justify-between gap-4 mb-10 sm:mb-12">
            <div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-[#C4A470]" />
                <p className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#C4A470] font-medium">
                  CLIENT TESTIMONIALS
                </p>
              </div>
              <h2 className="mt-2 text-2xl sm:text-4xl font-serif font-semibold text-white">
                เสียงตอบรับจากลูกค้าจริง
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => scrollToReview(activeReviewIdx - 1)}
                aria-label="รีวิวก่อนหน้า"
                className="w-10 h-10 rounded-full border border-white/20 hover:border-[#C4A470] bg-[#161616]/70 text-white hover:text-[#C4A470] flex items-center justify-center transition-colors cursor-pointer"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => scrollToReview(activeReviewIdx + 1)}
                aria-label="รีวิวถัดไป"
                className="w-10 h-10 rounded-full border border-white/20 hover:border-[#C4A470] bg-[#161616]/70 text-white hover:text-[#C4A470] flex items-center justify-center transition-colors cursor-pointer"
              >
                →
              </button>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto pl-4 sm:pl-10 lg:pl-12">
          <div
            ref={reviewTrackRef}
            className="flex gap-10 sm:gap-16 overflow-x-auto snap-x snap-mandatory no-scrollbar pr-12 sm:pr-24"
          >
            {reviews.map((rev, idx) => {
              const initials = rev.customerName
                .replace(/^คุณ/, "")
                .trim()
                .slice(0, 2)
                .toUpperCase();

              return (
                <article
                  key={rev.id}
                  onClick={() => scrollToReview(idx)}
                  className="snap-start shrink-0 w-[85%] sm:w-[72%] lg:w-[68%] cursor-pointer group"
                >
                  <svg
                    className="w-9 h-9 sm:w-11 sm:h-11 text-[#C4A470] mb-5"
                    viewBox="0 0 32 32"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M13 6H4v11h5.2c-.3 3.1-1.9 5.3-5.2 6.7V28c6.2-1.7 9-6.1 9-12.5V6zm15 0h-9v11h5.2c-.3 3.1-1.9 5.3-5.2 6.7V28c6.2-1.7 9-6.1 9-12.5V6z" />
                  </svg>

                  <blockquote className="font-serif text-xl sm:text-3xl lg:text-[32px] font-normal text-white leading-[1.45] tracking-tight">
                    {rev.comment}
                  </blockquote>

                  <div className="mt-7 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-[#C4A470]/50 bg-[#222222]/90 flex items-center justify-center font-serif text-sm font-semibold text-[#C4A470] shrink-0">
                      {initials}
                    </div>

                    <div>
                      <p className="text-sm sm:text-base font-semibold text-white">
                        {rev.customerName}
                      </p>
                      <p className="text-xs text-white/60 mt-0.5">
                        {rev.service} · โดย{rev.barberName} ({rev.date})
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs">
                        <span className="text-[#C4A470] tracking-wider">
                          {"★".repeat(rev.rating)}
                        </span>
                        <span className="font-mono text-white/80">
                          {rev.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10 flex items-center gap-2">
            {reviews.map((rev, idx) => (
              <button
                key={rev.id}
                type="button"
                onClick={() => scrollToReview(idx)}
                aria-label={`ไปยังรีวิวที่ ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  activeReviewIdx === idx
                    ? "w-8 bg-[#C4A470]"
                    : "w-2 bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 7. ABOUT & CONTACT SECTION ==================== */}
      <section
        id="about"
        className="relative z-10 px-4 sm:px-10 lg:px-12 py-14 sm:py-20 bg-[#1A1A1A]/80 scroll-mt-14 lg:scroll-mt-0"
      >
        <div
          id="contact"
          className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 scroll-mt-14 lg:scroll-mt-0"
        >
          <div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-[#C4A470]" />
              <p className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#C4A470] font-medium">
                ABOUT VEERA BARBER
              </p>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-serif font-semibold text-white">
              ทำไมลูกค้าย่านแจ้งวัฒนะถึงเลือกเรา
            </h2>
            <ul className="mt-5 space-y-3">
              {shop.highlights.map((hl, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-xs sm:text-sm text-white/80 leading-relaxed"
                >
                  <span className="text-[#C4A470] font-bold mt-0.5">✓</span>
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 sm:p-7 rounded-lg bg-[#222222]/90 border border-white/[0.08] flex flex-col justify-between space-y-6">
            <div>
              <p className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#C4A470] font-medium">
                VISIT US
              </p>
              <h3 className="mt-1.5 text-xl sm:text-2xl font-serif font-semibold text-white">
                ที่ตั้งร้านและเวลาเปิดให้บริการ
              </h3>

              <div className="mt-5 space-y-4 text-xs sm:text-sm">
                <div>
                  <p className="text-white/50 text-xs">ที่อยู่ร้าน</p>
                  <p className="text-white mt-0.5 leading-relaxed">
                    {shop.address}
                  </p>
                </div>

                <div>
                  <p className="text-white/50 text-xs">เวลาทำการ</p>
                  <div className="mt-1 space-y-1.5">
                    {shop.openHours.map((oh, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-white/85 border-b border-white/[0.06] pb-1.5"
                      >
                        <span>{oh.day}</span>
                        <span className="font-mono text-[#C4A470]">
                          {oh.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-white/50 text-xs">ติดต่อสอบถาม</p>
                  <a
                    href={`tel:${shop.phone.replace(/-/g, "")}`}
                    className="inline-block text-lg font-mono font-semibold text-white hover:text-[#C4A470] mt-0.5"
                  >
                    {shop.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/book"
                className="flex-1 text-center py-3 px-5 rounded-md bg-[#C4A470] hover:bg-[#b59460] text-white font-semibold text-xs sm:text-sm transition-all"
              >
                จองคิวออนไลน์
              </Link>
              <a
                href={shop.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-3 px-5 rounded-md border border-white/20 hover:border-white/50 text-white font-medium text-xs sm:text-sm transition-all"
              >
                เปิด Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}