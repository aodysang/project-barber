'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Client } from '@gradio/client';

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

// ย่อขนาดรูปให้คมชัดพอสำหรับเก็บรายละเอียดแสงเงาและไรผม (768px)
function resizeImage(dataUrl: string, maxWidth = 768): Promise<string> {
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

  // 1. เปิดกล้องเว็บแคม
  const startCamera = async () => {
    try {
      setCapturedImage(null);
      setAnalysisData(null);
      setAnalysisError(null);
      setGeneratedImage(null);
      setGenError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1024 }, height: { ideal: 768 } },
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
        validTextModels.length > 0 ? validTextModels : ['gemini-3.8-flash', 'gemini-2.5-flash'];

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

  // 4. ฟังก์ชันที่ 2: เชื่อมต่อ Hugging Face ZeroGPU Space (เน้น Qwen-Image-Edit + ลดความแข็งของขอบผม)
  const generateHairstyleImage = async (style: RecommendedStyle) => {
    if (!capturedImage) return;
    setGeneratingStyle(style.name);
    setSelectedStyleName(`${style.name} (${style.englishName})`);
    setGeneratedImage(null);
    setGenError(null);

    try {
      const hfToken = process.env.NEXT_PUBLIC_HF_TOKEN as `hf_${string}` | undefined;
      const imgBlob = await (await fetch(capturedImage)).blob();

      // เน้นความเป็นธรรมชาติ เส้นผมฟุ้งไม่เป็นก้อน และมีเงาตกกระทบบนหน้าผากตามแสงห้องจริง
      const editPrompt = `Change ONLY the man's hairstyle to a natural, slightly messy ${style.englishName} haircut. Realistic individual hair strands, soft feathered hairline with natural forehead shadow, matching the exact low-light smartphone camera grain, exposure, and warm indoor lighting of the original selfie. Keep his exact face, skin pores, eyes, nose, mouth, and background completely unchanged.`;

      const spacesToTry = [
        {
          // ใช้ Qwen-Image-Edit เป็นตัวหลัก เพราะเกลี่ยเส้นผมและแสงกล้องมือถือได้เนียนกว่า
          spaceId: 'Qwen/Qwen-Image-Edit',
          endpoint: '/infer',
          buildArgs: () => [
            imgBlob,
            editPrompt,
            0, // seed
            true, // randomize_seed
            2.2, // guidance_scale ต่ำลงเพื่อให้เส้นผมนุ่ม ไม่แข็งเป็นก้อน
            28, // steps
          ],
        },
        {
          spaceId: 'black-forest-labs/FLUX.1-Kontext-dev',
          endpoint: '/infer',
          buildArgs: () => [
            imgBlob,
            editPrompt,
            0,
            true,
            2.2, // ลดจาก 3.0 เหลือ 2.2 เพื่อลดความแข็งของขอบไรผม
            28,
          ],
        },
      ];

      let foundImage = false;
      const errors: string[] = [];

      for (const sp of spacesToTry) {
        try {
          const client = await Client.connect(
            sp.spaceId,
            hfToken ? { hf_token: hfToken } : undefined
          );
          const result = await client.predict(sp.endpoint, sp.buildArgs());
          const outputData = result?.data as Array<{ url?: string; path?: string } | string>;

          const firstItem = outputData?.[0];
          const outUrl =
            typeof firstItem === 'string'
              ? firstItem
              : firstItem?.url || firstItem?.path;

          if (outUrl) {
            try {
              const resImg = await fetch(outUrl);
              const blobImg = await resImg.blob();
              const reader = new FileReader();
              reader.onloadend = () => {
                setGeneratedImage(typeof reader.result === 'string' ? reader.result : outUrl);
                setGeneratingStyle(null);
              };
              reader.readAsDataURL(blobImg);
            } catch {
              setGeneratedImage(outUrl);
              setGeneratingStyle(null);
            }
            foundImage = true;
            break;
          }
          errors.push(`[${sp.spaceId}] ไม่พบ URL รูปภาพในการตอบกลับ`);
        } catch (err: unknown) {
          errors.push(`[${sp.spaceId}] ${err instanceof Error ? err.message : String(err)}`);
        }
      }

      if (!foundImage) {
        setGenError(errors.join(' | ') || 'คิว ZeroGPU เต็มชั่วคราว กรุณากดลองใหม่อีกครั้งครับ');
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