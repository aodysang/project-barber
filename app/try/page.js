'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AiBarberStudio from '@/components/AiBarberStudio';

const steps = [
  {
    step: '1',
    title: 'ถ่ายรูปหรืออัปโหลดใบหน้าตรง',
    description: 'เปิดกล้องถ่ายรูปหน้าตรงหรือเลือกรูปที่เห็นโครงหน้าชัดเจน ไม่สวมแว่นหรือหมวก',
  },
  {
    step: '2',
    title: 'AI วิเคราะห์โครงหน้า & แนะนำทรง',
    description: 'ลุง AI จะวิเคราะห์รูปหน้า (รูปไข่, รูปเพชร, หน้ากลม ฯลฯ) และคัดทรงผมที่เข้ากับคุณ',
  },
  {
    step: '3',
    title: 'กด Generate ดูภาพทรงผมจริง',
    description: 'กดปุ่ม Generate ในทรงที่ชอบ ระบบจะดึงรูปเดิมของคุณมาจำลองทรงผมให้เห็นทันที',
  },
];

export default function TryPage() {
  const [started, setStarted] = useState<boolean>(false);

  return (
    <main
      className="min-h-[100svh] flex flex-col justify-center items-center pt-[124px] pb-16 px-4 sm:px-6 lg:px-8 text-[#F4F1EC] relative"
      style={{
        background:
          'radial-gradient(60% 40% at 50% 0%, rgba(217, 161, 91, 0.14), transparent 70%), linear-gradient(180deg, #081416 0%, #0B1F1F 100%)',
      }}
    >
      <div className="w-full max-w-[960px] mx-auto flex flex-col items-center text-center">
        {/* ส่วนหัวข้อ */}
        <header className="mb-10 max-w-2xl mx-auto">
          <span className="font-serif text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#E8C98A] block mb-3">
            AI HAIRSTYLE RECOMMENDATION
          </span>
          <h1
            className="font-bold tracking-tight text-[#F4F1EC] leading-[1.15]"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)' }}
          >
            ให้ลุงช่วยเลือกทรง
          </h1>
          <p className="text-base sm:text-lg text-[rgba(244,241,236,0.68)] mt-3.5 leading-relaxed font-light">
            วิเคราะห์โครงหน้าและจำลองทรงผมจากใบหน้าจริงของคุณด้วย Google Gemini
          </p>
        </header>

        {!started ? (
          <>
            {/* การ์ด 3 ขั้นตอน */}
            <section aria-label="3 ขั้นตอนในการเลือกทรงผม" className="w-full relative mb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
                {steps.map((item) => (
                  <div
                    key={item.step}
                    className="rounded-[20px] border border-[rgba(232,201,138,0.22)] bg-[rgba(255,255,255,0.04)] backdrop-blur-[8px] p-6 sm:p-7 flex flex-col text-left"
                  >
                    <span className="font-serif text-3xl sm:text-4xl font-bold leading-none text-[#E8C98A] mb-4">
                      {item.step}
                    </span>
                    <h2 className="text-lg font-bold text-[#F4F1EC] mb-2 leading-snug">
                      {item.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-[rgba(244,241,236,0.68)] font-light">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ปุ่มหลักปุ่มเดียว: เริ่มเลือกทรงกับลุง */}
            <div className="w-full max-w-sm flex flex-col items-center gap-4">
              <button
                onClick={() => setStarted(true)}
                className="btn-premium group w-full min-h-[56px] py-4 px-8 text-base sm:text-lg font-semibold tracking-wide inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>เริ่มเลือกทรงกับลุง</span>
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 text-xl leading-none text-[#F3DDAE]">
                  →
                </span>
              </button>

              <Link
                href="/book"
                className="inline-flex items-center justify-center min-h-[44px] py-2 px-7 rounded-full text-sm font-medium border border-[rgba(232,201,138,0.35)] text-[#E8C98A] hover:bg-[rgba(232,201,138,0.08)] hover:border-[#E8C98A] transition-all duration-200"
              >
                จองคิวเลย
              </Link>
            </div>
          </>
        ) : (
          /* เมื่อกดปุ่ม "เริ่มเลือกทรงกับลุง" จะเปิด Studio ทำงานต่อเนื่องทันที */
          <AiBarberStudio />
        )}
      </div>
    </main>
  );
}