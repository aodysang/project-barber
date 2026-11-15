'use client';

import React, { useRef, useState } from 'react';
import { GoogleGenAI } from '@google/genai';

export default function FaceAnalysis({ onAnalysisComplete }: { onAnalysisComplete: (image: string, analysis: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');

  // 1. เปิดกล้องเว็บแคม
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("เปิดกล้องไม่ได้:", error);
      alert("กรุณาอนุญาตการใช้งานกล้องเว็บแคม");
    }
  };

  // 2. ถ่ายรูป (Snapshot)
  const takeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
      }
    }
  };

  // 3. ส่งภาพไปให้ AI วิเคราะห์โครงหน้าและแนะนำทรงผม
  const analyzeFace = async () => {
    if (!capturedImage) {
      alert("กรุณาถ่ายรูปหน้าตรงก่อนครับ!");
      return;
    }

    setLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey: apiKey });
      const base64Data = capturedImage.split(',')[1];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            inlineData: { data: base64Data, mimeType: 'image/jpeg' },
          },
          {
            text: "วิเคราะห์โครงหน้าของบุคคลในภาพนี้ว่าเป็นทรงอะไร (เช่น หน้ากลม, หน้าเหลี่ยม, ฯลฯ) และช่วยแนะนำทรงผมชายที่เหมาะสมมา 3 ทรง พร้อมเหตุผลสั้นๆ เป็นภาษาไทย",
          },
        ],
      });

      const resultText = response.text || 'วิเคราะห์ไม่สำเร็จ';
      setAnalysisResult(resultText);
      
      // ส่งข้อมูลภาพและผลวิเคราะห์ไปให้หน้าถัดไปใช้งานต่อ
      onAnalysisComplete(capturedImage, resultText);

    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาดในการวิเคราะห์กับ AI");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-gray-900 text-white rounded-xl shadow-lg border border-yellow-500/30">
      <h2 className="text-2xl font-bold mb-4 text-center text-yellow-400">สเต็ปที่ 1: วิเคราะห์โครงหน้าด้วย AI</h2>

      <div className="flex flex-col items-center gap-4">
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-gray-700">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        </div>

        <div className="flex gap-4">
          <button onClick={startCamera} className="px-4 py-2 bg-blue-600 rounded-lg font-semibold hover:bg-blue-500">
            เปิดกล้อง
          </button>
          <button onClick={takeSnapshot} className="px-4 py-2 bg-green-600 rounded-lg font-semibold hover:bg-green-500">
            ถ่ายรูปหน้าตรง
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {capturedImage && (
          <div className="w-full mt-4 flex flex-col items-center gap-2">
            <p className="text-sm text-gray-400">รูปภาพที่บันทึกไว้:</p>
            <img src={capturedImage} alt="Captured" className="w-40 rounded-lg border border-gray-600" />
            <button 
              onClick={analyzeFace} 
              disabled={loading}
              className="mt-2 px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 w-full disabled:bg-gray-600"
            >
              {loading ? 'กำลังให้ลุง AI วิเคราะห์โครงหน้า...' : 'เริ่มวิเคราะห์โครงหน้า'}
            </button>
          </div>
        )}

        {analysisResult && (
          <div className="w-full mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="font-bold text-yellow-400 mb-2">ผลการวิเคราะห์และทรงผมที่แนะนำ:</h3>
            <p className="text-sm whitespace-pre-wrap">{analysisResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}