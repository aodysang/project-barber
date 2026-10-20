import Image from "next/image";
import Link from "next/link";
import { barbers } from "@/data/barbers";
import { reviews } from "@/data/reviews";

export default function BarbersPage() {
  return (
    <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-10">
        <span className="text-xs font-semibold text-[#FFC800] tracking-wider uppercase">
          Master Barbers
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
          ทีมช่างตัดผมมืออาชีพ
        </h1>
        <p className="text-sm text-gray-400 mt-2 max-w-lg mx-auto">
          ช่างตัดผมผู้มากประสบการณ์ พร้อมให้คำปรึกษาและเนรมิตทรงผมที่ตอบโจทย์บุคลิกของคุณ
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
        {barbers.map((barber) => (
          <div
            key={barber.id}
            className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 flex flex-col justify-between hover:border-[#FFC800]/50 transition-all duration-300 shadow-xl"
          >
            <div>
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-[#FFC800] mx-auto mb-4 shadow-lg shadow-[#FFC800]/20">
                <Image
                  src={barber.photo}
                  alt={barber.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="text-center">
                <span className="text-[10px] font-semibold text-[#FFC800] bg-black/60 px-2.5 py-0.5 rounded-full border border-[#FFC800]/30 inline-block mb-1">
                  {barber.badge}
                </span>
                <h2 className="text-xl font-bold text-white">{barber.name}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{barber.title}</p>

                <div className="flex items-center justify-center gap-1 my-2 text-xs text-yellow-400 font-bold">
                  <span>★ {barber.rating.toFixed(1)}</span>
                  <span className="text-gray-500 font-normal">
                    ({barber.reviewCount} รีวิว)
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-gray-300 my-4 bg-black/40 p-3 rounded-xl border border-zinc-800/80">
                <p>
                  <span className="text-gray-500">ความถนัด: </span>
                  {barber.specialty}
                </p>
                <p>
                  <span className="text-gray-500">ประสบการณ์: </span>
                  {barber.experience}
                </p>
                <p>
                  <span className="text-gray-500">ทรงโปรด: </span>
                  <span className="text-[#FFC800]">{barber.favoriteCut}</span>
                </p>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                {barber.bio}
              </p>
            </div>

            <Link
              href={`/book?barber=${barber.barberNumber}`}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FFC800] to-[#977600] text-black font-bold text-xs text-center flex items-center justify-center gap-1.5 hover:opacity-90 transition shadow-md shadow-[#FFC800]/20"
            >
              <span>จองคิวกับ{barber.name}</span>
            </Link>
          </div>
        ))}
      </div>

      <div className="text-center mb-8">
        <span className="text-xs font-semibold text-[#FFC800] tracking-wider uppercase">
          Client Feedback
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          รีวิวจากลูกค้า
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-bold text-sm text-white">
                  {review.customerName}
                </span>
                <span className="text-xs text-[#FFC800] block">
                  ตัดกับ: {review.barberName} · {review.service}
                </span>
              </div>
              <div className="text-right">
                <span className="text-yellow-400 text-xs">
                  {"★".repeat(review.rating)}
                </span>
                <span className="block text-[10px] text-gray-500">
                  {review.date}
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 italic">
              “{review.comment}”
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}