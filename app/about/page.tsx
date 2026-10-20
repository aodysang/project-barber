import Link from "next/link";
import { shop } from "@/data/shop";

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-10">
        <span className="text-xs font-semibold text-[#FFC800] tracking-wider uppercase">
          About Us
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
          เกี่ยวกับ {shop.name}
        </h1>
        <p className="text-sm text-[#FFC800] mt-1 font-medium">
          “{shop.tagline}”
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 mb-8">
        <p className="text-gray-300 text-base leading-relaxed">
          {shop.description}
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-[#FFC800]">★</span>
          <span>จุดเด่นและความตั้งใจของเรา</span>
        </h2>
        <ul className="space-y-3">
          {shop.highlights.map((point, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
              <span className="w-5 h-5 rounded-full bg-[#FFC800]/20 text-[#FFC800] flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                ✓
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <h2 className="text-xl font-bold text-white mb-3">ที่อยู่และติดต่อร้าน</h2>
        <p className="text-sm text-gray-300 leading-relaxed">{shop.address}</p>
        <p className="text-sm text-[#FFC800] mt-2 font-medium">โทร: {shop.phone}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/book"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FFC800] to-[#977600] text-black font-bold text-xs shadow-md"
          >
            จองคิวออนไลน์
          </Link>
          <a
            href={shop.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold"
          >
            ดูแผนที่ร้าน
          </a>
        </div>
      </div>
    </main>
  );
}