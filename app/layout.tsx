import type { Metadata } from "next";
import {
  Prompt,
  JetBrains_Mono,
  IBM_Plex_Sans_Thai_Looped,
  Cormorant_Garamond,
} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

const promptFont = Prompt({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-prompt",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const ibmThaiLooped = IBM_Plex_Sans_Thai_Looped({
  weight: ["400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-thai-looped",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
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
    <html
      lang="th"
      className={`${promptFont.variable} ${jetbrainsMono.variable} ${ibmThaiLooped.variable} ${cormorantGaramond.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#1A1A1A] text-white selection:bg-[#C4A470] selection:text-white font-sans overflow-x-hidden">
        <Navbar />
        <div className="lg:pl-[260px] pb-16 lg:pb-0 flex-1 flex flex-col min-w-0">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <ChatWidget />
      </body>
    </html>
  );
}