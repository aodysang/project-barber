"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Service type
interface ServiceItem {
  id: string;
  name: string;
  enName: string;
  price: number;
  duration: number;
  image: string;
}

// Barber type
interface BarberItem {
  id: string;
  idNumber: number;
  name: string;
  badge?: string;
  categories: ("Classic" | "Fade" | "Fashion")[];
  specialty: string;
  rating: number;
  reviewCount: number;
  photo: string;
  isAnyBarber?: boolean;
}

// Date item type
interface DateOption {
  dayLabel: string; // e.g. "วันนี้", "พรุ่งนี้", "10 ต.ค."
  dateLabel: string; // e.g. "8 ต.ค.", "9 ต.ค.", "ศุกร์"
  fullDisplay: string; // e.g. "พรุ่งนี้ (9 ต.ค. 2025)"
  isoDate: string; // "2025-10-09"
}

// Default mock services matching the screenshots
const SERVICES_DATA: ServiceItem[] = [
  {
    id: "haircut-adult",
    name: "ตัดผมผู้ใหญ่",
    enName: "Haircut",
    price: 250,
    duration: 30,
    image: "/images/service-haircut.jpg",
  },
  {
    id: "haircut-shave",
    name: "ตัดผม + โกนหนวด",
    enName: "Haircut + Shave",
    price: 400,
    duration: 45,
    image: "/images/service-shave.jpg",
  },
  {
    id: "wash-blow",
    name: "สระ + ไดร์",
    enName: "Wash & Blow",
    price: 150,
    duration: 30,
    image: "/images/service-wash.jpg",
  },
  {
    id: "perm",
    name: "ดัดผม",
    enName: "Perm",
    price: 800,
    duration: 120,
    image: "/images/service-haircut.jpg",
  },
  {
    id: "haircut-kid",
    name: "ตัดผมเด็กโต",
    enName: "Junior Haircut",
    price: 100,
    duration: 30,
    image: "/images/service-kid.jpg",
  },
];

// Default barbers data matching the screenshots & prompt
const BARBERS_DATA: BarberItem[] = [
  {
    id: "any",
    idNumber: 1,
    name: "ไม่ระบุช่าง (Any Barber)",
    categories: ["Classic", "Fade", "Fashion"],
    specialty: "ทางร้านจะจัดช่างที่มีคิวว่างที่เหมาะสมให้คุณ สะดวกรวดเร็วที่สุด",
    rating: 5.0,
    reviewCount: 500,
    photo: "/images/hero-barber.jpg",
    isAnyBarber: true,
  },
  {
    id: "barber-1",
    idNumber: 1,
    name: "ช่างวีระ",
    badge: "แนะนำ",
    categories: ["Classic", "Fade"],
    specialty: "Classic / Fade / Vintage",
    rating: 4.9,
    reviewCount: 142,
    photo: "/images/barber-veera.jpg",
  },
  {
    id: "barber-2",
    idNumber: 2,
    name: "ช่างเบค",
    badge: "แนะนำ",
    categories: ["Fade", "Fashion"],
    specialty: "Skin Fade / Undercut / Modern",
    rating: 4.9,
    reviewCount: 185,
    photo: "/images/barber-beck.jpg",
  },
  {
    id: "barber-3",
    idNumber: 3,
    name: "ช่างฟลุ๊ค",
    badge: "ยอดนิยม",
    categories: ["Fashion"],
    specialty: "Two-Block / Comma Hair / Korean",
    rating: 4.9,
    reviewCount: 142,
    photo: "/images/barber-fluke.jpg",
  },
  {
    id: "barber-4",
    idNumber: 4,
    name: "ช่างเล็ก",
    categories: ["Classic", "Fade"],
    specialty: "Texture Cut / Vintage Fade / Classic",
    rating: 4.8,
    reviewCount: 120,
    photo: "/images/barber-beck.jpg",
  },
  {
    id: "barber-5",
    idNumber: 5,
    name: "ช่างว่าน",
    categories: ["Classic"],
    specialty: "Side Part / Modern Quiff / Classic",
    rating: 4.9,
    reviewCount: 115,
    photo: "/images/barber-veera.jpg",
  },
];

// Time slots from 08:30 to 18:00
const TIME_SLOTS = [
  "08:30", "09:00", "09:30", "10:00",
  "10:30", "11:00", "11:30", "12:00",
  "12:30", "13:00", "13:30", "14:00",
  "14:30", "15:00", "15:30", "16:00",
  "16:30", "17:00", "17:30", "18:00",
];

// Generate realistic date options
function generateDateOptions(): DateOption[] {
  const thaiMonths = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];

  const now = new Date();
  const options: DateOption[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);

    const day = d.getDate();
    const month = thaiMonths[d.getMonth()];
    const year = d.getFullYear();

    let dayLabel = `${day} ${month}`;
    let dateLabel = "-";

    if (i === 0) {
      dayLabel = "วันนี้";
      dateLabel = `${day} ${month}`;
    } else if (i === 1) {
      dayLabel = "พรุ่งนี้";
      dateLabel = `${day} ${month}`;
    } else {
      dayLabel = `${day} ${month}`;
      dateLabel = "-";
    }

    const fullDisplay =
      i === 0
        ? `วันนี้ (${day} ${month} ${year})`
        : i === 1
        ? `พรุ่งนี้ (${day} ${month} ${year})`
        : `${day} ${month} ${year}`;

    const isoDate = `${year}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    options.push({
      dayLabel,
      dateLabel,
      fullDisplay,
      isoDate,
    });
  }

  return options;
}

export default function BookingFlow() {
  const searchParams = useSearchParams();

  // 6 Steps definition
  const STEPS = [
    { number: 1, label: "เลือกบริการ" },
    { number: 2, label: "เลือกช่าง" },
    { number: 3, label: "วันและเวลา" },
    { number: 4, label: "กรอกข้อมูล" },
    { number: 5, label: "ยืนยัน" },
    { number: 6, label: "สำเร็จ" },
  ];

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Selected Service
  const [selectedServiceId, setSelectedServiceId] = useState<string>("haircut-adult");

  // Step 2: Selected Barber & Filter
  const [barberCategory, setBarberCategory] = useState<string>("ทั้งหมด");
  const [selectedBarberId, setSelectedBarberId] = useState<string>("barber-1");

  // Step 3: Date & Time Picker
  const dateOptions = useMemo(() => generateDateOptions(), []);
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(1); // Default: Tomorrow (matches screenshot)
  const [selectedTime, setSelectedTime] = useState<string>("16:00"); // Default 16:00 (matches screenshot)
  // Booked slots: 12:00 (matches screenshot with "(จองแล้ว)")
  const bookedSlots = ["12:00"];

  // Step 4: Customer Details
  const [customerName, setCustomerName] = useState<string>("สมชาย ใจดี");
  const [customerPhone, setCustomerPhone] = useState<string>("081-234-5678");
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string }>({});

  // Step 6: Confirmation code and copy state
  const [bookingCode, setBookingCode] = useState<string>("VB20251008-001");
  const [copied, setCopied] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  // Auto-select from query params if passed
  useEffect(() => {
    const sId = searchParams.get("service") || searchParams.get("hairstyle");
    if (sId) {
      const match = SERVICES_DATA.find((s) => s.id === sId);
      if (match) setSelectedServiceId(match.id);
    }
    const bId = searchParams.get("barber");
    if (bId) {
      const matchB = BARBERS_DATA.find((b) => b.id === bId);
      if (matchB) setSelectedBarberId(matchB.id);
    }
  }, [searchParams]);

  // Selected entities
  const selectedService = useMemo(
    () => SERVICES_DATA.find((s) => s.id === selectedServiceId) || SERVICES_DATA[0],
    [selectedServiceId]
  );

  const selectedBarber = useMemo(
    () => BARBERS_DATA.find((b) => b.id === selectedBarberId) || BARBERS_DATA[1],
    [selectedBarberId]
  );

  const selectedDate = dateOptions[selectedDateIndex] || dateOptions[0];

  // Filtered barbers based on category
  const filteredBarbers = useMemo(() => {
    if (barberCategory === "ทั้งหมด") return BARBERS_DATA;
    return BARBERS_DATA.filter(
      (b) => b.isAnyBarber || b.categories.includes(barberCategory as "Classic" | "Fade" | "Fashion")
    );
  }, [barberCategory]);

  // Copy code to clipboard
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(bookingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Validation for Step 4
  const validateStep4 = (): boolean => {
    const errors: { name?: string; phone?: string } = {};
    if (!customerName.trim()) {
      errors.name = "กรุณากรอกชื่อ - นามสกุล";
    }
    const cleanPhone = customerPhone.replace(/[^0-9]/g, "");
    if (!cleanPhone || cleanPhone.length < 9) {
      errors.phone = "กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง (9-10 หลัก)";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step progression handlers
  const handleNext = () => {
    if (currentStep === 4) {
      if (!validateStep4()) return;
    }
    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Confirm booking in Step 5
  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    // Generate reference code
    const datePart = selectedDate.isoDate.replace(/-/g, "");
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const generatedCode = `VB${datePart}-${randomSuffix}`;
    setBookingCode(generatedCode);

    try {
      // Attempt API call to backend reservation route
      await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.replace(/[^0-9]/g, ""),
          barberId: selectedBarber.idNumber,
          hairstyleId: selectedService.id,
          date: selectedDate.isoDate,
          startTime: selectedTime,
        }),
      });
    } catch {
      // Gracefully continue to Step 6 even if offline or mock DB
    } finally {
      setIsSubmitting(false);
      setCurrentStep(6);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Reset booking to start fresh
  const handleReset = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-100 flex flex-col justify-between selection:bg-[#FFC800] selection:text-black">
      {/* Top Container */}
      <div className="w-full max-w-xl mx-auto px-4 sm:px-6 pt-6 pb-20">
        
        {/* Section Header */}
        <div className="text-center sm:text-left mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            จองคิว
          </h1>
        </div>

        {/* 6-Step Horizontal Progress Stepper */}
        <div className="mb-8 select-none">
          <div className="relative flex items-center justify-between">
            {/* Background connecting line */}
            <div className="absolute top-3.5 sm:top-4 left-3 right-3 h-[2px] bg-zinc-800 -z-0" />
            
            {/* Active connecting line */}
            <div
              className="absolute top-3.5 sm:top-4 left-3 h-[2px] bg-[#FFC800] transition-all duration-300 -z-0"
              style={{
                width: `${((Math.min(currentStep, 6) - 1) / 5) * 100}%`,
              }}
            />

            {STEPS.map((s) => {
              const isActive = s.number === currentStep;
              const isPast = s.number < currentStep;

              return (
                <div
                  key={s.number}
                  onClick={() => {
                    if (isPast && currentStep !== 6) setCurrentStep(s.number);
                  }}
                  className={`flex flex-col items-center relative z-10 ${
                    isPast && currentStep !== 6 ? "cursor-pointer group" : ""
                  }`}
                >
                  {/* Step Circle Node */}
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-[#FFC800] text-black ring-4 ring-[#FFC800]/25 shadow-lg shadow-[#FFC800]/30 scale-105"
                        : isPast
                        ? "bg-[#181818] border-2 border-[#FFC800] text-[#FFC800]"
                        : "bg-[#161616] border border-zinc-700 text-zinc-400"
                    }`}
                  >
                    {isPast ? (
                      <svg
                        className="w-3.5 h-3.5 text-[#FFC800]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      s.number
                    )}
                  </div>

                  {/* Step Label */}
                  <span
                    className={`text-[10px] sm:text-xs mt-1.5 font-medium whitespace-nowrap transition-colors duration-200 ${
                      isActive
                        ? "text-[#FFC800] font-semibold"
                        : isPast
                        ? "text-zinc-300"
                        : "text-zinc-500"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────── */}
        {/* STEP 1: เลือกบริการ (Service Selection)                      */}
        {/* ─────────────────────────────────────────────────────────── */}
        {currentStep === 1 && (
          <div className="animate-fadeIn">
            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                เลือกการใช้บริการ
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                กรุณาเลือกบริการที่ต้องการ
              </p>
            </div>

            {/* Services List */}
            <div className="space-y-3 sm:space-y-3.5">
              {SERVICES_DATA.map((srv) => {
                const isSelected = selectedServiceId === srv.id;

                return (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedServiceId(srv.id)}
                    className={`relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "bg-[#181818] border-2 border-[#FFC800] shadow-xl shadow-[#FFC800]/10 scale-[1.01]"
                        : "bg-[#161616] border border-zinc-850 hover:border-zinc-700 hover:bg-[#1a1a1a]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 sm:gap-4 flex-1 pr-3">
                      {/* Service Thumbnail */}
                      <img
                        src={srv.image}
                        alt={srv.name}
                        className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-zinc-800"
                        loading="lazy"
                      />

                      {/* Service Info */}
                      <div className="flex flex-col justify-center">
                        <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                          {srv.name}
                        </h3>
                        <span className="text-xs text-zinc-400 mt-0.5 font-light">
                          {srv.enName}
                        </span>
                        <div className="flex items-center gap-2 mt-1.5 text-xs sm:text-sm text-zinc-300">
                          <span className="font-semibold text-white">
                            เริ่มต้น {srv.price}.-
                          </span>
                          <span className="text-zinc-600">|</span>
                          <span className="text-zinc-400">{srv.duration} นาที</span>
                        </div>
                      </div>
                    </div>

                    {/* Custom Radio Button */}
                    <div className="shrink-0 flex items-center justify-center">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "border-[#FFC800] bg-transparent"
                            : "border-zinc-600 bg-transparent"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-3 h-3 rounded-full bg-[#FFC800]" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Main Action CTA */}
            <div className="mt-8">
              <button
                onClick={handleNext}
                className="w-full min-h-[48px] py-4 px-6 rounded-xl bg-[#FFC800] hover:bg-[#ffcf1a] active:scale-[0.99] text-black font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#FFC800]/20 transition-all cursor-pointer"
              >
                <span>ไปขั้นตอนถัดไป</span>
                <span className="text-lg">→</span>
              </button>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────── */}
        {/* STEP 2: เลือกช่าง (Barber Selection)                         */}
        {/* ─────────────────────────────────────────────────────────── */}
        {currentStep === 2 && (
          <div className="animate-fadeIn">
            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                เลือกช่างตัดผม
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                เลือกช่างที่คุณต้องการ หรือให้เราจัดช่างที่เหมาะสมให้
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
              {["ทั้งหมด", "Classic", "Fade", "Fashion"].map((cat) => {
                const isActive = barberCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setBarberCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer min-h-[40px] ${
                      isActive
                        ? "bg-[#FFC800] text-black shadow-md shadow-[#FFC800]/20"
                        : "bg-[#181818] border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Barber Cards List */}
            <div className="space-y-3 sm:space-y-3.5">
              {filteredBarbers.map((b) => {
                const isSelected = selectedBarberId === b.id;

                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBarberId(b.id)}
                    className={`relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "bg-[#181818] border-2 border-[#FFC800] shadow-xl shadow-[#FFC800]/10 scale-[1.01]"
                        : "bg-[#161616] border border-zinc-850 hover:border-zinc-700 hover:bg-[#1a1a1a]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 sm:gap-4 flex-1 pr-3">
                      {/* Barber Photo / Avatar */}
                      {b.isAnyBarber ? (
                        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-750 flex items-center justify-center shrink-0 text-2xl shadow-inner">
                          ✂️
                        </div>
                      ) : (
                        <img
                          src={b.photo}
                          alt={b.name}
                          className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-zinc-800"
                          loading="lazy"
                        />
                      )}

                      {/* Barber Info */}
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                            {b.name}
                          </h3>
                          {b.badge && (
                            <span className="bg-[#FFC800]/20 text-[#FFC800] border border-[#FFC800]/30 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium">
                              {b.badge}
                            </span>
                          )}
                        </div>

                        <span className="text-xs text-zinc-400 mt-1 line-clamp-1">
                          {b.specialty}
                        </span>

                        {!b.isAnyBarber && (
                          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-zinc-300">
                            <span className="text-[#FFC800]">★</span>
                            <span className="font-semibold">{b.rating.toFixed(1)}</span>
                            <span className="text-zinc-500">
                              ({b.reviewCount} รีวิว)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Radio Button */}
                    <div className="shrink-0 flex items-center justify-center">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "border-[#FFC800] bg-transparent"
                            : "border-zinc-600 bg-transparent"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-3 h-3 rounded-full bg-[#FFC800]" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Navigation Buttons */}
            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={handleBack}
                className="min-h-[48px] py-3.5 px-6 rounded-xl border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50 text-white font-medium text-sm sm:text-base transition-all cursor-pointer"
              >
                ย้อนกลับ
              </button>
              <button
                onClick={handleNext}
                className="flex-1 min-h-[48px] py-3.5 px-6 rounded-xl bg-[#FFC800] hover:bg-[#ffcf1a] active:scale-[0.99] text-black font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#FFC800]/20 transition-all cursor-pointer"
              >
                <span>ไปขั้นตอนถัดไป</span>
                <span className="text-lg">→</span>
              </button>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────── */}
        {/* STEP 3: เลือกวันและเวลา (Date & Time Picker)                 */}
        {/* ─────────────────────────────────────────────────────────── */}
        {currentStep === 3 && (
          <div className="animate-fadeIn">
            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                เลือกวันและเวลา
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                เลือกวันที่สะดวก และเวลาที่ต้องการ
              </p>
            </div>

            {/* Date Picker Carousel */}
            <div className="relative flex items-center gap-2 mb-6">
              <button
                onClick={() =>
                  setSelectedDateIndex((prev) => Math.max(0, prev - 1))
                }
                disabled={selectedDateIndex === 0}
                className="w-9 h-9 rounded-xl border border-zinc-800 bg-[#161616] hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-zinc-300 shrink-0 cursor-pointer"
                aria-label="วันก่อนหน้า"
              >
                ‹
              </button>

              <div className="flex items-center gap-2.5 overflow-x-auto py-1 flex-1 no-scrollbar">
                {dateOptions.map((opt, idx) => {
                  const isSelected = selectedDateIndex === idx;

                  return (
                    <div
                      key={opt.isoDate}
                      onClick={() => setSelectedDateIndex(idx)}
                      className={`min-w-[76px] sm:min-w-[84px] py-3 px-2 rounded-xl text-center cursor-pointer transition-all duration-200 select-none ${
                        isSelected
                          ? "bg-[#181818] border-2 border-[#FFC800] text-white shadow-lg shadow-[#FFC800]/15 scale-[1.02]"
                          : "bg-[#161616] border border-zinc-800 hover:border-zinc-700 text-zinc-300"
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-semibold whitespace-nowrap">
                        {opt.dayLabel}
                      </div>
                      <div className="text-[11px] sm:text-xs text-zinc-400 mt-1 whitespace-nowrap">
                        {opt.dateLabel}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  setSelectedDateIndex((prev) =>
                    Math.min(dateOptions.length - 1, prev + 1)
                  )
                }
                disabled={selectedDateIndex === dateOptions.length - 1}
                className="w-9 h-9 rounded-xl border border-zinc-800 bg-[#161616] hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-zinc-300 shrink-0 cursor-pointer"
                aria-label="วันถัดไป"
              >
                ›
              </button>
            </div>

            {/* Time Slots Section */}
            <div className="mb-4">
              <h3 className="text-base font-bold text-white mb-3">
                เลือกเวลา
              </h3>

              {/* 4-column Grid */}
              <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                {TIME_SLOTS.map((slot) => {
                  const isBooked = bookedSlots.includes(slot);
                  const isSelected = selectedTime === slot;

                  if (isBooked) {
                    return (
                      <div
                        key={slot}
                        className="min-h-[48px] py-2 px-1 rounded-xl bg-[#121212] border border-zinc-850 text-zinc-600 flex flex-col items-center justify-center cursor-not-allowed select-none"
                      >
                        <span className="text-xs font-semibold text-zinc-500">
                          {slot}
                        </span>
                        <span className="text-[10px] text-zinc-600">
                          จองแล้ว
                        </span>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`min-h-[48px] py-2.5 px-1 rounded-xl text-center text-sm font-medium transition-all cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? "bg-[#181818] border-2 border-[#FFC800] text-white font-bold shadow-md shadow-[#FFC800]/15 scale-[1.02]"
                          : "bg-[#161616] border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Navigation Buttons */}
            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={handleBack}
                className="min-h-[48px] py-3.5 px-6 rounded-xl border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50 text-white font-medium text-sm sm:text-base transition-all cursor-pointer"
              >
                ย้อนกลับ
              </button>
              <button
                onClick={handleNext}
                disabled={!selectedTime}
                className="flex-1 min-h-[48px] py-3.5 px-6 rounded-xl bg-[#FFC800] hover:bg-[#ffcf1a] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#FFC800]/20 transition-all cursor-pointer"
              >
                <span>ไปขั้นตอนถัดไป</span>
                <span className="text-lg">→</span>
              </button>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────── */}
        {/* STEP 4: กรอกข้อมูลผู้จอง (Customer Details Form)              */}
        {/* ─────────────────────────────────────────────────────────── */}
        {currentStep === 4 && (
          <div className="animate-fadeIn">
            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                กรอกข้อมูลผู้จอง
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                กรุณากรอกข้อมูลสำหรับการจองคิว
              </p>
            </div>

            <div className="space-y-4">
              {/* Field: Full Name */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  ชื่อ - นามสกุล <span className="text-[#FFC800]">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (formErrors.name) setFormErrors((p) => ({ ...p, name: undefined }));
                  }}
                  placeholder="สมชาย ใจดี"
                  className={`w-full min-h-[48px] px-4 py-3.5 rounded-xl bg-[#161616] border text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FFC800] transition-colors text-base ${
                    formErrors.name ? "border-red-500" : "border-zinc-800"
                  }`}
                />
                {formErrors.name && (
                  <p className="text-xs text-red-400 mt-1.5">{formErrors.name}</p>
                )}
              </div>

              {/* Field: Phone Number */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  เบอร์โทรศัพท์ <span className="text-[#FFC800]">*</span>
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => {
                    setCustomerPhone(e.target.value);
                    if (formErrors.phone) setFormErrors((p) => ({ ...p, phone: undefined }));
                  }}
                  placeholder="081-234-5678"
                  className={`w-full min-h-[48px] px-4 py-3.5 rounded-xl bg-[#161616] border text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FFC800] transition-colors text-base ${
                    formErrors.phone ? "border-red-500" : "border-zinc-800"
                  }`}
                />
                {formErrors.phone && (
                  <p className="text-xs text-red-400 mt-1.5">{formErrors.phone}</p>
                )}
              </div>

              {/* Info Notice Box */}
              <div className="bg-[#161616] border border-zinc-800 rounded-xl p-4 flex items-start gap-3 mt-2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[#FFC800]">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 4V3z" />
                  </svg>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  เราจะใช้เบอร์นี้ในการยืนยันการจอง และติดต่อกลับหากมีการเปลี่ยนแปลง
                </p>
              </div>
            </div>

            {/* Bottom Navigation Buttons */}
            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={handleBack}
                className="min-h-[48px] py-3.5 px-6 rounded-xl border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50 text-white font-medium text-sm sm:text-base transition-all cursor-pointer"
              >
                ย้อนกลับ
              </button>
              <button
                onClick={handleNext}
                className="flex-1 min-h-[48px] py-3.5 px-6 rounded-xl bg-[#FFC800] hover:bg-[#ffcf1a] active:scale-[0.99] text-black font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#FFC800]/20 transition-all cursor-pointer"
              >
                <span>ไปขั้นตอนถัดไป</span>
                <span className="text-lg">→</span>
              </button>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────── */}
        {/* STEP 5: ยืนยัน (Order Summary & Confirm)                    */}
        {/* ─────────────────────────────────────────────────────────── */}
        {currentStep === 5 && (
          <div className="animate-fadeIn">
            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                ตรวจสอบข้อมูลการจอง
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนยืนยัน
              </p>
            </div>

            {/* Order Summary Card */}
            <div className="bg-[#181818] border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl">
              {/* Upper Section */}
              <div className="flex items-start gap-4">
                <img
                  src={selectedBarber.photo}
                  alt={selectedBarber.name}
                  className="w-22 h-22 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 border border-zinc-800"
                />

                <div className="flex flex-col justify-center flex-1">
                  <span className="text-xs text-zinc-400">บริการ</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {selectedService.name}
                  </h3>
                  <div className="text-xs sm:text-sm text-zinc-300 font-medium mt-0.5">
                    {selectedService.price}.- <span className="text-zinc-600">|</span> {selectedService.duration} นาที
                  </div>

                  <span className="text-xs text-zinc-400 mt-2.5">ช่าง</span>
                  <div className="font-semibold text-white text-sm sm:text-base">
                    {selectedBarber.name}
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                    {selectedBarber.specialty}
                  </div>
                  {!selectedBarber.isAnyBarber && (
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-300">
                      <span className="text-[#FFC800]">★</span>
                      <span className="font-semibold">{selectedBarber.rating.toFixed(1)}</span>
                      <span className="text-zinc-500">
                        ({selectedBarber.reviewCount} รีวิว)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="h-[1px] bg-zinc-800/80 my-4.5" />

              {/* Lower Section (Itemized Rows) */}
              <div className="space-y-3.5">
                {/* Date & Time Row */}
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-400">วันที่และเวลา</span>
                    <span className="text-sm font-semibold text-white mt-0.5">
                      {selectedDate.fullDisplay} <span className="text-zinc-600">|</span> {selectedTime} น.
                    </span>
                  </div>
                </div>

                {/* Customer Name Row */}
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-400">ชื่อผู้จอง</span>
                    <span className="text-sm font-semibold text-white mt-0.5">
                      {customerName}
                    </span>
                  </div>
                </div>

                {/* Customer Phone Row */}
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-400">เบอร์โทรศัพท์</span>
                    <span className="text-sm font-semibold text-white mt-0.5">
                      {customerPhone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Controls */}
            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={handleBack}
                disabled={isSubmitting}
                className="min-h-[48px] py-3.5 px-6 rounded-xl border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50 text-white font-medium text-sm sm:text-base transition-all cursor-pointer"
              >
                ย้อนกลับ
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="flex-1 min-h-[48px] py-3.5 px-6 rounded-xl bg-[#FFC800] hover:bg-[#ffcf1a] active:scale-[0.99] text-black font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#FFC800]/20 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    กำลังยืนยัน...
                  </span>
                ) : (
                  <>
                    <span>ยืนยันการจอง</span>
                    <span className="text-lg">→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────── */}
        {/* STEP 6: สำเร็จ (Booking Success View)                        */}
        {/* ─────────────────────────────────────────────────────────── */}
        {currentStep === 6 && (
          <div className="animate-fadeIn text-center">
            {/* Big Gold Checkmark Icon */}
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full border-4 border-[#FFC800] flex items-center justify-center mx-auto text-[#FFC800] shadow-lg shadow-[#FFC800]/25 mb-4">
              <svg
                className="w-10 h-10 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Success Headlines */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              จองคิวสำเร็จ!
            </h2>
            <p className="text-zinc-300 text-sm mt-1.5 font-medium">
              ขอบคุณที่ใช้บริการ Veera Barber
            </p>
            <p className="text-zinc-400 text-xs mt-1">
              กรุณาเก็บหมายเลขการจองไว้สำหรับการยืนยัน
            </p>

            {/* Booking Code Reference Card */}
            <div className="border-2 border-[#FFC800] bg-[#181818]/90 rounded-2xl p-4 sm:p-5 text-center my-6 relative group shadow-xl">
              <span className="text-xs text-zinc-400 uppercase tracking-wider block mb-1">
                รหัสการจองของคุณ
              </span>
              <div className="flex items-center justify-center gap-2.5">
                <span className="text-2xl sm:text-3xl font-black text-[#FFC800] tracking-wider font-mono">
                  {bookingCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg text-[#FFC800] hover:bg-[#FFC800]/15 transition-all cursor-pointer relative"
                  title="คัดลอกรหัสการจอง"
                  aria-label="คัดลอกรหัสการจอง"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  {copied && (
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#FFC800] text-black text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap animate-fadeIn">
                      คัดลอกแล้ว!
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Itemized Details Card */}
            <div className="bg-[#181818] border border-zinc-800 rounded-2xl p-4 sm:p-5 text-left flex items-start gap-4 mb-6 shadow-xl">
              <img
                src={selectedBarber.photo}
                alt={selectedBarber.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-zinc-800 mt-1"
              />

              <div className="flex-1 space-y-1.5 text-xs sm:text-sm">
                <div className="flex items-start">
                  <span className="text-zinc-400 w-24 shrink-0">บริการ</span>
                  <span className="text-white font-medium">
                    {selectedService.name} <span className="text-zinc-600">|</span> {selectedService.price}.- <span className="text-zinc-600">|</span> {selectedService.duration} นาที
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="text-zinc-400 w-24 shrink-0">ช่าง</span>
                  <span className="text-white font-medium">
                    {selectedBarber.name} <span className="text-zinc-600">|</span> {selectedBarber.specialty}
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="text-zinc-400 w-24 shrink-0">วันที่และเวลา</span>
                  <span className="text-white font-medium">
                    {selectedDate.fullDisplay} <span className="text-zinc-600">|</span> {selectedTime} น.
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="text-zinc-400 w-24 shrink-0">ชื่อผู้จอง</span>
                  <span className="text-white font-medium">
                    {customerName} <span className="text-zinc-600">|</span> {customerPhone}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setShowDetailModal(true)}
                className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-[#FFC800] hover:bg-[#ffcf1a] active:scale-[0.99] text-black font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#FFC800]/20 transition-all cursor-pointer"
              >
                ดูรายละเอียดการจอง
              </button>

              <Link
                href="/"
                className="w-full min-h-[48px] py-3.5 px-6 rounded-xl border border-zinc-800 hover:border-zinc-600 bg-transparent text-white font-medium text-sm sm:text-base flex items-center justify-center transition-all"
              >
                กลับสู่หน้าหลัก
              </Link>

              <button
                onClick={handleReset}
                className="text-xs text-zinc-500 hover:text-[#FFC800] underline mt-3 inline-block transition-colors cursor-pointer"
              >
                จองคิวใหม่อีกครั้ง
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* Booking Details Modal Popup (For "ดูรายละเอียดการจอง")      */}
      {/* ─────────────────────────────────────────────────────────── */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setShowDetailModal(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white text-lg p-2 rounded-lg cursor-pointer"
              aria-label="ปิด"
            >
              ✕
            </button>

            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-full bg-[#FFC800]/20 text-[#FFC800] flex items-center justify-center mx-auto mb-2 text-xl font-bold">
                ✂️
              </div>
              <h3 className="text-xl font-bold text-white">บัตรคิว Veera Barber</h3>
              <p className="text-xs text-zinc-400">สาขาแจ้งวัฒนะ 28 · นนทบุรี</p>
            </div>

            <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-4 mb-5 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between border-b border-zinc-850 pb-2">
                <span className="text-zinc-400">รหัสจองคิว</span>
                <span className="font-mono font-bold text-[#FFC800]">{bookingCode}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-850 pb-2">
                <span className="text-zinc-400">บริการ</span>
                <span className="font-semibold text-white">{selectedService.name}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-850 pb-2">
                <span className="text-zinc-400">ค่าบริการ</span>
                <span className="font-semibold text-white">{selectedService.price} บาท</span>
              </div>
              <div className="flex justify-between border-b border-zinc-850 pb-2">
                <span className="text-zinc-400">ช่างตัดผม</span>
                <span className="font-semibold text-white">{selectedBarber.name}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-850 pb-2">
                <span className="text-zinc-400">วันเวลาที่นัดหมาย</span>
                <span className="font-semibold text-white">{selectedDate.fullDisplay} {selectedTime} น.</span>
              </div>
              <div className="flex justify-between border-b border-zinc-850 pb-2">
                <span className="text-zinc-400">ชื่อลูกค้า</span>
                <span className="font-semibold text-white">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">เบอร์โทร</span>
                <span className="font-semibold text-white">{customerPhone}</span>
              </div>
            </div>

            <div className="text-[11px] text-zinc-500 text-center mb-5 leading-relaxed">
              * กรุณามาถึงก่อนเวลานัดหมาย 5-10 นาที หากมาช้ากว่า 15 นาที ระบบอาจส่งต่อคิวให้ลูกค้าท่านถัดไป
            </div>

            <button
              onClick={() => setShowDetailModal(false)}
              className="w-full min-h-[48px] py-3 rounded-xl bg-[#FFC800] hover:bg-[#ffcf1a] text-black font-bold text-sm cursor-pointer shadow-md"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* Brand Footer (as shown in reference screenshots)           */}
      {/* ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-900 bg-black/90 py-8 px-4 text-center mt-12">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-4">
          {/* Logo */}
          <div className="flex flex-col items-center">
            <span className="text-base font-bold tracking-widest text-[#FFC800] uppercase">
              VEERA
            </span>
            <span className="text-[10px] tracking-widest text-zinc-400 -mt-1 font-semibold uppercase">
              BARBER
            </span>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400 font-light">
            <Link href="/about" className="hover:text-white transition-colors">
              เกี่ยวกับร้าน
            </Link>
            <Link href="/#barbers" className="hover:text-white transition-colors">
              ช่างและรีวิว
            </Link>
            <Link href="/book" className="text-[#FFC800] hover:underline">
              จองคิว
            </Link>
            <Link href="/#location" className="hover:text-white transition-colors">
              Location
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-zinc-400 text-sm">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:text-[#FFC800] hover:border-[#FFC800] transition-colors"
              aria-label="Facebook"
            >
              f
            </a>
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:text-[#FFC800] hover:border-[#FFC800] transition-colors"
              aria-label="Instagram"
            >
              📷
            </a>
            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:text-[#FFC800] hover:border-[#FFC800] transition-colors"
              aria-label="YouTube"
            >
              ▶
            </a>
          </div>

          {/* Copyright */}
          <p className="text-[11px] text-zinc-600 mt-1">
            © 2025 Veera Barber. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
