import Link from "next/link";
import { hairstyles } from "@/data/hairstyles";

export default function HairstylesPage() {
  return (
    <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-ink text-paper">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="eyebrow font-mono text-accent font-semibold block mb-2">
            Hairstyle Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-paper tracking-tight">
            ทรงผมทั้งหมดของร้าน
          </h1>
          <p className="text-sm text-line/70 mt-2 max-w-lg mx-auto">
            รวมทรงผมยอดนิยมคลาสสิกและโมเดิร์น พร้อมระบุราคาและเวลาบริการ
          </p>
        </div>

        {/* Hairstyles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hairstyles.map((style) => (
            <div
              key={style.id}
              className="rounded-[20px] border border-white/10 bg-night/80 p-6 flex flex-col justify-between hover:border-accent/40 transition-all duration-300 shadow-xl"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="text-xl font-bold text-paper">{style.name}</h2>
                  <span className="font-mono text-sm font-semibold text-accent tabular-nums shrink-0">
                    {style.price} บาท
                  </span>
                </div>
                <p className="text-sm text-line/70 leading-relaxed mb-4">
                  {style.description}
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-line/50 mb-6">
                  <svg
                    className="w-4 h-4 text-accent/70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{style.duration} นาที</span>
                </div>
              </div>

              <Link
                href={`/book?service=${style.id}`}
                className="w-full min-h-[48px] py-2.5 px-6 rounded-full bg-paper text-night font-semibold text-xs text-center flex items-center justify-center hover:bg-mist transition-colors shadow-md active:scale-98"
              >
                จองคิวทรงนี้
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}