'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { GoogleGenAI, Type } from '@google/genai';

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

// ฟังก์ชันย่อขนาดรูปภาพให้เล็กลงก่อนส่ง AI (ช่วยลดเวลาอัปโหลดได้มากกว่า 80%)
function resizeImage(dataUrl: string, maxWidth = 512): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      } else {
        resolve(dataUrl);
      }
    };
    img.src = dataUrl;
  });
}

export default function AiBarberStudio() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const [generatingStyle, setGeneratingStyle] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedStyleName, setSelectedStyleName] = useState<string>('');

  // 1. เปิดกล้องเว็บแคม
  const startCamera = async () => {
    try {
      setCapturedImage(null);
      setAnalysisData(null);
      setGeneratedImage(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 540 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('เปิดกล้องไม่ได้:', error);
      alert('ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตสิทธิ์กล้อง หรือเลือกอัปโหลดรูปภาพแทนครับ');
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

  // 2. ถ่ายรูปจากกล้อง (ย่อขนาดอัตโนมัติทันที)
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
        const rawDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        stopCamera();
        const smallImage = await resizeImage(rawDataUrl, 640);
        setCapturedImage(smallImage);
      }
    }
  };

  // ทางเลือก: อัปโหลดรูปจากเครื่อง (ย่อขนาดอัตโนมัติทันที)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    stopCamera();
    setAnalysisData(null);
    setGeneratedImage(null);

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        const smallImage = await resizeImage(reader.result, 640);
        setCapturedImage(smallImage);
      }
    };
    reader.readAsDataURL(file);
  };

  // 3. ฟังก์ชันที่ 1: วิเคราะห์โครงหน้า
  const analyzeFace = async () => {
    if (!capturedImage) return;
    setAnalyzing(true);
    setAnalysisData(null);
    setGeneratedImage(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        alert('ไม่พบ API Key (NEXT_PUBLIC_GEMINI_API_KEY เป็นค่าว่าง) กรุณาเช็ค GitHub Secrets และไฟล์ nextjs.yml');
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const fastImage = await resizeImage(capturedImage, 400);
      const base64Data = fastImage.split(',')[1];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
          {
            text: 'วิเคราะห์โครงหน้าของคนในภาพ (เช่น หน้ารูปไข่, หน้ารูปเพชร, หน้ากลม, หน้าเหลี่ยม) อธิบายสั้นๆ 1 ประโยค และแนะนำทรงผมชาย 3 ทรงที่เข้ากับโครงหน้านี้',
          },
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              faceShape: {
                type: Type.STRING,
                description: 'ประเภทโครงหน้า เช่น หน้ารูปไข่ (Oval), หน้ารูปเพชร (Diamond), หน้ากลม (Round)',
              },
              faceDescription: {
                type: Type.STRING,
                description: 'คำอธิบายจุดเด่นโครงหน้าแบบกระชับ 1 ประโยค',
              },
              recommendations: {
                type: Type.ARRAY,
                description: 'รายการทรงผมที่แนะนำ 3 ทรง',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: 'ชื่อทรงผมภาษาไทย' },
                    englishName: { type: Type.STRING, description: 'ชื่อทรงผมภาษาอังกฤษ' },
                    reason: { type: Type.STRING, description: 'เหตุผลสั้นๆ 1 ประโยค' },
                  },
                  required: ['name', 'englishName', 'reason'],
                },
              },
            },
            required: ['faceShape', 'faceDescription', 'recommendations'],
          },
        },
      });

      const parsed: AnalysisData = JSON.parse(response.text || '{}');
      setAnalysisData(parsed);
    } catch (error: unknown) {
      console.error('Error analyzing face:', error);
      const errMsg = error instanceof Error ? error.message : JSON.stringify(error);
      alert(`เกิดข้อผิดพลาด: ${errMsg}`);
    } finally {
      setAnalyzing(false);
    }
  };

  // 4. ฟังก์ชันที่ 2: ดึงรูปเดิมที่ถ่ายไว้ + ชื่อทรงที่แนะนำ ไป Generate ภาพเปลี่ยนทรงผมจริง
  const generateHairstyleImage = async (style: RecommendedStyle) => {
    if (!capturedImage) return;
    setGeneratingStyle(style.name);
    setSelectedStyleName(`${style.name} (${style.englishName})`);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        alert('ไม่พบ API Key (NEXT_PUBLIC_GEMINI_API_KEY เป็นค่าว่าง)');
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const base64Data = capturedImage.split(',')[1];

      const prompt = `Edit this portrait photo to change ONLY the person's hairstyle to a realistic "${style.englishName}" (${style.name}) men's haircut. Keep the person's exact face, facial features, skin tone, expression, clothing, and background completely identical to the original photo. Photorealistic barbershop look, natural hair texture and lighting.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [
          { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
          { text: prompt },
        ],
      });

      let foundImage = false;
      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData?.data) {
          const outMime = part.inlineData.mimeType || 'image/png';
          setGeneratedImage(`data:${outMime};base64,${part.inlineData.data}`);
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        alert('AI ไม่สามารถสร้างภาพสำหรับรูปนี้ได้ ลองถ่ายรูปหน้าตรงที่เห็นผมชัดเจนขึ้นอีกนิดนะครับ');
      }
    } catch (error: unknown) {
      console.error('Error generating hairstyle image:', error);
      const errMsg = error instanceof Error ? error.message : JSON.stringify(error);
      alert(`เกิดข้อผิดพลาดในการสร้างภาพ: ${errMsg}`);
    } finally {
      setGeneratingStyle(null);
    }
  };

  return (
    <div className="w-full max-w-[960px] mx-auto flex flex-col gap-8 text-left">
      {/* สเต็ปที่ 1: ถ่ายรูป / อัปโหลดใบหน้า */}
      <section className="rounded-[24px] border border-[rgba(232,201,138,0.28)] bg-[rgba(255,255,255,0.03)] backdrop-blur-md p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#E8C98A]">
              STEP 01 · FACE CAPTURE & ANALYSIS
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F4F1EC] mt-1">
              1. ถ่ายรูปหน้าตรงเพื่อวิเคราะห์โครงหน้า
            </h2>
          </div>
          {capturedImage && (
            <button
              onClick={() => {
                setCapturedImage(null);
                setAnalysisData(null);
                setGeneratedImage(null);
              }}
              className="text-xs sm:text-sm text-[#E8C98A] underline hover:opacity-80"
            >
              ถ่ายใหม่ / เปลี่ยนรูป
            </button>
          )}
        </div>

        {/* กรอบแสดงกล้องหรือรูปที่ถ่ายไว้ */}
        {!capturedImage ? (
          <div className="flex flex-col items-center gap-5">
            <div className="relative w-full max-w-md aspect-[4/3] bg-[#060F11] rounded-2xl overflow-hidden border border-[rgba(232,201,138,0.25)] flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`w-full h-full object-cover scale-x-[-1] ${cameraActive ? 'block' : 'hidden'}`}
              />
              {!cameraActive && (
                <div className="text-center p-6 text-[rgba(244,241,236,0.6)]">
                  <p className="text-sm">กดปุ่มเปิดกล้องเพื่อถ่ายรูปหน้าตรง หรืออัปโหลดรูปภาพจากเครื่อง</p>
                </div>
              )}
            </div>

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
              className="w-56 h-56 object-cover rounded-2xl border-2 border-[#E8C98A] shadow-lg shrink-0"
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
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </section>

      {/* สเต็ปที่ 2: ผลการวิเคราะห์โครงหน้า + การ์ดทรงผมที่แนะนำพร้อมปุ่ม Generate */}
      {analysisData && (
        <section className="rounded-[24px] border border-[rgba(232,201,138,0.35)] bg-[rgba(255,255,255,0.04)] backdrop-blur-md p-6 sm:p-8 flex flex-col gap-6">
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

          {/* รายการทรงผมที่แนะนำ พร้อมปุ่ม Generate แยกแต่ละทรง */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysisData.recommendations?.map((style, idx) => {
              const isGeneratingThis = generatingStyle === style.name;
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
                    disabled={generatingStyle !== null}
                    className="w-full py-2.5 px-4 rounded-full bg-[rgba(232,201,138,0.15)] border border-[#E8C98A] text-[#E8C98A] font-semibold text-sm hover:bg-[#E8C98A] hover:text-[#081416] transition disabled:opacity-40 cursor-pointer"
                  >
                    {isGeneratingThis ? 'กำลัง Generate ภาพ...' : 'Generate รูปทรงนี้'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* สเต็ปที่ 3: แสดงภาพผลลัพธ์ที่ Generate ออกมาจากรูปเดิม */}
      {(generatingStyle || generatedImage) && (
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
          ) : (
            generatedImage && (
              <div className="flex flex-col items-center gap-6 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl w-full">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-[rgba(244,241,236,0.6)]">รูปต้นฉบับ</span>
                    <img
                      src={capturedImage!}
                      alt="Original"
                      className="w-full aspect-square object-cover rounded-2xl border border-white/15"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-[#E8C98A] font-semibold">ทรงใหม่ที่ Generate</span>
                    <img
                      src={generatedImage}
                      alt={selectedStyleName}
                      className="w-full aspect-square object-cover rounded-2xl border-2 border-[#E8C98A] shadow-xl"
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