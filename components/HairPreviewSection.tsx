"use client";

import React, { useState, useRef, useEffect, ChangeEvent, useCallback } from "react";
import Link from "next/link";
import {
  getFaceLandmarker,
  validateFace,
  NO_FACE_ERROR_MESSAGE,
} from "@/lib/faceLandmarker";

interface HaircutRecommendation {
  resultImage: string;
  suggestedStyle: string;
  reasoning: string;
  faceShape?: string;
  price?: string;
  styleId?: string;
}

interface StyleRecommendation {
  styleName: string;
  reasoning: string;
}

// Client-side precise Hair Mask Generator using MediaPipe 3D face landmarks
function generateClientHairMask(
  imageDataUrl: string,
  landmarks?: Array<{ x: number; y: number }> | null
): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve("");
        return;
      }

      // Background black (face, body, black t-shirt, mall background 100% locked)
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      // Hair inpainting region (white)
      ctx.fillStyle = "white";

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

        // Skull dome boundaries - strictly bounds hair to head volume
        const marginX = headWidth * 0.12;
        const domeLeftX = Math.max(0, leftX - marginX);
        const domeRightX = Math.min(width, rightX + marginX);
        const domeTopY = Math.max(0, foreheadY - faceHeight * 0.52);
        const domeControlY = Math.max(0, domeTopY - faceHeight * 0.12);

        ctx.beginPath();
        // Start at left temple
        ctx.moveTo(domeLeftX, leftY);
        // Arch over skull crown to right temple
        ctx.bezierCurveTo(
          domeLeftX,
          domeControlY,
          domeRightX,
          domeControlY,
          domeRightX,
          rightY
        );

        // Trace across forehead hairline
        for (let i = foreheadIndices.length - 1; i >= 0; i--) {
          const pt = landmarks[foreheadIndices[i]];
          if (pt) {
            ctx.lineTo(pt.x * width, pt.y * height);
          }
        }

        ctx.closePath();
        ctx.fill();
      } else {
        // Fallback: Centered head dome (leaving background untouched)
        const centerX = width * 0.5;
        const headW = width * 0.42;
        const topY = height * 0.08;
        const bottomY = height * 0.36;

        ctx.beginPath();
        ctx.ellipse(
          centerX,
          (topY + bottomY) / 2,
          headW * 0.5,
          (bottomY - topY) * 0.6,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.fillRect(0, bottomY, width, height - bottomY);
      }

      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve("");
    img.src = imageDataUrl;
  });
}

export default function HairPreviewSection() {
  // User photo state
  const [userImage, setUserImage] = useState<string | null>(null);
  const [validatedImage, setValidatedImage] = useState<string | null>(null);
  const [faceLandmarks, setFaceLandmarks] = useState<Array<{ x: number; y: number }> | null>(null);

  // Client-side Face Validation state (MediaPipe Step 1)
  const [isValidating, setIsValidating] = useState<boolean>(false);

  // Gemini Face Analysis & Recommendation state (Step 2)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [faceShape, setFaceShape] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<StyleRecommendation[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<StyleRecommendation | null>(null);

  // Live Camera state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  // Inpainting Hair Try-on state (Step 3 & 4)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<HaircutRecommendation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // References
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<HTMLDivElement>(null);

  // Stop camera on unmount
  const stopCameraStream = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setCameraLoading(false);
  }, []);

  // Preload MediaPipe model in background for instant validation
  useEffect(() => {
    getFaceLandmarker().catch((err) => {
      console.warn("MediaPipe model preload warning:", err);
    });

    return () => {
      stopCameraStream();
    };
  }, [stopCameraStream]);

  // ─────────────────────────────────────────────────────────────
  // Step 2: Call Gemini Face Analysis & Recommendation API
  // ─────────────────────────────────────────────────────────────
  const analyzeFace = async (photoBase64: string) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setRecommendation(null);
    setRecommendations([]);
    setFaceShape(null);
    setSelectedStyle(null);

    try {
      const response = await fetch("/api/analyze-face", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userImage: photoBase64,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการวิเคราะห์ใบหน้า");
      }

      if (
        data.recommendations &&
        Array.isArray(data.recommendations) &&
        data.recommendations.length > 0
      ) {
        setFaceShape(data.faceShape || "ทรงไข่ (Oval)");
        setRecommendations(data.recommendations);
        setSelectedStyle(data.recommendations[0]);

        setTimeout(() => {
          selectionRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      } else {
        throw new Error("ไม่ได้รับข้อมูลทรงผมแนะนำจากระบบ AI");
      }
    } catch (err: unknown) {
      const errObj = err as Error;
      console.error("Analyze face error:", errObj);
      setErrorMessage(
        errObj.message || "เกิดข้อผิดพลาดในการวิเคราะห์ใบหน้า กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Step 3 & 4: Submit chosen hairstyle & user face to Hair Inpainting API
  // ─────────────────────────────────────────────────────────────
  const generateMockup = async (
    photoBase64: string,
    styleToGenerate?: StyleRecommendation | null
  ) => {
    setIsLoading(true);
    setErrorMessage(null);
    setRecommendation(null);

    const chosen = styleToGenerate || selectedStyle;

    try {
      // 1. Generate client-side hair mask based on detected landmarks
      let clientMask = "";
      try {
        clientMask = await generateClientHairMask(photoBase64, faceLandmarks);
      } catch (maskErr) {
        console.warn("Client mask generation notice:", maskErr);
      }

      // 2. Call specialized hair inpainting API
      const response = await fetch("/api/generate-mockup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userImage: photoBase64,
          selectedStyleName: chosen?.styleName,
          reasoning: chosen?.reasoning,
          faceShape: faceShape || "ทรงไข่ (Oval)",
          hairMask: clientMask || undefined,
          landmarks: faceLandmarks || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "ระบบ AI กำลังเริ่มต้นทำงาน (เซิร์ฟเวอร์กำลังตื่น) กรุณากดลองใหม่อีกครั้งในอีกสักครู่ครับ"
        );
      }

      if (data.resultImage) {
        setRecommendation({
          resultImage: data.resultImage,
          suggestedStyle:
            data.suggestedStyle || chosen?.styleName || "ทรงผมแนะนำ",
          reasoning:
            data.reasoning ||
            chosen?.reasoning ||
            "เข้ากับรูปหน้าได้ดี ตัดแล้วดูเด็กลง",
          faceShape: data.faceShape || faceShape || "ทรงไข่ (Oval)",
          price: data.price || "฿280 / 40 นาที",
          styleId: data.styleId || "curtain-hair",
        });

        // Save to sessionStorage for seamless booking
        try {
          sessionStorage.setItem(
            "lastHairstylePreview",
            JSON.stringify({
              hairstyleId: data.styleId || "curtain-hair",
              hairstyleName:
                data.suggestedStyle || chosen?.styleName || "ทรงผมแนะนำ",
              faceShape: data.faceShape || faceShape || "",
              timestamp: Date.now(),
            })
          );
        } catch {
          // ignore session storage error
        }

        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      } else {
        throw new Error("ไม่ได้รับข้อมูลผลลัพธ์จาก AI");
      }
    } catch (err: unknown) {
      const errObj = err as Error;
      console.error("Hair inpainting error:", errObj);
      setErrorMessage(
        errObj.message ||
          "ระบบ AI กำลังเริ่มต้นทำงาน (เซิร์ฟเวอร์กำลังตื่น) กรุณากดลองใหม่อีกครั้งในอีกสักครู่ครับ"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Start Camera
  const startCamera = async (mode: "user" | "environment" = facingMode) => {
    stopCameraStream();
    setIsCameraActive(true);
    setCameraLoading(true);
    setCameraError(null);
    setCapturedPreview(null);
    setErrorMessage(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(
        "เบราว์เซอร์นี้ไม่รองรับการเปิดกล้อง กรุณาใช้ตัวเลือก 'เลือกรูปภาพ'"
      );
      setCameraLoading(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraLoading(false);
    } catch (err: unknown) {
      console.error("Camera access error:", err);
      setCameraLoading(false);
      const domErr = err as DOMException;
      if (
        domErr.name === "NotAllowedError" ||
        domErr.name === "PermissionDeniedError"
      ) {
        setCameraError(
          "ไม่ได้รับอนุญาตให้เข้าถึงกล้อง กรุณาเปิดสิทธิ์การใช้งานกล้องในเบราว์เซอร์"
        );
      } else {
        setCameraError(
          "ไม่สามารถเปิดกล้องได้ กรุณาเลือกอัปโหลดไฟล์รูปภาพแทน"
        );
      }
    }
  };

  const handleFlipCamera = () => {
    const nextMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Step 1: Capture photo & validate with MediaPipe Tasks Vision
  const capturePhoto = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoData = canvas.toDataURL("image/jpeg", 0.92);

    setIsValidating(true);
    setCameraError(null);
    setErrorMessage(null);

    try {
      // Step 1: Client-side Face Validation ด้วย MediaPipe
      const validation = await validateFace(canvas);

      if (!validation.isValid) {
        const message = validation.errorMessage || NO_FACE_ERROR_MESSAGE;
        setCameraError(message);
        setErrorMessage(message);
        setCapturedPreview(null);
        setValidatedImage(null);
        setFaceLandmarks(null);
        return;
      }

      // เก็บ landmarks สำหรับสร้าง Hair Mask
      if (validation.result?.faceLandmarks?.[0]) {
        setFaceLandmarks(validation.result.faceLandmarks[0]);
      }

      // เมื่อตรวจพบใบหน้าสำเร็จ จัดเก็บสถานะ
      setValidatedImage(photoData);
      setCapturedPreview(photoData);
      setCameraError(null);
      setErrorMessage(null);
    } catch (err) {
      console.error("Camera face validation error:", err);
      setCameraError(NO_FACE_ERROR_MESSAGE);
      setErrorMessage(NO_FACE_ERROR_MESSAGE);
      setCapturedPreview(null);
      setValidatedImage(null);
      setFaceLandmarks(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleRetakeCamera = () => {
    setCapturedPreview(null);
    setValidatedImage(null);
    setFaceLandmarks(null);
    setCameraError(null);
    setErrorMessage(null);
  };

  // When user confirms camera photo, proceed to Step 2
  const handleConfirmCameraPhoto = () => {
    const photoToUse = validatedImage || capturedPreview;
    if (photoToUse) {
      setUserImage(photoToUse);
      stopCameraStream();
      // Step 2: ส่งภาพไปวิเคราะห์โครงหน้าและแนะนำทรงผมด้วย Gemini
      analyzeFace(photoToUse);
    }
  };

  const handleCloseCamera = () => {
    stopCameraStream();
    setCapturedPreview(null);
    setCameraError(null);
    setValidatedImage(null);
  };

  // Step 1: File Upload Handler with MediaPipe Face Validation
  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("กรุณาเลือกไฟล์รูปภาพที่ถูกต้อง (JPG, PNG หรือ WebP)");
      return;
    }

    setErrorMessage(null);
    setCameraError(null);
    setIsValidating(true);

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = async () => {
        try {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          let processedData = "";
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            processedData = canvas.toDataURL("image/jpeg", 0.9);
          } else {
            processedData = event.target?.result as string;
          }

          // Step 1: MediaPipe Face Validation
          const validation = await validateFace(canvas);

          if (!validation.isValid) {
            const message = validation.errorMessage || NO_FACE_ERROR_MESSAGE;
            setErrorMessage(message);
            setUserImage(null);
            setValidatedImage(null);
            setFaceLandmarks(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            return;
          }

          // เก็บ landmarks สำหรับสร้าง Hair Mask
          if (validation.result?.faceLandmarks?.[0]) {
            setFaceLandmarks(validation.result.faceLandmarks[0]);
          }

          // ตรวจพบใบหน้าผ่านฉลุย จัดเก็บรูปภาพ และไปสู่ Step 2 ทันที
          setValidatedImage(processedData);
          setUserImage(processedData);
          analyzeFace(processedData);
        } catch (err) {
          console.error("Image face validation error:", err);
          setErrorMessage(NO_FACE_ERROR_MESSAGE);
          setUserImage(null);
          setValidatedImage(null);
          setFaceLandmarks(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } finally {
          setIsValidating(false);
        }
      };

      img.onerror = () => {
        setErrorMessage("ไม่สามารถเปิดไฟล์รูปภาพได้ กรุณาลองใหม่อีกครั้ง");
        setIsValidating(false);
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      setErrorMessage("เกิดข้อผิดพลาดในการอ่านไฟล์");
      setIsValidating(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Download image to device
  const handleDownloadImage = () => {
    if (!recommendation?.resultImage) return;
    const link = document.createElement("a");
    link.href = recommendation.resultImage;
    link.download = `veera-barber-${recommendation.styleId || "inpainted"}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset to try another photo
  const handleReset = () => {
    setUserImage(null);
    setValidatedImage(null);
    setFaceLandmarks(null);
    setIsAnalyzing(false);
    setFaceShape(null);
    setRecommendations([]);
    setSelectedStyle(null);
    setRecommendation(null);
    setErrorMessage(null);
    setCameraError(null);
    setCapturedPreview(null);
    stopCameraStream();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 text-white font-sans">
      {/* ── 1. Clean Header (Branded for "ให้ลุงช่วยเลือกทรง") ── */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFC800]/10 border border-[#FFC800]/30 text-[#FFC800] text-sm font-semibold mb-3">
          <span>✨</span>
          <span>ให้ลุงช่วยเลือกทรง (Virtual Hair Inpainting)</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
          ให้ลุงช่วยเลือกทรงผมที่<span className="text-[#FFC800]">เข้ากับคุณ</span>
        </h2>
        <p className="text-[#B3B3B3] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          ถ่ายภาพหน้าตรง ระบบจะจำลองเปลี่ยนทรงผมใหม่บนหัวของคุณ โดยคงใบหน้า ตัวเสื้อ และฉากหลังเดิมไว้ 100%
        </p>
      </div>

      {/* ── 2. Dual Input Method: Camera / Upload (Step 1) ── */}
      {!recommendation && !isLoading && !isAnalyzing && recommendations.length === 0 && (
        <div className="w-full max-w-xl mx-auto mb-10">
          <div className="bg-[#121216] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="customer-face-file-input"
            />

            {/* Live Camera Viewport */}
            {isCameraActive ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#FFC800] bg-black shadow-2xl flex flex-col items-center">
                <div className="relative w-full h-[360px] sm:h-[420px] bg-black flex items-center justify-center overflow-hidden">
                  {!capturedPreview ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover ${
                          facingMode === "user" ? "scale-x-[-1]" : ""
                        }`}
                      />

                      {/* Oval face guide overlay */}
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-56 h-72 border-2 border-dashed border-[#FFC800]/80 rounded-[50%] shadow-[0_0_20px_rgba(255,200,0,0.3)] flex items-end justify-center pb-4">
                          <span className="bg-black/75 backdrop-blur-sm text-[#FFC800] text-[11px] font-semibold px-3 py-1 rounded-full border border-[#FFC800]/30">
                            จัดใบหน้าให้อยู่ในกรอบ
                          </span>
                        </div>
                      </div>

                      {cameraLoading && (
                        <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3">
                          <div className="w-9 h-9 border-3 border-[#FFC800] border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm text-zinc-300">กำลังเปิดกล้อง...</span>
                        </div>
                      )}

                      {/* Scanning spinner overlay inside camera (Step 1) */}
                      {isValidating && (
                        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3 animate-fade-in">
                          <div className="w-10 h-10 border-3 border-[#FFC800] border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm font-bold text-white tracking-wide">
                            กำลังสแกนใบหน้า...
                          </span>
                          <span className="text-xs text-[#A4A4A4]">
                            กำลังตรวจสอบใบหน้าด้วย Google MediaPipe
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="relative w-full h-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={capturedPreview}
                        alt="รูปที่ถ่ายแล้ว"
                        className="w-full h-full object-contain bg-zinc-950"
                      />
                      <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#FFC800] border border-[#FFC800]/40 flex items-center gap-1.5 shadow-lg">
                        <span>✓</span>
                        <span>ตรวจพบใบหน้าเรียบร้อย</span>
                      </div>
                    </div>
                  )}
                </div>

                {cameraError && (
                  <div className="p-3.5 bg-red-950/90 border-t border-red-500/50 text-red-200 text-xs sm:text-sm w-full text-center flex items-center justify-center gap-2">
                    <span className="text-base shrink-0">⚠️</span>
                    <span>{cameraError}</span>
                  </div>
                )}

                {/* Camera Action Buttons (min 48px) */}
                <div className="w-full p-4 bg-zinc-900 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  {!capturedPreview ? (
                    <>
                      <button
                        type="button"
                        onClick={handleCloseCamera}
                        className="min-h-[48px] px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold transition active:scale-95"
                      >
                        ยกเลิก
                      </button>

                      <button
                        type="button"
                        onClick={capturePhoto}
                        disabled={cameraLoading || isValidating}
                        className="min-h-[52px] px-8 py-3 rounded-2xl bg-gradient-to-r from-[#FFC800] to-[#E6B400] text-black text-base font-extrabold flex items-center gap-2 hover:brightness-110 active:scale-95 shadow-lg shadow-[#FFC800]/30 transition disabled:opacity-50"
                      >
                        <span className="text-xl">📸</span>
                        <span>{isValidating ? "กำลังสแกน..." : "กดถ่ายภาพ"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleFlipCamera}
                        className="min-h-[48px] px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold transition active:scale-95 flex items-center gap-1.5"
                        title="สลับกล้อง"
                      >
                        <span>🔄</span>
                        <span className="hidden sm:inline">สลับกล้อง</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleRetakeCamera}
                        className="min-h-[48px] px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold transition active:scale-95 flex items-center gap-1.5"
                      >
                        <span>🔄</span>
                        <span>ถ่ายใหม่</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleConfirmCameraPhoto}
                        className="min-h-[52px] px-8 py-3 rounded-2xl bg-gradient-to-r from-[#FFC800] to-[#E6B400] text-black text-base font-extrabold flex items-center gap-2 hover:brightness-110 active:scale-95 shadow-lg shadow-[#FFC800]/30 transition"
                      >
                        <span>✓</span>
                        <span>ใช้รูปนี้ & วิเคราะห์ทรงผม</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : isValidating ? (
              /* ── Face Scanning Spinner State (Step 1) ── */
              <div className="border-2 border-dashed border-[#FFC800]/40 bg-black/60 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-4 min-h-[300px] animate-fade-in">
                <div className="w-12 h-12 border-3 border-[#FFC800] border-t-transparent rounded-full animate-spin" />
                <div>
                  <h4 className="font-extrabold text-white text-lg mb-1.5">
                    กำลังสแกนใบหน้า...
                  </h4>
                  <p className="text-xs sm:text-sm text-[#A4A4A4] max-w-sm">
                    Google MediaPipe Tasks Vision กำลังตรวจจับจุดและรูปหน้าเพื่อยืนยันความถูกต้อง
                  </p>
                </div>
              </div>
            ) : (
              /* ── Dual Input: Camera / Upload ── */
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-white/20 hover:border-[#FFC800] bg-black/40 hover:bg-[#FFC800]/5 rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center transition-all duration-200 min-h-[300px]"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#FFC800]/10 border border-[#FFC800]/30 flex items-center justify-center mb-4 text-[#FFC800]">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>

                <h4 className="font-bold text-white text-lg mb-1.5">
                  รูปใบหน้าของคุณ
                </h4>
                <p className="text-xs sm:text-sm text-zinc-400 mb-6 max-w-sm">
                  ถ่ายภาพหน้าตรงหรือเลือกไฟล์รูปภาพ ระบบจะวิเคราะห์โครงหน้าและแนะนำทรงผมที่เข้ากับคุณ
                </p>

                {/* Two Touch Target Buttons (min 48px) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-md">
                  <button
                    type="button"
                    onClick={() => startCamera("user")}
                    className="min-h-[52px] px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FFC800] to-[#E6B400] text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition shadow-lg shadow-[#FFC800]/20"
                  >
                    <span className="text-xl">📷</span>
                    <span>กดถ่ายภาพ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="min-h-[52px] px-5 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition active:scale-95 border border-white/10"
                  >
                    <span className="text-xl">📁</span>
                    <span>เลือกรูปภาพ</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 3. Step 2 Loading State: Face Analysis via Google Gemini API ── */}
      {isAnalyzing && (
        <div className="w-full max-w-xl mx-auto my-12 p-8 sm:p-10 rounded-3xl bg-zinc-900/95 border border-[#FFC800]/40 flex flex-col items-center justify-center text-center gap-4 shadow-2xl animate-fade-in">
          <div className="w-12 h-12 border-3 border-[#FFC800] border-t-transparent rounded-full animate-spin" />
          <div>
            <p className="text-lg sm:text-xl font-bold text-white mb-2">
              ลุงกำลังวิเคราะห์โครงหน้า และคัดเลือกทรงผมที่เหมาะกับคุณ...
            </p>
            <p className="text-xs sm:text-sm text-[#A4A4A4] max-w-md mx-auto leading-relaxed">
              Google Gemini AI กำลังจำแนกมิติของใบหน้า และคัดเลือก 3 ทรงผมเอเชียที่ขับเน้นจุดเด่นของคุณได้อย่างลงตัวที่สุด
            </p>
          </div>
        </div>
      )}

      {/* ── 4. Step 2 Selection UI: Hairstyle Recommendations (3 Clickable Cards) ── */}
      {!recommendation && !isLoading && !isAnalyzing && recommendations.length > 0 && (
        <div ref={selectionRef} className="space-y-6 animate-fade-in mb-10">
          <div className="bg-[#121216] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
            {/* Top Bar: Step & Detected Face Shape */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFC800]/10 border border-[#FFC800]/30 text-[#FFC800] text-xs font-bold mb-2">
                  <span>✨</span>
                  <span>Step 2: เลือกทรงผมที่โดนใจ</span>
                </div>
                <h3 className="text-2xl font-black text-white">
                  3 ทรงผมที่ลุงคัดสรรให้คุณ
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  คลิกเลือกทรงที่คุณชอบที่สุดเพื่อดูภาพจำลองใบหน้าจริง
                </p>
              </div>

              {/* Detected Face Shape Display */}
              <div className="bg-gradient-to-r from-[#FFC800]/20 to-[#FFC800]/5 border border-[#FFC800]/50 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-lg shrink-0">
                <span className="text-2xl">👤</span>
                <div>
                  <span className="text-[11px] text-zinc-400 block uppercase font-bold tracking-wider">
                    โครงหน้าของคุณ
                  </span>
                  <span className="text-base font-extrabold text-[#FFC800]">
                    {faceShape || "ทรงไข่ (Oval)"}
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Clickable Style Recommendation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 my-6">
              {recommendations.map((rec, idx) => {
                const isSelected = selectedStyle?.styleName === rec.styleName;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedStyle(rec)}
                    className={`relative cursor-pointer rounded-2xl p-5 sm:p-6 text-left transition-all duration-200 border-2 flex flex-col justify-between ${
                      isSelected
                        ? "bg-gradient-to-b from-[#1E1A0A] to-[#121216] border-[#FFC800] shadow-[0_0_25px_rgba(255,200,0,0.25)] scale-[1.02]"
                        : "bg-[#0E0E12] border-white/10 hover:border-white/30 hover:bg-zinc-900/50"
                    }`}
                  >
                    <div>
                      {/* Top Header of Card */}
                      <div className="flex items-center justify-between mb-3.5">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                            isSelected
                              ? "bg-[#FFC800] text-black"
                              : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          สไตล์แนะนำ {idx + 1}
                        </span>

                        {/* Radio Checkmark Indicator */}
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                            isSelected
                              ? "border-[#FFC800] bg-[#FFC800]"
                              : "border-zinc-600 bg-transparent"
                          }`}
                        >
                          {isSelected && (
                            <span className="text-black text-xs font-black">
                              ✓
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Style Name */}
                      <h4
                        className={`text-base sm:text-lg font-black mb-2.5 leading-snug ${
                          isSelected ? "text-[#FFC800]" : "text-white"
                        }`}
                      >
                        {rec.styleName}
                      </h4>

                      {/* Barber Reasoning */}
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        {rec.reasoning}
                      </p>
                    </div>

                    {/* Bottom Selected Indicator */}
                    <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className={isSelected ? "text-[#FFC800] font-semibold" : "text-zinc-500"}>
                        {isSelected ? "● เลือกทรงนี้อยู่" : "คลิกเพื่อเลือกทรงนี้"}
                      </span>
                      <span className="text-zinc-400">Veera Barber</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons: Confirm Selection or Try Another Photo */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-4 justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto min-h-[48px] px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-semibold text-xs sm:text-sm transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>เปลี่ยนรูปภาพ / ถ่ายใหม่</span>
              </button>

              <button
                type="button"
                disabled={!selectedStyle}
                onClick={() => generateMockup(userImage!, selectedStyle)}
                className="w-full sm:flex-1 max-w-md min-h-[52px] px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#FFC800] via-[#E6B400] to-[#B38F00] text-black font-black text-base flex items-center justify-center gap-2.5 hover:brightness-110 active:scale-95 shadow-xl shadow-[#FFC800]/25 transition disabled:opacity-50"
              >
                <span className="text-xl">✨</span>
                <span>เลือกทรงนี้เพื่อดูภาพจำลอง</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. Step 3 & 4 Loading State: Hair Inpainting Processing (Replicate AI) ── */}
      {isLoading && (
        <div className="w-full max-w-xl mx-auto my-12 p-8 sm:p-10 rounded-3xl bg-zinc-900/95 border border-[#FFC800]/40 flex flex-col items-center justify-center text-center gap-4 shadow-2xl animate-fade-in">
          <div className="w-12 h-12 border-3 border-[#FFC800] border-t-transparent rounded-full animate-spin" />
          <div>
            <p className="text-lg sm:text-xl font-bold text-white mb-2">
              กำลังตัดต่อเฉพาะทรงผมด้วย Replicate AI... (ใช้เวลาประมาณ 3-5 วินาที)
            </p>
            <p className="text-xs sm:text-sm text-[#A4A4A4] max-w-md mx-auto leading-relaxed">
              ระบบกำลังจำลองเปลี่ยนทรงผม &quot;{selectedStyle?.styleName || "ทรงที่เลือก"}&quot; โดยล็อกใบหน้าจริง เสื้อผ้า และฉากหลังเดิมของคุณไว้ 100%
            </p>
          </div>
        </div>
      )}

      {/* ── Error Notification ── */}
      {errorMessage && (
        <div className="max-w-xl mx-auto mb-8 p-5 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-200 shadow-xl animate-fade-in">
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">⚠️</span>
            <div className="flex-1">
              <h4 className="font-bold text-base text-red-100 mb-1">
                {errorMessage === NO_FACE_ERROR_MESSAGE
                  ? "ไม่พบใบหน้าในรูปภาพ"
                  : "เกิดข้อผิดพลาดในการประมวลผล"}
              </h4>
              <p className="text-xs sm:text-sm text-red-300 mb-4">{errorMessage}</p>
              <div className="flex flex-wrap gap-2.5">
                {selectedStyle && userImage && (
                  <button
                    type="button"
                    onClick={() => generateMockup(userImage, selectedStyle)}
                    className="min-h-[44px] px-5 py-2 rounded-xl bg-gradient-to-r from-[#FFC800] to-[#E6B400] text-black font-extrabold text-xs sm:text-sm transition active:scale-95 shadow-md"
                  >
                    ลองใหม่อีกครั้ง 🔄
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleReset}
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs sm:text-sm transition active:scale-95 border border-white/10"
                >
                  เลือกทรงอื่น / เปลี่ยนรูป 📷
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. Step 4 Showcase Display: Gold-Bordered Showcase Card (#FFC800) ── */}
      {recommendation && (
        <div ref={resultRef} className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left: Original Face */}
            <div className="bg-[#121216] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col items-center">
              <span className="text-xs font-semibold text-[#A4A4A4] mb-3 uppercase tracking-wider">
                รูปหน้าเดิมของคุณ
              </span>
              <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-white/10 bg-zinc-950">
                {userImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={userImage}
                    alt="รูปใบหน้าลูกค้าเดิม"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </div>

            {/* Right: Gold-Bordered Showcase Card (#FFC800) */}
            <div className="bg-[#0E0E12] border-2 border-[#FFC800] rounded-3xl p-5 sm:p-6 shadow-[0_0_40px_rgba(255,200,0,0.25)] flex flex-col items-center">
              <span className="text-xs font-bold text-[#FFC800] mb-3 uppercase tracking-wider flex items-center gap-1.5">
                <span>✨</span> ทรงผมที่ลุงเนรมิตให้คุณ (Virtual Inpaint)
              </span>

              <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-[#FFC800]/50 bg-zinc-950 shadow-lg relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={recommendation.resultImage}
                  alt="ภาพจำลองทรงผม"
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-2.5 right-2.5 bg-black/85 backdrop-blur-md px-3 py-1 rounded-md border border-[#FFC800]/40 text-[11px] text-[#FFC800] font-bold">
                  Veera Barber AI
                </div>
              </div>

              {/* Style Details Underneath Preview */}
              <div className="w-full mt-5 space-y-3 bg-zinc-900/70 border border-white/10 rounded-2xl p-4 text-left">
                {/* 1) Suggested Style */}
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs text-zinc-400">ทรงผมที่เลือก:</span>
                  <span className="text-sm sm:text-base font-extrabold text-[#FFC800]">
                    {recommendation.suggestedStyle}
                  </span>
                </div>

                {/* 2) Reasoning */}
                <div>
                  <span className="text-xs text-zinc-400 block mb-1">เหตุผลที่แนะนำ:</span>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {recommendation.reasoning}
                  </p>
                </div>

                {/* 3) Face Shape & Price */}
                {recommendation.faceShape && (
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-zinc-400">รูปทรงใบหน้า:</span>
                    <span className="text-zinc-200 font-semibold">{recommendation.faceShape}</span>
                  </div>
                )}

                {recommendation.price && (
                  <div className="pt-1 flex items-center justify-between text-xs">
                    <span className="text-zinc-400">ค่าบริการ:</span>
                    <span className="text-[#FFC800] font-bold">{recommendation.price}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── 7. Final Action Buttons: Download + Book Now + Try Another ── */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 justify-center pt-4">
            {/* 1) 📥 บันทึกภาพ */}
            <button
              type="button"
              onClick={handleDownloadImage}
              className="w-full sm:flex-1 min-h-[52px] px-6 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition active:scale-95 border border-white/15 shadow-md"
            >
              <span>📥</span>
              <span>บันทึกภาพ</span>
            </button>

            {/* 2) ✂️ จองคิวทันที */}
            <Link
              href={`/book?service=haircut-adult&style=${encodeURIComponent(
                recommendation.styleId || "curtain-hair"
              )}&styleName=${encodeURIComponent(recommendation.suggestedStyle)}`}
              className="w-full sm:flex-1 min-h-[52px] px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FFC800] via-[#E6B400] to-[#977600] text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#FFC800]/30"
            >
              <span>✂️</span>
              <span>จองคิวทันที</span>
            </Link>

            {/* 3) 🔄 ลองรูปอื่น */}
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto min-h-[52px] px-5 py-3.5 rounded-xl bg-black/70 hover:bg-zinc-900 text-[#FFC800] border border-[#FFC800]/40 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition active:scale-95"
            >
              <span>🔄</span>
              <span>ลองรูปอื่น</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
