import Image from "next/image";

const steps = [
  {
    num: "01",
    title: "เข้าใจทรงก่อนเริ่มตัด",
    desc: "พูดคุยและออกแบบทรงผมที่เหมาะกับรูปหน้าและบุคลิกของคุณก่อนเริ่มลงมือ เพื่อผลลัพธ์ที่ตรงใจที่สุด",
  },
  {
    num: "02",
    title: "ใส่ใจทุกรายละเอียด",
    desc: "เก็บทุกมุม ทุกเส้น ด้วยความประณีตไม่เร่งรีบ ทั้งไทม์ไลน์ ไซด์เบิร์น และกรอบผมที่เนี้ยบสมบูรณ์",
  },
  {
    num: "03",
    title: "มอบความมั่นใจก่อนออกจากร้าน",
    desc: "เพราะทรงผมที่ดีช่วยเพิ่มความมั่นใจ เราจึงพิถีพิถันทุกขั้นตอน จนกว่าคุณจะพอใจ 100%",
  },
];

export default function Standards() {
  return (
    <div className="p-3 bg-white">
      {/* Full-width image band with 12px page gutter */}
      <section className="relative rounded-[28px] overflow-hidden py-28 px-6 sm:px-10">
        {/* Section background with .image-treatment overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-barber.jpg"
            alt="มาตรฐานการบริการ"
            fill
            className="object-cover object-center"
          />
          <div className="image-treatment" />
          <div className="absolute inset-0 bg-[#07151A]/60 pointer-events-none" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1200px] mx-auto w-full">
          {/* Left-aligned existing heading in white text-5xl */}
          <div className="mb-12 text-left">
            <p className="eyebrow font-mono text-white/60 mb-2">
              Quality Standards
            </p>
            <h2 className="text-4xl sm:text-5xl font-semibold leading-[1.1] text-white">
              มาตรฐานการบริการ
            </h2>
          </div>

          {/* Three equal columns of dark translucent cards (mobile: stack) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="bg-black/35 backdrop-blur border border-white/10 rounded-[20px] p-8 min-h-[280px] flex flex-col justify-between"
              >
                {/* Huge low-contrast numeral at top */}
                <span className="font-mono text-8xl font-black text-white/10 leading-none select-none tracking-tighter">
                  {step.num}
                </span>

                {/* Title and description pinned to bottom */}
                <div className="mt-auto pt-8">
                  <h3 className="text-xl font-semibold text-white mb-2 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
