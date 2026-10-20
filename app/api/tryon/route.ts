import { NextResponse } from "next/server";
import { hairstyles } from "@/data/hairstyles";
import fs from "node:fs/promises";
import path from "node:path";
import { checkRateLimit } from "@/lib/rateLimit";

function fail(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(req: Request) {
  // =====================================================
  // 0. เช็กก่อนว่า IP นี้เรียกเกินโควต้าหรือยัง (กันเงินหมด)
  // =====================================================
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rate = await checkRateLimit(`tryon:${ip}`);
  if (!rate.allowed) {
    return fail("too-many-requests", 429);
  }

  let body: { photo?: unknown; hairstyleId?: unknown };

  try {
    body = await req.json();
  } catch {
    return fail("bad-request", 400);
  }

  const { photo, hairstyleId } = body;

  if (typeof photo !== "string" || typeof hairstyleId !== "string") {
    return fail("bad-request", 400);
  }

  const style = hairstyles.find((s) => s.id === hairstyleId);

  if (!style) {
    return fail("unknown-style", 400);
  }

  // =====================================================
  // โหมดจำลอง: ส่งรูปเดิมกลับ ไม่เรียก AI ไม่เสียเงิน
  // จะเรียก AI จริงก็ต่อเมื่อตั้ง USE_MOCK_AI=false เท่านั้น
  // =====================================================
  if (process.env.USE_MOCK_AI !== "false") {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return NextResponse.json({ image: photo, mock: true });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return fail("no-api-key", 500);
  }

  const match = photo.match(
    /^data:(image\/(?:jpeg|jpg|png|webp));base64,(.+)$/
  );

  if (!match) {
    return fail("bad-photo", 400);
  }

  const customerMimeType = match[1];
  const customerBase64 = match[2];

  try {
    // =====================================================
    // 1. อ่านรูปทรงผมอ้างอิงจากโฟลเดอร์ public
    // =====================================================

    if (!style.referenceImage) {
      return fail("no-reference-image", 400);
    }

    const refPath = path.join(
      process.cwd(),
      "public",
      style.referenceImage
    );

    const refBuffer = await fs.readFile(refPath);
    const refBase64 = refBuffer.toString("base64");
    const refMimeType = style.referenceImage.endsWith(".png")
      ? "image/png"
      : "image/jpeg";

    console.log("ใช้รูปทรงผมอ้างอิง:", style.referenceImage);

    // =====================================================
    // 2. เตรียม prompt สั่ง Gemini
    // =====================================================

    const prompt =
      "นี่คือรูปของลูกค้า (รูปแรก) และรูปทรงผมอ้างอิง (รูปที่สอง). " +
      "เปลี่ยนเฉพาะทรงผมของลูกค้าในรูปแรกให้เหมือนทรงผมในรูปที่สอง. " +
      "ห้ามเปลี่ยนใบหน้า สีผิว เสื้อผ้า หรือพื้นหลังของลูกค้า. " +
      "ให้ผลลัพธ์ดูเป็นภาพถ่ายจริง ไม่ใช่ภาพวาดการ์ตูน.";

    // =====================================================
    // 3. เรียก Gemini API
    // =====================================================

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: customerMimeType,
                    data: customerBase64,
                  },
                },
                {
                  inline_data: {
                    mime_type: refMimeType,
                    data: refBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
          },
        }),
      }
    );

    const data = await response.json();

    console.log("Gemini response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return fail(data?.error?.message || "gemini-failed", response.status);
    }

    // =====================================================
    // 4. ดึงรูปที่ Gemini สร้างออกมา
    // =====================================================

    const parts = data?.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find(
      (p: any) => p.inlineData || p.inline_data
    );

    if (!imagePart) {
      console.error("ไม่พบรูปในผลลัพธ์:", JSON.stringify(data, null, 2));
      return fail("no-image-returned", 502);
    }

    const outData = imagePart.inlineData || imagePart.inline_data;
    const outMime = outData.mimeType || outData.mime_type || "image/png";
    const outBase64 = outData.data;

    const imageDataUrl = `data:${outMime};base64,${outBase64}`;

    console.log("ได้รูปผลลัพธ์จาก Gemini แล้ว");

    return NextResponse.json({
      image: imageDataUrl,
      mock: false,
    });
  } catch (error) {
    console.error("Gemini error:", error);
    return fail("ai-failed", 502);
  }
}