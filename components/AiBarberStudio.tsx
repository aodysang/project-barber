'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { fal } from '@fal-ai/client';

interface RecommendedStyle {
  name: string;
  englishName: string;
  reason: string;
}

interface AnalysisData {
  faceShape: string;
  faceDescription: string;
  recommendations: RecommendedStyle[];
}

const MAX_GEN_LIMIT = 2; // จำกัดลูกค้า 1 คน Generate ได้สูงสุด 2 รูป
const STORAGE_KEY = 'veera_barber_gen_count_v1';

// ย่อขนาดรูปให้คมชัดและรักษาสัดส่วนใบหน้าเดิม
function resizeImage(dataUrl: string, maxWidth = 768): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      } else {
        resolve(dataUrl);
      }
    };
    img.src = dataUrl;
  });
}

// ดึงรายชื่อโมเดลทั้งหมดที่มีอยู่ใน Gemini API Key
async function getAvailableModels(apiKey: string): Promise<string[]> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    const data = await res.json();
    return (data?.models || [])
      .map((m: { name?: string }) => (m.name || '').replace('models/', ''))
      .filter(Boolean);
  } catch {
    return [];
  }
}

export default function AiBarberStudio() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [generatingStyle, setGeneratingStyle] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedStyleName, setSelectedStyleName] = useState<string>('');
  const [genError, setGenError] = useState<string | null>(null);

  // เก็บจำนวนครั้งที่ลูกค้ากด Generate ไปแล้ว (สูงสุด 2 รูปต่อคน)
  const [usedCount, setUsedCount] = useState<number>(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0) {
          setUsedCount(parsed);
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const updateUsedCount = (newCount: number) => {
    setUsedCount(newCount);
    try {
      localStorage.setItem(STORAGE_KEY, String(newCount));
    } catch {
      // ignore storage errors
    }
  };

  const remainingQuota = Math.max(0, MAX_GEN_LIMIT - usedCount);
  const isQuotaReached = usedCount >= MAX_GEN_LIMIT;

  // 1. เปิดกล้องเว็บแคม
  const startCamera = async () => {
    try {
      setCapturedImage(null);
      setAnalysisData(null);
      setAnalysisError(null);
      setGeneratedImage(null);
      setGenError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 768 }, height: { ideal: 1024 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('เปิดกล้องไม่ได้:', error);
      setAnalysisError('ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตสิทธิ์กล้อง หรือเลือกอัปโหลดรูปภาพแทนครับ');
    }
  };

  // ปิดกล้องเมื่อถ่ายเสร็จ
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // 2. ถ่ายรูปจากกล้อง
  const takeSnapshot = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const rawDataUrl = canvas.toDataURL('image/jpeg', 0.92);
        stopCamera();
        const hdImage = await resizeImage(rawDataUrl, 768);
        setCapturedImage(hdImage);
      }
    }
  };

  // ทางเลือก: อัปโหลดรูปจากเครื่อง
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    stopCamera();
    setAnalysisData(null);
    setAnalysisError(null);
    setGeneratedImage(null);
    setGenError(null);

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        const hdImage = await resizeImage(reader.result, 768);
        setCapturedImage(hdImage);
      }
    };
    reader.readAsDataURL(file);
  };

  // 3. ฟังก์ชันที่ 1: วิเคราะห์โครงหน้าด้วย Gemini
  const analyzeFace = async () => {
    if (!capturedImage) return;
    setAnalyzing(true);
    setAnalysisData(null);
    setAnalysisError(null);
    setGeneratedImage(null);
    setGenError(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        setAnalysisError('ไม่พบ API Key (NEXT_PUBLIC_GEMINI_API_KEY เป็นค่าว่าง)');
        return;
      }

      const tinyImage = await resizeImage(capturedImage, 256);
      const base64Data = tinyImage.split(',')[1];

      const promptText = `วิเคราะห์โครงหน้าของบุคคลในภาพนี้ แล้วตอบกลับเป็น JSON เท่านั้น ตามรูปแบบนี้:
{
  "faceShape": "ประเภทโครงหน้า เช่น หน้ารูปไข่ (Oval), หน้ารูปเพชร (Diamond), หน้ากลม (Round), หน้าเหลี่ยม (Square)",
  "faceDescription": "อธิบายจุดเด่นโครงหน้าสั้นๆ 1 ประโยค",
  "recommendations": [
    { "name": "ชื่อทรงผมภาษาไทย 1", "englishName": "English Hairstyle Name 1", "reason": "เหตุผลสั้นๆ 1 ประโยค" },
    { "name": "ชื่อทรงผมภาษาไทย 2", "englishName": "English Hairstyle Name 2", "reason": "เหตุผลสั้นๆ 1 ประโยค" },
    { "name": "ชื่อทรงผมภาษาไทย 3", "englishName": "English Hairstyle Name 3", "reason": "เหตุผลสั้นๆ 1 ประโยค" }
  ]
}`;

      const allModels = await getAvailableModels(apiKey);
      const validTextModels = allModels.filter(
        (n) =>
          (n.includes('gemini-3') || n.includes('gemini-2.5') || n.includes('gemini-2.0')) &&
          !n.includes('image') &&
          !n.includes('tts') &&
          !n.includes('embedding')
      );

      const analysisModels =
        validTextModels.length > 0 ? validTextModels : ['gemini-2.5-flash'];

      let parsedResult: AnalysisData | null = null;
      const errors: string[] = [];

      for (const modelName of analysisModels) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

          const genConfig: Record<string, unknown> = {
            response_mime_type: 'application/json',
            maxOutputTokens: 1024,
            temperature: 0.4,
          };

          if (modelName.startsWith('gemini-3')) {
            genConfig.thinkingConfig = { thinkingBudget: 0 };
          }

          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { inline_data: { mime_type: 'image/jpeg', data: base64Data } },
                    { text: promptText },
                  ],
                },
              ],
              generationConfig: genConfig,
            }),
          });

          const data = await res.json();
          if (!res.ok) {
            errors.push(`[${modelName}] ${data?.error?.message || `HTTP ${res.status}`}`);
            continue;
          }

          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
          const cleanJson = rawText.replace(/```json|```/g, '').trim();
          const parsed: AnalysisData = JSON.parse(cleanJson);

          if (parsed.faceShape && parsed.recommendations) {
            parsedResult = parsed;
            break;
          }
        } catch (err: unknown) {
          errors.push(`[${modelName}] ${err instanceof Error ? err.message : String(err)}`);
        }
      }

      if (!parsedResult) {
        throw new Error(errors.join(' | ') || 'AI ตอบกลับข้อมูลไม่ครบ กรุณากดลองใหม่อีกครั้ง');
      }

      setAnalysisData(parsedResult);
    } catch (error: unknown) {
      console.error('Error analyzing face:', error);
      const errMsg = error instanceof Error ? error.message : JSON.stringify(error);
      setAnalysisError(`เกิดข้อผิดพลาด: ${errMsg}`);
    } finally {
      setAnalyzing(false);
    }
  };

  // 4. ฟังก์ชันที่ 2: เรียก fal.ai (FLUX Pro Kontext) จำกัดลูกค้า 1 คน สูงสุด 2 รูป
  const generateHairstyleImage = async (style: RecommendedStyle) => {
    if (!capturedImage) return;

    // ตรวจสอบสิทธิ์ลูกค้า 1 คนไม่เกิน 2 รูป
    if (usedCount >= MAX_GEN_LIMIT) {
      setGenError(
        `คุณใช้สิทธิ์ทดลองสร้างภาพทรงผมครบ ${MAX_GEN_LIMIT} รูปแล้วครับ หากสนใจตัดทรงที่แนะนำ สามารถกดจองคิวกับช่างได้เลยครับ`
      );
      return;
    }

    setGeneratingStyle(style.name);
    setSelectedStyleName(`${style.name} (${style.englishName})`);
    setGeneratedImage(null);
    setGenError(null);

    try {
      const falKey = process.env.NEXT_PUBLIC_FAL_KEY;
      if (!falKey) {
        setGenError(
          'ไม่พบค่า NEXT_PUBLIC_FAL_KEY กรุณาใส่ API Key จาก fal.ai ใน .env.local และ GitHub Secrets'
        );
        setGeneratingStyle(null);
        return;
      }

      fal.config({
        credentials: falKey,
      });

      const prompt = `Change ONLY the man's hairstyle to a realistic, freshly cut ${style.englishName} (${style.name}) men's haircut. Seamlessly blend the natural hairline, baby hairs, and tapered side fade into his forehead skin and temples. Match the exact indoor room lighting, soft shadows on the forehead, natural dark Asian hair texture, and smartphone camera quality of the original photo. Keep his exact face, eyes, eyebrows, nose, mouth, skin pores, beard stubble, neck, and room background 100% identical.`;

      const result = await fal.subscribe('fal-ai/flux-pro/kontext', {
        input: {
          prompt: prompt,
          image_url: capturedImage,
          guidance_scale: 3.5,
          num_images: 1,
          output_format: 'jpeg',
        },
      });

      const outUrl = result.data?.images?.[0]?.url;
      if (!outUrl) {
        throw new Error('ไม่ได้รับรูปภาพจาก fal.ai');
      }

      // นับจำนวนการใช้งานเพิ่ม 1 ครั้งเมื่อสร้างภาพสำเร็จ
      updateUsedCount(usedCount + 1);

      // แปลงรูปเป็น Base64 เพื่อให้กดดาวน์โหลดลงเครื่องได้ทันที
      try {
        const imgRes = await fetch(outUrl);
        const blob = await imgRes.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setGeneratedImage(typeof reader.result === 'string' ? reader.result : outUrl);
          setGeneratingStyle(null);
        };
        reader.readAsDataURL(blob);
      } catch {
        setGeneratedImage(outUrl);
        setGeneratingStyle(null);
      }
    } catch (error: unknown) {
      console.error('Error generating hairstyle image:', error);
      const errMsg = error instanceof Error ? error.message : JSON.stringify(error);
      setGenError(`เกิดข้อผิดพลาด: ${errMsg}`);
      setGeneratingStyle(null);
    }
  };

  return (
    <div className="w-full max-w-[960px] mx-auto flex flex-col gap-8 text-left">
      {/* สเต็ปที่ 1: ถ่ายรูป / อัปโหลดใบหน้า พร้อมกรอบไกด์ระยะใบหน้าและพื้นที่เหนือหัว */}
      <section className="rounded-[24px] border border-[rgba(232,201,138,0.28)] bg-[rgba(255,255,255,0.03)] backdrop-blur-md p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#E8C98A]">
              STEP 01 · FACE CAPTURE & ANALYSIS
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F4F1EC] mt-1">
              1. ถ่ายรูปหน้าตรงให้อยู่ในกรอบเพื่อวิเคราะห์ทรงผม
            </h2>
          </div>
          {capturedImage && (
            <button
              onClick={() => {
                setCapturedImage(null);
                setAnalysisData(null);
                setAnalysisError(null);
                setGeneratedImage(null);
                setGenError(null);
              }}
              className="text-xs sm:text-sm text-[#E8C98A] underline hover:opacity-80"
            >
              ถ่ายใหม่ / เปลี่ยนรูป
            </button>
          )}
        </div>

        {/* กรอบแสดงกล้องพร้อมไกด์วางใบหน้า หรือรูปที่ถ่ายไว้ */}
        {!capturedImage ? (
          <div className="flex flex-col items-center gap-5">
            <div className="relative w-full max-w-sm aspect-[3/4] bg-[#060F11] rounded-2xl overflow-hidden border-2 border-[rgba(232,201,138,0.35)] flex items-center justify-center shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`w-full h-full object-cover scale-x-[-1] ${cameraActive ? 'block' : 'hidden'}`}
              />

              {/* กรอบไกด์ตำแหน่งใบหน้าและระยะเหนือศีรษะ */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between p-4">
                <div className="w-full border-b border-dashed border-[#E8C98A]/60 pb-2 text-center">
                  <span className="inline-block px-3 py-0.5 rounded-full bg-[#081416]/80 text-[11px] font-medium text-[#E8C98A] border border-[#E8C98A]/40">
                    ↑ เว้นช่องว่างด้านบนไว้สำหรับทรงผม
                  </span>
                </div>

                <div className="relative w-44 h-60 sm:w-48 sm:h-64 rounded-[999px] border-2 border-dashed border-[#E8C98A]/85 flex flex-col items-center justify-center shadow-[0_0_0_9999px_rgba(6,15,17,0.38)]">
                  <div className="w-full border-t border-dotted border-[#E8C98A]/40 absolute top-[42%]" />
                  {!cameraActive && (
                    <p className="text-xs text-center text-[#F4F1EC]/85 px-4 leading-relaxed">
                      วางใบหน้าตรงให้อยู่ในกรอบวงรีนี้
                    </p>
                  )}
                </div>

                <div className="w-64 h-8 border-t-2 border-dashed border-[#E8C98A]/50 rounded-t-[100px] flex items-end justify-center">
                  <span className="text-[11px] text-[#E8C98A]/85 bg-[#081416]/80 px-2.5 py-0.5 rounded-full">
                    ให้เห็นถึงระดับช่วงไหล่
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[rgba(244,241,236,0.65)] text-center max-w-md">
              * แนะนำให้หันหน้าตรงในที่แสงสว่างสม่ำเสมอ และเว้นพื้นที่ว่างเหนือศีรษะตามเส้นประ เพื่อให้ AI จำลองทรงผมได้สมจริงที่สุด
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {!cameraActive ? (
                <button
                  onClick={startCamera}
                  className="btn-premium px-6 py-3 rounded-full font-semibold text-sm sm:text-base cursor-pointer"
                >
                  เปิดกล้องถ่ายรูป
                </button>
              ) : (
                <button
                  onClick={takeSnapshot}
                  className="px-7 py-3 rounded-full bg-[#E8C98A] text-[#081416] font-bold text-sm sm:text-base hover:bg-[#f3d8a0] transition cursor-pointer"
                >
                  กดชัตเตอร์ถ่ายรูป
                </button>
              )}

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 rounded-full border border-[rgba(232,201,138,0.4)] text-[#E8C98A] text-sm sm:text-base font-medium hover:bg-[rgba(232,201,138,0.1)] transition cursor-pointer"
              >
                อัปโหลดรูปภาพ
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={capturedImage}
              alt="รูปใบหน้าลูกค้า"
              className="w-56 h-72 object-cover object-top rounded-2xl border-2 border-[#E8C98A] shadow-lg shrink-0"
            />
            <div className="flex-1 flex flex-col items-start gap-4">
              <p className="text-sm sm:text-base text-[rgba(244,241,236,0.8)] leading-relaxed">
                ระบบบันทึกรูปใบหน้าของคุณเรียบร้อยแล้ว กดปุ่มด้านล่างเพื่อให้ลุง AI วิเคราะห์รูปทรงใบหน้าและคัดเลือกทรงผมที่เหมาะสมที่สุดให้ครับ
              </p>
              <button
                onClick={analyzeFace}
                disabled={analyzing}
                className="btn-premium px-8 py-3.5 rounded-full font-semibold text-base disabled:opacity-50 cursor-pointer"
              >
                {analyzing ? 'กำลังวิเคราะห์โครงหน้า...' : 'วิเคราะห์โครงหน้าเลย →'}
              </button>

              {analysisError && (
                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs sm:text-sm w-full break-words">
                  {analysisError}
                </div>
              )}
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </section>

      {/* สเต็ปที่ 2: ผลการวิเคราะห์โครงหน้า + การ์ดทรงผมที่แนะนำพร้อมตัวนับโควตา 2 รูป/คน */}
      {analysisData && (
        <section className="rounded-[24px] border border-[rgba(232,201,138,0.35)] bg-[rgba(255,255,255,0.04)] backdrop-blur-md p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#E8C98A]">
                STEP 02 · FACE SHAPE & RECOMMENDED STYLES
              </span>
              <div className="mt-2 flex flex-wrap items-baseline gap-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#F4F1EC]">
                  โครงหน้าของคุณคือ: <span className="text-[#E8C98A]">{analysisData.faceShape}</span>
                </h2>
              </div>
              <p className="text-sm sm:text-base text-[rgba(244,241,236,0.75)] mt-2 leading-relaxed">
                {analysisData.faceDescription}
              </p>
            </div>

            {/* ป้ายแสดงโควต้าทดลองสร้างภาพทรงผม (สูงสุด 2 รูปต่อลูกค้า 1 คน) */}
            <div className="shrink-0 flex flex-col items-start sm:items-end gap-1.5">
              <div
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border ${
                  isQuotaReached
                    ? 'bg-red-950/50 border-red-500/40 text-red-200'
                    : 'bg-[#E8C98A]/10 border-[#E8C98A]/40 text-[#E8C98A]'
                }`}
              >
                สิทธิ์สร้างภาพทรงผม: เหลือ {remainingQuota} / {MAX_GEN_LIMIT} รูป
              </div>
              {usedCount > 0 && (
                <button
                  onClick={() => updateUsedCount(0)}
                  className="text-[11px] text-[rgba(244,241,236,0.45)] hover:text-[#E8C98A] underline cursor-pointer"
                  title="สำหรับร้านค้า/ผู้ดูแลระบบรีเซ็ตสิทธิ์ทดสอบ"
                >
                  รีเซ็ตสิทธิ์ (สำหรับร้าน)
                </button>
              )}
            </div>
          </div>

          {isQuotaReached && (
            <div className="p-4 rounded-xl bg-amber-950/50 border border-[#E8C98A]/40 text-sm text-[#F4F1EC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span>
                คุณใช้สิทธิ์ทดลองจำลองทรงผมครบ <strong>{MAX_GEN_LIMIT} รูป</strong> เรียบร้อยแล้วครับ สามารถนำภาพที่บันทึกไว้มาให้ช่างตัดจริงที่ร้านได้เลย!
              </span>
              <Link
                href="/book"
                className="shrink-0 px-5 py-2 rounded-full bg-[#E8C98A] text-[#081416] text-xs font-bold hover:bg-[#f3d8a0] transition"
              >
                จองคิวตัดผมเลย →
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysisData.recommendations?.map((style, idx) => {
              const isGeneratingThis = generatingStyle === style.name;
              const isButtonDisabled = generatingStyle !== null || isQuotaReached;

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[rgba(232,201,138,0.22)] bg-[#081416]/80 p-5 flex flex-col justify-between gap-4"
                >
                  <div>
                    <span className="text-xs font-serif text-[#E8C98A]">ทรงแนะนำที่ {idx + 1}</span>
                    <h3 className="text-lg font-bold text-[#F4F1EC] mt-1">{style.name}</h3>
                    <p className="text-xs text-[#E8C98A]/80 mb-2">{style.englishName}</p>
                    <p className="text-sm text-[rgba(244,241,236,0.7)] leading-relaxed">
                      {style.reason}
                    </p>
                  </div>

                  <button
                    onClick={() => generateHairstyleImage(style)}
                    disabled={isButtonDisabled}
                    className="w-full py-2.5 px-4 rounded-full bg-[rgba(232,201,138,0.15)] border border-[#E8C98A] text-[#E8C98A] font-semibold text-sm hover:bg-[#E8C98A] hover:text-[#081416] transition disabled:opacity-40 disabled:hover:bg-[rgba(232,201,138,0.15)] disabled:hover:text-[#E8C98A] cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isGeneratingThis
                      ? 'กำลัง Generate ภาพ...'
                      : isQuotaReached
                      ? 'ใช้สิทธิ์ครบ 2 รูปแล้ว'
                      : 'Generate รูปทรงนี้'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* สเต็ปที่ 3: แสดงภาพผลลัพธ์ที่ Generate ออกมาจากรูปเดิม หรือแจ้งสาเหตุบนหน้าจอ */}
      {(generatingStyle || generatedImage || genError) && (
        <section className="rounded-[24px] border border-[#E8C98A]/50 bg-[#071214] p-6 sm:p-8 flex flex-col items-center text-center gap-6">
          <div>
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#E8C98A]">
              AI HAIRSTYLE PREVIEW
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F4F1EC] mt-1">
              ภาพจำลองทรง: <span className="text-[#E8C98A]">{selectedStyleName}</span>
            </h2>
          </div>

          {generatingStyle ? (
            <div className="py-12 flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-[#E8C98A] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[#E8C98A]">
                กำลังดึงรูปใบหน้าเดิมของคุณมาตัดทรง {generatingStyle} รอสักครู่ครับ...
              </p>
            </div>
          ) : genError ? (
            <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-sm max-w-lg">
              <p className="font-semibold mb-1">ไม่สามารถสร้างภาพได้:</p>
              <p className="break-words">{genError}</p>
            </div>
          ) : (
            generatedImage && (
              <div className="flex flex-col items-center gap-6 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl w-full">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-[rgba(244,241,236,0.6)]">รูปต้นฉบับ</span>
                    <img
                      src={capturedImage!}
                      alt="Original"
                      className="w-full aspect-[3/4] object-cover object-top rounded-2xl border border-white/15"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-[#E8C98A] font-semibold">ทรงใหม่ที่ Generate</span>
                    <img
                      src={generatedImage}
                      alt={selectedStyleName}
                      className="w-full aspect-[3/4] object-cover object-top rounded-2xl border-2 border-[#E8C98A] shadow-xl"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 pt-2">
                  <a
                    href={generatedImage}
                    download={`veera-barber-${selectedStyleName}.png`}
                    className="px-6 py-3 rounded-full border border-[#E8C98A] text-[#E8C98A] text-sm font-semibold hover:bg-[rgba(232,201,138,0.1)] transition"
                  >
                    บันทึกรูปภาพนี้
                  </a>
                  <Link
                    href="/book"
                    className="btn-premium px-8 py-3 rounded-full text-sm font-semibold"
                  >
                    ถูกใจทรงนี้ · จองคิวตัดเลย →
                  </Link>
                </div>
              </div>
            )
          )}
        </section>
      )}
    </div>
  );
}