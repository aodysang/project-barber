"use client";

import { useEffect, useRef, useState } from "react";
import CameraView from "@/components/CameraView";
import HairstyleMatches from "@/components/HairstyleMatches";
import { getFaceLandmarker } from "@/lib/faceLandmarker";
import {
  analyzeFace,
  FACE_SHAPE_INFO,
  THRESHOLDS,
  type FaceAnalysis,
  type FaceShape,
} from "@/lib/faceShape";

// สถานะการวิเคราะห์ มีได้ทีละอย่างเดียว
type AnalysisState =
  | { phase: "idle" } // ยังไม่ได้ส่งรูป
  | { phase: "analyzing" } // กำลังวิเคราะห์
  | { phase: "no-face" } // ไม่พบใบหน้า
  | { phase: "error" } // เกิดข้อผิดพลาด
  | { phase: "done"; result: FaceAnalysis }; // เสร็จแล้ว

export default function FaceAnalysisFlow() {
  const [state, setState] = useState<AnalysisState>({ phase: "idle" });

  // โครงหน้าที่ลูกค้าเลือกเอง (null = ยังไม่ได้เลือก ใช้ค่าที่ระบบวัดได้)
  const [manualShape, setManualShape] = useState<FaceShape | null>(null);

  // ตัวนับรอบ: กันกรณีกดถ่ายใหม่ระหว่างที่ผลรอบเก่ายังไม่เสร็จ
  const runId = useRef(0);

  // โหลดโมเดลรอไว้ตั้งแต่เข้าหน้า พอลูกค้ากดใช้รูปจะได้ไม่ต้องรอ
  useEffect(() => {
    getFaceLandmarker().catch(() => {});
  }, []);

  async function handleConfirm(photo: string) {
    const myRun = ++runId.current;
    setState({ phase: "analyzing" });
    setManualShape(null);

    try {
      // แปลงข้อความ base64 กลับเป็นรูป แล้วรอให้พร้อม
      const img = new Image();
      img.src = photo;
      await img.decode();

      const landmarker = await getFaceLandmarker();
      if (myRun !== runId.current) return; // ลูกค้ากดถ่ายใหม่ไปแล้ว ทิ้งผลนี้

      // MediaPipe ส่งข้อความ INFO ผ่าน console.error ทำให้หน้าจอ dev ขึ้นแดง
      // ดักเฉพาะข้อความนี้ ส่วน error จริงยังแสดงตามปกติ
      const originalError = console.error;
      console.error = (...args: unknown[]) => {
        if (typeof args[0] === "string" && args[0].includes("XNNPACK")) return;
        originalError(...args);
      };
      let result;
      try {
        result = landmarker.detect(img);
      } finally {
        console.error = originalError; // คืนค่าเดิมเสมอ
      }

      if (result.faceLandmarks.length === 0) {
        setState({ phase: "no-face" });
        return;
      }

      const analysis = analyzeFace(
        result.faceLandmarks[0],
        img.naturalWidth,
        img.naturalHeight
      );
      setState({ phase: "done", result: analysis });
    } catch (err) {
      console.error("วิเคราะห์ใบหน้าไม่สำเร็จ:", err);
      if (myRun === runId.current) setState({ phase: "error" });
    }
  }

  function handleRetake() {
    runId.current++; // ยกเลิกผลของรอบเก่า
    setState({ phase: "idle" });
    setManualShape(null);
  }

  return (
    <div className="flex w-full flex-col items-center">
      <CameraView onConfirm={handleConfirm} onRetake={handleRetake} />

      {state.phase === "analyzing" && (
        <div className="mt-6 w-full max-w-md rounded-2xl border p-5 text-center text-gray-600">
          กำลังวิเคราะห์โครงหน้า... (ครั้งแรกอาจใช้เวลาสักครู่)
        </div>
      )}

      {state.phase === "no-face" && (
        <div className="mt-6 w-full max-w-md rounded-2xl border border-red-300 bg-red-50 p-5 text-red-800">
          <p className="font-semibold">ไม่พบใบหน้าในรูป</p>
          <p className="mt-1 text-sm">
            ลองถ่ายใหม่ในที่แสงสว่างขึ้น มองตรงเข้ากล้อง และเปิดหน้าผาก
          </p>
        </div>
      )}

      {state.phase === "error" && (
        <div className="mt-6 w-full max-w-md rounded-2xl border border-red-300 bg-red-50 p-5 text-red-800">
          <p className="font-semibold">วิเคราะห์ไม่สำเร็จ</p>
          <p className="mt-1 text-sm">
            ลองรีเฟรชหน้าแล้วถ่ายใหม่ (นักพัฒนา: ดูรายละเอียดใน Console ด้วย F12)
          </p>
        </div>
      )}

      {state.phase === "done" && (
        <div className="mt-6 w-full max-w-md rounded-2xl border p-5">
          <p className="text-sm text-gray-500">โครงหน้าของคุณ</p>
          <h2 className="text-2xl font-bold">
            {FACE_SHAPE_INFO[state.result.shape].label}
          </h2>
          <p className="mt-1 text-gray-600">
            {FACE_SHAPE_INFO[state.result.shape].description}
          </p>

          {state.result.warnings.length > 0 && (
            <div className="mt-4 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
              <p className="font-semibold">ผลอาจคลาดเคลื่อน เพราะรูปนี้</p>
              <ul className="mt-1 list-disc pl-5">
                {state.result.warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
              <p className="mt-2">ลองถ่ายใหม่โดยปรับตามคำแนะนำข้างต้น</p>
            </div>
          )}

          <details className="mt-4 text-sm text-gray-600">
            <summary className="cursor-pointer">
              ดูตัวเลขที่วัดได้ (สำหรับปรับแต่ง)
            </summary>
            <ul className="mt-2 space-y-1 font-mono">
              <li>
                ยาว÷กว้าง: {state.result.metrics.lengthRatio.toFixed(2)} (ยาว ≥{" "}
                {THRESHOLDS.oblongLengthRatio}, กลม/เหลี่ยม &lt;{" "}
                {THRESHOLDS.roundLengthRatio})
              </li>
              <li>
                กราม÷แก้ม: {state.result.metrics.jawRatio.toFixed(2)} (เหลี่ยม ≥{" "}
                {THRESHOLDS.squareJawRatio}, เรียว &lt; {THRESHOLDS.narrowJawRatio})
              </li>
              <li>
                หน้าผาก÷แก้ม: {state.result.metrics.foreheadRatio.toFixed(2)}{" "}
                (หัวใจ ≥ {THRESHOLDS.wideForeheadRatio})
              </li>
            </ul>
          </details>
        </div>
      )}

      {state.phase === "done" && (
        <HairstyleMatches
          detectedShape={state.result.shape}
          selectedShape={manualShape ?? state.result.shape}
          onChangeShape={setManualShape}
        />
      )}
    </div>
  );
}