import Link from "next/link";

const GEMINI_GEM_URL =
  "https://gemini.google.com/gem/1wYY-_WGghY0Fe2FVr_8fnO26IHjT0Wv8?usp=sharing";

export const metadata = {
  title: "ให้ลุงช่วยเลือกทรง | Veera Barber",
  description:
    "จำลองทรงผมสไตล์คุณด้วย AI อัจฉริยะจาก Google Gemini - Veera Barber ซอยแจ้งวัฒนะ 28",
};

const steps = [
  {
    step: "1",
    title: "อัปโหลดรูปใบหน้าตรง",
    description: "เลือกรูปที่เห็นโครงหน้าชัดเจน ไม่สวมแว่นหรือหมวก",
    icon: (
      <svg
        className="w-6 h-6 text-[#E8C98A]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
        />
      </svg>
    ),
  },
  {
    step: "2",
    title: "เลือกทรงผมที่ต้องการ",
    description: "เลือกจากรายการทรงของร้าน กด \"แสดงเพิ่มเติม\" เพื่อดูทั้งหมด",
    icon: (
      <svg
        className="w-6 h-6 text-[#E8C98A]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"
        />
      </svg>
    ),
  },
  {
    step: "3",
    title: "ให้ลุงช่วยแนะนำและจำลองทรง",
    description: "รอสักครู่ ลุงจะแนะนำทรงที่เหมาะกับใบหน้าของคุณ",
    icon: (
      <svg
        className="w-6 h-6 text-[#E8C98A]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
        />
      </svg>
    ),
  },
];

export default function TryPage() {
  return (
    <main
      className="min-h-[100svh] flex flex-col justify-center items-center pt-[124px] pb-16 px-4 sm:px-6 lg:px-8 text-[#F4F1EC] relative"
      style={{
        background:
          "radial-gradient(60% 40% at 50% 0%, rgba(217, 161, 91, 0.14), transparent 70%), linear-gradient(180deg, #081416 0%, #0B1F1F 100%)",
      }}
    >
      <style>{`
        @keyframes tryFadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .try-animate-fade {
          opacity: 0;
          animation: tryFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .try-delay-header { animation-delay: 40ms; }
        .try-delay-0 { animation-delay: 120ms; }
        .try-delay-1 { animation-delay: 200ms; }
        .try-delay-2 { animation-delay: 280ms; }
        .try-delay-actions { animation-delay: 360ms; }

        @media (prefers-reduced-motion: reduce) {
          .try-animate-fade {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="w-full max-w-[960px] mx-auto flex flex-col items-center text-center">
        {/* ส่วนหัวข้อ */}
        <header className="mb-10 max-w-2xl mx-auto try-animate-fade try-delay-header">
          <span className="font-serif text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#E8C98A] block mb-3">
            AI HAIRSTYLE RECOMMENDATION
          </span>
          <h1
            className="font-bold tracking-tight text-[#F4F1EC] leading-[1.15]"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}
          >
            ให้ลุงช่วยเลือกทรง
          </h1>
          <p className="text-base sm:text-lg text-[rgba(244,241,236,0.68)] mt-3.5 leading-relaxed font-light">
            จำลองทรงผมสไตล์คุณด้วย AI อัจฉริยะจาก Google Gemini
          </p>
        </header>

        {/* การ์ด 3 ขั้นตอน */}
        <section
          aria-label="3 ขั้นตอนในการเลือกทรงผม"
          className="w-full relative mb-12"
        >
          {/* เส้นเชื่อมทองจางบน Desktop */}
          <div
            className="hidden md:block absolute top-[52px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-[rgba(232,201,138,0.22)] to-transparent pointer-events-none z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
            {steps.map((item, idx) => (
              <div
                key={item.step}
                className={`try-animate-fade try-delay-${idx} rounded-[20px] border border-[rgba(232,201,138,0.22)] bg-[rgba(255,255,255,0.04)] backdrop-blur-[8px] p-6 sm:p-7 flex flex-col text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(232,201,138,0.45)] hover:shadow-[0_12px_32px_-8px_rgba(7,21,26,0.6)]`}
              >
                {/* แถวด้านบน: หมายเลข + ไอคอน */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="font-serif text-3xl sm:text-4xl font-bold leading-none text-[#E8C98A]"
                    aria-hidden="true"
                  >
                    {item.step}
                  </span>
                  <div className="p-2.5 rounded-full bg-[rgba(232,201,138,0.08)] border border-[rgba(232,201,138,0.18)]">
                    {item.icon}
                  </div>
                </div>

                {/* เนื้อหาการ์ด */}
                <h2 className="text-lg font-bold text-[#F4F1EC] mb-2 leading-snug">
                  {item.title}
                </h2>
                <p className="text-sm leading-relaxed text-[rgba(244,241,236,0.68)] font-light">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ปุ่มหลัก, หมายเหตุ และปุ่มรอง */}
        <div className="w-full max-w-md flex flex-col items-center gap-5 try-animate-fade try-delay-actions">
          {/* ปุ่มหลัก: เปิด Gemini Gem ในแท็บใหม่ */}
          <a
            href={GEMINI_GEM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="เริ่มเลือกทรงกับลุง (เปิดในแท็บใหม่)"
            className="btn-premium group w-full sm:w-auto min-h-[52px] py-4 px-8 text-base sm:text-lg font-semibold tracking-wide inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C98A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#081416]"
          >
            <span>เริ่มเลือกทรงกับลุง</span>
            <span
              className="inline-block transition-transform duration-200 group-hover:translate-x-1 text-xl leading-none text-[#F3DDAE]"
              aria-hidden="true"
            >
              →
            </span>
          </a>

          {/* หมายเหตุใต้ปุ่ม */}
          <div className="flex flex-col items-center gap-1 text-xs sm:text-sm text-[rgba(244,241,236,0.68)] text-center leading-relaxed">
            <p>ต้องเข้าสู่ระบบด้วยบัญชี Google เพื่อใช้งาน</p>
            <p>
              ระบบจะเปิดในแท็บใหม่ ได้ทรงที่ชอบแล้วกลับมาจองคิวได้ที่นี่
            </p>
          </div>

          {/* ปุ่มรอง: จองคิวเลย ลิงก์ไป /book */}
          <div className="pt-2">
            <Link
              href="/book"
              className="inline-flex items-center justify-center min-h-[48px] py-2.5 px-7 rounded-full text-sm font-medium border border-[rgba(232,201,138,0.35)] text-[#E8C98A] hover:bg-[rgba(232,201,138,0.08)] hover:border-[#E8C98A] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C98A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#081416]"
            >
              จองคิวเลย
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
