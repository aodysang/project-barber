import { NextResponse } from "next/server";
import { shop } from "@/data/shop";
import { services } from "@/data/services";
import { barbers } from "@/data/barbers";
import { reviews } from "@/data/reviews";

export async function POST(req: Request) {
  try {
    const { message, history = [] } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    // เช็กชื่อตัวแปร API Key ใน .env.local (รองรับทั้ง GEMINI_API_KEY และ GOOGLE_API_KEY)
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    // สรุปข้อมูลร้านจริงให้ AI ใช้เป็นฐานความรู้
    const shopKnowledge = `
คุณคือผู้ช่วยแอดมินประจำร้านตัดผมชาย "Veera Barber" (วีระ บาร์เบอร์) พูดจาสุภาพ เป็นกันเอง ลงท้ายด้วย "ครับ" ตอบกระชับ ตรงประเด็น ไม่ยืดเยื้อ

ข้อมูลร้าน:
- ชื่อร้าน: ${shop.name}
- ที่อยู่: ${shop.address}
- เบอร์โทร: ${shop.phone}
- เวลาทำการ: ${shop.openHours.map((h) => `${h.day} ${h.time}`).join(", ")}
- จุดเด่น: ${shop.highlights.join(", ")}

รายการบริการและราคา:
${services
  .map(
    (s) =>
      `- ${s.name} (${s.category}): ${s.price} บาท ใช้เวลา ${s.duration} นาที (${s.description})`
  )
  .join("\n")}

ทีมช่างประจำร้าน (5 ท่าน):
${barbers
  .map(
    (b) =>
      `- ${b.name} (${b.title} / ${b.badge}): ประสบการณ์ ${b.experience}, คะแนนรีวิว ${b.rating}/5 (${b.reviewCount} รีวิว), ความถนัด: ${b.specialty}, ทรงแนะนำ: ${b.favoriteCut}`
  )
  .join("\n")}

ตัวอย่างรีวิวลูกค้าจริง:
${reviews
  .slice(0, 4)
  .map((r) => `- ${r.customerName} (${r.barberName}): "${r.comment}"`)
  .join("\n")}

คำแนะนำเพิ่มเติมในการตอบ:
- หากลูกค้าถามว่า "คนไหนตัดดีสุด" ให้แนะนำว่าช่างทุกคนฝีมือดีคะแนนรีวิว 4.9-5.0 ทุกคน แต่แนะนำให้เลือกตามสไตล์ที่ชอบ (เช่น ช่างวีระ 5.0 ดาว ถนัดคลาสสิก/วินเทจ, ช่างเบค ถนัดสกินเฟด/โมเดิร์น, ช่างฟลุ๊ค ถนัดทรงเกาหลี Two-Block, ช่างเล็ก ถนัด Texture/วินเทจ, ช่างว่าน ถนัดทรงสุภาพคลาสสิก)
- หากลูกค้าถามเรื่องเลือกทรงผมให้เข้ากับโครงหน้า แนะนำให้ลองใช้ฟีเจอร์ "ให้ลุง AI ช่วยเลือกทรง" บนเว็บ
- ห้ามแต่งราคาหรือข้อมูลบริการนอกเหนือจากที่ให้ไว้
`;

    // แปลงประวัติแชทล่าสุด 6 ข้อความเพื่อให้บอทจำบริบทการคุยได้
    const contents = [
      ...history.slice(-6).map((m: { sender: string; text: string }) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      })),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: shopKnowledge }],
          },
          contents,
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 350,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini Chat API Error:", errText);
      return NextResponse.json({ error: "Gemini API failed" }, { status: 502 });
    }

    const data = await response.json();
    const replyText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "ขออภัยครับ ระบบขัดข้องชั่วคราว สามารถโทรสอบถามได้ที่ " + shop.phone;

    // ตัดสินใจแนบปุ่มลิงก์อัตโนมัติตามเนื้อหาคำตอบ
    let action: { label: string; href: string } | undefined;
    if (
      replyText.includes("ลองทรง") ||
      replyText.includes("โครงหน้า") ||
      replyText.includes("AI")
    ) {
      action = { label: "ให้ลุง AI ช่วยเลือกทรง →", href: "/try" };
    } else if (
      replyText.includes("จอง") ||
      replyText.includes("ช่าง") ||
      replyText.includes("บาท")
    ) {
      action = { label: "จองคิวตัดผมทันที →", href: "/book" };
    }

    return NextResponse.json({ reply: replyText, action });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}