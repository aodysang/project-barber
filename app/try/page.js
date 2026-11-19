"use client";

import React, { useState } from "react";
import Link from "next/link";
import AiBarberStudio from "@/components/AiBarberStudio";

const steps = [
  {
    step: "01",
    title: "ถ่ายรูปหรืออัปโหลดใบหน้าตรง",
    description:
      "เปิดกล้องถ่ายรูปหน้าตรงหรือเลือกรูปที่เห็นโครงหน้าชัดเจน ไม่สวมแว่นหรือหมวก",
  },
  {
    step: "02",
    title: "AI วิเคราะห์โครงหน้า & แนะนำทรง",
    description:
      "ลุง AI จะวิเคราะห์รูปหน้า (รูปไข่, รูปเพชร, หน้ากลม ฯลฯ) และคัดทรงผมที่เข้ากับคุณ",
  },
  {
    step: "03",
    title: "กด Generate ดูภาพทรงผมจริง",
    description:
      "กดปุ่ม Generate ในทรงที่ชอบ ระบบจะดึงรูปเดิมของคุณมาจำลองทรงผมให้เห็นทันที",
  },
];

export default function TryPage() {
  const [started, setStarted] = useState(false);

  return (
    <div className="min-h-[calc(100svh-3.5rem)] lg:min-h-screen flex flex-col justify-center bg-[#1A1A1A] text-white px-4 sm:px-10 lg:px-12 py-12 sm:py-16">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header Section */}
        <header className="mb-10 sm:mb-12 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="w-6 h-px bg-[#C4A470]" />
            <span className="text-[11px] sm:text-xs font-medium tracking-[0.25em] uppercase text-[#C4A470]">
              AI HAIRSTYLE STUDIO
            </span>
            <span className="w-6 h-px bg-[#C4A470]" />
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-[1.15]">
            ให้ลุงช่วยเลือกทรง
          </h1>

          <p className="mt-3 text-xs sm:text-base text-white/65 leading-relaxed">
            วิเคราะห์โครงหน้าและจำลองทรงผมจากใบหน้าจริงของคุณด้วย Google Gemini
          </p>
        </header>

        {!started ? (
          <>
            {/* 3 Steps Editorial Cards */}
            <section
              aria-label="3 ขั้นตอนในการเลือกทรงผม"
              className="w-full mb-10 sm:mb-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                {steps.map((item) => (
                  <div
                    key={item.step}
                    className="group rounded-lg border border-white/[0.08] hover:border-[#C4A470]/45 bg-[#222222] p-6 sm:p-7 flex flex-col justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-xs tracking-[0.2em] text-[#C4A470]">
                          STEP {item.step}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C4A470]/50 group-hover:bg-[#C4A470] transition-colors" />
                      </div>

                      <h2 className="text-base sm:text-lg font-semibold text-white mb-2 leading-snug">
                        {item.title}
                      </h2>

                      <p className="text-xs sm:text-sm leading-relaxed text-white/60">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Primary & Secondary Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
              <button
                onClick={() => setStarted(true)}
                className="w-full sm:w-auto flex-1 py-3.5 px-7 rounded-md bg-[#C4A470] hover:bg-[#b59460] active:scale-[0.98] text-white font-semibold text-xs sm:text-sm tracking-wider uppercase inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>เริ่มเลือกทรงกับลุง</span>
                <span>→</span>
              </button>

              <Link
                href="/book"
                className="w-full sm:w-auto py-3.5 px-7 rounded-md border border-white/20 hover:border-[#C4A470] text-white hover:text-[#C4A470] text-xs sm:text-sm font-medium text-center transition-all"
              >
                จองคิวเลย
              </Link>
            </div>
          </>
        ) : (
          /* Studio Component */
          <div className="w-full">
            <AiBarberStudio />
          </div>
        )}
      </div>
    </div>
  );
}