"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BookingProvider,
  useBooking,
  SERVICES_DATA,
  SERVICE_CATEGORIES,
  SERVICE_CATEGORY_MAP,
  SERVICE_DESCRIPTIONS,
  SERVICE_ADDONS_CONFIG,
  BARBERS_DATA,
  TIME_SLOTS,
} from "@/context/BookingContext";
import BookingSummaryCard from "@/components/booking/BookingSummaryCard";

function BookingFlowContent() {
  const {
    currentStep,
    activeCategory,
    setActiveCategory,
    selectedService,
    selectService,
    selectedAddOns,
    toggleAddOn,
    totalDuration,
    totalPrice,
    serviceAlert,
    clearServiceAlert,
    barberCategory,
    setBarberCategory,
    selectedBarber,
    setSelectedBarber,
    dateOptions,
    selectedDateIndex,
    setSelectedDateIndex,
    selectedDate,
    selectedTime,
    setSelectedTime,
    bookedSlots,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    customerNotes,
    setCustomerNotes,
    formErrors,
    setFormErrors,
    isSubmitting,
    bookingCode,
    goToStep,
    handleNext,
    handleBack,
    resetBooking,
  } = useBooking();

  // Local state for Step 6 copy and detail modal
  const [copied, setCopied] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  // Focus shift to step heading on step transition
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    stepHeadingRef.current?.focus();
  }, [currentStep]);

  // Filtered Services based on Category
  const filteredServices = useMemo(() => {
    if (activeCategory === "ทั้งหมด") return SERVICES_DATA;
    return SERVICES_DATA.filter((s) => {
      const cats = SERVICE_CATEGORY_MAP[s.id] || [];
      return cats.includes(activeCategory);
    });
  }, [activeCategory]);

  // Filtered Barbers
  const filteredBarbers = useMemo(() => {
    if (barberCategory === "All") return BARBERS_DATA;
    return BARBERS_DATA.filter(
      (b) => b.isAnyBarber || b.categories.includes(barberCategory)
    );
  }, [barberCategory]);

  const handleCopyCode = () => {
    if (!bookingCode) return;
    navigator.clipboard.writeText(bookingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const STEPS = [
    { number: 1, label: "เลือกบริการ" },
    { number: 2, label: "เลือกช่าง" },
    { number: 3, label: "วันและเวลา" },
    { number: 4, label: "กรอกข้อมูล" },
    { number: 5, label: "ยืนยัน" },
    { number: 6, label: "สำเร็จ" },
  ];

  return (
    <div className="min-h-screen bg-[#F4F1EC] text-[#0B1F1F] font-thai-looped relative overflow-hidden flex flex-col justify-between selection:bg-[#A8703A] selection:text-white">
      {/* ─────────────────────────────────────────────────────────── */}
      {/* BACKGROUND DECORATIONS (Palm Shadow & "VEERA" Watermark)    */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute -top-16 -right-16 sm:-top-10 sm:-right-10 w-96 h-96 sm:w-[500px] sm:h-[500px] pointer-events-none opacity-20 sm:opacity-25 select-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at 75% 20%, rgba(35, 45, 30, 0.45) 0%, rgba(168, 112, 58, 0.15) 35%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 400 400"
        className="absolute -top-8 -right-8 w-72 h-72 sm:w-[420px] sm:h-[420px] pointer-events-none opacity-[0.18] select-none text-[#182B1C] z-0 filter blur-[1px]"
        fill="currentColor"
      >
        <path d="M400,0 C320,40 260,110 220,200 C200,245 190,290 180,340 C178,310 185,270 205,225 C230,165 280,105 350,55 Z" />
        <path d="M400,60 C330,95 280,155 245,235 C232,265 224,295 220,330 C215,298 224,260 240,225 C270,165 315,115 380,75 Z" />
        <path d="M400,130 C340,160 295,210 265,280 C256,302 250,326 248,350 C242,324 249,295 262,268 C286,215 325,170 380,140 Z" />
        <path d="M400,200 C350,225 310,270 285,330 C279,345 275,362 274,380 C270,360 274,338 284,318 C305,272 340,234 390,210 Z" />
        <path d="M350,0 C290,50 240,120 205,210 C192,242 184,276 180,310 C175,280 184,244 200,210 C228,150 272,95 330,45 Z" />
      </svg>

      {/* Bottom-Right "VEERA" Serif Watermark */}
      <div
        aria-hidden="true"
        className="absolute -bottom-10 -right-6 font-serif font-black text-[clamp(130px,18vw,260px)] text-[#E7E1D7]/75 select-none pointer-events-none leading-none tracking-tight z-0"
      >
        VEERA
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* MAIN CONTAINER (max-w-[1200px] centered)                    */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-[1200px] mx-auto px-[clamp(16px,4vw,48px)] pt-3 sm:pt-5 pb-20 lg:pb-12 relative z-10 flex-1">
        {/* Page Header (Desktop: Left Headline & Right Stepper) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6 mb-4 sm:mb-5">
          {/* Left: Eyebrow + H1 + Subtitle */}
          <div>
            <span className="font-serif tracking-[0.24em] text-[#A8703A] text-[12px] font-semibold uppercase block mb-1">
              BOOKING · STEP 0{currentStep} OF 06
            </span>
            <h1
              ref={stepHeadingRef}
              tabIndex={-1}
              className="text-[clamp(32px,3.2vw,44px)] font-bold text-[#0B1F1F] tracking-tight leading-[1.1] outline-none"
            >
              {STEPS[currentStep - 1]?.label || "เลือกบริการ"}
            </h1>
            <p className="text-[13px] sm:text-[15px] text-[#6B6B66] mt-1 leading-snug">
              {currentStep === 1
                ? "เลือกบริการที่ต้องการ จากนั้นเราจะพาคุณไปขั้นตอนถัดไป"
                : currentStep === 2
                ? "เลือกช่างที่คุณต้องการ หรือให้เราจัดช่างที่เหมาะสมให้"
                : currentStep === 3
                ? "เลือกวันที่และเวลาที่สะดวกเข้ารับบริการ"
                : currentStep === 4
                ? "กรุณากรอกข้อมูลสำหรับการติดต่อและยืนยันการจอง"
                : currentStep === 5
                ? "ตรวจสอบความถูกต้องของข้อมูลก่อนยืนยัน"
                : "การจองคิวของคุณเสร็จสมบูรณ์เรียบร้อยแล้ว"}
            </p>
          </div>

          {/* Right: Stepper (6 steps) */}
          <div className="select-none py-1 overflow-x-auto no-scrollbar shrink-0">
            <div className="relative flex items-center gap-1.5 sm:gap-3 md:gap-4 min-w-max">
              {/* Background Connecting Line */}
              <div className="absolute top-[13px] left-3 right-3 h-[1px] bg-[#E3DED6] -z-0" />

              {STEPS.map((s) => {
                const isActive = s.number === currentStep;
                const isPast = s.number < currentStep;

                return (
                  <div
                    key={s.number}
                    onClick={() => {
                      if (isPast && currentStep !== 6) goToStep(s.number);
                    }}
                    className={`flex flex-col items-center relative z-10 min-w-[48px] sm:min-w-[54px] ${
                      isPast && currentStep !== 6 ? "cursor-pointer group" : ""
                    }`}
                  >
                    {/* Circle 26px */}
                    <div
                      className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-[#A8703A] text-white shadow-[0_0_12px_rgba(168,112,58,0.4)] ring-2 ring-[#A8703A]/20"
                          : isPast
                          ? "bg-[#0B1F1F] text-white border border-[#0B1F1F]"
                          : "bg-white text-[#9A9A94] border border-[#E3DED6]"
                      }`}
                    >
                      {isPast ? "✓" : s.number}
                    </div>

                    {/* Step Label */}
                    <span
                      className={`text-[11px] sm:text-[12px] mt-1 transition-colors duration-200 whitespace-nowrap ${
                        isActive
                          ? "text-[#0B1F1F] font-bold"
                          : "text-[#9A9A94] font-medium"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────── */}
        {/* SHARED 2-COLUMN LAYOUT (PERMANENT ACROSS ALL STEPS 1 TO 6)  */}
        {/* ─────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-start">
          {/* Left Column (~62%): Step Content */}
          <div className="lg:col-span-7 xl:col-span-7 min-w-0">
            {/* ─────────────────────────────────────────────────────────── */}
            {/* STEP 1: เลือกบริการ (Single-select radio behavior)          */}
            {/* ─────────────────────────────────────────────────────────── */}
            {currentStep === 1 && (
              <div className="animate-fadeIn">
                <span className="font-serif tracking-[0.24em] text-[#A8703A] text-[11px] font-semibold uppercase block mb-2">
                  OUR SERVICES
                </span>

                {/* Service Alert Toast (if changed service with previous slot) */}
                {serviceAlert && (
                  <div className="mb-3 p-3 rounded-[10px] bg-[#A8703A]/10 border border-[#A8703A]/30 flex items-center justify-between text-xs text-[#0B1F1F]">
                    <div className="flex items-center gap-2">
                      <span className="text-[#A8703A] font-bold">ℹ</span>
                      <span>{serviceAlert}</span>
                    </div>
                    <button
                      type="button"
                      onClick={clearServiceAlert}
                      className="text-[#A8703A] font-semibold hover:underline ml-2 cursor-pointer"
                    >
                      รับทราบ
                    </button>
                  </div>
                )}

                {/* Category Filter Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-4 no-scrollbar">
                  {SERVICE_CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={`h-8 px-3.5 rounded-full text-[13px] font-medium transition-all duration-150 cursor-pointer shrink-0 border ${
                          isActive
                            ? "bg-[#0B1F1F] text-white border-[#0B1F1F] shadow-sm"
                            : "bg-transparent text-[#0B1F1F] border-[#E3DED6] hover:border-[#0B1F1F]/40 hover:bg-[#EFEAE2]/40"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* Services List (Single-select: click replaces immediately) */}
                <div className="border-t border-[#E3DED6]">
                  {filteredServices.map((srv) => {
                    const isSelected = selectedService?.id === srv.id;
                    const availableAddOns = SERVICE_ADDONS_CONFIG[srv.id] || [];

                    return (
                      <div
                        key={srv.id}
                        className={`border-b border-[#E3DED6] transition-colors rounded-[12px] overflow-hidden ${
                          isSelected ? "bg-[#EFEAE2]/35" : ""
                        }`}
                      >
                        <div
                          onClick={() => selectService(srv)}
                          className="py-3.5 sm:py-4 px-3 sm:px-3.5 transition-all duration-150 hover:bg-[#EFEAE2]/60 cursor-pointer flex items-center justify-between gap-3 sm:gap-4 group"
                        >
                          {/* Left: Thumbnail ~120x80 */}
                          <div className="relative w-[100px] h-[67px] sm:w-[120px] sm:h-[80px] rounded-[8px] overflow-hidden shrink-0 border border-black/5 bg-[#E3DED6]/40 shadow-sm">
                            <img
                              src={srv.image}
                              alt={srv.name}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>

                          {/* Middle: Info */}
                          <div className="flex-1 min-w-0 pr-1">
                            <div className="flex items-baseline gap-2">
                              <h3 className="text-base font-bold text-[#0B1F1F] leading-snug">
                                {srv.name}
                              </h3>
                              <span className="text-[13px] text-[#6B6B66] font-sans hidden sm:inline">
                                {srv.enName}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[12px] text-[#6B6B66]">
                              <svg
                                className="w-3.5 h-3.5 text-[#A8703A] shrink-0"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              <span>{srv.duration} นาที</span>
                            </div>
                            <p className="text-[13px] text-[#6B6B66] mt-1 line-clamp-1 leading-snug">
                              {SERVICE_DESCRIPTIONS[srv.id] ||
                                "บริการตัดแต่งทรงผมคุณภาพระดับพรีเมียม"}
                            </p>

                            {/* Inline Compact Add-ons for Selected Service (ใต้คำอธิบายแบบกะทัดรัด ไม่แยกเป็นบล็อกสูง) */}
                            {isSelected && availableAddOns.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-1.5 border-t border-[#E3DED6]/60">
                                <span className="text-[11px] font-semibold text-[#6B6B66]">
                                  เสริม:
                                </span>
                                {availableAddOns.map((addon) => {
                                  const isAddOnSelected = selectedAddOns.some(
                                    (a) => a.id === addon.id
                                  );

                                  return (
                                    <button
                                      key={addon.id}
                                      type="button"
                                      aria-pressed={isAddOnSelected}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleAddOn(addon);
                                      }}
                                      className={`h-[26px] px-2.5 rounded-full text-[11px] font-medium transition-all duration-150 cursor-pointer flex items-center gap-1 focus:outline-none select-none ${
                                        isAddOnSelected
                                          ? "border border-[#A8703A] bg-[#A8703A]/20 text-[#A8703A] font-semibold"
                                          : "border border-[#A8703A]/70 bg-transparent text-[#A8703A] hover:bg-[#A8703A]/10"
                                      }`}
                                    >
                                      {isAddOnSelected ? (
                                        <>
                                          <span>{addon.nameTh} (+{addon.price} ฿)</span>
                                          <span className="text-[10px]">✓</span>
                                        </>
                                      ) : (
                                        <>
                                          <span>+ {addon.nameTh} (+{addon.price} ฿)</span>
                                        </>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Right: Price + Radio Indicator */}
                          <div className="flex items-center gap-3 sm:gap-4 shrink-0 self-center">
                            <span
                              className={`text-base font-semibold tabular-nums transition-colors ${
                                isSelected ? "text-[#A8703A]" : "text-[#0B1F1F]"
                              }`}
                            >
                              {srv.price.toLocaleString()} ฿
                            </span>

                            {/* Custom Radio Button ~18px */}
                            <div
                              className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-all ${
                                isSelected
                                  ? "border-[#A8703A] bg-transparent"
                                  : "border-[#D1CAC0] bg-transparent group-hover:border-[#0B1F1F]/40"
                              }`}
                            >
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-[#0B1F1F]" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────── */}
            {/* STEP 2: เลือกช่าง (Barber Selection)                         */}
            {/* ─────────────────────────────────────────────────────────── */}
            {currentStep === 2 && (
              <div className="animate-fadeIn">
                <div className="mb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-[#0B1F1F] tracking-tight">
                    เลือกช่างตัดผม
                  </h2>
                  <p className="text-[13px] text-[#6B6B66] mt-0.5">
                    เลือกช่างที่คุณต้องการ หรือให้เราจัดช่างที่เหมาะสมให้
                  </p>
                </div>

                {/* Category Filter Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-3.5 no-scrollbar">
                  {(
                    [
                      { id: "All", label: "ทั้งหมด" },
                      { id: "Classic", label: "ทรงคลาสสิก" },
                      { id: "Fade", label: "สกินเฟด" },
                      { id: "Fashion", label: "สไตล์เกาหลี" },
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setBarberCategory(cat.id)}
                      className={`h-8 px-3.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all cursor-pointer border ${
                        barberCategory === cat.id
                          ? "bg-[#0B1F1F] text-white border-[#0B1F1F] shadow-sm"
                          : "bg-[#FBFAF8] border-[#E3DED6] text-[#0B1F1F] hover:border-[#0B1F1F]/40"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Barbers List */}
                <div className="space-y-2.5">
                  {filteredBarbers.map((b) => {
                    const isSelected = selectedBarber.id === b.id;

                    return (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBarber(b)}
                        className={`relative min-h-[64px] flex items-center justify-between p-3 sm:p-3.5 rounded-[12px] cursor-pointer transition-all duration-150 border ${
                          isSelected
                            ? "bg-[#FBFAF8] border-[#A8703A] shadow-sm ring-1 ring-[#A8703A]/20"
                            : "bg-[#FBFAF8] border-[#E3DED6] hover:border-[#0B1F1F]/30"
                        }`}
                      >
                        <div className="flex items-center gap-3.5 flex-1 pr-2">
                          {/* Barber Photo / Icon */}
                          {b.isAnyBarber ? (
                            <div className="w-13 h-13 sm:w-15 sm:h-15 w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-[10px] bg-[#A8703A]/15 border border-[#A8703A]/30 flex items-center justify-center shrink-0 text-xl text-[#A8703A]">
                              ✂
                            </div>
                          ) : (
                            <img
                              src={b.photo}
                              alt={b.name}
                              className="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-[10px] object-cover shrink-0 border border-black/5"
                              loading="lazy"
                            />
                          )}

                          {/* Barber Info */}
                          <div className="flex flex-col justify-center">
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-[#0B1F1F] leading-snug">
                                {b.name}
                              </h3>
                              {b.badge && (
                                <span className="bg-[#A8703A]/15 text-[#A8703A] border border-[#A8703A]/30 text-[10px] font-mono px-2 py-0.5 rounded-full font-medium">
                                  {b.badge}
                                </span>
                              )}
                            </div>

                            <span className="text-[12px] text-[#6B6B66] mt-0.5 line-clamp-1">
                              {b.specialty}
                            </span>

                            {!b.isAnyBarber && (
                              <div className="flex items-center gap-1 mt-1 text-[11px] text-[#A8703A]">
                                <span>★</span>
                                <span className="font-semibold">{b.rating.toFixed(1)}</span>
                                <span className="text-[#9A9A94] font-normal">
                                  ({b.reviewCount} รีวิว)
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Radio Button */}
                        <div className="shrink-0 flex items-center justify-center">
                          <div
                            className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-all ${
                              isSelected
                                ? "border-[#A8703A] bg-transparent"
                                : "border-[#D1CAC0] bg-transparent"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-[#0B1F1F]" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Secondary Back Button */}
                <div className="mt-5 flex justify-start">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E3DED6] bg-white hover:bg-[#EFEAE2] hover:border-[#0B1F1F]/30 text-[#0B1F1F] font-medium text-[13px] transition-all cursor-pointer shadow-sm"
                  >
                    <span aria-hidden="true">←</span>
                    <span>ย้อนกลับ</span>
                  </button>
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────── */}
            {/* STEP 3: เลือกวันและเวลา (Date & Time Picker)                 */}
            {/* ─────────────────────────────────────────────────────────── */}
            {currentStep === 3 && (
              <div className="animate-fadeIn">
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#0B1F1F] tracking-tight">
                      เลือกวันและเวลา
                    </h2>
                    <p className="text-[13px] text-[#6B6B66] mt-0.5">
                      เลือกวันที่สะดวก และเวลาที่ต้องการ
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#A8703A]/10 text-[#A8703A] text-[11px] font-semibold self-start sm:self-auto border border-[#A8703A]/25">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>ระยะเวลารวม: {totalDuration} นาที</span>
                  </div>
                </div>

                {/* Date Picker Carousel */}
                <div className="relative flex items-center gap-2 mb-5">
                  <button
                    onClick={() =>
                      setSelectedDateIndex((prev) => Math.max(0, prev - 1))
                    }
                    disabled={selectedDateIndex === 0}
                    className="w-8 h-8 rounded-full border border-[#E3DED6] bg-[#FBFAF8] hover:border-[#0B1F1F]/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[#0B1F1F] shrink-0 cursor-pointer transition-all text-sm"
                    aria-label="วันก่อนหน้า"
                  >
                    ‹
                  </button>

                  <div className="flex items-center gap-2 overflow-x-auto py-1 flex-1 no-scrollbar">
                    {dateOptions.map((opt, idx) => {
                      const isSelected = selectedDateIndex === idx;

                      return (
                        <div
                          key={opt.isoDate}
                          onClick={() => setSelectedDateIndex(idx)}
                          className={`min-w-[72px] sm:min-w-[80px] min-h-[56px] py-2 px-1.5 rounded-[12px] text-center cursor-pointer transition-all duration-150 select-none border ${
                            isSelected
                              ? "bg-[#0B1F1F] text-white border-[#0B1F1F] shadow-sm"
                              : "bg-[#FBFAF8] border-[#E3DED6] hover:border-[#0B1F1F]/30 text-[#6B6B66]"
                          }`}
                        >
                          <div className="text-[12px] sm:text-[13px] font-semibold whitespace-nowrap">
                            {opt.dayLabel}
                          </div>
                          <div
                            className={`text-[10px] sm:text-[11px] mt-0.5 whitespace-nowrap ${
                              isSelected ? "text-white/70" : "text-[#9A9A94]"
                            }`}
                          >
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
                    className="w-8 h-8 rounded-full border border-[#E3DED6] bg-[#FBFAF8] hover:border-[#0B1F1F]/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[#0B1F1F] shrink-0 cursor-pointer transition-all text-sm"
                    aria-label="วันถัดไป"
                  >
                    ›
                  </button>
                </div>

                {/* Time Slots Section */}
                <div className="mb-4">
                  <h3 className="text-[14px] font-bold text-[#0B1F1F] mb-2.5">
                    เลือกเวลา
                  </h3>

                  <div className="grid grid-cols-4 gap-2">
                    {TIME_SLOTS.map((slot) => {
                      const isBooked = bookedSlots.includes(slot);
                      const isSelected = selectedTime === slot;

                      if (isBooked) {
                        return (
                          <div
                            key={slot}
                            className="min-h-[40px] py-1.5 px-1 rounded-full bg-[#E3DED6]/40 border border-[#E3DED6] text-[#9A9A94] flex flex-col items-center justify-center cursor-not-allowed select-none"
                          >
                            <span className="text-[11px] font-semibold">{slot}</span>
                            <span className="text-[9px] text-[#9A9A94]">จองแล้ว</span>
                          </div>
                        );
                      }

                      return (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`min-h-[40px] py-2 px-1 rounded-full text-center text-[13px] transition-all cursor-pointer flex items-center justify-center border ${
                            isSelected
                              ? "bg-[#0B1F1F] text-white font-bold shadow-sm border-[#0B1F1F]"
                              : "bg-[#FBFAF8] border-[#E3DED6] hover:border-[#0B1F1F]/40 text-[#0B1F1F]"
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Secondary Back Button */}
                <div className="mt-5 flex justify-start">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E3DED6] bg-white hover:bg-[#EFEAE2] hover:border-[#0B1F1F]/30 text-[#0B1F1F] font-medium text-[13px] transition-all cursor-pointer shadow-sm"
                  >
                    <span aria-hidden="true">←</span>
                    <span>ย้อนกลับ</span>
                  </button>
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────── */}
            {/* STEP 4: กรอกข้อมูลผู้จอง (Customer Details Form)              */}
            {/* ─────────────────────────────────────────────────────────── */}
            {currentStep === 4 && (
              <div className="animate-fadeIn">
                <div className="mb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-[#0B1F1F] tracking-tight">
                    กรอกข้อมูลผู้จอง
                  </h2>
                  <p className="text-[13px] text-[#6B6B66] mt-0.5">
                    กรุณากรอกข้อมูลสำหรับการจองคิว
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleNext();
                  }}
                  className="space-y-3"
                >
                  {/* Field: Full Name */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#0B1F1F] mb-1.5">
                      ชื่อ - นามสกุล <span className="text-[#A8703A]">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (formErrors.name) {
                          setFormErrors((p) => ({ ...p, name: undefined }));
                        }
                      }}
                      placeholder="สมชาย ใจดี"
                      className={`w-full min-h-[42px] px-4 py-2 rounded-[12px] bg-white border text-[#0B1F1F] placeholder:text-[#9A9A94] focus:outline-none focus:border-[#A8703A] transition-colors text-[14px] ${
                        formErrors.name ? "border-red-500" : "border-[#E3DED6]"
                      }`}
                    />
                    {formErrors.name && (
                      <p className="text-xs text-red-500 mt-1 ml-2">{formErrors.name}</p>
                    )}
                  </div>

                  {/* Field: Phone Number */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#0B1F1F] mb-1.5">
                      เบอร์โทรศัพท์ <span className="text-[#A8703A]">*</span>
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        if (formErrors.phone) {
                          setFormErrors((p) => ({ ...p, phone: undefined }));
                        }
                      }}
                      placeholder="0812345678"
                      className={`w-full min-h-[42px] px-4 py-2 rounded-[12px] bg-white border text-[#0B1F1F] placeholder:text-[#9A9A94] focus:outline-none focus:border-[#A8703A] transition-colors text-[14px] ${
                        formErrors.phone ? "border-red-500" : "border-[#E3DED6]"
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="text-xs text-red-500 mt-1 ml-2">{formErrors.phone}</p>
                    )}
                  </div>

                  {/* Field: Special Request / Notes */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#0B1F1F] mb-1.5">
                      หมายเหตุเพิ่มเติม (ถ้ามี)
                    </label>
                    <textarea
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      rows={2}
                      placeholder="เช่น อยากได้ทรงเดิม, ผมหนา, ต้องการคำแนะนำก่อนตัด"
                      className="w-full px-4 py-2.5 rounded-[12px] bg-white border border-[#E3DED6] text-[#0B1F1F] placeholder:text-[#9A9A94] focus:outline-none focus:border-[#A8703A] transition-colors text-[14px] resize-none"
                    />
                  </div>

                  {/* Hidden submit button to allow Enter key submit on form */}
                  <button type="submit" className="hidden" tabIndex={-1} aria-hidden="true" />
                </form>

                {/* Secondary Back Button */}
                <div className="mt-5 flex justify-start">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E3DED6] bg-white hover:bg-[#EFEAE2] hover:border-[#0B1F1F]/30 text-[#0B1F1F] font-medium text-[13px] transition-all cursor-pointer shadow-sm"
                  >
                    <span aria-hidden="true">←</span>
                    <span>ย้อนกลับ</span>
                  </button>
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────── */}
            {/* STEP 5: ยืนยัน (Order Summary & Confirm)                    */}
            {/* ─────────────────────────────────────────────────────────── */}
            {currentStep === 5 && (
              <div className="animate-fadeIn">
                <div className="mb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-[#0B1F1F] tracking-tight">
                    ตรวจสอบข้อมูลการจอง
                  </h2>
                  <p className="text-[13px] text-[#6B6B66] mt-0.5">
                    กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนยืนยัน
                  </p>
                </div>

                {/* Salon Policies & Guide on the Left */}
                <div className="bg-[#FBFAF8] border border-[#E3DED6] rounded-[16px] p-4 sm:p-5 shadow-sm space-y-3.5">
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#A8703A] text-base">✦</span>
                    <div>
                      <h4 className="font-bold text-[#0B1F1F] text-[13px]">การเข้ารับบริการ</h4>
                      <p className="text-[12px] text-[#6B6B66] mt-0.5 leading-relaxed">
                        กรุณาเดินทางมาถึงก่อนเวลานัดหมายอย่างน้อย 5-10 นาที หากมาช้ากว่าเวลานัดหมายเกิน 15 นาที ทางร้านขอสงวนสิทธิ์ในการจัดคิวถัดไป
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-[#E3DED6]" />

                  <div className="flex items-start gap-2.5">
                    <span className="text-[#A8703A] text-base">✦</span>
                    <div>
                      <h4 className="font-bold text-[#0B1F1F] text-[13px]">การชำระเงิน</h4>
                      <p className="text-[12px] text-[#6B6B66] mt-0.5 leading-relaxed">
                        ชำระเงินหน้าร้านหลังรับบริการเสร็จสิ้น (รับเงินสด, โอนเงินผ่าน PromptPay และบัตรเครดิต)
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-[#E3DED6]" />

                  <div className="flex items-start gap-2.5">
                    <span className="text-[#A8703A] text-base">✦</span>
                    <div>
                      <h4 className="font-bold text-[#0B1F1F] text-[13px]">การยกเลิกหรือเลื่อนคิว</h4>
                      <p className="text-[12px] text-[#6B6B66] mt-0.5 leading-relaxed">
                        สามารถแจ้งเลื่อนหรือยกเลิกคิวได้ล่วงหน้าอย่างน้อย 2 ชั่วโมง ผ่านทางโทรศัพท์ 02-123-4567 หรือ LINE Official @veerabarber
                      </p>
                    </div>
                  </div>
                </div>

                {/* Secondary Back Button */}
                <div className="mt-5 flex justify-start">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E3DED6] bg-white hover:bg-[#EFEAE2] hover:border-[#0B1F1F]/30 disabled:opacity-40 disabled:cursor-not-allowed text-[#0B1F1F] font-medium text-[13px] transition-all cursor-pointer shadow-sm"
                  >
                    <span aria-hidden="true">←</span>
                    <span>ย้อนกลับ</span>
                  </button>
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────── */}
            {/* STEP 6: สำเร็จ (Success Screen & Details Modal)              */}
            {/* ─────────────────────────────────────────────────────────── */}
            {currentStep === 6 && (
              <div className="animate-fadeIn">
                {/* Success Card */}
                <div className="bg-[#FBFAF8] border border-[#E3DED6] rounded-[16px] p-5 sm:p-6 shadow-sm text-center">
                  {/* Success Checkmark Icon */}
                  <div className="w-13 h-13 sm:w-16 sm:h-16 w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-full border-2 border-[#A8703A] flex items-center justify-center mx-auto text-[#A8703A] shadow-sm mb-3 bg-[#A8703A]/10">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F1F] tracking-tight">
                    จองคิวสำเร็จ!
                  </h2>
                  <p className="text-[13px] text-[#6B6B66] mt-1">
                    เราได้รับข้อมูลการจองคิวของคุณเรียบร้อยแล้ว
                  </p>

                  {/* Booking Code Card */}
                  <div className="border border-[#A8703A]/40 bg-white rounded-[12px] p-3.5 sm:p-4 text-center my-4 relative shadow-sm">
                    <span className="text-[11px] text-[#9A9A94] uppercase tracking-wider block mb-0.5">
                      รหัสการจองของคุณ
                    </span>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#A8703A] tracking-wider font-mono">
                        {bookingCode}
                      </span>
                      <button
                        onClick={handleCopyCode}
                        className="p-1.5 rounded-full text-[#A8703A] hover:bg-[#A8703A]/15 transition-all cursor-pointer relative"
                        title="คัดลอกรหัส"
                      >
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        {copied && (
                          <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] bg-[#0B1F1F] text-white px-2 py-0.5 rounded shadow">
                            คัดลอกแล้ว!
                          </span>
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-[#9A9A94] mt-1">
                      กรุณาแคปหน้าจอนี้ไว้ หรือจดรหัสเพื่อแสดงต่อเจ้าหน้าที่หน้าร้าน
                    </p>
                  </div>

                  {/* Quick Summary Preview */}
                  <div className="bg-white border border-[#E3DED6] rounded-[12px] p-3 text-left text-[13px] space-y-2 mb-4 shadow-sm">
                    <div className="flex justify-between items-center text-xs pb-1.5 border-b border-[#E3DED6]">
                      <span className="text-[#9A9A94]">เวลานัดหมาย</span>
                      <span className="font-semibold text-[#0B1F1F]">
                        {selectedDate.dateLabel} เวลา {selectedTime} น.
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs pb-1.5 border-b border-[#E3DED6]">
                      <span className="text-[#9A9A94]">ช่างที่เลือก</span>
                      <span className="font-semibold text-[#0B1F1F]">
                        {selectedBarber.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-start text-xs">
                      <span className="text-[#9A9A94]">บริการ</span>
                      <div className="text-right">
                        <span className="font-semibold text-[#0B1F1F]">
                          {selectedService?.name} ({selectedService?.price} ฿)
                        </span>
                        {selectedAddOns.map((addon) => (
                          <div key={addon.id} className="text-[#A8703A] font-medium mt-0.5">
                            + {addon.nameTh} (+{addon.price} ฿)
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShowDetailModal(true)}
                      className="w-full h-[42px] py-2 rounded-full border border-[#E3DED6] bg-white text-[#0B1F1F] font-semibold text-[13px] hover:bg-[#EFEAE2] transition-all cursor-pointer shadow-sm"
                    >
                      ดูรายละเอียดการจอง
                    </button>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={resetBooking}
                      className="text-xs text-[#9A9A94] hover:text-[#0B1F1F] underline underline-offset-4 cursor-pointer"
                    >
                      จองคิวใหม่
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Unified Sticky Summary Card (Consistent across all steps) */}
          <div className="lg:col-span-5 xl:col-span-5 sticky top-[76px]">
            <BookingSummaryCard />
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* DETAIL MODAL POPUP (Step 6)                                 */}
      {/* ─────────────────────────────────────────────────────────── */}
      {showDetailModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="relative w-full max-w-md rounded-[20px] border border-[#E3DED6] bg-[#FBFAF8] text-[#0B1F1F] p-6 sm:p-8 shadow-2xl overflow-hidden font-thai-looped"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E3DED6]">
              <div>
                <h3 className="text-lg font-bold text-[#0B1F1F]">
                  รายละเอียดการจอง
                </h3>
                <span className="text-xs font-mono text-[#A8703A]">
                  {bookingCode}
                </span>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-1 rounded-full text-[#9A9A94] hover:text-[#0B1F1F] hover:bg-black/5 transition-colors cursor-pointer"
                aria-label="ปิด"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="py-4 space-y-3.5 text-sm">
              <div className="flex justify-between items-start">
                <span className="text-xs text-[#9A9A94]">ชื่อผู้จอง:</span>
                <span className="font-semibold text-[#0B1F1F] text-right">{customerName}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs text-[#9A9A94]">เบอร์โทร:</span>
                <span className="font-semibold text-[#0B1F1F] text-right font-mono">{customerPhone}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs text-[#9A9A94]">บริการ:</span>
                <div className="text-right">
                  <span className="font-semibold text-[#0B1F1F]">
                    {selectedService?.name} ({selectedService?.duration} นาที)
                  </span>
                  {selectedAddOns.map((addon) => (
                    <div key={addon.id} className="text-xs text-[#A8703A] font-medium mt-0.5">
                      + {addon.nameTh} ({addon.durationMin} นาที · {addon.price} ฿)
                    </div>
                  ))}
                  {selectedAddOns.length > 0 && (
                    <div className="text-[11px] text-[#6B6B66] mt-0.5">
                      รวมระยะเวลา: {totalDuration} นาที
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs text-[#9A9A94]">ช่างที่ตัด:</span>
                <span className="font-semibold text-[#0B1F1F] text-right">{selectedBarber.name}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs text-[#9A9A94]">วันและเวลา:</span>
                <span className="font-semibold text-[#0B1F1F] text-right">
                  {selectedDate.fullDisplay} | {selectedTime} น.
                </span>
              </div>
              {customerNotes && (
                <div className="flex justify-between items-start pt-2 border-t border-[#E3DED6]">
                  <span className="text-xs text-[#9A9A94]">หมายเหตุ:</span>
                  <span className="text-[#6B6B66] text-right text-xs max-w-[220px]">{customerNotes}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-[#E3DED6] text-base">
                <span className="font-bold text-[#0B1F1F]">ยอดชำระหน้าร้าน:</span>
                <span className="font-bold text-[#A8703A] font-serif text-xl">
                  {totalPrice.toLocaleString()} บาท
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-[#E3DED6]">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full py-3 rounded-full bg-[#0B1F1F] text-white font-semibold text-sm hover:bg-black transition-all cursor-pointer"
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingFlow() {
  return (
    <BookingProvider>
      <BookingFlowContent />
    </BookingProvider>
  );
}
