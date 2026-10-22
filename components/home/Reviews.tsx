import { reviews } from "@/data/reviews";

const washes = ["#FFF8E1", "#EAF2FF", "#FFEDF3"];

export default function Reviews() {
  return (
    <section id="reviews" className="scroll-mt-20 bg-white text-night py-28">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Centered existing heading & subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="eyebrow font-mono text-neutral-400 mb-2">
            Verified Customer Reviews
          </p>
          <h2 className="text-4xl sm:text-5xl font-semibold leading-[1.1] text-night">
            เสียงจากลูกค้า
          </h2>
        </div>

        {/* 3 columns on desktop, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, index) => (
            <div
              key={index}
              className="rounded-[20px] p-6 border border-(--color-line) flex flex-col justify-between transition-colors duration-200"
              style={{ backgroundColor: washes[index % washes.length] }}
            >
              <div>
                {/* Top row: service mono chip & muted date */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-mono text-xs px-3 py-1 rounded-full bg-black/5 text-neutral-700 font-medium">
                    {r.service}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono shrink-0">
                    {r.date}
                  </span>
                </div>

                {/* Inline SVG stars (amber) */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(r.rating || 5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 fill-[#F08A2B] text-[#F08A2B] shrink-0"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>

                {/* Comment */}
                <p className="text-[15px] leading-relaxed text-neutral-800">
                  &ldquo;{r.comment}&rdquo;
                </p>
              </div>

              {/* Bottom: customer name & barber name */}
              <div className="flex items-center justify-between text-xs pt-4 border-t border-black/5 mt-6">
                <span className="font-semibold text-night">{r.customerName}</span>
                <span className="text-neutral-500">{r.barberName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
