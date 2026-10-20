"use client";

import { useState } from "react";
import Link from "next/link";

type DevicePreset = {
  name: string;
  width: number;
  height: number;
  label: string;
};

const presets: DevicePreset[] = [
  { name: "iPhone 15 Pro Max", width: 430, height: 932, label: "430px (แนะนำ)" },
  { name: "iPhone 15 Pro", width: 393, height: 852, label: "393px" },
  { name: "iPhone SE", width: 375, height: 667, label: "375px" },
];

export default function MobilePreviewPage() {
  const [selectedPreset, setSelectedPreset] = useState<DevicePreset>(presets[0]);
  const [showFrame, setShowFrame] = useState(true);
  const [currentPath, setCurrentPath] = useState("/");
  const [scale, setScale] = useState(90);
  const [key, setKey] = useState(0); // for refreshing iframe

  return (
    <div className="min-h-screen bg-[#070708] text-gray-200 flex flex-col font-sans">
      {/* Top Simulator Control Bar */}
      <header className="sticky top-0 z-50 bg-[#0f0f12] border-b border-[#FFC800]/25 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:text-white transition"
          >
            ← กลับหน้าเว็บหลัก
          </Link>
          <div className="h-4 w-px bg-zinc-700 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFC800] animate-pulse" />
            <h1 className="text-sm font-bold text-white tracking-wide">
              โหมดจำลองมือถือ (Mobile Simulator)
            </h1>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-black rounded-xl p-1 border border-zinc-800">
            {presets.map((p) => (
              <button
                key={p.name}
                onClick={() => setSelectedPreset(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedPreset.width === p.width
                    ? "bg-gradient-to-r from-[#FFC800] to-[#977600] text-black shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Scale Slider / Controls */}
          <div className="hidden md:flex items-center gap-1.5 bg-black rounded-xl px-2.5 py-1 border border-zinc-800 text-xs">
            <span className="text-gray-400">ขนาด:</span>
            {[80, 90, 100].map((s) => (
              <button
                key={s}
                onClick={() => setScale(s)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  scale === s
                    ? "bg-zinc-700 text-[#FFC800]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {s}%
              </button>
            ))}
          </div>

          {/* Frame Toggle */}
          <button
            onClick={() => setShowFrame(!showFrame)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
              showFrame
                ? "border-[#FFC800]/50 bg-[#FFC800]/10 text-[#FFC800]"
                : "border-zinc-800 bg-zinc-900 text-gray-400 hover:text-white"
            }`}
          >
            {showFrame ? "📱 ซ่อนกรอบเครื่อง" : "📱 แสดงกรอบเครื่อง"}
          </button>

          {/* Refresh iframe */}
          <button
            onClick={() => setKey((prev) => prev + 1)}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:text-white transition text-xs"
            title="รีเฟรชหน้าจำลอง"
          >
            🔄
          </button>
        </div>
      </header>

      {/* Quick Path Navigator */}
      <div className="bg-[#0b0b0e] border-b border-zinc-800/80 px-4 py-2 flex items-center justify-center gap-2 text-xs overflow-x-auto">
        <span className="text-gray-500 font-medium shrink-0">หน้าทดสอบ:</span>
        {[
          { label: "หน้าแรก (Home)", path: "/" },
          { label: "บริการ & ราคา (#services)", path: "/#services" },
          { label: "ช่างของเรา (#barbers)", path: "/#barbers" },
          { label: "รีวิว (#reviews)", path: "/#reviews" },
          { label: "พิกัดร้าน (#contact)", path: "/#contact" },
          { label: "จองคิว (/book)", path: "/book" },
          { label: "ให้ลุงช่วยเลือกทรง (/try)", path: "/try" },
        ].map((item) => (
          <button
            key={item.path}
            onClick={() => setCurrentPath(item.path)}
            className={`px-2.5 py-1 rounded-lg transition shrink-0 ${
              currentPath === item.path
                ? "bg-[#FFC800] text-black font-bold"
                : "bg-zinc-900 hover:bg-zinc-800 text-gray-300"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Simulator Canvas Area */}
      <main className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 overflow-auto">
        <div className="mb-3 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-gray-400">
            <span>ความกว้างที่จำลอง:</span>
            <span className="text-[#FFC800] font-bold">
              {selectedPreset.width}px
            </span>
            <span>× {selectedPreset.height}px</span>
            <span className="text-zinc-600">|</span>
            <span>{selectedPreset.name}</span>
          </div>
        </div>

        {/* Scaled Device Box */}
        <div
          style={{
            transform: `scale(${scale / 100})`,
            transformOrigin: "top center",
          }}
          className="transition-transform duration-200"
        >
          {showFrame ? (
            /* Authentic Smartphone Shell */
            <div
              style={{
                width: selectedPreset.width + 24,
                height: selectedPreset.height + 24,
              }}
              className="relative rounded-[50px] p-3 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_30px_rgba(255,200,0,0.15)] border-4 border-zinc-700 flex flex-col"
            >
              {/* Phone Speaker & Dynamic Island */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
                <div className="w-28 h-6 bg-black rounded-full flex items-center justify-between px-3 shadow-inner">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-900" />
                </div>
              </div>

              {/* Screen Bezel & Display Viewport */}
              <div className="relative w-full h-full rounded-[40px] overflow-hidden bg-black border border-zinc-900">
                <iframe
                  key={key + currentPath + selectedPreset.width}
                  src={currentPath}
                  style={{
                    width: `${selectedPreset.width}px`,
                    height: `${selectedPreset.height}px`,
                  }}
                  className="w-full h-full border-0 select-none bg-black"
                  title="Mobile Preview Frame"
                />
              </div>

              {/* Bottom Home Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-30 pointer-events-none" />
            </div>
          ) : (
            /* Frameless Canvas */
            <div
              style={{
                width: `${selectedPreset.width}px`,
                height: `${selectedPreset.height}px`,
              }}
              className="rounded-2xl overflow-hidden shadow-2xl border-2 border-[#FFC800]/40 bg-black"
            >
              <iframe
                key={key + currentPath + selectedPreset.width}
                src={currentPath}
                style={{
                  width: `${selectedPreset.width}px`,
                  height: `${selectedPreset.height}px`,
                }}
                className="w-full h-full border-0 select-none bg-black"
                title="Mobile Preview Frame Frameless"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
