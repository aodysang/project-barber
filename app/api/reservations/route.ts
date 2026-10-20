import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { hairstyles } from "@/data/hairstyles";
import {
  BARBER_COUNT,
  rangesOverlap,
  timeToMinutes,
  type Reservation,
} from "@/lib/reservation";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customerName, customerPhone, barberId, hairstyleId, date, startTime } =
    body;

  // ---------- ตรวจความถูกต้องของข้อมูลที่ส่งมา ----------
  if (!customerName || typeof customerName !== "string" || !customerName.trim()) {
    return NextResponse.json({ error: "กรุณากรอกชื่อ" }, { status: 400 });
  }

  const phoneDigits = String(customerPhone ?? "").replace(/[^0-9]/g, "");
  if (phoneDigits.length < 9 || phoneDigits.length > 10) {
    return NextResponse.json({ error: "เบอร์โทรไม่ถูกต้อง" }, { status: 400 });
  }

  if (
    typeof barberId !== "number" ||
    barberId < 1 ||
    barberId > BARBER_COUNT
  ) {
    return NextResponse.json({ error: "กรุณาเลือกช่าง" }, { status: 400 });
  }

  const style = hairstyles.find((h) => h.id === hairstyleId);
  if (!style) {
    return NextResponse.json({ error: "ไม่พบทรงผมที่เลือก" }, { status: 400 });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(startTime)) {
    return NextResponse.json({ error: "รูปแบบวันหรือเวลาไม่ถูกต้อง" }, { status: 400 });
  }

  const duration = style.duration;
  const start = timeToMinutes(startTime);
  const end = start + duration;

  // ---------- ตรวจซ้ำกับฐานข้อมูลจริงอีกครั้งก่อนบันทึก ----------
  // (กันกรณีลูกค้าสองคนกดจองคิวเดียวกันพร้อมกัน)
  const db = await getDb();
  const collection = db.collection<Reservation>("reservations");

  const existing = await collection
    .find({ date, barberId, status: "confirmed" })
    .toArray();

  const conflict = existing.some((r) => {
    const existingStart = timeToMinutes(r.startTime);
    const existingEnd = existingStart + r.durationMinutes;
    return rangesOverlap(start, end, existingStart, existingEnd);
  });

  if (conflict) {
    return NextResponse.json(
      { error: "คิวนี้เพิ่งถูกจองไปแล้ว กรุณาเลือกเวลาอื่น" },
      { status: 409 }
    );
  }

  // ---------- บันทึกการจอง ----------
  const reservation: Reservation = {
    customerName: customerName.trim(),
    customerPhone: phoneDigits,
    barberId,
    hairstyleId,
    date,
    startTime,
    durationMinutes: duration,
    status: "confirmed",
    createdAt: new Date(),
  };

  const result = await collection.insertOne(reservation);

  return NextResponse.json({
    ok: true,
    id: result.insertedId,
    reservation,
  });
}