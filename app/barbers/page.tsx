import Image from "next/image";
import Link from "next/link";
import { barbers } from "@/data/barbers";
import { reviews } from "@/data/reviews";

export default function BarbersPage() {
  return (
    <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-ink text-paper">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="eyebrow font-mono text-accent font-semibold block mb-2">
            Master Barbers
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-paper tracking-tight">
            ทีมช่างตัดผมมืออาชีพ
          </h1>
          <p className="text-sm text-line/70 mt-2 max-w-lg mx-auto">
            ช่างตัดผมผู้มากประสบการณ์ พร้อมให้คำปรึกษาและเนรมิตทรงผมที่ตอบโจทย์บุคลิกของคุณ
          </p>
        </div>

        {/* Barbers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {barbers.map((barber) => (
            <div
              key={barber.id}
              className="group rounded-[20px] border border-white/10 bg-night/80 p-6 flex flex-col justify-between hover:border-accent/40 transition-all duration-300 shadow-xl"
            >
              <div>
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-accent mx-auto mb-4 shadow-lg shadow-accent/20">
                  <Image
                    src={barber.photo}
                    alt={barber.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="text-center">
                  <span className="text-[10px] font-semibold text-accent bg-ink/75 px-3 py-1 rounded-full border border-accent/30 inline-block mb-1.5 font-mono">
                    {barber.badge}
                  </span>
                  <h2 className="text-xl font-bold text-paper">{barber.name}</h2>
                  <p className="text-xs text-line/60 mt-0.5">{barber.title}</p>

                  <div className="flex items-center justify-center gap-1.5 my-2.5 text-xs text-accent font-bold">
                    <svg
                      className="w-3.5 h-3.5 fill-[#F08A2B] text-[#F08A2B] shrink-0"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span>{barber.rating.toFixed(1)}</span>
                    <span className="text-line/60 font-normal">
                      ({barber.reviewCount} รีวิว)
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-line/80 my-4 bg-ink/60 p-4 rounded-[14px] border border-white/10">
                  <p>
                    <span className="text-line/50">ความถนัด: </span>
                    {barber.specialty}
                  </p>
                  <p>
                    <span className="text-line/50">ประสบการณ์: </span>
                    {barber.experience}
                  </p>
                  <p>
                    <span className="text-line/50">ทรงโปรด: </span>
                    <span className="text-accent font-medium">{barber.favoriteCut}</span>
                  </p>
                </div>

                <p className="text-xs text-line/70 leading-relaxed mb-6">
                  {barber.bio}
                </p>
              </div>

              <Link
                href={`/book?barber=${barber.barberNumber}`}
                className="w-full min-h-[48px] py-2.5 rounded-full bg-accent text-ink font-bold text-xs text-center flex items-center justify-center gap-1.5 hover:opacity-90 transition-all shadow-md shadow-accent/20 active:scale-98"
              >
                <span>จองคิวกับ{barber.name}</span>
              </Link>
            </div>
          ))}
        </div>

        {/* Reviews Section Header */}
        <div className="text-center mb-10">
          <span className="eyebrow font-mono text-accent font-semibold block mb-2">
            Client Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-paper tracking-tight">
            รีวิวจากลูกค้า
          </h2>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="rounded-[20px] border border-white/10 bg-night/80 p-6 hover:border-white/20 transition-all duration-200 border-l-[3px] border-l-accent shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="font-bold text-sm text-paper block">
                      {review.customerName}
                    </span>
                    <span className="text-xs text-accent block mt-0.5">
                      ตัดกับ: {review.barberName} · {review.service}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-0.5 justify-end">
                      {[...Array(review.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-3.5 h-3.5 fill-[#F08A2B] text-[#F08A2B]"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="block text-[10px] font-mono text-line/50 mt-0.5">
                      {review.date}
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-line/80 leading-relaxed italic">
                  “{review.comment}”
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}