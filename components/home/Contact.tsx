"use client";

import { useState } from "react";
import Link from "next/link";
import { shop } from "@/data/shop";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const rawNumber = shop.phone.replace(/[^0-9]/g, "") || shop.phone;
    navigator.clipboard.writeText(rawNumber);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <section id="contact" className="scroll-mt-20 bg-white py-20 lg:py-28 text-paper">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Near-black rounded-[28px] panel (bg-(--color-ink)) */}
        <div className="rounded-[28px] bg-[#07151A] bg-(--color-ink) p-8 sm:p-12 lg:p-16 border border-white/10 shadow-2xl">
          {/* Header row */}
          <div className="mb-12">
            <p className="eyebrow font-mono text-accent mb-2">Find Us</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-paper">
              แล้วมาเจอกันที่ Veera Barber
            </h2>
          </div>

          {/* 2-column grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left column: Address, Map, and Large Mono Phone with Copy Button */}
            <div className="space-y-8">
              {/* Phone number as large mono line with copy button */}
              <div>
                <p className="text-line/60 text-xs font-mono uppercase tracking-wider mb-2">
                  เบอร์โทรศัพท์
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href={`tel:${shop.phone.replace(/[^0-9]/g, "")}`}
                    className="font-mono text-3xl sm:text-4xl font-bold text-paper hover:text-accent tracking-tight transition-colors"
                  >
                    {shop.phone}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-3.5 py-1.5 rounded-full border border-white/20 bg-white/10 text-xs font-mono text-line/90 hover:bg-white/20 hover:text-paper transition-all cursor-pointer"
                  >
                    {copied ? "คัดลอกแล้ว" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Address */}
              <div>
                <p className="text-line/60 text-xs font-mono uppercase tracking-wider mb-2">
                  ที่อยู่ร้าน
                </p>
                <p className="text-line/90 text-base leading-relaxed">
                  {shop.address}
                </p>
                <p className="text-line/50 text-xs mt-1">
                  ใกล้เซ็นทรัลแจ้งวัฒนะ · มีที่จอดรถ
                </p>
              </div>

              {/* Map Link */}
              <div>
                <a
                  href={shop.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-paper text-sm font-semibold transition-all"
                >
                  <svg
                    className="w-4 h-4 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  ดูแผนที่บน Google Maps
                </a>
              </div>
            </div>

            {/* Right column: Opening Hours & Booking Button */}
            <div className="flex flex-col justify-between h-full space-y-8 lg:border-l lg:border-white/10 lg:pl-12">
              <div>
                <p className="text-line/60 text-xs font-mono uppercase tracking-wider mb-3">
                  เวลาทำการ
                </p>
                <div className="divide-y divide-white/10 border-y border-white/10">
                  {shop.openHours.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2.5 text-sm"
                    >
                      <span className="text-line/80">{h.day}</span>
                      <span className="font-mono text-accent font-semibold">
                        {h.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* จองคิว Button */}
              <div className="pt-2">
                <Link
                  href="/book"
                  className="btn-primary w-full bg-white! text-night! hover:bg-mist! text-sm py-3.5 font-bold shadow-xl transition-all text-center"
                >
                  จองคิวออนไลน์
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
