"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { barbers } from "@/data/barbers";
import { services } from "@/data/services";

export default function BookingConfirmContent() {
  const searchParams = useSearchParams();

  const name = searchParams.get("name");
  const phone = searchParams.get("phone");
  const barberId = searchParams.get("barberId");
  const serviceId = searchParams.get("serviceId");
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  const barber = barbers.find((b) => b.id === barberId);
  const service = services.find((s) => s.id === serviceId);

  return (
    <main className="max-w-lg mx-auto py-16 px-4 text-center">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-3xl font-bold mb-2">จองคิวสำเร็จ!</h1>
      <p className="text-gray-600 mb-8">
        เราได้บันทึกการจองของคุณเรียบร้อยแล้ว
      </p>

      <div className="border rounded-xl p-6 text-left space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-500">ชื่อ</span>
          <span className="font-medium">{name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">เบอร์โทร</span>
          <span className="font-medium">{phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">ช่าง</span>
          <span className="font-medium">{barber?.name ?? "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">บริการ</span>
          <span className="font-medium">{service?.name ?? "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">วันที่</span>
          <span className="font-medium">{date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">เวลา</span>
          <span className="font-medium">{time}</span>
        </div>
      </div>

      <Link
        href="/"
        className="inline-block mt-8 rounded-full bg-black text-white px-8 py-3 hover:bg-gray-800"
      >
        กลับหน้าแรก
      </Link>
    </main>
  );
}