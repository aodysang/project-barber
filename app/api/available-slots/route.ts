import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import {
  BARBER_COUNT,
  SHOP_CLOSE_MINUTES,
  SHOP_OPEN_MINUTES,
  SLOT_STEP_MINUTES,
  minutesToTime,
  rangesOverlap,
  timeToMinutes,
  type Reservation,
} from "@/lib/reservation";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date"); // "2026-10-05"
  const durationParam = req.nextUrl.searchParams.get("duration"); // นาที เช่น "30"

  if (!date) {
    return NextResponse.json(
      { error: "ต้องระบุ date เช่น ?date=2026-10-05" },
      { status: 400 }
    );
  }

  const duration = Number(durationParam) || 30;

  const db = await getDb();
  // ดึงคิวที่จองไว้แล้วของวันนั้น (เฉพาะที่ยัง confirmed อยู่)
  const existing = await db
    .collection<Reservation>("reservations")
    .find({ date, status: "confirmed" })
    .toArray();

  // จัดกลุ่มคิวที่จองแล้วตามช่างแต่ละคน
  const bookedByBarber = new Map<number, { start: number; end: number }[]>();
  for (let i = 1; i <= BARBER_COUNT; i++) bookedByBarber.set(i, []);
  for (const r of existing) {
    const start = timeToMinutes(r.startTime);
    const end = start + r.durationMinutes;
    bookedByBarber.get(r.barberId)?.push({ start, end });
  }

  // ไล่สร้างช่วงเวลาทุก 30 นาที ตั้งแต่เปิดถึงปิด แล้วเช็กว่าช่างคนไหนว่างบ้าง
  const slots: { time: string; availableBarbers: number[] }[] = [];

  for (
    let start = SHOP_OPEN_MINUTES;
    start + duration <= SHOP_CLOSE_MINUTES;
    start += SLOT_STEP_MINUTES
  ) {
    const end = start + duration;
    const availableBarbers: number[] = [];

    for (let barberId = 1; barberId <= BARBER_COUNT; barberId++) {
      const booked = bookedByBarber.get(barberId) ?? [];
      const isFree = !booked.some((b) =>
        rangesOverlap(start, end, b.start, b.end)
      );
      if (isFree) availableBarbers.push(barberId);
    }

    if (availableBarbers.length > 0) {
      slots.push({ time: minutesToTime(start), availableBarbers });
    }
  }

  return NextResponse.json({ date, duration, slots });
}