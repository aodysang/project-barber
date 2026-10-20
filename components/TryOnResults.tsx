/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { hairstyles } from "@/data/hairstyles";
import type { TryOnMap } from "@/lib/tryOnTypes";

type Props = {
  photo: string; // รูปต้นฉบับของลูกค้า (ใช้เป็นภาพ "ก่อน")
  tryOn: TryOnMap;
  chosenId: string | null; // ทรงที่ลูกค้าเลือกไว้
  onChoose: (styleId: string | null) => void;
};

export default function TryOnResults({ photo, tryOn, chosenId, onChoose }: Props) {
  // เอาเฉพาะทรงที่สร้างภาพเสร็จแล้ว เรียงตามลำดับในรายการทรงผมของร้าน
  const doneStyles = hairstyles.filter((s) => tryOn[s.id]?.status === "done");
  if (doneStyles.length === 0) return null;

  const chosen = hairstyles.find((s) => s.id === chosenId);

  return (
    <div className="mt-8 w-full max-w-md">
      <h2 className="text-xl font-bold">ภาพลองทรง</h2>
      <p className="mt-1 text-sm text-gray-500">
        เลือกทรงที่ชอบได้ 1 ทรง (กดซ้ำเพื่อยกเลิก)
      </p>

      <div className="mt-4 space-y-4">
        {doneStyles.map((style) => {
          const entry = tryOn[style.id];
          if (entry.status !== "done") return null;
          const isChosen = style.id === chosenId;

          return (
            <div
              key={style.id}
              className={`rounded-2xl border p-3 ${
                isChosen ? "border-black ring-2 ring-black" : ""
              }`}
            >
              <div className="grid grid-cols-2 gap-2">
                <figure>
                  <img src={photo} alt="ก่อน" className="w-full rounded-lg" />
                  <figcaption className="mt-1 text-center text-xs text-gray-500">
                    ก่อน
                  </figcaption>
                </figure>
                <figure>
                  <img
                    src={entry.image}
                    alt={`ภาพลองทรง ${style.name}`}
                    className="w-full rounded-lg"
                  />
                  <figcaption className="mt-1 text-center text-xs text-gray-500">
                    {style.name}
                  </figcaption>
                </figure>
              </div>

              {entry.mock && (
                <p className="mt-2 text-xs text-amber-700">
                  ภาพจำลองปลอม (โหมดทดสอบ ยังไม่ได้เรียก AI จริง)
                </p>
              )}

              <div className="mt-3 flex items-center justify-between text-sm text-gray-700">
                <span>
                  {style.price} บาท · {style.duration} นาที
                </span>
                <button
                  type="button"
                  onClick={() => onChoose(isChosen ? null : style.id)}
                  className={`rounded-lg px-3 py-1.5 ${
                    isChosen
                      ? "bg-black text-white"
                      : "border hover:bg-gray-100"
                  }`}
                >
                  {isChosen ? "✓ เลือกทรงนี้แล้ว" : "เลือกทรงนี้"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {chosen && (
        <div className="mt-4 rounded-2xl bg-black p-4 text-white">
          <p className="text-sm text-gray-300">ทรงที่คุณเลือก</p>
          <p className="text-lg font-semibold">{chosen.name}</p>
          <p className="text-sm">
            {chosen.price} บาท · {chosen.duration} นาที
          </p>
          <Link
            href={`/book?hairstyle=${chosen.id}`}
            className="mt-4 block w-full rounded-xl bg-white py-3 text-center font-semibold text-black hover:bg-gray-100"
          >
            ไปจองคิวต่อ →
          </Link>
        </div>
      )}
    </div>
  );
}