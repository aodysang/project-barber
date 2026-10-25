import FaceAnalysisFlow from "@/components/FaceAnalysisFlow";

export default function FaceAnalysisPage() {
  return (
    <main className="min-h-screen p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-2">วิเคราะห์โครงหน้า</h1>
      <p className="mb-6 text-center text-gray-500 text-sm max-w-sm">
        ถ่ายรูปหน้าตรง ให้ระบบวิเคราะห์โครงหน้าและแนะนำทรงผมที่เหมาะกับคุณ
        (ไม่มีการสร้างภาพจำลองด้วย AI ในขั้นนี้)
      </p>
      <FaceAnalysisFlow />
    </main>
  );
}