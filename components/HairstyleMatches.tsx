"use client";

import Link from "next/link";
import { hairstyles } from "@/data/hairstyles";
import { FACE_SHAPE_INFO, type FaceShape } from "@/lib/faceShape";

type Props = {
  detectedShape: FaceShape; // โครงหน้าที่ระบบวัดได้
  selectedShape: FaceShape; // โครงหน้าที่ใช้กรองอยู่ตอนนี้ (อาจถูกลูกค้าเปลี่ยน)
  onChangeShape: (shape: FaceShape) => void;
};

// รายชื่อโครงหน้าทั้งหมด ดึงจาก FACE_SHAPE_INFO ไม่ต้องพิมพ์ซ้ำ
const ALL_SHAPES = Object.keys(FACE_SHAPE_INFO) as FaceShape[];

export default function HairstyleMatches({
  detectedShape,
  selectedShape,
  onChangeShape,
}: Props) {
  // กรองเฉพาะทรงที่เหมาะกับโครงหน้าที่เลือก
  const matches = hairstyles.filter((style) =>
    style.suitableFaceShapes.includes(selectedShape)
  );

  return (
    <div className="mt-6 w-full max-w-md">
      <h2 className="text-xl font-bold">
        ทรงผมที่เหมาะกับ{FACE_SHAPE_INFO[selectedShape].label}
      </h2>

      {selectedShape !== detectedShape && (
        <p className="mt-1 text-sm text-gray-500">
          คุณเลือกเปลี่ยนจากที่ระบบวัดได้ ({FACE_SHAPE_INFO[detectedShape].label}){" "}
          <button
            type="button"
            onClick={() => onChangeShape(detectedShape)}
            className="underline"
          >
            กลับไปใช้ค่าเดิม
          </button>
        </p>
      )}

      <p className="mt-3 text-sm text-gray-600">
        ถ้าผลไม่ตรงกับความรู้สึก เลือกโครงหน้าเองได้:
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {ALL_SHAPES.map((shape) => (
          <button
            key={shape}
            type="button"
            onClick={() => onChangeShape(shape)}
            className={`rounded-full border px-3 py-1 text-sm ${
              shape === selectedShape
                ? "border-black bg-black text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {FACE_SHAPE_INFO[shape].label}
          </button>
        ))}
      </div>

      {matches.length === 0 ? (
        <p className="mt-4 rounded-xl border p-4 text-sm text-gray-600">
          ตอนนี้ร้านยังไม่มีทรงที่ตรงกับโครงหน้านี้ ลองเลือกโครงหน้าอื่น
          หรือปรึกษาช่างที่ร้านได้เลย
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {matches.map((style) => (
            <div key={style.id} className="rounded-xl border p-4 shadow-sm">
              <h3 className="text-lg font-semibold">{style.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{style.description}</p>
              <div className="mt-3 flex justify-between text-sm text-gray-700">
                <span>{style.price} บาท</span>
                <span>{style.duration} นาที</span>
              </div>

              <Link
                href={`/book?hairstyle=${style.id}`}
                className="mt-3 block w-full rounded-lg bg-black px-4 py-2 text-center text-sm text-white hover:bg-gray-800"
              >
                จองทรงนี้เลย
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}