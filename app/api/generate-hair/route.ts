export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import { Client } from "@gradio/client";
import fs from "node:fs/promises";
import path from "node:path";
import Replicate from "replicate";

interface TargetStyle {
  id: string;
  name: string;
  desc: string;
  price: string;
  faceShape: string;
  localPath: string;
  url?: string;
}

// ─────────────────────────────────────────────────────────────
// 1. Target Hairstyle Library (High quality modern haircuts)
// ─────────────────────────────────────────────────────────────
const targetStyles: TargetStyle[] = [
  {
    id: "two-block",
    name: "ทรงทูบล็อค (Two Block)",
    desc: "เข้ากับรูปหน้าได้ดี ตัดแล้วดูเด็กลง เพิ่มมิติและความละมุนให้ช่วงกราม",
    price: "฿280 / 40 นาที",
    faceShape: "ทรงไข่ (Oval) / ทรงหัวใจ (Heart)",
    localPath: "public/hairstyles/two-block.jpg",
  },
  {
    id: "undercut",
    name: "ทรงอันเดอร์คัต (Undercut)",
    desc: "เท่ สะอาดตา ดูแลง่าย เปิดกรอบหน้าและแนวกรามให้คมชัดโดดเด่น",
    price: "฿250 / 30 นาที",
    faceShape: "ทรงเหลี่ยม (Square) / ทรงไข่ (Oval)",
    localPath: "public/hairstyles/undercut.jpg",
  },
  {
    id: "quiff",
    name: "ทรงควิฟ (Modern Quiff)",
    desc: "ปัดเสยมีวอลลุ่ม เสริมบุคลิกภาพให้ดูภูมิฐานและสมาร์ท",
    price: "฿270 / 35 นาที",
    faceShape: "ทรงกลม (Round) / ทรงไข่ (Oval)",
    localPath: "public/hairstyles/quiff.jpg",
  },
  {
    id: "pompadour",
    name: "ทรงปอมปาดัวร์ (Pompadour)",
    desc: "คลาสสิกวินเทจ ยกโคนสูง ช่วยให้ใบหน้าดูกระชับและเรียวยาวขึ้น",
    price: "฿300 / 45 นาที",
    faceShape: "ทรงกลม (Round) / ทรงยาว (Oblong)",
    localPath: "public/hairstyles/pompadour.jpg",
  },
  {
    id: "buzz-cut",
    name: "ทรงบัซคัต (Buzz Cut)",
    desc: "สั้นกระชับ สไตล์แมนดุดัน ขับเน้นสันกรามและดวงตาอย่างชัดเจน",
    price: "฿150 / 20 นาที",
    faceShape: "ทรงเหลี่ยม (Square)",
    localPath: "public/hairstyles/buzz-cut.jpg",
  },
  {
    id: "crew-cut",
    name: "ทรงครูว์คัต (Crew Cut)",
    desc: "เรียบร้อย ทันสมัย สุภาพและดูแลง่ายในทุกวัน",
    price: "฿200 / 25 นาที",
    faceShape: "ทรงไข่ (Oval) / ทรงกลม (Round)",
    localPath: "public/hairstyles/crew-cut.jpg",
  },
];

// Helper to convert data URL to Blob
function dataUrlToBlob(dataUrl: string): Blob {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (match) {
    const mimeType = match[1];
    const buffer = Buffer.from(match[2], "base64");
    return new Blob([buffer], { type: mimeType });
  }
  const buffer = Buffer.from(dataUrl, "base64");
  return new Blob([buffer], { type: "image/jpeg" });
}

export async function POST(req: NextRequest) {
  try {
    let body: { userImage?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    const { userImage, styleName, styleId, reasoning, faceShape } = body as {
      userImage?: unknown;
      styleName?: string;
      styleId?: string;
      reasoning?: string;
      faceShape?: string;
    };

    if (!userImage || typeof userImage !== "string") {
      return NextResponse.json(
        {
          error:
            "Missing or invalid 'userImage'. Please provide a base64 string or image URL.",
        },
        { status: 400 }
      );
    }

    // ─────────────────────────────────────────────────────────────
    // 1. Select target hairstyle (use requested style if provided)
    // ─────────────────────────────────────────────────────────────
    let selectedStyle = targetStyles.find(
      (s) =>
        (styleId && s.id === styleId) ||
        (styleName && (s.name.includes(styleName) || styleName.includes(s.name) || styleName.includes(s.id)))
    );

    if (!selectedStyle) {
      selectedStyle = targetStyles[Math.floor(Math.random() * targetStyles.length)];
    }

    // Read the target hairstyle local image as Blob
    let targetImageBlob: Blob;
    try {
      const targetFilePath = path.join(
        process.cwd(),
        selectedStyle.localPath
      );
      const targetBuffer = await fs.readFile(targetFilePath);
      targetImageBlob = new Blob([targetBuffer], { type: "image/jpeg" });
    } catch (fsErr) {
      console.warn("Could not read local target image, fallback to default buffer:", fsErr);
      targetImageBlob = new Blob([Buffer.from("")], { type: "image/jpeg" });
    }

    // Convert source user face image into Blob
    const userFaceBlob = dataUrlToBlob(userImage);

    let generatedImageUrl: string = "";

    // ─────────────────────────────────────────────────────────────
    // 2. 100% Free Hugging Face Spaces Face Swap via @gradio/client
    // ─────────────────────────────────────────────────────────────
    try {
      // Connect to stable public Face Swap space
      const client = await Client.connect("tonyassi/face-swap");
      const result = await client.predict("/swap_faces", [
        userFaceBlob,    // Source (The user's face)
        targetImageBlob, // Target (The body/hair)
      ]);

      const dataOutput = (result as { data?: unknown[] })?.data;
      if (Array.isArray(dataOutput) && dataOutput.length > 0) {
        const first = dataOutput[0];
        if (typeof first === "string") {
          generatedImageUrl = first;
        } else if (
          first &&
          typeof first === "object" &&
          "url" in (first as Record<string, unknown>)
        ) {
          generatedImageUrl = String((first as { url?: string }).url);
        } else if (
          first &&
          typeof first === "object" &&
          "path" in (first as Record<string, unknown>)
        ) {
          generatedImageUrl = String((first as { path?: string }).path);
        }
      }
    } catch (gradioErr) {
      console.warn("Hugging Face Gradio space call encountered issue, trying fallback:", gradioErr);
    }

    // Secondary fallback: Try Dentro/face-swap or Replicate if Hugging Face space had a queue timeout
    if (!generatedImageUrl) {
      try {
        const clientDentro = await Client.connect("Dentro/face-swap");
        const resDentro = await clientDentro.predict("/predict", [
          userFaceBlob,
          1,
          targetImageBlob,
          1,
        ]);
        const dataOutput = (resDentro as { data?: unknown[] })?.data;
        if (Array.isArray(dataOutput) && dataOutput[0]) {
          const item = dataOutput[0] as { url?: string; path?: string } | string;
          generatedImageUrl =
            typeof item === "string"
              ? item
              : item.url || item.path || "";
        }
      } catch (dentroErr) {
        console.warn("Dentro fallback also had issue:", dentroErr);
      }
    }

    // Replicate fallback if token is available in .env.local
    if (!generatedImageUrl && process.env.REPLICATE_API_TOKEN) {
      try {
        const replicate = new Replicate({
          auth: process.env.REPLICATE_API_TOKEN,
        });
        const repRes = await replicate.run(
          "cdingram/face-swap:d1d6ea8c8be89d664a07a457526f7128109dee7030fdac424788d762c71ed111",
          {
            input: {
              input_image: userImage,
              swap_image: `/${selectedStyle.localPath.replace(/^public\//, "")}`,
            },
          }
        );
        if (typeof repRes === "string") {
          generatedImageUrl = repRes;
        } else if (Array.isArray(repRes) && repRes[0]) {
          generatedImageUrl = String(repRes[0]);
        }
      } catch (repErr) {
        console.warn("Replicate fallback error:", repErr);
      }
    }

    // Final safety fallback: use local style preview so UI never crashes
    if (!generatedImageUrl) {
      generatedImageUrl = `/${selectedStyle.localPath.replace(/^public\//, "")}`;
    }

    // ─────────────────────────────────────────────────────────────
    // 3. Return JSON schema
    // ─────────────────────────────────────────────────────────────
    return NextResponse.json({
      resultImage: generatedImageUrl,
      suggestedStyle: styleName || selectedStyle.name,
      reasoning: reasoning || selectedStyle.desc,
      faceShape: faceShape || selectedStyle.faceShape,
      price: selectedStyle.price,
      styleId: selectedStyle.id,
    });
  } catch (err: unknown) {
    console.error("Error in /api/generate-hair:", err);
    const errorObj = err as { message?: string };
    return NextResponse.json(
      {
        error: errorObj?.message || "Failed to process hairstyle preview",
      },
      { status: 500 }
    );
  }
}
