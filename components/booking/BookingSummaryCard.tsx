"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useBooking } from "@/context/BookingContext";

interface BookingSummaryCardProps {
  className?: string;
}

export default function BookingSummaryCard({ className = "" }: BookingSummaryCardProps) {
  const {
    currentStep,
    selectedService,
    clearService,
    selectedAddOns,
    removeAddOn,
    totalDuration,
    selectedBarber,
    selectedDate,
    selectedTime,
    customerName,
    customerPhone,
    totalPrice,
    isSubmitting,
    bookingCode,
    goToStep,
    handleNext,
    confirmBooking,
    resetBooking,
    canProceed,
    missingRequirementText,
    submitError,
  } = useBooking();

  // Mobile bottom sheet toggle
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mask phone for privacy in summary (e.g. 081-xxx-5678)
  const formatMaskedPhone = (phone: string) => {
    const clean = phone.replace(/[^0-9]/g, "");
    if (clean.length >= 10) {
      return `${clean.slice(0, 3)}-xxx-${clean.slice(-4)}`;
    }
    if (clean.length >= 9) {
      return `${clean.slice(0, 2)}-xxx-${clean.slice(-4)}`;
    }
    return phone;
  };

  // Copy code in step 6
  const handleCopyCode = () => {
    if (!bookingCode) return;
    navigator.clipboard.writeText(bookingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Reset confirmation
  const handleResetWithConfirm = () => {
    const ok = window.confirm("ต้องการล้างข้อมูลการจองทั้งหมดและเริ่มต้นใหม่หรือไม่?");
    if (ok) {
      resetBooking();
      setIsMobileSheetOpen(false);
    }
  };

  // Primary action button handler
  const handlePrimaryCta = () => {
    if (!canProceed) return;
    if (currentStep <= 4) {
      handleNext();
      setIsMobileSheetOpen(false);
    } else if (currentStep === 5) {
      confirmBooking();
      setIsMobileSheetOpen(false);
    }
  };

  // Reusable card contents component
  const renderCardContent = (isMobileSheet = false) => (
    <>
      {/* Top Banner (96-104px height) */}
      <div className="relative h-[96px] sm:h-[104px] w-full overflow-hidden bg-[#0B1F1F] shrink-0">
        <img
          src="/images/hero-barber.jpg"
          alt="Veera Barber Atmosphere"
          className="w-full h-full object-cover object-center opacity-70"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(11,31,31,0.92) 0%, rgba(11,31,31,0.7) 45%, rgba(11,31,31,0.3) 100%)",
          }}
        />
        <div className="absolute top-3.5 left-5 z-10">
          <span className="font-serif tracking-[0.2em] text-[#D4AF37] text-xs font-semibold uppercase block leading-tight">
            GOOD HAIR<br />GOOD DAY
          </span>
        </div>
        {currentStep === 6 && (
          <div className="absolute top-3 right-4 z-10 bg-[#A8703A] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-md font-thai-looped">
            ✓ จองสำเร็จ
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-3.5 sm:p-4 overflow-y-auto no-scrollbar flex-1 overscroll-contain">
        {/* Card Header Row */}
        <div className="flex items-center justify-between pb-2 border-b border-[#E3DED6]">
          <h3 className="font-bold text-[#0B1F1F] text-[15px]">
            {currentStep === 6 ? "สรุปการจอง" : "รายการที่เลือก"}
          </h3>
          {currentStep < 5 && selectedService && (
            <button
              type="button"
              onClick={handleResetWithConfirm}
              className="text-[11px] text-[#9A9A94] hover:text-[#0B1F1F] transition-colors cursor-pointer underline underline-offset-2"
            >
              ล้างทั้งหมด
            </button>
          )}
        </div>

        {/* Progressive Summary Rows */}
        <div className="space-y-2.5 my-2.5">
          {/* ─────────────────────────────────────────────────────────── */}
          {/* ROW 1: บริการ (Service)                                      */}
          {/* ─────────────────────────────────────────────────────────── */}
          <div
            className={`transition-all duration-200 py-1 ${
              currentStep === 1
                ? "border-l-2 border-[#A8703A] pl-2 bg-[#A8703A]/5 rounded-r-[6px]"
                : ""
            }`}
          >
            {selectedService ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2.5">
                  <img
                    src={selectedService.image}
                    alt={selectedService.name}
                    className="w-12 h-12 rounded-[6px] object-cover shrink-0 border border-[#E3DED6]"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-[#A8703A] uppercase font-semibold tracking-wider block">
                      บริการหลัก
                    </span>
                    <h4 className="text-[15px] font-bold text-[#0B1F1F] truncate leading-tight">
                      {selectedService.name}
                    </h4>
                    <p className="text-[12px] text-[#6B6B66] mt-0.5">
                      {selectedService.duration} นาที · {selectedService.price.toLocaleString()} ฿
                    </p>
                  </div>
                  {/* Action button */}
                  <div className="shrink-0 flex items-center">
                    {currentStep === 1 ? (
                      <button
                        type="button"
                        onClick={clearService}
                        className="p-1.5 text-[#9A9A94] hover:text-[#0B1F1F] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
                        aria-label="ล้างบริการที่เลือก"
                        title="ลบ"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    ) : currentStep < 6 ? (
                      <button
                        type="button"
                        onClick={() => {
                          goToStep(1);
                          if (isMobileSheet) setIsMobileSheetOpen(false);
                        }}
                        className="text-xs text-[#A8703A] hover:underline cursor-pointer font-medium px-1 py-0.5"
                      >
                        แก้ไข
                      </button>
                    ) : null}
                  </div>
                </div>

                {/* Sub-rows: Selected Add-ons */}
                {selectedAddOns.length > 0 && (
                  <div className="pl-3 border-l-2 border-[#A8703A]/40 space-y-1 pt-1 mt-1">
                    {selectedAddOns.map((addon) => (
                      <div
                        key={addon.id}
                        className="flex items-center justify-between text-xs py-0.5"
                      >
                        <div className="flex items-center gap-1.5 text-[#0B1F1F]">
                          <span className="text-[#A8703A] font-bold">+</span>
                          <span className="font-semibold">{addon.nameTh}</span>
                          <span className="text-[#6B6B66]">
                            · {addon.durationMin} นาที · {addon.price.toLocaleString()} ฿
                          </span>
                        </div>
                        {currentStep < 6 && (
                          <button
                            type="button"
                            onClick={() => removeAddOn(addon.id)}
                            className="p-1 text-[#9A9A94] hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                            aria-label={`นำ ${addon.nameTh} ออก`}
                            title="ลบ"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    <div className="text-[11px] text-[#A8703A] font-medium pt-0.5">
                      รวมเวลาบริการ: {totalDuration} นาที
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5 py-1 text-[#9A9A94] text-xs">
                <div className="w-12 h-12 rounded-[6px] border border-dashed border-[#D1CAC0] flex items-center justify-center shrink-0 text-sm text-[#D1CAC0]">
                  ✂
                </div>
                <span>ยังไม่ได้เลือกบริการ (เลือกจากรายการด้านซ้าย)</span>
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────── */}
          {/* ROW 2: ช่าง (Barber)                                         */}
          {/* ─────────────────────────────────────────────────────────── */}
          <div
            className={`transition-all duration-200 py-1 ${
              currentStep === 2
                ? "border-l-2 border-[#A8703A] pl-2 bg-[#A8703A]/5 rounded-r-[6px]"
                : ""
            }`}
          >
            {currentStep >= 2 ? (
              <div className="flex items-center justify-between gap-2.5">
                {selectedBarber.photo ? (
                  <img
                    src={selectedBarber.photo}
                    alt={selectedBarber.name}
                    className="w-9 h-9 rounded-full object-cover shrink-0 border border-[#E3DED6]"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#A8703A]/15 border border-[#A8703A]/30 flex items-center justify-center shrink-0 text-[#A8703A] text-sm font-bold">
                    ✂
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-[#A8703A] uppercase font-semibold tracking-wider block">
                    ช่างตัดผม
                  </span>
                  <h4 className="text-[14px] font-bold text-[#0B1F1F] truncate leading-tight">
                    {selectedBarber.name}
                  </h4>
                  <p className="text-[11px] text-[#6B6B66] truncate mt-0.5">
                    {selectedBarber.specialty}
                  </p>
                </div>
                {currentStep > 2 && currentStep < 6 && (
                  <button
                    type="button"
                    onClick={() => {
                      goToStep(2);
                      if (isMobileSheet) setIsMobileSheetOpen(false);
                    }}
                    className="text-xs text-[#A8703A] hover:underline cursor-pointer font-medium px-1 py-0.5 shrink-0"
                  >
                    แก้ไข
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 py-1 opacity-50">
                <div className="w-10 h-10 rounded-full border border-dashed border-[#D1CAC0] flex items-center justify-center shrink-0 text-xs text-[#9A9A94]">
                  👤
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#9A9A94] uppercase tracking-wider">ช่างตัดผม</span>
                  <span className="text-xs text-[#9A9A94]">ยังไม่ได้เลือกช่าง</span>
                </div>
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────── */}
          {/* ROW 3: วันและเวลา (Date & Time)                              */}
          {/* ─────────────────────────────────────────────────────────── */}
          <div
            className={`transition-all duration-200 py-1 ${
              currentStep === 3
                ? "border-l-2 border-[#A8703A] pl-2 bg-[#A8703A]/5 rounded-r-[6px]"
                : ""
            }`}
          >
            {currentStep >= 3 && selectedTime ? (
              <div className="flex items-center justify-between gap-2.5">
                <div className="w-9 h-9 rounded-[6px] bg-[#0B1F1F] text-white flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-[#A8703A] uppercase font-semibold tracking-wider block">
                    วันและเวลา
                  </span>
                  <h4 className="text-[14px] font-bold text-[#0B1F1F] truncate leading-tight">
                    {selectedDate.dateLabel} · {selectedTime} น.
                  </h4>
                  <p className="text-[11px] text-[#6B6B66] truncate mt-0.5">
                    {selectedDate.fullDisplay}
                  </p>
                </div>
                {currentStep > 3 && currentStep < 6 && (
                  <button
                    type="button"
                    onClick={() => {
                      goToStep(3);
                      if (isMobileSheet) setIsMobileSheetOpen(false);
                    }}
                    className="text-xs text-[#A8703A] hover:underline cursor-pointer font-medium px-1 py-0.5 shrink-0"
                  >
                    แก้ไข
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 py-1 opacity-50">
                <div className="w-10 h-10 rounded-[8px] border border-dashed border-[#D1CAC0] flex items-center justify-center shrink-0 text-xs text-[#9A9A94]">
                  📅
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#9A9A94] uppercase tracking-wider">วันและเวลา</span>
                  <span className="text-xs text-[#9A9A94]">ยังไม่ได้เลือกวันและเวลา</span>
                </div>
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────── */}
          {/* ROW 4: ข้อมูลผู้จอง (Customer)                               */}
          {/* ─────────────────────────────────────────────────────────── */}
          <div
            className={`transition-all duration-200 py-1 ${
              currentStep === 4
                ? "border-l-2 border-[#A8703A] pl-2 bg-[#A8703A]/5 rounded-r-[6px]"
                : ""
            }`}
          >
            {currentStep >= 4 && customerName ? (
              <div className="flex items-center justify-between gap-2.5">
                <div className="w-9 h-9 rounded-[6px] bg-[#A8703A]/15 border border-[#A8703A]/30 text-[#A8703A] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-[#A8703A] uppercase font-semibold tracking-wider block">
                    ผู้จองคิว
                  </span>
                  <h4 className="text-[14px] font-bold text-[#0B1F1F] truncate leading-tight">
                    {customerName}
                  </h4>
                  <p className="text-[11px] text-[#6B6B66] font-mono mt-0.5">
                    {formatMaskedPhone(customerPhone)}
                  </p>
                </div>
                {currentStep > 4 && currentStep < 6 && (
                  <button
                    type="button"
                    onClick={() => {
                      goToStep(4);
                      if (isMobileSheet) setIsMobileSheetOpen(false);
                    }}
                    className="text-xs text-[#A8703A] hover:underline cursor-pointer font-medium px-1 py-0.5 shrink-0"
                  >
                    แก้ไข
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 py-1 opacity-50">
                <div className="w-10 h-10 rounded-[8px] border border-dashed border-[#D1CAC0] flex items-center justify-center shrink-0 text-xs text-[#9A9A94]">
                  📝
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#9A9A94] uppercase tracking-wider">ข้อมูลผู้จอง</span>
                  <span className="text-xs text-[#9A9A94]">ยังไม่ได้ระบุข้อมูลผู้จอง</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 6: Booking Code Display inside Card */}
        {currentStep === 6 && bookingCode && (
          <div className="my-4 p-3.5 rounded-[12px] bg-[#A8703A]/10 border border-[#A8703A]/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#A8703A] font-semibold uppercase tracking-wider block">
                รหัสการจอง
              </span>
              <span className="text-lg font-bold font-mono text-[#A8703A]">
                {bookingCode}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyCode}
              className="text-xs bg-[#0B1F1F] text-white px-3 py-1.5 rounded-full hover:bg-black transition-colors"
            >
              {copied ? "คัดลอกแล้ว" : "คัดลอก"}
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-[#E3DED6] my-2.5" />

        {/* Total Price Row */}
        <div className="flex items-baseline justify-between mb-3">
          <span className="font-bold text-[#0B1F1F] text-sm">รวมทั้งหมด</span>
          <span
            aria-live="polite"
            className="font-serif text-[26px] font-bold text-[#0B1F1F] tabular-nums leading-none"
          >
            {totalPrice.toLocaleString()} ฿
          </span>
        </div>

        {/* CTA Primary Action Button */}
        <div>
          {currentStep <= 4 ? (
            <button
              type="button"
              onClick={handlePrimaryCta}
              disabled={!canProceed}
              aria-disabled={!canProceed}
              className={`w-full h-[46px] rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 select-none shadow-md ${
                !canProceed
                  ? "opacity-40 cursor-not-allowed bg-[#0B1F1F] text-white"
                  : "bg-[#0B1F1F] text-white hover:bg-black active:scale-[0.99] cursor-pointer"
              }`}
            >
              {!canProceed && (
                <svg className="w-3.5 h-3.5 shrink-0 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
              <span aria-live="polite">ขั้นตอนถัดไป</span>
              <span aria-hidden="true">→</span>
            </button>
          ) : currentStep === 5 ? (
            <button
              type="button"
              onClick={handlePrimaryCta}
              disabled={!canProceed || isSubmitting}
              aria-disabled={!canProceed || isSubmitting}
              className={`w-full h-[46px] rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 select-none shadow-md ${
                !canProceed || isSubmitting
                  ? "opacity-40 cursor-not-allowed bg-[#0B1F1F] text-white"
                  : "bg-[#0B1F1F] text-white hover:bg-black active:scale-[0.99] cursor-pointer"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2" aria-live="polite">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>กำลังยืนยัน...</span>
                </span>
              ) : (
                <>
                  {!canProceed && (
                    <svg className="w-3.5 h-3.5 shrink-0 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                  <span aria-live="polite">ยืนยันการจอง</span>
                </>
              )}
            </button>
          ) : (
            <Link
              href="/"
              onClick={() => resetBooking()}
              className="w-full h-[46px] rounded-full bg-[#0B1F1F] text-white font-semibold text-sm flex items-center justify-center hover:bg-black active:scale-[0.99] transition-all shadow-md"
            >
              <span aria-live="polite">กลับหน้าแรก</span>
            </Link>
          )}

          {/* Missing requirement text helper */}
          {!canProceed && missingRequirementText && (
            <p className="text-xs text-[#9A9A94] text-center mt-2 font-thai-looped transition-opacity duration-200">
              {missingRequirementText}
            </p>
          )}

          {/* Error notice if submission failed in Step 5 */}
          {currentStep === 5 && submitError && (
            <div className="mt-2.5 p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 text-center flex flex-col items-center justify-center gap-1.5 font-thai-looped">
              <span>⚠️ {submitError}</span>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
                {submitError.includes("ช่าง") && (
                  <button
                    type="button"
                    onClick={() => {
                      goToStep(2);
                      if (isMobileSheet) setIsMobileSheetOpen(false);
                    }}
                    className="underline font-bold text-red-800 hover:text-red-950 cursor-pointer"
                  >
                    ไปเลือกช่าง (Step 2)
                  </button>
                )}
                {(submitError.includes("เวลา") || submitError.includes("คิว") || submitError.includes("ว่าง")) && (
                  <button
                    type="button"
                    onClick={() => {
                      goToStep(3);
                      if (isMobileSheet) setIsMobileSheetOpen(false);
                    }}
                    className="underline font-bold text-red-800 hover:text-red-950 cursor-pointer"
                  >
                    ไปเลือกเวลาใหม่ (Step 3)
                  </button>
                )}
                {(submitError.includes("ทรงผม") || submitError.includes("บริการ")) && (
                  <button
                    type="button"
                    onClick={() => {
                      goToStep(1);
                      if (isMobileSheet) setIsMobileSheetOpen(false);
                    }}
                    className="underline font-bold text-red-800 hover:text-red-950 cursor-pointer"
                  >
                    ไปเลือกบริการ (Step 1)
                  </button>
                )}
                {(submitError.includes("ชื่อ") || submitError.includes("เบอร์")) && (
                  <button
                    type="button"
                    onClick={() => {
                      goToStep(4);
                      if (isMobileSheet) setIsMobileSheetOpen(false);
                    }}
                    className="underline font-bold text-red-800 hover:text-red-950 cursor-pointer"
                  >
                    ไปแก้ไขข้อมูล (Step 4)
                  </button>
                )}
                <button
                  type="button"
                  onClick={confirmBooking}
                  className="underline text-red-600 hover:text-red-800 cursor-pointer ml-1"
                >
                  ลองใหม่
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Security Badge (hide in step 6) */}
        {currentStep < 6 && (
          <div className="mt-5 text-center flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-xs text-[#6B6B66] font-medium">
              <svg className="w-3.5 h-3.5 text-[#6B6B66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>ข้อมูลของคุณปลอดภัย</span>
            </div>
            <span className="text-[11px] text-[#9A9A94] mt-0.5">
              เราจะใช้ข้อมูลเพื่อยืนยันการจองเท่านั้น
            </span>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* ─────────────────────────────────────────────────────────── */}
      {/* DESKTOP STICKY CARD (Permanent in right column, width fixed) */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className={`hidden lg:block ${className}`}>
        <div className="rounded-[16px] bg-[#FBFAF8] border border-[#E3DED6] shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden max-h-[calc(100vh-84px)] flex flex-col">
          {renderCardContent(false)}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* MOBILE / TABLET STICKY BOTTOM BAR (<lg)                     */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FBFAF8]/95 backdrop-blur-md border-t border-[#E3DED6] p-4 flex items-center justify-between gap-3 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-xl">
        {/* Left: Summary trigger & total */}
        <div
          onClick={() => setIsMobileSheetOpen(true)}
          className="flex flex-col cursor-pointer select-none group pr-2 min-w-0"
        >
          <div className="flex items-center gap-1 text-[11px] text-[#6B6B66] group-hover:text-[#A8703A] transition-colors">
            <span>สรุปการจอง</span>
            <svg className="w-3.5 h-3.5 text-[#A8703A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
          </div>
          <span
            aria-live="polite"
            className="font-serif text-xl font-bold text-[#0B1F1F] tabular-nums"
          >
            {totalPrice.toLocaleString()} ฿
          </span>
          {!canProceed && missingRequirementText && (
            <span className="text-[10px] text-[#A8703A] truncate max-w-[130px]">
              {missingRequirementText}
            </span>
          )}
        </div>

        {/* Right: Primary action CTA */}
        {currentStep <= 4 ? (
          <button
            type="button"
            onClick={handlePrimaryCta}
            disabled={!canProceed}
            aria-disabled={!canProceed}
            className={`flex-1 max-w-[210px] h-12 rounded-full font-semibold text-sm flex items-center justify-center gap-1.5 transition-all shadow ${
              !canProceed
                ? "opacity-40 cursor-not-allowed bg-[#0B1F1F] text-white"
                : "bg-[#0B1F1F] text-white hover:bg-black active:scale-[0.99] cursor-pointer"
            }`}
          >
            {!canProceed && (
              <svg className="w-3.5 h-3.5 shrink-0 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
            <span aria-live="polite">ขั้นตอนถัดไป</span>
            <span aria-hidden="true">→</span>
          </button>
        ) : currentStep === 5 ? (
          <button
            type="button"
            onClick={handlePrimaryCta}
            disabled={!canProceed || isSubmitting}
            aria-disabled={!canProceed || isSubmitting}
            className={`flex-1 max-w-[210px] h-12 rounded-full font-semibold text-sm flex items-center justify-center gap-1.5 transition-all shadow ${
              !canProceed || isSubmitting
                ? "opacity-40 cursor-not-allowed bg-[#0B1F1F] text-white"
                : "bg-[#0B1F1F] text-white hover:bg-black active:scale-[0.99] cursor-pointer"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2" aria-live="polite">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>กำลังยืนยัน...</span>
              </span>
            ) : (
              <>
                {!canProceed && (
                  <svg className="w-3.5 h-3.5 shrink-0 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
                <span aria-live="polite">ยืนยันการจอง</span>
              </>
            )}
          </button>
        ) : (
          <Link
            href="/"
            onClick={() => resetBooking()}
            className="flex-1 max-w-[210px] h-12 rounded-full bg-[#0B1F1F] text-white font-semibold text-sm flex items-center justify-center hover:bg-black transition-all shadow"
          >
            <span aria-live="polite">กลับหน้าแรก</span>
          </Link>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* MOBILE BOTTOM SHEET MODAL                                   */}
      {/* ─────────────────────────────────────────────────────────── */}
      {isMobileSheetOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsMobileSheetOpen(false)}
        >
          <div
            className="relative w-full max-h-[85vh] bg-[#FBFAF8] rounded-t-[24px] border-t border-[#E3DED6] shadow-2xl overflow-y-auto no-scrollbar font-thai-looped animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <div className="pt-3 pb-2 flex justify-center sticky top-0 bg-[#FBFAF8] z-20">
              <div className="w-12 h-1.5 rounded-full bg-[#D1CAC0]" />
              <button
                type="button"
                onClick={() => setIsMobileSheetOpen(false)}
                className="absolute top-2.5 right-4 p-1.5 rounded-full text-[#9A9A94] hover:text-[#0B1F1F] hover:bg-black/5"
                aria-label="ปิดหน้ารายละเอียด"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Inner Content */}
            {renderCardContent(true)}
          </div>
        </div>
      )}
    </>
  );
}
