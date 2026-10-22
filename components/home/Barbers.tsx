"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { barbers } from "@/data/barbers";

export default function Barbers() {
  const [selectedBarber, setSelectedBarber] = useState<(typeof barbers)[0] | null>(
    null
  );

  return (
    <section id="barbers" className="scroll-mt-20 bg-(--color-mist) text-night py-28">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header row: same style as services */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="text-left">
            <p className="eyebrow font-mono text-neutral-400 mb-2">
              Professional Barbers
            </p>
            <h2 className="text-5xl font-semibold leading-[1.1] text-night">
              ช่างของเรา
            </h2>
          </div>
          <Link
            href="/barbers"
            className="text-sm text-neutral-500 hover:text-night underline underline-offset-4 self-start sm:self-end"
          >
            ดูทั้งหมด
          </Link>
        </div>

        {/* Layout: desktop 3 columns with 4th/5th continuing in the grid, mobile horizontal scroll-snap row */}
        <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none -mx-6 px-6 md:mx-0 md:px-0 pb-6 md:pb-0 no-scrollbar">
          {barbers.map((b) => (
            <div
              key={b.id}
              onClick={() => setSelectedBarber(b)}
              className="relative aspect-[3/4] w-[78%] md:w-auto shrink-0 md:shrink rounded-[24px] overflow-hidden cursor-pointer group shadow-lg border border-black/5 hover:border-black/20 transition-all snap-center md:snap-align-none bg-neutral-900"
            >
              {/* Photo fills the card with object-top */}
              <Image
                src={b.photo}
                alt={b.name}
                fill
                className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-200 ease-out"
              />

              {/* Single smooth overlay: transparent at top to dark at bottom, no orange, no hard line */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(8,20,22,0.88) 0%, rgba(8,20,22,0.45) 35%, transparent 65%)",
                }}
              />

              {/* Bottom content inside the card */}
              <div className="absolute bottom-0 inset-x-0 p-5 z-10 flex items-end justify-between gap-3 pointer-events-auto">
                <div className="min-w-0 flex-1 pr-1">
                  <h3 className="text-xl font-bold text-white truncate tracking-tight">{b.name}</h3>
                  <p className="text-xs font-medium text-white/85 mt-0.5 truncate">{b.title}</p>
                  <p className="text-xs text-white/75 mt-1 line-clamp-1 max-w-full" title={b.specialty}>{b.specialty}</p>

                  {/* Rating with inline SVG star (not the ★ character) */}
                  <div className="flex items-center gap-1.5 mt-2 text-white text-xs font-semibold">
                    <svg
                      className="w-3.5 h-3.5 fill-[#F08A2B] text-[#F08A2B] shrink-0"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span>{b.rating.toFixed(1)}</span>
                    <span className="text-white/60 text-[11px]">
                      ({b.reviewCount})
                    </span>
                  </div>
                </div>

                {/* White "จองคิว" pill bottom-right linking to /book?barber=<n> */}
                <Link
                  href={`/book?barber=${b.barberNumber}`}
                  onClick={(e) => e.stopPropagation()}
                  className="btn-primary bg-white! text-night! text-xs py-2 px-4 shadow-md hover:bg-mist! shrink-0 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#081416]"
                >
                  จองคิว
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Barber Detail Modal */}
      {selectedBarber && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md"
          onClick={() => setSelectedBarber(null)}
        >
          <div
            className="relative w-full max-w-md rounded-[28px] border border-white/10 bg-[#111113] text-paper shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Photo header with image treatment */}
            <div className="relative h-56 overflow-hidden">
              <Image
                src={selectedBarber.photo}
                alt={selectedBarber.name}
                fill
                className="object-cover object-top"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(17,17,19,0.95) 0%, rgba(17,17,19,0.5) 45%, transparent 70%)",
                }}
              />
              <button
                onClick={() => setSelectedBarber(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 border border-white/15 text-paper hover:text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
                aria-label="ปิด"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-5">
                <span className="eyebrow text-accent font-bold">
                  {selectedBarber.badge}
                </span>
                <h3 className="text-paper text-2xl font-bold leading-tight">
                  {selectedBarber.name}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-3.5 h-3.5 fill-accent text-accent"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <span className="text-accent text-sm font-bold">
                  {selectedBarber.rating.toFixed(1)}
                </span>
                <span className="text-line/60 text-xs">
                  ({selectedBarber.reviewCount} รีวิว)
                </span>
              </div>
              <p className="text-line/70 text-xs">{selectedBarber.title}</p>

              <div className="space-y-3 text-sm border-t border-white/10 pt-4">
                <div>
                  <p className="text-line/50 text-xs mb-1">ความถนัด</p>
                  <p className="text-line/90 text-sm">
                    {selectedBarber.specialty}
                  </p>
                </div>
                <div>
                  <p className="text-line/50 text-xs mb-1">ทรงที่ชำนาญ</p>
                  <p className="text-accent text-sm font-medium">
                    {selectedBarber.favoriteCut}
                  </p>
                </div>
                <div>
                  <p className="text-line/50 text-xs mb-1">ประวัติ</p>
                  <p className="text-line/80 text-sm leading-relaxed">
                    {selectedBarber.bio}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectedBarber(null)}
                  className="flex-1 py-2.5 rounded-full border border-white/15 bg-white/5 text-sm font-semibold text-line/80 hover:text-paper transition-colors cursor-pointer"
                >
                  ปิด
                </button>
                <Link
                  href={`/book?barber=${selectedBarber.barberNumber}`}
                  onClick={() => setSelectedBarber(null)}
                  className="flex-1 py-2.5 rounded-full bg-paper text-night text-sm font-bold text-center flex items-center justify-center shadow-md hover:bg-mist transition-all"
                >
                  จองคิวกับช่างนี้
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
