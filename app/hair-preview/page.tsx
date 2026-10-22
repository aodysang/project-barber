import HairPreviewSection from "@/components/HairPreviewSection";

export const metadata = {
  title: "AI Face Swap ลองทรงผมเสมือนจริง | Veera Barber",
  description:
    "ให้ลุงช่วยเลือกทรงผมด้วย AI Face Swap จำลองทรงผมก่อนตัดจริง ด้วยโมเดล AI คุณภาพสูง",
};

export default function HairPreviewPage() {
  return (
    <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-ink text-paper flex flex-col items-center">
      <div className="w-full max-w-[1200px] flex flex-col items-center">
        <HairPreviewSection />
      </div>
    </main>
  );
}
