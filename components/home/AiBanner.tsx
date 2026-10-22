import Link from "next/link";

export default function AiBanner() {
  return (
    <section className="bg-white py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Wide rounded-[28px] bg-(--color-ink) p-12 panel (no emoji, no glow) */}
        <div className="rounded-[28px] bg-[#07151A] bg-(--color-ink) p-8 sm:p-12 flex flex-col sm:flex-row sm:items-center justify-between gap-8 text-paper shadow-2xl">
          {/* Existing text left */}
          <div className="max-w-xl">
            <h3 className="text-white font-bold text-2xl sm:text-3xl leading-tight">
              ยังไม่รู้ว่าจะตัดทรงไหนดี?
            </h3>
            <p className="text-white/70 text-sm mt-2 leading-relaxed">
              ถ่ายรูป ให้ AI วิเคราะห์รูปหน้า แนะนำทรงผมที่เหมาะกับคุณฟรี!
            </p>
          </div>

          {/* Existing link as .btn-premium on the right */}
          <Link
            href="/try"
            className="btn-premium shrink-0 text-sm font-semibold px-7 py-3.5 gap-2"
          >
            <svg
              className="w-4 h-4 shrink-0 text-[#E8C98A]"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
            <span>ให้ลุงช่วยเลือกทรง</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
