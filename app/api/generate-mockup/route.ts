export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import sharp from "sharp";
import { Client } from "@gradio/client";
import fs from "node:fs/promises";
import path from "node:path";
import { getTargetHairstyle } from "@/lib/targetHairstyles";

// Helper to parse Base64 Data URL into Buffer & MimeType
function parseDataUrl(dataUrl: string): { buffer: Buffer; mimeType: string } {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (match) {
    const mimeType = match[1];
    const buffer = Buffer.from(match[2], "base64");
    return { buffer, mimeType };
  }
  const buffer = Buffer.from(dataUrl, "base64");
  return { buffer, mimeType: "image/jpeg" };
}

// ─────────────────────────────────────────────────────────────
// 1. Precise Anatomical Hair Mask Generator
// Traces natural head dome and forehead hairline landmarks.
// Strictly locks out mall background (0,0 to width,0) and face.
// ─────────────────────────────────────────────────────────────
function createAnatomicalHairMaskSvg(
  width: number,
  height: number,
  landmarks?: Array<{ x: number; y: number }>
): string {
  if (landmarks && landmarks.length >= 400) {
    const foreheadIndices = [
      234, 127, 162, 54, 103, 67, 109, 10, 338, 297, 332, 284, 389, 356, 454,
    ];

    const leftTemple = landmarks[234];
    const rightTemple = landmarks[454];
    const centerForehead = landmarks[10];
    const chin = landmarks[152] || { x: 0.5, y: 0.85 };

    const leftX = leftTemple.x * width;
    const leftY = leftTemple.y * height;
    const rightX = rightTemple.x * width;
    const rightY = rightTemple.y * height;
    const headWidth = Math.max(rightX - leftX, 40);

    const foreheadY = centerForehead.y * height;
    const chinY = chin.y * height;
    const faceHeight = Math.max(chinY - foreheadY, 50);

    // Bounded skull dome coordinates - locks left/right background 100%
    const marginX = headWidth * 0.12;
    const domeLeftX = Math.max(0, leftX - marginX);
    const domeRightX = Math.min(width, rightX + marginX);
    const domeTopY = Math.max(0, foreheadY - faceHeight * 0.52);
    const domeControlY = Math.max(0, domeTopY - faceHeight * 0.12);

    const hairlinePoints = foreheadIndices
      .map((idx) => {
        const pt = landmarks[idx];
        return `${Math.round(pt.x * width)},${Math.round(pt.y * height)}`;
      })
      .join(" L ");

    return `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="black"/>
        <path d="M ${Math.round(domeLeftX)},${Math.round(leftY)}
                 C ${Math.round(domeLeftX)},${Math.round(domeControlY)}
                   ${Math.round(domeRightX)},${Math.round(domeControlY)}
                   ${Math.round(domeRightX)},${Math.round(rightY)}
                 L ${hairlinePoints} Z" fill="white"/>
      </svg>
    `;
  }

  // Fallback: Centered portrait head dome (strictly preserving mall background)
  const centerX = width * 0.5;
  const headW = width * 0.42;
  const topY = height * 0.08;
  const bottomY = height * 0.36;

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="black"/>
      <ellipse cx="${centerX}" cy="${(topY + bottomY) / 2}" rx="${headW * 0.5}" ry="${(bottomY - topY) * 0.6}" fill="white"/>
      <rect x="0" y="${bottomY}" width="${width}" height="${height - bottomY}" fill="black"/>
    </svg>
  `;
}

// ─────────────────────────────────────────────────────────────
// 2. Automatic AI Hair Segmentation Pipeline via Replicate
// Calls SAM / Grounded SAM, hair-segment, or remove-bg
// ─────────────────────────────────────────────────────────────
async function fetchAutomaticHairMaskFromReplicate(
  replicate: Replicate,
  userImageBase64: string,
  width: number,
  height: number,
  landmarks?: Array<{ x: number; y: number }>
): Promise<Buffer | null> {
  // Option A: Grounded SAM (Segment Anything Model) targeted for hair
  try {
    console.log("Segmenting hair with schananas/grounded_sam...");
    const samOutput: unknown = await replicate.run(
      "schananas/grounded_sam:c2e06895c010642f4c9c2771804f56f14066929342721869e5d0382d62294103",
      {
        input: {
          image: userImageBase64,
          mask_prompt: "hair, haircut",
          negative_mask_prompt:
            "face, skin, eyes, nose, mouth, beard, clothes, shirt, background, mall",
          adjustment_factor: 0,
        },
      }
    );

    const maskUrl = Array.isArray(samOutput)
      ? String(samOutput[0])
      : typeof samOutput === "string"
      ? samOutput
      : "";
    if (maskUrl && maskUrl.startsWith("http")) {
      const resp = await fetch(maskUrl);
      if (resp.ok) {
        const buf = Buffer.from(await resp.arrayBuffer());
        return await sharp(buf)
          .resize(width, height)
          .grayscale()
          .blur(2)
          .png()
          .toBuffer();
      }
    }
  } catch (samErr) {
    console.warn("Grounded SAM segmentation attempt skipped:", samErr);
  }

  // Option B: hadilq/hair-segment specialized hair model
  try {
    console.log("Segmenting hair with hadilq/hair-segment...");
    const hairSegOutput: unknown = await replicate.run(
      "hadilq/hair-segment:b335dc1b693b2de88040736eb426702adfc2f0c869ae9dba3569bac1beb9c0f6",
      {
        input: {
          image: userImageBase64,
        },
      }
    );

    const maskUrl =
      typeof hairSegOutput === "string"
        ? hairSegOutput
        : Array.isArray(hairSegOutput)
        ? String(hairSegOutput[0])
        : "";
    if (maskUrl && maskUrl.startsWith("http")) {
      const resp = await fetch(maskUrl);
      if (resp.ok) {
        const buf = Buffer.from(await resp.arrayBuffer());
        return await sharp(buf)
          .resize(width, height)
          .grayscale()
          .blur(2)
          .png()
          .toBuffer();
      }
    }
  } catch (hairSegErr) {
    console.warn("hadilq/hair-segment attempt skipped:", hairSegErr);
  }

  // Option C: lucataco/remove-bg to extract person silhouette,
  // then intersect with anatomical head region to isolate hair from mall background
  try {
    console.log("Segmenting silhouette with lucataco/remove-bg...");
    const rmbgOutput: unknown = await replicate.run(
      "lucataco/remove-bg:95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1",
      {
        input: {
          image: userImageBase64,
        },
      }
    );

    const rmbgUrl =
      typeof rmbgOutput === "string"
        ? rmbgOutput
        : Array.isArray(rmbgOutput)
        ? String(rmbgOutput[0])
        : "";
    if (rmbgUrl && rmbgUrl.startsWith("http")) {
      const resp = await fetch(rmbgUrl);
      if (resp.ok) {
        const buf = Buffer.from(await resp.arrayBuffer());
        // Extract alpha channel: 0 = mall background, 255 = person
        const alphaMask = await sharp(buf)
          .resize(width, height)
          .ensureAlpha()
          .extractChannel(3)
          .png()
          .toBuffer();

        // Intersect with anatomical head dome so face and shirt are also black (0)
        const anatomicalSvg = createAnatomicalHairMaskSvg(width, height, landmarks);
        const anatomicalBuffer = await sharp(Buffer.from(anatomicalSvg))
          .png()
          .toBuffer();

        return await sharp(alphaMask)
          .composite([{ input: anatomicalBuffer, blend: "dest-in" }])
          .blur(2)
          .png()
          .toBuffer();
      }
    }
  } catch (rmbgErr) {
    console.warn("lucataco/remove-bg attempt skipped:", rmbgErr);
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    let body: {
      userImage?: unknown;
      selectedStyleName?: string;
      reasoning?: string;
      faceShape?: string;
      hairMask?: string;
      landmarks?: Array<{ x: number; y: number }>;
    };

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    const {
      userImage,
      selectedStyleName = "แสกกลางสไตล์เกาหลี (Curtain Hair)",
      reasoning,
      faceShape,
      hairMask,
      landmarks,
    } = body;

    if (!userImage || typeof userImage !== "string") {
      return NextResponse.json(
        {
          error:
            "Missing or invalid 'userImage'. Please provide a base64 string or image URL.",
        },
        { status: 400 }
      );
    }

    const targetStyle = getTargetHairstyle(selectedStyleName);

    // 1. Process original user image
    const { buffer: userImageBuffer, mimeType: userMime } =
      parseDataUrl(userImage);
    const originalMetadata = await sharp(userImageBuffer).metadata();
    const origWidth = originalMetadata.width || 800;
    const origHeight = originalMetadata.height || 1000;

    const userImageBase64 = `data:${userMime};base64,${userImageBuffer.toString(
      "base64"
    )}`;

    // 2. Obtain high-precision Hair Segmentation Mask
    // Priority 1: Replicate AI Automatic Hair Segmenter (SAM / hair-segment / remove-bg)
    // Priority 2: Client-passed anatomical hair mask
    // Priority 3: Server anatomical head dome mask
    let maskPngBuffer: Buffer | null = null;
    const replicateToken = process.env.REPLICATE_API_TOKEN?.trim();

    let replicate: Replicate | null = null;
    if (replicateToken) {
      replicate = new Replicate({
        auth: replicateToken,
      });

      try {
        maskPngBuffer = await fetchAutomaticHairMaskFromReplicate(
          replicate,
          userImageBase64,
          origWidth,
          origHeight,
          landmarks
        );
      } catch (autoSegErr) {
        console.warn("Automatic Replicate segmentation error:", autoSegErr);
      }
    }

    // Fallback to high-precision anatomical landmark hair mask
    if (!maskPngBuffer) {
      if (hairMask && typeof hairMask === "string") {
        try {
          const parsedMask = parseDataUrl(hairMask);
          maskPngBuffer = await sharp(parsedMask.buffer)
            .resize(origWidth, origHeight)
            .grayscale()
            .blur(2)
            .png()
            .toBuffer();
        } catch {
          // ignore mask parse error
        }
      }

      if (!maskPngBuffer) {
        const svg = createAnatomicalHairMaskSvg(origWidth, origHeight, landmarks);
        maskPngBuffer = await sharp(Buffer.from(svg))
          .blur(3)
          .png()
          .toBuffer();
      }
    }

    const hairMaskBase64 = `data:image/png;base64,${maskPngBuffer.toString(
      "base64"
    )}`;

    // 3. Strict inpainting prompts & constraints
    // prompt_strength capped strictly at 0.60 (within 0.55 - 0.65)
    const prompt = `A realistic Asian male ${selectedStyleName} haircut, detailed natural hair texture, matching original lighting, professional Thai barber style`;
    const negativePrompt = `3d, render, cartoon, illustration, beard, mustache, fake, low resolution, face change, background change`;
    const promptStrength = 0.60;
    const numInferenceSteps = 30;

    let generatedImageUrl = "";
    let lastError: Error | null = null;

    // 4. Inpainting via Replicate API
    if (replicate) {
      const inpaintingModels = [
        "stability-ai/stable-diffusion-inpainting:c28b92a7ecd662a808b15776f8615bda220336214341f532a87611ef4f1d4317",
        "stability-ai/stable-diffusion-inpainting:95b7223104132402a9ae91cc677285bc5eb997834bd2349fa486f53910fd68b3",
        "lucataco/sdxl-inpainting:a5b13068cc81a89a4fbeefeccc774869fcb34df4dbc92c1555e0f2771d49dde7",
      ];

      for (const modelId of inpaintingModels) {
        try {
          console.log(`Executing Replicate inpainting model: ${modelId}...`);

          const output: unknown = await replicate.run(
            modelId as `${string}/${string}:${string}`,
            {
              input: {
                image: userImageBase64,
                mask: hairMaskBase64,
                prompt,
                negative_prompt: negativePrompt,
                prompt_strength: promptStrength,
                num_inference_steps: numInferenceSteps,
              },
            }
          );

          if (typeof output === "string" && output.length > 0) {
            generatedImageUrl = output;
            break;
          } else if (Array.isArray(output) && output.length > 0) {
            generatedImageUrl = String(output[0]);
            break;
          } else if (output) {
            generatedImageUrl = String(output);
            break;
          }
        } catch (repErr) {
          lastError = repErr as Error;
          console.warn(`Replicate inpainting error on ${modelId}:`, repErr);
        }
      }
    }

    // 5. Fallback to free SDXL inpainting if Replicate is unauthenticated or busy
    if (!generatedImageUrl) {
      try {
        console.log(
          "Fallback to Hugging Face diffusers/stable-diffusion-xl-inpainting..."
        );
        const client = await Client.connect(
          "diffusers/stable-diffusion-xl-inpainting"
        );

        const userBlob = new Blob([new Uint8Array(userImageBuffer)], {
          type: userMime,
        });
        const maskBlob = new Blob([new Uint8Array(maskPngBuffer)], {
          type: "image/png",
        });

        const inputPayload = {
          background: userBlob,
          layers: [maskBlob],
          composite: null,
        };

        const result = await client.predict("/predict", [
          inputPayload,
          prompt,
          negativePrompt,
          7.5,
          25,
          promptStrength,
          "EulerDiscreteScheduler",
        ]);

        const dataOutput = (result as { data?: unknown[] })?.data;
        if (Array.isArray(dataOutput) && dataOutput.length > 0) {
          const tuple = dataOutput[0] as
            | Array<{ url?: string; path?: string }>
            | { url?: string; path?: string };

          let resultUrl = "";
          if (Array.isArray(tuple) && tuple.length > 1) {
            resultUrl = tuple[1]?.url || tuple[1]?.path || "";
          } else if (Array.isArray(tuple) && tuple.length > 0) {
            resultUrl = tuple[0]?.url || tuple[0]?.path || "";
          } else if (tuple && typeof tuple === "object") {
            const item = tuple as { url?: string; path?: string };
            resultUrl = item.url || item.path || "";
          }

          if (resultUrl && resultUrl.startsWith("http")) {
            generatedImageUrl = resultUrl;
          }
        }
      } catch (hfErr) {
        lastError = hfErr as Error;
        console.warn("Hugging Face inpainting fallback notice:", hfErr);
      }
    }

    let finalResultDataUrl = generatedImageUrl;

    // Graceful fallback: If external inpainting services hit rate-limits or auth issues,
    // composite the shop's target hairstyle reference seamlessly within the precise hair mask.
    if (!generatedImageUrl) {
      try {
        console.log("Using high-precision hairstyle asset composite fallback...");
        const fallbackFilePath = path.join(process.cwd(), targetStyle.localFallbackPath);
        const styleAssetBuffer = await fs.readFile(fallbackFilePath);

        const styleResized = await sharp(styleAssetBuffer)
          .resize(origWidth, origHeight, { fit: "cover" })
          .toBuffer();

        const maskedHairLayer = await sharp(styleResized)
          .ensureAlpha()
          .composite([{ input: maskPngBuffer, blend: "dest-in" }])
          .png()
          .toBuffer();

        const compositedBuffer = await sharp(userImageBuffer)
          .composite([{ input: maskedHairLayer, blend: "over" }])
          .jpeg({ quality: 95 })
          .toBuffer();

        finalResultDataUrl = `data:image/jpeg;base64,${compositedBuffer.toString(
          "base64"
        )}`;
      } catch (fallbackErr) {
        console.warn("Local hairstyle composite fallback warning:", fallbackErr);
      }
    }

    if (!finalResultDataUrl) {
      console.error("All inpainting services were unavailable:", lastError);
      return NextResponse.json(
        {
          error:
            "ระบบ AI กำลังเริ่มต้นทำงาน กรุณารอสักครู่แล้วกดลองใหม่อีกครั้งครับ",
          details: lastError?.message || "Inpainting service busy.",
        },
        { status: 503 }
      );
    }

    try {
      if (generatedImageUrl.startsWith("http")) {
        const resp = await fetch(generatedImageUrl);
        if (resp.ok) {
          const generatedArrBuf = await resp.arrayBuffer();
          const generatedBuffer = Buffer.from(generatedArrBuf);

          const inpaintedResized = await sharp(generatedBuffer)
            .resize(origWidth, origHeight, { fit: "fill" })
            .toBuffer();

          const maskedHairLayer = await sharp(inpaintedResized)
            .ensureAlpha()
            .composite([{ input: maskPngBuffer, blend: "dest-in" }])
            .png()
            .toBuffer();

          const compositedBuffer = await sharp(userImageBuffer)
            .composite([{ input: maskedHairLayer, blend: "over" }])
            .jpeg({ quality: 95 })
            .toBuffer();

          finalResultDataUrl = `data:image/jpeg;base64,${compositedBuffer.toString(
            "base64"
          )}`;
        }
      }
    } catch (compositeErr) {
      console.warn(
        "Compositing warning, using direct result URL:",
        compositeErr
      );
    }

    return NextResponse.json({
      resultImage: finalResultDataUrl,
      suggestedStyle: targetStyle.name,
      reasoning: reasoning || targetStyle.desc,
      faceShape: faceShape || "ทรงไข่ (Oval)",
      price: targetStyle.price,
      styleId: targetStyle.id,
    });
  } catch (err: unknown) {
    const errObj = err as Error;
    console.error("Generate mockup API error:", errObj);
    return NextResponse.json(
      {
        error:
          "ระบบ AI กำลังเริ่มต้นทำงาน กรุณารอสักครู่แล้วกดลองใหม่อีกครั้งครับ",
        details: errObj.message,
      },
      { status: 500 }
    );
  }
}
