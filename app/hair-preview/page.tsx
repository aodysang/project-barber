import HairPreviewSection from "@/components/HairPreviewSection";

export const metadata = {
  title: "AI Face Swap ลองทรงผมเสมือนจริง | Veera Barber",
  description:
    "ให้ลุงช่วยเลือกทรงผมด้วย AI Face Swap จำลองทรงผมก่อนตัดจริง ด้วยโมเดล AI คุณภาพสูง",
};

export default function HairPreviewPage() {
  return (
    <main className="min-h-screen py-10 px-4 bg-[#070709] text-white flex flex-col items-center">
      <HairPreviewSection />
    </main>
  );
}
