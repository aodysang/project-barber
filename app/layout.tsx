import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const promptFont = Prompt({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-prompt",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Veera Barber | ความคลาสสิกที่ใส่ได้ทุกวัน - แจ้งวัฒนะ 28",
  description:
    "Veera Barber ร้านตัดผมชายสไตล์คลาสสิกและโมเดิร์น ซอยแจ้งวัฒนะ 28 จ.นนทบุรี ตัดผมผู้ใหญ่ 120 บาท บริการตัด สระ โกนหนวด พร้อมระบบจองคิวออนไลน์และระบบ AI แนะนำทรงผม",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${promptFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#000000] text-gray-100 selection:bg-[#FFC800] selection:text-black">
        <Navbar />
        {children}
      </body>
    </html>
  );
}