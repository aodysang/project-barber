"use client";

import HairPreviewSection from "@/components/HairPreviewSection";

const GEMINI_GEM_URL =
  "https://gemini.google.com/gem/1wYY-_WGghY0Fe2FVr_8fnO26IHjT0Wv8?usp=sharing";

export default function TryPage() {
  return (
    <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center bg-ink text-paper">
      <div className="w-full max-w-[1200px] flex flex-col items-center">
        {/* Top Mode Selector */}
        <div className="w-full max-w-xl mb-8 flex p-1.5 rounded-full bg-night/90 border border-white/10 shadow-lg">
          {/* ปุ่มลองทรงผม: ใช้งานในเว็บไซต์เดิม */}
          <button
            type="button"
            className="flex-1 min-h-[48px] py-2.5 px-4 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 bg-accent text-ink shadow-md shadow-accent/20 cursor-pointer"
          >
            <span>✨</span>
            <span>วิเคราะห์โครงหน้าและทรงผมด้วยAi</span>
          </button>

          {/* ปุ่มสแกนโครงหน้า: เปิด Gemini Gem */}
          <a
            href={GEMINI_GEM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-h-[48px] py-2.5 px-4 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 text-line/60 hover:text-paper hover:bg-white/5"
          >
            <span>📷</span>
            <span>ลองเปลียนทรงผมด้วยAI</span>
          </a>
        </div>

        {/* ส่วนทดลองทรงผมเดิม */}
        <HairPreviewSection />
      </div>
    </main>
  );
}
