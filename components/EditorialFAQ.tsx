"use client";

import { useState } from "react";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: "geometry",
    category: "TECHNOLOGY & ANATOMY",
    question: "How does Barber AI analyze facial geometry without feeling artificial or gimmicky?",
    answer:
      "Instead of applying novelty cartoon filters or distorted face stickers, Barber AI relies on computer-vision spatial landmark extraction (mapping 468 precise coordinates across cranial contours, temporal lines, zygomatic arch, and mandibular angle). It evaluates classic proportion ratios (such as facial thirds and cranial symmetry) against decades-proven classical barbering principles to recommend cuts that architecturally harmonize with your bone structure.",
  },
  {
    id: "barber-workflow",
    category: "CHAIR CONSULTATION",
    question: "How do master barbers at the shop translate this digital blueprint into real hair cutting?",
    answer:
      "When you sit in the chair at Veera Barber, your assigned master stylist reviews your digital blueprint. The blueprint specifies exact millimeter clipper guard progressions (e.g. skin fade taper drop, parietal ridge blending height), scissor graduation angles, and crown weight guidelines tailored to your specific hair growth whorls. This eliminates vague verbal explanations and gives the stylist a clear technical baseline.",
  },
  {
    id: "privacy",
    category: "DATA & PRIVACY",
    question: "Is my facial scan saved, shared, or used for AI model training?",
    answer:
      "No. All landmark extraction and facial geometric calculations run client-side directly within your browser sandbox. We do not store biometric facial recognition databases, nor do we sell or license customer imagery. Your scan exists solely during your active styling session.",
  },
  {
    id: "hair-types",
    category: "TEXTURE & DIVERSITY",
    question: "Does the system handle complex hair types like cowlicks, receding hairlines, or coarse textures?",
    answer:
      "Yes. The diagnostic engine specifically evaluates forehead hairline recession, crown apex density, and temporal tapering. Furthermore, the platform matches you to the specific master barber on our team whose documented specialty (e.g., razor fades, Asian two-block, classic pompadour scissor work) best suits your biological hair texture.",
  },
  {
    id: "walk-in-vs-booking",
    category: "VISITING THE STUDIO",
    question: "Can I walk in, or do I need an AI blueprint reservation in advance?",
    answer:
      "Walk-ins are warmly accepted at our Chaengwattana 28 studio whenever chairs are free. However, booking an appointment with your generated Barber AI blueprint reserves your exact time slot with zero wait, ensuring your stylist has pre-reviewed your cranial silhouette specifications before you arrive.",
  },
];

export default function EditorialFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 sm:py-32 bg-white text-[#111113]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6F6F4] border border-[#E7E7E7] text-[11px] font-mono tracking-widest text-[#355A3A] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#355A3A]" />
            COLOPHON & ARCHIVE · INQUIRIES
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#07151A] uppercase">
            Frequently Asked
          </h2>
          <p className="mt-2 text-lg sm:text-xl font-editorial-serif text-[#07151A]/70">
            Clear technical answers regarding facial mapping, privacy, and barber craft.
          </p>
        </div>

        {/* Narrow Accordion Stack */}
        <div className="divide-y divide-[#E7E7E7] border-y border-[#E7E7E7]">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.id} className="py-6 sm:py-7 transition-colors">
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-start justify-between gap-4 text-left group cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex-1 pr-4">
                    <span className="block text-[10px] font-mono tracking-widest text-[#355A3A] font-semibold mb-1 uppercase">
                      {faq.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#07151A] group-hover:text-[#F08A2B] transition-colors">
                      {faq.question}
                    </h3>
                  </div>

                  {/* Circular chevron toggle */}
                  <div
                    className={`w-9 h-9 shrink-0 rounded-full border flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? "bg-[#07151A] text-white border-[#07151A] rotate-180 shadow-xs"
                        : "bg-[#F6F6F4] text-[#07151A] border-[#E7E7E7] group-hover:border-[#07151A]/40"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded Answer View */}
                {isOpen && (
                  <div className="mt-4 pt-2 pr-12 text-sm text-[#07151A]/80 leading-relaxed font-sans animate-fadeIn">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional Help Link */}
        <div className="mt-12 text-center text-xs text-[#07151A]/60">
          Have an unlisted query? Reach our Chaengwattana 28 concierge directly at{" "}
          <a href="tel:0812345678" className="font-bold text-[#07151A] underline hover:text-[#F08A2B]">
            081-234-5678
          </a>
        </div>

      </div>
    </section>
  );
}
