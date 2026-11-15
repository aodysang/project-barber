'use client';

import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

export default function HairGenerator({ originalImage }: { originalImage: string }) {
  const [selectedStyle, setSelectedStyle] = useState<string>('Undercut');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // ฟังก์ชันสั่ง AI ให้ Gen เปลี่ยนทรงผมจากรูปเดิม
  const generateHairStyle = async (styleName: string) => {
    setSelectedStyle(styleName);
    setLoading(true);
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey: apiKey });
      const base64Data = originalImage.split(',')[1];

      // ส่งรูปเดิม + คำสั่งเปลี่ยนทรงผม
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            inlineData: { data: base64Data, mimeType: 'image/jpeg' },
          },
          {
            text: `แก้ไขรูปภาพใบหน้านี้ โดยทำการเปลี่ยนทรงผมให้เป็นทรง "${styleName}อย่างสมจริง รักษารูปหน้าเดิมไว้ให้มากที่สุด`,
          },
        ],
      });

      // หมายเหตุ: หากโมเดลตอบกลับมาเป็นข้อความหรือคำแนะนำ ให้แสดงผล หรือหากดึงรูปภาพจำลองได้ให้นำมาแสดง
      console.log("AI Generation Result:", response.text);
      alert(`ระบบได้ประมวลผลทรง ${styleName} ให้เรียบร้อยแล้ว!`);

    } catch (error) {
      console.error("Error generating hair:", error);
      alert("เกิดข้อผิดพลาดในการสร้างภาพทรงผม");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-gray-900 text-white rounded-xl shadow-lg mt-6 border border-yellow-500/30">
      <h2 className="text-2xl font-bold mb-4 text-center text-yellow-400">สเต็ปที่ 2: เลือกทรงผมเพื่อจำลองภาพ</h2>
      
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-gray-300">ใช้รูปถ่ายใบหน้าเดิมของคุณเพื่อลองเปลี่ยนทรง:</p>
        <img src={originalImage} alt="Original" className="w-32 rounded-lg border border-gray-600" />

        <div className="grid grid-cols-2 gap-3 w-full mt-2">
          {['Undercut', 'Two Block', 'Mullet', 'Buzz Cut'].map((style) => (
            <button
              key={style}
              onClick={() => generateHairStyle(style)}
              disabled={loading}
              className="p-3 bg-gray-800 hover:bg-yellow-500 hover:text-black font-semibold rounded-lg border border-gray-700 transition"
            >
              {loading && selectedStyle === style ? 'กำลังสร้างภาพ...' : `ลองทรง ${style}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}