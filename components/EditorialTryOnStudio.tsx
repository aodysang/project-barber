"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { hairstyles } from "@/data/hairstyles";
import { barbers } from "@/data/barbers";

interface ExtendedHairstyle {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  faceShape: string;
  referenceImage: string;
  geometryNotes: string;
  clipperSpecs: string;
  matchedBarberId: string;
  confidenceScore: number;
  duration: number;
  price: number;
}

const curatedStyles: ExtendedHairstyle[] = [
  {
    id: "two-block",
    name: "ทูบล็อก เลเยอร์สากล",
    nameEn: "Architectural Two-Block",
    category: "Korean & Asian Modern",
    faceShape: "Oval · Balanced",
    referenceImage: "/hairstyles/two-block.jpg",
    geometryNotes: "Relieves temporal weight while maintaining crown density. Frames eye-line naturally.",
    clipperSpecs: "Guard #3 internal disconnect, low taper fade at nape, 6.5cm textured perimeter.",
    matchedBarberId: "barber-3", // Fluke
    confidenceScore: 98.6,
    duration: 40,
    price: 280,
  },
  {
    id: "quiff",
    name: "โมเดิร์นควิฟ ยกโคน",
    nameEn: "Executive Modern Quiff",
    category: "Structured & Classic",
    faceShape: "Round & Square",
    referenceImage: "/hairstyles/quiff.jpg",
    geometryNotes: "Elongates vertical facial silhouette. Balances wider mandibular angle with crown height.",
    clipperSpecs: "Mid-drop fade starting at 0.5mm, scissor graduated crown with matte clay finish.",
    matchedBarberId: "barber-2", // Beck
    confidenceScore: 97.4,
    duration: 35,
    price: 270,
  },
  {
    id: "pompadour",
    name: "คลาสสิกปอมปาดัวร์",
    nameEn: "Heritage High Pompadour",
    category: "Vintage & Formal",
    faceShape: "Oval & Oblong",
    referenceImage: "/hairstyles/pompadour.jpg",
    geometryNotes: "Exemplifies clean razor parting. Sharp temples accentuate cheekbone architecture.",
    clipperSpecs: "Zero-gap razor line, high taper blend, scissor over comb 8cm front sweep.",
    matchedBarberId: "barber-1", // Veera
    confidenceScore: 99.1,
    duration: 45,
    price: 300,
  },
  {
    id: "undercut",
    name: "สกินเฟด อันเดอร์คัต",
    nameEn: "Sculpted Clean Undercut",
    category: "High Contrast",
    faceShape: "Square & Jaw-Dominant",
    referenceImage: "/hairstyles/undercut.jpg",
    geometryNotes: "High visual contrast sharpens jawline definition and chisels soft cheek contours.",
    clipperSpecs: "Skin taper from temple to occipital bone, disconnected swept back top.",
    matchedBarberId: "barber-2", // Beck
    confidenceScore: 96.8,
    duration: 30,
    price: 250,
  },
  {
    id: "crew-cut",
    name: "ครูว์คัต เนี้ยบกระชับ",
    nameEn: "Precision Crew Taper",
    category: "Minimal & Tactical",
    faceShape: "Square & Diamond",
    referenceImage: "/hairstyles/crew-cut.jpg",
    geometryNotes: "Emphasizes masculine jawline while keeping temporal regions trim and maintenance-free.",
    clipperSpecs: "Closed clipper #1 to #2 blend, flat crown graduation with hairline boxing.",
    matchedBarberId: "barber-4", // Lek
    confidenceScore: 95.2,
    duration: 25,
    price: 200,
  },
  {
    id: "buzz-cut",
    name: "บัซคัต ไล่ระดับขอบคม",
    nameEn: "Textured Tactical Buzz",
    category: "Ultra Minimal",
    faceShape: "Oval & Diamond",
    referenceImage: "/hairstyles/buzz-cut.jpg",
    geometryNotes: "Pure skull exposure. Best paired with precise hairline laser-level razor edging.",
    clipperSpecs: "Uniform #3 on skull apex, skin fade at sides and neckline with foil shaver finish.",
    matchedBarberId: "barber-2", // Beck
    confidenceScore: 94.7,
    duration: 20,
    price: 150,
  },
];

const faceFilterTabs = [
  "All Silhouettes",
  "Oval · Balanced",
  "Square & Jaw-Dominant",
  "Round & Square",
  "Oval & Oblong",
  "Square & Diamond",
];

export default function EditorialTryOnStudio() {
  const [selectedFilter, setSelectedFilter] = useState("All Silhouettes");
  const [selectedStyle, setSelectedStyle] = useState<ExtendedHairstyle>(curatedStyles[0]);
  const [showBlueprintMesh, setShowBlueprintMesh] = useState(true);
  const [activeViewMode, setActiveViewMode] = useState<"render" | "split" | "specs">("render");

  const filteredStyles = curatedStyles.filter((style) => {
    if (selectedFilter === "All Silhouettes") return true;
    return style.faceShape.toLowerCase().includes(selectedFilter.split("·")[0].trim().toLowerCase());
  });

  const matchedBarber = barbers.find((b) => b.id === selectedStyle.matchedBarberId) || barbers[0];

  return (
    <section id="demo" className="py-24 sm:py-32 bg-[#F6F6F4] text-[#111113] relative overflow-hidden">
      {/* Editorial section header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E7E7E7] text-[11px] font-mono tracking-widest text-[#355A3A] uppercase mb-4 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#355A3A]" />
          STUDIO SCANNER · SYSTEM V4.2
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#07151A] uppercase">
          Intelligent Try-On Studio
        </h2>
        <p className="mt-3 text-lg sm:text-xl font-editorial-serif text-[#07151A]/70 max-w-2xl mx-auto">
          Real-time geometry mapping meets bespoke barber consultation.
        </p>

        {/* Filter Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
          {faceFilterTabs.map((tab) => {
            const isActive = selectedFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setSelectedFilter(tab);
                  const firstMatch = curatedStyles.find((s) =>
                    tab === "All Silhouettes"
                      ? true
                      : s.faceShape.toLowerCase().includes(tab.split("·")[0].trim().toLowerCase())
                  );
                  if (firstMatch) setSelectedStyle(firstMatch);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border cursor-pointer ${
                  isActive
                    ? "bg-[#07151A] text-white border-[#07151A] shadow-md shadow-black/10 scale-102"
                    : "bg-white text-[#07151A]/80 border-[#E7E7E7] hover:border-[#07151A]/30 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Elevated Panel (24-28px rounded corners, broad soft shadow, white card) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-[26px] border border-[#E7E7E7] editorial-card-shadow overflow-hidden">
          
          {/* Top Panel Bar */}
          <div className="px-6 py-4 border-b border-[#E7E7E7] flex flex-wrap items-center justify-between gap-4 bg-[#FCFCFB]">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F08A2B] animate-pulse" />
              <span className="font-mono text-xs font-semibold tracking-wider text-[#07151A] uppercase">
                CALIBRATED FACE ARCHITECTURE ENGINE
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#E7E7E7]/60 text-[10px] font-mono text-black/60">
                468 LANDMARKS
              </span>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#F0F0EE] border border-[#E7E7E7] text-xs font-medium">
              <button
                onClick={() => setShowBlueprintMesh(!showBlueprintMesh)}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  showBlueprintMesh
                    ? "bg-white text-[#07151A] font-bold shadow-xs"
                    : "text-[#07151A]/60 hover:text-[#07151A]"
                }`}
              >
                {showBlueprintMesh ? "Blueprint Overlay: ON" : "Blueprint Overlay: OFF"}
              </button>
              <button
                onClick={() => setActiveViewMode(activeViewMode === "specs" ? "render" : "specs")}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  activeViewMode === "specs"
                    ? "bg-white text-[#07151A] font-bold shadow-xs"
                    : "text-[#07151A]/60 hover:text-[#07151A]"
                }`}
              >
                Clipper Directives
              </button>
            </div>
          </div>

          {/* Panel Body Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left 7 Columns: Visual Canvas & Anatomy Map */}
            <div className="lg:col-span-7 p-6 sm:p-8 bg-[#0D181D] relative flex flex-col justify-between min-h-[480px] sm:min-h-[540px]">
              {/* Subtle ambient lighting */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#07151A] via-transparent to-[#F08A2B]/10 pointer-events-none" />

              {/* Hairstyle Preview Frame */}
              <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                <Image
                  src={selectedStyle.referenceImage}
                  alt={selectedStyle.nameEn}
                  fill
                  className="object-cover object-top brightness-95 transition-all duration-700"
                  priority
                />

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07151A] via-transparent to-transparent opacity-80" />

                {/* Simulated anatomical geometry blueprint overlay */}
                {showBlueprintMesh && (
                  <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
                    {/* Top Blueprint Coordinates */}
                    <div className="flex justify-between items-start text-[10px] font-mono text-[#F08A2B]/90 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 self-start">
                      <span>TEMPORAL BREADTH: 142mm</span>
                      <span className="mx-2 text-white/30">|</span>
                      <span>SYMMETRY: {selectedStyle.confidenceScore}%</span>
                    </div>

                    {/* SVG Anatomical Vector Guides (No sci-fi, just clean draftsman calipers) */}
                    <svg className="absolute inset-0 w-full h-full stroke-[#F08A2B]/40 stroke-[1] fill-none" viewBox="0 0 400 500">
                      {/* Subtle cranial contour line */}
                      <ellipse cx="200" cy="220" rx="110" ry="145" strokeDasharray="3 3" />
                      {/* Horizontal balance level */}
                      <line x1="80" y1="210" x2="320" y2="210" stroke="#FFFFFF" strokeOpacity="0.25" strokeDasharray="2 4" />
                      {/* Jawline taper guides */}
                      <path d="M 120 280 L 200 370 L 280 280" stroke="#F08A2B" strokeOpacity="0.5" />
                      {/* Anchor vertex markers */}
                      <circle cx="200" cy="370" r="3" fill="#F08A2B" />
                      <circle cx="120" cy="280" r="2.5" fill="#355A3A" />
                      <circle cx="280" cy="280" r="2.5" fill="#355A3A" />
                      <circle cx="200" cy="115" r="2.5" fill="#FFFFFF" />
                    </svg>

                    {/* Bottom Indicator Pill */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-white/80 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 mt-auto">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#355A3A]" />
                        <span>FACIAL MESH LOCKED</span>
                      </div>
                      <span className="text-[#F08A2B]">RATIO 1:1.32 (OPTIMAL)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Strip for Quick Switching */}
              <div className="mt-4 flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2">
                {filteredStyles.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedStyle(item)}
                    className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedStyle.id === item.id
                        ? "border-[#F08A2B] scale-105 shadow-md shadow-black/40"
                        : "border-white/15 opacity-60 hover:opacity-100 hover:border-white/40"
                    }`}
                  >
                    <Image src={item.referenceImage} alt={item.nameEn} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right 5 Columns: Editorial Analysis & Barber Pairing */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white">
              <div>
                {/* Meta header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-semibold tracking-wider text-[#355A3A] uppercase">
                    {selectedStyle.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F6F6F4] border border-[#E7E7E7] text-[10px] font-mono text-[#07151A]/80 font-bold">
                    EST. {selectedStyle.duration} MIN · {selectedStyle.price} ฿
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#07151A] tracking-tight uppercase">
                  {selectedStyle.nameEn}
                </h3>
                <p className="text-sm font-editorial-serif text-[#07151A]/70 mt-1">
                  {selectedStyle.name} — เหมาะสำหรับรูปหน้า {selectedStyle.faceShape}
                </p>

                {/* Editorial Anatomical Critique */}
                <div className="mt-6 p-4 rounded-2xl bg-[#F6F6F4] border border-[#E7E7E7]">
                  <p className="text-xs font-mono text-[#07151A]/60 uppercase tracking-wider mb-1.5">
                    Anatomical Diagnosis
                  </p>
                  <p className="text-xs sm:text-sm text-[#07151A] leading-relaxed">
                    "{selectedStyle.geometryNotes}"
                  </p>
                </div>

                {/* Barber Execution Blueprint */}
                <div className="mt-4 p-4 rounded-2xl bg-[#07151A] text-white">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono text-[#F08A2B] tracking-wider uppercase font-semibold">
                      Stylist Clipper Directives
                    </span>
                    <span className="text-[10px] font-mono text-white/40">CALIBRATED</span>
                  </div>
                  <p className="text-xs text-white/80 font-mono leading-relaxed">
                    {selectedStyle.clipperSpecs}
                  </p>
                </div>

                {/* Stylist Match Card */}
                <div className="mt-6 pt-5 border-t border-[#E7E7E7] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#E7E7E7]">
                      <Image
                        src={matchedBarber.photo}
                        alt={matchedBarber.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-[#07151A]/60 tracking-wider uppercase">
                        Recommended Stylist
                      </p>
                      <h4 className="text-sm font-bold text-[#07151A]">
                        {matchedBarber.name}
                      </h4>
                      <p className="text-[11px] text-[#07151A]/70">
                        {matchedBarber.title} · {matchedBarber.experience}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#355A3A] bg-[#355A3A]/10 px-2.5 py-1 rounded-full">
                    ★ {matchedBarber.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-8 pt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/book?service=haircut-adult&barber=${matchedBarber.barberNumber}`}
                  className="flex-1 py-3.5 px-6 rounded-full bg-[#F08A2B] text-[#07151A] font-bold text-xs uppercase tracking-wider text-center hover:bg-[#ff9738] active:scale-98 transition-all shadow-md shadow-[#F08A2B]/20"
                >
                  Book with Blueprint
                </Link>

                <Link
                  href="/try"
                  className="py-3.5 px-6 rounded-full border border-[#07151A] text-[#07151A] font-bold text-xs uppercase tracking-wider text-center hover:bg-[#07151A] hover:text-white active:scale-98 transition-all"
                >
                  Live Webcam Scanner
                </Link>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
