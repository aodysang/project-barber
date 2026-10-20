export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// ─────────────────────────────────────────────────────────────
// 1. The 6 Asian Hairstyle Collection (Veera Barber)
// ─────────────────────────────────────────────────────────────
export const AVAILABLE_HAIRSTYLES = [
  "แสกกลางสไตล์เกาหลี (Curtain Hair)",
  "แสกข้าง 6:4 (Side Part)",
  "หน้าม้าเท็กซ์เจอร์ (Textured Fringe)",
  "ผมยาวปัดข้าง (Long Flow)",
  "รองทรงต่ำ + Volume ด้านบน",
  "หน้าม้าปัดเกาหลี (Soft Fringe)",
];

interface Recommendation {
  styleName: string;
  reasoning: string;
}

interface AnalyzeFaceResponse {
  faceShape: string;
  recommendations: Recommendation[];
}

// Fallback recommendations if Gemini API key is missing or service encounters an issue
const FALLBACK_RESULT: AnalyzeFaceResponse = {
  faceShape: "ทรงไข่ (Oval)",
  recommendations: [
    {
      styleName: "แสกกลางสไตล์เกาหลี (Curtain Hair)",
      reasoning: "ช่วยเปิดหน้าผากและสร้างกรอบหน้าที่ดูละมุน เข้ากับโครงหน้าได้อย่างลงตัวและดูทันสมัย",
    },
    {
      styleName: "แสกข้าง 6:4 (Side Part)",
      reasoning: "เพิ่มมิติให้แนวกรามและสายตา ให้ลุคสุภาพ เรียบหรู แต่ยังคงความเท่และโปร่งสบาย",
    },
    {
      styleName: "หน้าม้าเท็กซ์เจอร์ (Textured Fringe)",
      reasoning: "เพิ่มวอลลุ่มด้านบนและมิติของเส้นผม ช่วยปรับสัดส่วนใบหน้าให้ดูเด็กลงและสมดุล",
    },
  ],
};

function cleanAndParseJSON(rawText: string): AnalyzeFaceResponse {
  const cleaned = rawText
    .replace(/```(?:json)?\s*/gi, "")
    .replace(/\s*```/g, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Parsed result is not an object");
  }

  const faceShape =
    typeof parsed.faceShape === "string" && parsed.faceShape.trim().length > 0
      ? parsed.faceShape.trim()
      : "ทรงไข่ (Oval)";

  const rawRecs = Array.isArray(parsed.recommendations)
    ? parsed.recommendations
    : [];

  const recommendations: Recommendation[] = rawRecs
    .filter(
      (item: unknown) =>
        item &&
        typeof item === "object" &&
        "styleName" in item &&
        typeof (item as { styleName: unknown }).styleName === "string"
    )
    .map((item: { styleName: string; reasoning?: string }) => ({
      styleName: item.styleName.trim(),
      reasoning:
        typeof item.reasoning === "string" && item.reasoning.trim().length > 0
          ? item.reasoning.trim()
          : "ทรงนี้ช่วยปรับสมดุลและขับเน้นจุดเด่นของโครงหน้าได้อย่างลงตัว",
    }))
    .slice(0, 3);

  // If Gemini returned fewer than 3, complete with styles from the list
  if (recommendations.length < 3) {
    const usedNames = new Set(recommendations.map((r) => r.styleName));
    for (const style of AVAILABLE_HAIRSTYLES) {
      if (!usedNames.has(style)) {
        recommendations.push({
          styleName: style,
          reasoning: "เข้ากับรูปหน้า ช่วยเสริมความมั่นใจและจัดแต่งทรงได้ง่าย",
        });
        usedNames.add(style);
        if (recommendations.length >= 3) break;
      }
    }
  }

  return {
    faceShape,
    recommendations,
  };
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

    const { userImage } = body;

    if (!userImage || typeof userImage !== "string") {
      return NextResponse.json(
        {
          error:
            "Missing or invalid 'userImage'. Please provide a base64 string or image URL.",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      console.warn(
        "GEMINI_API_KEY is not configured in environment. Using curated fallback."
      );
      return NextResponse.json(FALLBACK_RESULT);
    }

    // Initialize Google GenAI client
    const ai = new GoogleGenAI({ apiKey });

    // Format list of 6 Asian hairstyles for prompt
    const hairstylesListString = AVAILABLE_HAIRSTYLES.map(
      (style, index) => `${index + 1}. ${style}`
    ).join("\n");

    const prompt = `Act as an expert Thai Barber. Analyze this Asian male's face shape based on the image. Then, select exactly 3 hairstyles from this list:
${hairstylesListString}
that best suit his face shape. You MUST return the response strictly as a JSON object in this format: { "faceShape": "(e.g., ทรงไข่ (Oval))", "recommendations": [ { "styleName": "(Name of the style)", "reasoning": "(Why it suits him in Thai)" }, ... ] } Do not include markdown formatting or backticks around the JSON.`;

    // Extract Base64 data and mimeType
    let mimeType = "image/jpeg";
    let base64Data = userImage;

    const match = userImage.match(
      /^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/
    );
    if (match) {
      mimeType = match[1];
      base64Data = match[2];
    }

    // Supported multimodal models in priority order
    const candidateModels = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
    ];

    let lastError: Error | null = null;
    let resultText = "";

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType,
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          config: {
            responseMimeType: "application/json",
          },
        });

        if (response.text) {
          resultText = response.text;
          break;
        }
      } catch (modelErr: unknown) {
        lastError = modelErr as Error;
        console.warn(`Gemini model ${model} failed, attempting next:`, modelErr);
      }
    }

    if (!resultText) {
      console.error(
        "All Gemini models failed or returned empty text. Fallback applied:",
        lastError
      );
      return NextResponse.json(FALLBACK_RESULT);
    }

    try {
      const parsedData = cleanAndParseJSON(resultText);
      return NextResponse.json(parsedData);
    } catch (parseErr) {
      console.error("Failed to parse Gemini JSON output. Raw output was:", resultText, parseErr);
      return NextResponse.json(FALLBACK_RESULT);
    }
  } catch (err: unknown) {
    const errObj = err as Error;
    console.error("Face analysis API error:", errObj);
    return NextResponse.json(
      {
        error: "เกิดข้อผิดพลาดในการวิเคราะห์ใบหน้า กรุณาลองใหม่อีกครั้ง",
        details: errObj.message,
      },
      { status: 500 }
    );
  }
}
