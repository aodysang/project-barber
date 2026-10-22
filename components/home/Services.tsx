"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { services } from "@/data/services";

const categories = [
  "ทั้งหมด",
  "ยอดนิยม",
  "เด็กและเยาวชน",
  "ดูแลเส้นผม",
  "กรูมมิ่ง",
  "ดูแลผ่อนคลาย",
  "ทำสีผม",
];

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");

  const filteredServices =
    selectedCategory === "ทั้งหมด"
      ? services
      : selectedCategory === "ยอดนิยม"
      ? services.filter((s) => s.popular || s.category === "ยอดนิยม")
      : services.filter((s) => s.category === selectedCategory);

  return (
    <section id="services" className="scroll-mt-20 bg-white text-night py-28">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header row: left-aligned eyebrow & heading, right category filter */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="text-left">
            <p className="eyebrow font-mono text-neutral-400 mb-2">
              Services &amp; Pricing
            </p>
            <h2 className="text-5xl font-semibold leading-[1.1] text-night">
              บริการของเรา
            </h2>
          </div>

          {/* Category filter pill chips */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#07151A] text-white border border-[#07151A]"
                      : "bg-white text-neutral-700 border border-(--color-line) hover:border-[#07151A]/40"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl overflow-hidden border border-(--color-line) bg-white transition-colors duration-200 hover:border-[#07151A] flex flex-col"
            >
              {/* Photo on top with aspect-[4/3] object-cover (no dark overlay) */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                <Image
                  src={s.image}
                  alt={s.name}
                  fill
                  className="object-cover"
                />
                {s.popular && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#07151A] text-white text-[11px] font-semibold tracking-wide">
                    ยอดนิยม
                  </div>
                )}
              </div>

              {/* Card body */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold text-night">{s.name}</h3>
                  <span className="text-lg font-semibold text-night tabular-nums shrink-0">
                    {s.price} ฿
                  </span>
                </div>
                <p className="font-mono text-xs text-neutral-400 mt-1">
                  {s.duration} นาที
                </p>
                <p className="text-sm text-neutral-500 line-clamp-2 mt-2.5 leading-relaxed">
                  {s.description}
                </p>
                <div className="mt-5 pt-2 mt-auto">
                  <Link
                    href={`/book?service=${s.id}`}
                    className="btn-primary w-full bg-[#07151A]! text-white! hover:bg-black! text-sm py-2.5 transition-colors"
                  >
                    จองคิว
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compact two-column price list under the grid */}
        <div className="mt-20 pt-12 border-t border-(--color-line)">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="eyebrow font-mono text-neutral-400 mb-1">
                  Price Overview
                </p>
                <h3 className="text-xl font-semibold text-night">
                  ราคาบริการทั้งหมด
                </h3>
              </div>
              <Link
                href="/book"
                className="text-xs font-semibold text-neutral-600 hover:text-black underline underline-offset-4"
              >
                จองคิวตอนนี้
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3.5">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="flex items-baseline justify-between gap-3 text-sm"
                >
                  <span className="text-neutral-700 font-medium">{s.name}</span>
                  <div className="flex-1 border-b border-dotted border-neutral-300 mx-1 mb-1" />
                  <span className="text-night font-semibold tabular-nums">
                    {s.price} ฿
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
