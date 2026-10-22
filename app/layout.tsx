import type { Metadata } from "next";
import { Prompt, JetBrains_Mono, IBM_Plex_Sans_Thai_Looped, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
      className={`${promptFont.variable} ${jetbrainsMono.variable} ${ibmThaiLooped.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-night selection:bg-accent selection:text-paper font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}