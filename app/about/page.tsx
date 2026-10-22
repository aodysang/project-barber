import Link from "next/link";
import { shop } from "@/data/shop";

export default function AboutPage() {
  return (
    <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-ink text-paper">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="eyebrow font-mono text-accent font-semibold block mb-2">
            About Us
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-paper tracking-tight">
            เกี่ยวกับ {shop.name}
          </h1>
          <p className="text-sm text-accent mt-2 font-medium">
            “{shop.tagline}”
          </p>
        </div>

        {/* Content Cards */}
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Description Card */}
          <div className="rounded-[20px] border border-white/10 bg-night/80 p-6 sm:p-8 shadow-xl">
            <p className="text-line/90 text-base leading-relaxed">
              {shop.description}
            </p>
          </div>

          {/* Highlights Card */}
          <div className="rounded-[20px] border border-white/10 bg-night/80 p-6 sm:p-8 shadow-xl">
            <h2 className="text-xl font-bold text-paper mb-4 flex items-center gap-2">
              <span className="text-accent">★</span>
              <span>จุดเด่นและความตั้งใจของเรา</span>
            </h2>
            <ul className="space-y-3">
              {shop.highlights.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-line/80">
                  <span className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    ✓
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Address & Contact Card */}
          <div className="rounded-[20px] border border-white/10 bg-night/80 p-6 sm:p-8 shadow-xl">
            <h2 className="text-xl font-bold text-paper mb-3">ที่อยู่และติดต่อร้าน</h2>
            <p className="text-sm text-line/80 leading-relaxed">{shop.address}</p>
            <p className="text-sm text-accent mt-2 font-medium">โทร: {shop.phone}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/book"
                className="min-h-[48px] px-6 py-2.5 rounded-full bg-accent text-ink font-bold text-xs shadow-md shadow-accent/20 hover:opacity-90 transition-all flex items-center justify-center active:scale-98"
              >
                จองคิวออนไลน์
              </Link>
              <a
                href={shop.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] px-6 py-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-paper text-xs font-semibold transition-all flex items-center justify-center"
              >
                ดูแผนที่ร้าน
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}