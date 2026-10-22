"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { shop } from "@/data/shop";
import { services } from "@/data/services";
import { barbers } from "@/data/barbers";
import HeroVideo from "@/components/HeroVideo";

export default function Hero() {
  const [selectedService, setSelectedService] = useState("");
  const [selectedBarber, setSelectedBarber] = useState("");
  const router = useRouter();

  const handleQuickBook = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedService) params.set("service", selectedService);
    if (selectedBarber) params.set("barber", selectedBarber);
    const query = params.toString();
    router.push(query ? `/book?${query}` : "/book");
  };

  return (
    <section id="hero" className="min-h-[100svh] p-3 bg-paper">
      {/* Inner Card */}
      <div className="relative h-full min-h-[calc(100svh-24px)] rounded-[28px] overflow-hidden flex flex-col justify-between">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <HeroVideo />
        </div>

        {/* Center Content: Headline & Quick-Booking Bar (Centered) */}
        <div className="relative z-10 w-full max-w-4xl mx-auto flex-1 flex flex-col items-center justify-start pt-[clamp(6.5rem,14vh,9.5rem)] pb-36 sm:pb-32 px-4 sm:px-6 text-center">
          <h1 className="w-full text-center text-white font-semibold text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.08] tracking-tight">
            ความคลาสสิก<br />
            ที่ใส่ได้ทุกวัน
          </h1>

          {/* Quick-booking bar */}
          <form
            onSubmit={handleQuickBook}
            className="mt-8 sm:mt-10 w-full max-w-2xl mx-auto rounded-[24px] sm:rounded-full bg-paper text-night p-2 sm:p-2.5 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
          >
            {/* Select Service */}
            <div className="flex-1 relative">
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full bg-transparent text-night text-sm font-medium px-4 py-2.5 rounded-full appearance-none focus:outline-none cursor-pointer pr-10"
              >
                <option value="">เลือกบริการ</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.price}฿)
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-night/60">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-line shrink-0" />

            {/* Select Barber */}
            <div className="flex-1 relative">
              <select
                value={selectedBarber}
                onChange={(e) => setSelectedBarber(e.target.value)}
                className="w-full bg-transparent text-night text-sm font-medium px-4 py-2.5 rounded-full appearance-none focus:outline-none cursor-pointer pr-10"
              >
                <option value="">เลือกช่าง</option>
                {barbers.map((b) => (
                  <option key={b.id} value={b.barberNumber}>
                    {b.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-night/60">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 bg-[#07151A] text-white font-semibold text-sm px-7 py-3 rounded-full hover:bg-black active:scale-95 transition-all shadow-md cursor-pointer"
            >
              จองคิว
            </button>
          </form>
        </div>

        {/* Bottom Row inside Hero */}
        <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pointer-events-auto">
          {/* Bottom Left: shop description */}
          <div className="max-w-sm text-left">
            <p className="text-sm text-white/90 leading-relaxed drop-shadow-sm">
              {shop.description}
            </p>
          </div>

          {/* Bottom Right: shop location and opening hours */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-white/90 drop-shadow-sm justify-start sm:justify-end text-left sm:text-right">
            <svg className="w-4 h-4 text-accent shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span>{shop.shortAddress} · เปิดทุกวัน 08:30–21:00 น.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
