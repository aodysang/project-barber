"use client";

import { useEffect, useRef, useState } from "react";
import { getFaceLandmarker } from "@/lib/faceLandmarker";

export default function TryOnPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState("กำลังโหลดกล้องและโมเดล AI...");
  const [hairImage, setHairImage] = useState<HTMLImageElement | null>(null);

  // โหลดรูปผม PNG
  useEffect(() => {
    const img = new Image();
    img.src = "/hairstyles/undercut.png";
    img.onload = () => setHairImage(img);
  }, []);

  // เปิดกล้อง Webcam
  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setStatus("เปิดกล้องเรียบร้อย กำลังเริ่มตรวจจับใบหน้า...");
      } catch (err) {
        setStatus("ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตการใช้งานกล้อง");
      }
    }
    setupCamera();
  }, []);

  // วาดภาพจำลองทรงผมทับใบหน้าแบบเรียลไทม์
  useEffect(() => {
    let animationId: number;
    let landmarker: any;

    async function runDetection() {
      try {
        landmarker = await getFaceLandmarker();
      } catch (e) {
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      const ctx = canvas.getContext("2d")!;

      async function renderLoop() {
        if (video && video.readyState === 4) {
          // ใช้ canvas! เพื่อบอก TypeScript ว่าค่านี้ไม่เป็น null แน่นอน
          canvas!.width = video.videoWidth;
          canvas!.height = video.videoHeight;

          // วาดภาพวิดีโอจากกล้องลงบน Canvas
          ctx.clearRect(0, 0, canvas!.width, canvas!.height);
          ctx.drawImage(video, 0, 0, canvas!.width, canvas!.height);

          // ตรวจจับใบหน้าด้วย MediaPipe
          const result: any = landmarker.detectForVideo(video, performance.now());

          if (result.faceLandmarks && result.faceLandmarks.length > 0) {
            setStatus("ตรวจจับใบหน้าสำเร็จ กำลังลองทรงผม...");
            const lm = result.faceLandmarks[0];

            // ดึงพิกัดหางตาซ้าย (33) และขวา (263) เพื่อคำนวณตำแหน่งหัว
            const leftEye = { x: lm[33].x * canvas!.width, y: lm[33].y * canvas!.height };
            const rightEye = { x: lm[263].x * canvas!.width, y: lm[263].y * canvas!.height };

            // จุดกึ่งกลางระหว่างตา
            const midX = (leftEye.x + rightEye.x) / 2;
            const midY = (leftEye.y + rightEye.y) / 2;
            const eyeDist = Math.hypot(rightEye.x - leftEye.x, rightEye.y - leftEye.y);

            // ถ้ามีรูปผม PNG ให้วาดทับลงไปเหนือตาขึ้นไปตามสัดส่วน
            if (hairImage) {
              const scale = (eyeDist * 2.2) / hairImage.width;
              const w = hairImage.width * scale;
              const h = hairImage.height * scale;

              ctx.save();
              ctx.translate(midX, midY - eyeDist * 1.3); // ปรับตำแหน่งวางทรงผมเหนือตา
              const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
              ctx.rotate(angle);

              ctx.drawImage(hairImage, -w / 2, -h / 2, w, h);
              ctx.restore();
            }
          } else {
            setStatus("ไม่พบใบหน้า กรุณามองตรงเข้ากล้อง");
          }
        }
        animationId = requestAnimationFrame(renderLoop);
      }

      renderLoop();
    }

    runDetection();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [hairImage]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-6 text-neutral-900">
      <h1 className="text-2xl font-bold mb-2">ระบบจำลองทรงผม (Virtual Try-On)</h1>
      <p className="text-sm text-neutral-600 mb-4">{status}</p>

      <div className="relative overflow-hidden rounded-2xl border shadow-lg bg-black">
        <video ref={videoRef} className="hidden" playsInline muted />
        <canvas ref={canvasRef} className="block w-[640px] h-[480px] object-cover" />
      </div>
    </main>
  );
}