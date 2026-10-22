"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type CameraViewProps = {
  onConfirm?: (photo: string) => void; // เรียกเมื่อกด "ใช้รูปนี้"
  onRetake?: () => void; // เรียกเมื่อกด "ถ่ายใหม่"
};

export default function CameraView({ onConfirm, onRetake }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // สถานะกล้อง
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");

  // สถานะการถ่ายรูป
  const [countdown, setCountdown] = useState<number | null>(null); // เลขนับถอยหลัง (null = ไม่ได้นับ)
  const [photo, setPhoto] = useState<string | null>(null); // รูปที่ถ่ายแล้ว (เก็บเป็นข้อความ base64)
  const [confirmed, setConfirmed] = useState(false); // กด "ใช้รูปนี้" แล้วหรือยัง

  // ---------- ส่วนที่ 1: เปิดกล้อง (เหมือนขั้น 3.1) ----------
  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("error");
        setErrorMessage("เบราว์เซอร์นี้ไม่รองรับการเปิดกล้อง");
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setStatus("ready");
      } catch (err) {
        setStatus("error");
        if (err instanceof DOMException && err.name === "NotAllowedError") {
          setErrorMessage(
            "คุณไม่ได้อนุญาตให้ใช้กล้อง กรุณากดไอคอนแม่กุญแจข้างช่องที่อยู่เว็บ แล้วเปิดสิทธิ์กล้อง"
          );
        } else if (err instanceof DOMException && err.name === "NotFoundError") {
          setErrorMessage("ไม่พบกล้องในอุปกรณ์นี้");
        } else {
          setErrorMessage("เปิดกล้องไม่สำเร็จ ลองปิดโปรแกรมอื่นที่ใช้กล้องอยู่");
        }
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // ---------- ส่วนที่ 2: ฟังก์ชันถ่ายรูป ----------
  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;

    // กรอบที่ลูกค้าเห็นคือสัดส่วน 3:4 (แนวตั้ง) แต่วิดีโอจริงเป็นแนวนอน
    // เราจึงต้อง "ตัด" เอาเฉพาะส่วนกลางภาพที่ตรงกับสิ่งที่ลูกค้าเห็นในกรอบ
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const targetRatio = 3 / 4;

    let sx = 0;
    let sy = 0;
    let sw = vw;
    let sh = vh;

    if (vw / vh > targetRatio) {
      // วิดีโอกว้างเกินไป: ตัดซ้าย-ขวาออก
      sw = vh * targetRatio;
      sx = (vw - sw) / 2;
    } else {
      // วิดีโอสูงเกินไป: ตัดบน-ล่างออก
      sh = vw / targetRatio;
      sy = (vh - sh) / 2;
    }

    // สร้างผืนผ้าใบ (canvas) ขนาด 768x1024 สำหรับวาดภาพนิ่ง
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // กลับด้านซ้าย-ขวาให้ตรงกับที่ลูกค้าเห็นในกรอบ (เหมือนกระจก)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    // แปลงภาพเป็นข้อความ base64 (JPEG คุณภาพ 90%) เพื่อเก็บใน state
    setPhoto(canvas.toDataURL("image/jpeg", 0.9));
  }, []);

  // ---------- ส่วนที่ 3: นับถอยหลัง 3-2-1 ----------
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      const timer = setTimeout(() => {
        capturePhoto();
        setCountdown(null);
      }, 0);
      return () => clearTimeout(timer);
    }

    // รอ 1 วินาทีแล้วลดเลขลง 1
    const timer = setTimeout(() => {
      setCountdown((c) => (c === null ? null : c - 1));
    }, 1000);

    // ถ้าออกจากหน้าไปก่อน ให้ยกเลิกตัวจับเวลา
    return () => clearTimeout(timer);
  }, [countdown, capturePhoto]);

    function retake() {
    setPhoto(null);
    setConfirmed(false);
    onRetake?.();
  }

  // ---------- ส่วนที่ 4: หน้าตาที่แสดงผล ----------
  const showGuide = status === "ready" && !photo;

  return (
    <div className="w-full max-w-md">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-black">
        {/* ภาพสดจากกล้อง */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />

        {/* กรอบวงรีนำทาง: ทำให้นอกวงรีมืดลง และวาดเส้นประรอบวงรี */}
        {showGuide && (
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 300 400"
            preserveAspectRatio="none"
          >
            <defs>
              <mask id="face-hole">
                {/* สีขาว = แสดง, สีดำ = เจาะรู */}
                <rect width="300" height="400" fill="white" />
                <ellipse cx="150" cy="170" rx="100" ry="135" fill="black" />
              </mask>
            </defs>
            <rect
              width="300"
              height="400"
              fill="rgba(0,0,0,0.55)"
              mask="url(#face-hole)"
            />
            <ellipse
              cx="150"
              cy="170"
              rx="100"
              ry="135"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeDasharray="8 6"
            />
          </svg>
        )}

        {/* ข้อความแนะนำที่ด้านล่างภาพ */}
        {showGuide && countdown === null && (
          <div className="absolute inset-x-0 bottom-4 flex justify-center px-4">
            <p className="rounded-full bg-black/60 px-4 py-2 text-center text-sm text-white">
              วางใบหน้าให้อยู่ในกรอบ มองตรงเข้ากล้อง
            </p>
          </div>
        )}

        {/* เลขนับถอยหลังตัวใหญ่กลางภาพ */}
        {countdown !== null && countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-8xl font-bold text-white drop-shadow-lg">
              {countdown}
            </span>
          </div>
        )}

        {/* รูปที่ถ่ายแล้ว วางทับภาพสด */}
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt="รูปที่ถ่าย"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            กำลังเปิดกล้อง...
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-white">
            {errorMessage}
          </div>
        )}
      </div>

      {/* ปุ่มควบคุมด้านล่างกรอบภาพ */}
      <div className="mt-6 flex flex-col items-center gap-4">
        {!photo ? (
          <>
            <button
              onClick={() => setCountdown(3)}
              disabled={status !== "ready" || countdown !== null}
              aria-label="ถ่ายรูป"
              className="h-16 w-16 rounded-full border-4 border-gray-400 bg-white ring-2 ring-black transition active:scale-95 disabled:opacity-40"
            />
            <p className="text-sm text-gray-500">
              {countdown !== null
                ? "เตรียมตัว..."
                : "กดปุ่มกลมเพื่อถ่าย (นับถอยหลัง 3 วินาที)"}
            </p>
          </>
        ) : (
          <>
            {confirmed ? (
              <p className="rounded-lg bg-green-100 px-4 py-2 text-green-800">
                ✅ เก็บรูปเรียบร้อย
              </p>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={retake}
                  className="rounded-lg border border-gray-400 px-5 py-2"
                >
                  ถ่ายใหม่
                </button>
                <button
                  onClick={() => {
                    setConfirmed(true);
                    if (photo) onConfirm?.(photo);
                  }}
                  className="rounded-lg bg-black px-5 py-2 text-white"
                >
                  ใช้รูปนี้
                </button>
              </div>
            )}
            {confirmed && (
              <button onClick={retake} className="text-sm text-gray-500 underline">
                ถ่ายใหม่
              </button>
            )}
          </>
        )}
      </div>

      {/* เคล็ดลับการถ่าย */}
      <ul className="mt-6 list-disc space-y-1 pl-5 text-sm text-gray-600">
        <li>ถ่ายในที่แสงสว่าง ให้แสงส่องมาที่หน้า ไม่ใช่ข้างหลังศีรษะ</li>
        <li>เปิดหน้าผาก ปัดผมออกจากใบหน้า</li>
        <li>ถอดแว่นและหมวกก่อนถ่าย</li>
        <li>หน้าตรง ไม่เอียงศีรษะ ไม่ยิ้มกว้างเกินไป</li>
      </ul>
    </div>
  );
}