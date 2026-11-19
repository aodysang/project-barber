"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { shop } from "@/data/shop";
import { services } from "@/data/services";
import { barbers } from "@/data/barbers";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  action?: {
    label: string;
    href: string;
  };
}

const quickQuestions = [
  "คนไหนตัดดีสุด?",
  "ตัดผมราคาเท่าไหร่?",
  "ร้านเปิดกี่โมง / อยู่ที่ไหน?",
  "หน้ากลมตัดทรงไหนดี?",
  "จองคิวตัดผมยังไง?",
];

// ระบบสำรอง (Fallback) กรณีออฟไลน์หรือโควตาเต็ม
function fallbackReply(input: string): {
  text: string;
  action?: { label: string; href: string };
} {
  const q = input.toLowerCase();

  if (q.includes("ราคา") || q.includes("กี่บาท") || q.includes("บริการ")) {
    const priceList = services
      .map((s) => `• ${s.name}: ${s.price}฿ (${s.duration} นาที)`)
      .join("\n");
    return {
      text: `อัตราค่าบริการของ Veera Barber ครับ:\n\n${priceList}`,
      action: { label: "จองคิวบริการนี้ →", href: "/book" },
    };
  }

  if (q.includes("ช่าง") || q.includes("ดีสุด") || q.includes("แนะนำ")) {
    const barberList = barbers
      .map((b) => `• ${b.name} (${b.badge}) — ถนัด${b.specialty}`)
      .join("\n");
    return {
      text: `ช่างของเรามีฝีมือทุกคนครับ เลือกตามสไตล์ที่ชอบได้เลย:\n\n${barberList}`,
      action: { label: "เลือกช่างและจองคิว →", href: "/book" },
    };
  }

  return {
    text: `สามารถเลือกกดคำถามยอดฮิตด้านล่าง หรือโทรสอบถามด่วนได้ที่ ${shop.phone} เลยครับ`,
    action: { label: "จองคิวตัดผมทันที →", href: "/book" },
  };
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "สวัสดีครับ ยินดีต้อนรับสู่ Veera Barber แจ้งวัฒนะ 28 ถามเรื่องราคา ทรงผม หรือให้ช่วยแนะนำช่างได้เลยครับ!",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmed,
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputValue("");
    setIsTyping(true);

    try {
      const res = await fetch("/project-barber/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: updatedHistory,
        }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: data.reply,
          action: data.action,
        },
      ]);
    } catch {
      const fb = fallbackReply(trimmed);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: fb.text,
          action: fb.action,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 flex flex-col items-end">
      {/* ==================== CHAT POPUP WINDOW ==================== */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] sm:w-[375px] rounded-xl bg-[#1A1A1A] border border-[#C4A470]/40 shadow-[0_20px_50px_rgba(0,0,0,0.75)] overflow-hidden flex flex-col animate-fadeIn">
          {/* Header */}
          <div className="px-4 py-3.5 bg-[#161616] border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src="/project-barber/hairstyles/logo.png"
                  alt="Veera Barber"
                  className="w-8 h-8 object-contain invert mix-blend-screen"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#161616]" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-white leading-none">
                  ผู้ช่วย AI · Veera Barber
                </h3>
                <p className="text-[10px] text-[#C4A470] mt-1">
                  ขับเคลื่อนโดย Gemini · ออนไลน์
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="ปิดหน้าต่างแชท"
              className="p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Disclaimer */}
          <div className="px-4 py-2 bg-[#222222] border-b border-white/[0.06] text-[11px] text-white/60 leading-relaxed">
            ผู้ช่วย AI ตอบคำถามจากข้อมูลร้านจริง ต้องการคุยกับช่างโดยตรง โทร{" "}
            <a
              href={`tel:${shop.phone.replace(/-/g, "")}`}
              className="text-[#C4A470] font-mono underline"
            >
              {shop.phone}
            </a>
          </div>

          {/* Messages Area */}
          <div className="p-4 h-72 overflow-y-auto space-y-3.5 text-xs sm:text-[13px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 leading-relaxed whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-[#C4A470] text-[#14120E] font-medium rounded-br-xs"
                      : "bg-[#242424] text-white/90 border border-white/[0.08] rounded-bl-xs"
                  }`}
                >
                  {msg.text}

                  {msg.action && (
                    <div className="mt-2.5 pt-2 border-t border-white/10">
                      <Link
                        href={msg.action.href}
                        onClick={() => setIsOpen(false)}
                        className="inline-block w-full text-center py-1.5 px-3 rounded-md bg-[#C4A470]/20 hover:bg-[#C4A470] text-[#C4A470] hover:text-[#14120E] border border-[#C4A470]/40 text-xs font-semibold transition-colors"
                      >
                        {msg.action.label}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start">
                <div className="px-3.5 py-2.5 rounded-xl rounded-bl-xs bg-[#242424] border border-white/[0.08] text-white/60 text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C4A470] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C4A470] animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C4A470] animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="px-3.5 py-2.5 bg-[#161616] border-t border-white/[0.06]">
            <p className="text-[10px] text-white/45 mb-1.5">ลองถามได้เลย:</p>
            <div className="flex flex-wrap gap-1.5">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={isTyping}
                  onClick={() => handleSendMessage(q)}
                  className="px-2.5 py-1 rounded-full bg-[#222222] hover:bg-[#C4A470]/20 border border-white/12 hover:border-[#C4A470]/60 text-[11px] text-white/80 hover:text-[#F3DFB9] disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleFormSubmit}
            className="p-2.5 bg-[#161616] border-t border-white/[0.08] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              disabled={isTyping}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="พิมพ์ถามอะไรก็ได้ เช่น คนไหนตัดดีสุด..."
              className="flex-1 bg-[#222222] text-white placeholder:text-white/40 text-xs px-3.5 py-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-[#C4A470] disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isTyping || !inputValue.trim()}
              className="px-4 py-2.5 rounded-lg bg-[#C4A470] hover:bg-[#b59460] disabled:opacity-40 text-[#14120E] font-semibold text-xs transition-colors shrink-0 cursor-pointer"
            >
              ส่ง
            </button>
          </form>
        </div>
      )}

      {/* ==================== FLOATING CHAT BUTTON ==================== */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="เปิดแชทสอบถามข้อมูล"
        className="group relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-[#D8BA84] to-[#B59156] hover:from-[#E2C692] hover:to-[#C09C61] text-[#14120E] flex items-center justify-center ring-1 ring-[#F2DC9F]/60 shadow-[0_8px_28px_rgba(196,164,112,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-[#161616]" />

        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}