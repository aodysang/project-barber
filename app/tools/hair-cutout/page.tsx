/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import type { ImageSegmenter as ImageSegmenterType } from "@mediapipe/tasks-vision";
import { getFaceLandmarker } from "@/lib/faceLandmarker";

// รหัสทรงผมต้องตรงกับชื่อไฟล์ใน public/hairstyles (เช่น two-block.jpg)
const STYLE_IDS = [
  "undercut",
  "two-block",
  "buzz-cut",
  "pompadour",
  "crew-cut",
  "quiff",
];

// โมเดลตัดผมของ Google (โหลดจากเว็บ Google ตอนใช้เครื่องมือนี้)
const HAIR_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/image_segmenter/hair_segmenter/float32/latest/hair_segmenter.tflite";

// โหลดโมเดลครั้งเดียวแล้วใช้ซ้ำ
let segmenterPromise: Promise<ImageSegmenterType> | null = null;
function getHairSegmenter(): Promise<ImageSegmenterType> {
  if (!segmenterPromise) {
    segmenterPromise = (async () => {
      const { ImageSegmenter, FilesetResolver } = await import(
        "@mediapipe/tasks-vision"
      );
      const vision = await FilesetResolver.forVisionTasks("/mediapipe/wasm");
      return ImageSegmenter.createFromOptions(vision, {
        baseOptions: { modelAssetPath: HAIR_MODEL_URL, delegate: "CPU" },
        runningMode: "IMAGE",
        outputCategoryMask: true,
        outputConfidenceMasks: false,
      });
    })().catch((err) => {
      segmenterPromise = null;
      throw err;
    });
  }
  return segmenterPromise;
}

type Point = { x: number; y: number };
type Meta = {
  id: string;
  width: number;
  height: number;
  eyeMid: Point; // จุดกึ่งกลางระหว่างตาสองข้าง (พิกเซลในรูป)
  eyeDist: number; // ระยะห่างหางตาสองข้าง ใช้เป็นตัวกำหนดขนาด
  roll: number; // มุมเอียงของศีรษะ (เรเดียน)
};

function download(blob: Blob, filename: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export default function HairCutoutPage() {
  const [styleId, setStyleId] = useState(STYLE_IDS[0]);
  const [status, setStatus] = useState("เลือกทรงแล้วกดปุ่ม ตัดผม");
  const [busy, setBusy] = useState(false);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [hairPercent, setHairPercent] = useState<number | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function run() {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    setBusy(true);
    setMeta(null);
    setHairPercent(null);
    setStatus("กำลังตัดผม... (ครั้งแรกต้องโหลดโมเดล ใช้เวลาสักครู่)");

    try {
      await img.decode();

      // 1) หาตำแหน่งใบหน้าในรูปต้นฉบับ
      const landmarker = await getFaceLandmarker();
      const face = landmarker.detect(img);
      if (face.faceLandmarks.length === 0) {
        setStatus("ไม่พบใบหน้าในรูปนี้ ต้องใช้รูปที่เห็นหน้าตรงชัดเจน");
        return;
      }
      const lm = face.faceLandmarks[0];

      // 2) ให้โมเดลบอกว่าพิกเซลไหนเป็นผม
      const segmenter = await getHairSegmenter();
      const holder: { data: Uint8Array | null; w: number; h: number } = {
        data: null,
        w: 0,
        h: 0,
      };
      segmenter.segment(img, (result) => {
        const m = result.categoryMask;
        if (!m) return;
        holder.data = m.getAsUint8Array().slice(); // คัดลอกไว้ เพราะข้อมูลเดิมใช้ได้แค่ในฟังก์ชันนี้
        holder.w = m.width;
        holder.h = m.height;
      });
      if (!holder.data) {
        setStatus("โมเดลไม่ส่งผลตัดผมกลับมา ลองใหม่อีกครั้ง");
        return;
      }
      const { data, w, h } = holder;

      // 3) วาดรูปเดิม แล้วลบทุกส่วนที่ไม่ใช่ผมให้โปร่งใส
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);

      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = w;
      maskCanvas.height = h;
      const mctx = maskCanvas.getContext("2d")!;
      const maskData = mctx.createImageData(w, h);
      let hairCount = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i] !== 0) {
          maskData.data[i * 4 + 3] = 255; // ผม = ทึบ
          hairCount++;
        }
      }
      mctx.putImageData(maskData, 0, 0);

      ctx.globalCompositeOperation = "destination-in";
      ctx.filter = "blur(1px)"; // ทำขอบผมให้นุ่มขึ้นเล็กน้อย
      ctx.drawImage(maskCanvas, 0, 0);
      ctx.filter = "none";
      ctx.globalCompositeOperation = "source-over";

      // 4) จดตำแหน่งใบหน้าไว้ใช้จัดวางทรงผมตอนใช้งานจริง
      const px = (i: number): Point => ({ x: lm[i].x * w, y: lm[i].y * h });
      const a = px(33); // หางตาข้างหนึ่ง
      const b = px(263); // หางตาอีกข้าง
      setMeta({
        id: styleId,
        width: w,
        height: h,
        eyeMid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
        eyeDist: Math.hypot(b.x - a.x, b.y - a.y),
        roll: Math.atan2(b.y - a.y, b.x - a.x),
      });

      const percent = (hairCount / (w * h)) * 100;
      setHairPercent(percent);
      setStatus(
        percent < 2
          ? "ตัดได้ผมน้อยมาก ผลอาจไม่ใช้ได้ ลองรูปอื่นของทรงนี้"
          : "เสร็จแล้ว ดูผลทางขวา แล้วกดดาวน์โหลดทั้ง 2 ไฟล์"
      );
    } catch (err) {
      console.error("ตัดผมไม่สำเร็จ:", err);
      setStatus("เกิดข้อผิดพลาด ดูรายละเอียดใน Console (F12)");
    } finally {
      setBusy(false);
    }
  }

  function downloadPng() {
    canvasRef.current?.toBlob((blob) => {
      if (blob) download(blob, `${styleId}.png`);
    }, "image/png");
  }

  function downloadJson() {
    if (!meta) return;
    download(
      new Blob([JSON.stringify(meta, null, 2)], { type: "application/json" }),
      `${styleId}.json`
    );
  }

  const checker = {
    backgroundColor: "#fff",
    backgroundImage:
      "linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)",
    backgroundSize: "20px 20px",
    backgroundPosition: "0 0,0 10px,10px -10px,-10px 0",
  };

  return (
    <main className="min-h-screen bg-white px-4 pb-16 pt-28 text-neutral-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold">เครื่องมือตัดผมจากรูปทรงผม</h1>
        <p className="mt-1 text-sm text-neutral-600">
          ใช้เตรียมไฟล์ครั้งเดียว ตัดผมออกจากรูปใน public/hairstyles
          ให้เหลือเฉพาะผม พื้นหลังโปร่งใส
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <select
            value={styleId}
            onChange={(e) => {
              setStyleId(e.target.value);
              setMeta(null);
              setHairPercent(null);
              setStatus("เลือกทรงแล้วกดปุ่ม ตัดผม");
            }}
            className="rounded border px-3 py-2"
          >
            {STYLE_IDS.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={run}
            disabled={busy}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {busy ? "กำลังทำงาน..." : "ตัดผม"}
          </button>

          <button
            type="button"
            onClick={downloadPng}
            disabled={!meta}
            className="rounded border px-4 py-2 disabled:opacity-40"
          >
            ดาวน์โหลด PNG
          </button>
          <button
            type="button"
            onClick={downloadJson}
            disabled={!meta}
            className="rounded border px-4 py-2 disabled:opacity-40"
          >
            ดาวน์โหลด JSON
          </button>
        </div>

        <p className="mt-3 text-sm">
          {status}
          {hairPercent !== null && (
            <span className="text-neutral-500">
              {" "}
              (ผมคิดเป็น {hairPercent.toFixed(1)}% ของรูป)
            </span>
          )}
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-sm font-semibold">รูปต้นฉบับ</p>
            <img
              key={styleId}
              ref={imgRef}
              src={`/hairstyles/${styleId}.jpg`}
              alt={styleId}
              className="w-full rounded border"
            />
          </div>
          <div>
            <p className="mb-1 text-sm font-semibold">
              ผลลัพธ์ (ลายตารางหมากรุก = โปร่งใส)
            </p>
            <div className="rounded border" style={checker}>
              <canvas ref={canvasRef} className="block w-full" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}