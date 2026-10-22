import Image from "next/image";
import Link from "next/link";
import { shop } from "@/data/shop";

export default function About() {
  return (
    <section className="bg-white text-night py-28">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: tall photo (barber-veera.jpg, aspect-[4/5], rounded-[28px]) */}
          <div className="relative aspect-[4/5] w-full rounded-[28px] overflow-hidden shadow-xl bg-neutral-900">
            <Image
              src="/images/barber-veera.jpg"
              alt="ประสบการณ์มากกว่า 20 ปี"
              fill
              className="object-cover object-top"
            />
            {/* Gradient overlay for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

            {/* Overlaid text at bottom */}
            <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 z-10 text-white">
              <h3 className="text-2xl sm:text-3xl font-bold leading-snug">
                ประสบการณ์<br />
                <span className="text-[#FFC800]">มากกว่า 20 ปี</span>
              </h3>
              <p className="text-white/80 text-sm mt-2 max-w-md leading-relaxed">
                สืบทอดศาสตร์และศิลป์แห่งการตัดผมชาย จากรุ่นสู่รุ่น มุ่งมั่นส่งมอบบริการที่ดีที่สุดให้คุณ
              </p>
              <div className="mt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-xs text-white/90 hover:text-white underline underline-offset-4 font-medium transition-colors"
                >
                  เกี่ยวกับเรา
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Hours table, status, Why-Us list, booking button */}
          <div className="flex flex-col justify-center">
            {/* เวลาทำการ as a clean table (rows separated by 1px --color-line, time in mono) */}
            <div>
              <h3 className="text-xl font-bold text-night mb-4">เวลาทำการ</h3>
              <div className="divide-y divide-(--color-line) border-y border-(--color-line)">
                {shop.openHours.map((h, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="text-neutral-700">{h.day}</span>
                    <span className="font-mono text-night font-medium">{h.time}</span>
                  </div>
                ))}
              </div>

              {/* เปิดให้บริการอยู่ status as plain text with small green dot (no pulse) */}
              <div className="flex items-center gap-2 mt-3 text-xs text-neutral-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>เปิดให้บริการอยู่</span>
              </div>
            </div>

            {/* ทำไมต้อง Veera Barber? list as plain rows with thin dividers (no check-in-circle icons) */}
            <div className="mt-8">
              <h4 className="text-base font-semibold text-night mb-3">
                ทำไมต้อง Veera Barber?
              </h4>
              <div className="divide-y divide-(--color-line) border-y border-(--color-line)">
                {shop.highlights.slice(0, 4).map((h, i) => (
                  <div key={i} className="py-2.5 text-sm text-neutral-700">
                    {h}
                  </div>
                ))}
              </div>
            </div>

            {/* จองคิว button */}
            <Link
              href="/book"
              className="btn-primary w-full mt-8 bg-[#07151A]! text-white! hover:bg-black! text-sm py-3 transition-colors text-center"
            >
              จองคิว
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
