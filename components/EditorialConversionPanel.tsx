"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { services } from "@/data/services";
import { barbers } from "@/data/barbers";

const timeSlots = ["10:30 AM", "11:45 AM", "01:15 PM", "02:30 PM", "04:15 PM", "05:45 PM", "07:00 PM"];

export default function EditorialConversionPanel() {
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || "haircut-adult");
  const [selectedBarberNumber, setSelectedBarberNumber] = useState(barbers[0]?.barberNumber || 1);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(timeSlots[0]);

  const activeService = services.find((s) => s.id === selectedServiceId) || services[0];
  const activeBarber = barbers.find((b) => b.barberNumber === selectedBarberNumber) || barbers[0];

  return (
    <section className="py-20 sm:py-28 bg-[#F6F6F4] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Large Near-Black Rounded Panel (28px radius, elevated broad dark shadow) */}
        <div className="bg-[#07151A] rounded-[28px] border border-white/10 p-8 sm:p-12 lg:p-16 editorial-elevated-dark relative overflow-hidden">
          
          {/* Subtle warm dusk ambient glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F08A2B]/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#355A3A]/15 rounded-full blur-[120px] pointer-events-none" />

          {/* 3 Headline Metrics Across Top */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 sm:pb-16 border-b border-white/10 text-center md:text-left">
            <div className="flex flex-col">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                98.4<span className="text-[#F08A2B]">%</span>
              </span>
              <span className="text-xs font-mono text-white/50 tracking-wider uppercase mt-2">
                First-Cut Satisfaction Rate
              </span>
              <p className="text-xs text-white/70 mt-1 font-editorial-serif">
                Based on 500+ verified client consultations.
              </p>
            </div>

            <div className="flex flex-col">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                468<span className="text-[#355A3A]">+</span>
              </span>
              <span className="text-xs font-mono text-white/50 tracking-wider uppercase mt-2">
                Spatial Cranial Landmarks
              </span>
              <p className="text-xs text-white/70 mt-1 font-editorial-serif">
                Millimeter facial geometry mapped per scan.
              </p>
            </div>

            <div className="flex flex-col">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                &lt; 15<span className="text-[#F08A2B]">s</span>
              </span>
              <span className="text-xs font-mono text-white/50 tracking-wider uppercase mt-2">
                Instant Blueprint Latency
              </span>
              <p className="text-xs text-white/70 mt-1 font-editorial-serif">
                Calculated securely directly in browser.
              </p>
            </div>
          </div>

          {/* Centered Title + Italic Serif Subline */}
          <div className="relative z-10 text-center my-12 sm:my-16 max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-widest text-[#F08A2B] uppercase mb-3">
              DIRECT CHAIR RESERVATION
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase text-white">
              Reserve Your Session
            </h2>
            <p className="mt-2 text-base sm:text-lg font-editorial-serif text-white/70">
              Transmit your facial silhouette blueprint straight to the master barber chair.
            </p>
          </div>

          {/* Streamlined Quick-Booking / Action Widget */}
          <div className="relative z-10 max-w-3xl mx-auto bg-[#111113] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
            <div className="space-y-6">
              
              {/* Step 1: Service Selector */}
              <div>
                <label className="block text-[11px] font-mono text-white/50 uppercase tracking-widest mb-2.5">
                  1. Select Grooming Service
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {services.slice(0, 3).map((s) => {
                    const isSelected = s.id === selectedServiceId;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedServiceId(s.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-white/10 border-[#F08A2B] shadow-sm shadow-[#F08A2B]/10"
                            : "bg-black/30 border-white/5 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{s.name}</span>
                          <span className="text-xs font-mono font-bold text-[#F08A2B]">{s.price}฿</span>
                        </div>
                        <span className="text-[10px] text-white/50 block mt-1">{s.duration} mins</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Master Stylist Selector */}
              <div>
                <label className="block text-[11px] font-mono text-white/50 uppercase tracking-widest mb-2.5">
                  2. Select Master Stylist
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {barbers.slice(0, 3).map((b) => {
                    const isSelected = b.barberNumber === selectedBarberNumber;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBarberNumber(b.barberNumber)}
                        className={`p-3 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-white/10 border-[#F08A2B]"
                            : "bg-black/30 border-white/5 hover:border-white/20"
                        }`}
                      >
                        <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/20 shrink-0">
                          <Image src={b.photo} alt={b.name} fill className="object-cover" />
                        </div>
                        <div className="text-left overflow-hidden">
                          <p className="text-xs font-bold text-white truncate">{b.name}</p>
                          <p className="text-[10px] text-[#F08A2B] truncate">{b.nickname} · {b.experience}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Time Slot Chips */}
              <div>
                <label className="block text-[11px] font-mono text-white/50 uppercase tracking-widest mb-2.5">
                  3. Select Session Time
                </label>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map((slot) => {
                    const isSelected = slot === selectedTimeSlot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#F08A2B] text-[#07151A] font-bold shadow-sm"
                            : "bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/25"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Confirm Booking Pill Action */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left w-full sm:w-auto">
                  <p className="text-xs text-white/50 font-mono">SELECTED CONFIGURATION</p>
                  <p className="text-sm font-bold text-white">
                    {activeService.name} with {activeBarber.name} ({activeBarber.nickname})
                  </p>
                </div>

                <Link
                  href={`/book?service=${activeService.id}&barber=${activeBarber.barberNumber}`}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#F08A2B] text-[#07151A] font-bold text-xs uppercase tracking-wider text-center hover:bg-[#ff9738] active:scale-98 transition-all shadow-lg shadow-[#F08A2B]/25"
                >
                  Confirm with AI Blueprint →
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
