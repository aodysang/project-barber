import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { hairstyles } from "@/data/hairstyles";
import {
  SERVICES_DATA,
  SERVICE_ADDONS_CONFIG,
  type AddOnItem,
} from "@/lib/bookingServices";
import {
  BARBER_COUNT,
  ANY_BARBER_ID,
  rangesOverlap,
  timeToMinutes,
  type Reservation,
} from "@/lib/reservation";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customerName, customerPhone, barberId, date, startTime } = body;

  // ---------- ตรวจความถูกต้องของข้อมูลที่ส่งมา ----------
  if (!customerName || typeof customerName !== "string" || !customerName.trim()) {
    return NextResponse.json({ error: "กรุณากรอกชื่อ" }, { status: 400 });
  }

  const phoneDigits = String(customerPhone ?? "").replace(/[^0-9]/g, "");
  if (phoneDigits.length < 9 || phoneDigits.length > 10) {
    return NextResponse.json({ error: "เบอร์โทรไม่ถูกต้อง" }, { status: 400 });
  }

  // ยอมรับ ANY_BARBER_ID (0) เป็น "ใครก็ได้" หรือจำนวนเต็ม 1..BARBER_COUNT
  if (
    typeof barberId !== "number" ||
    !Number.isInteger(barberId) ||
    (barberId !== ANY_BARBER_ID && (barberId < 1 || barberId > BARBER_COUNT))
  ) {
    return NextResponse.json({ error: "กรุณาเลือกช่าง" }, { status: 400 });
  }

  // ค้นจากรายการบริการของร้านก่อน แล้วค่อยค้นจาก hairstyles
  const targetId = body.serviceId || body.hairstyleId;
  if (!targetId || typeof targetId !== "string") {
    return NextResponse.json({ error: "ไม่พบบริการที่เลือก" }, { status: 400 });
  }

  const service = SERVICES_DATA.find((s) => s.id === targetId);
  const hairstyle = !service ? hairstyles.find((h) => h.id === targetId) : null;

  if (!service && !hairstyle) {
    return NextResponse.json({ error: "ไม่พบบริการที่เลือก" }, { status: 400 });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(startTime)) {
    return NextResponse.json({ error: "รูปแบบวันหรือเวลาไม่ถูกต้อง" }, { status: 400 });
  }

  // ---------- ตรวจสอบ Add-ons ----------
  const rawAddOns = body.addOnIds ?? body.addOns ?? [];
  if (!Array.isArray(rawAddOns)) {
    return NextResponse.json({ error: "ข้อมูล add-on ไม่ถูกต้อง" }, { status: 400 });
  }

  const availableAddOns = service ? (SERVICE_ADDONS_CONFIG[service.id] || []) : [];
  const selectedAddOnItems: AddOnItem[] = [];

  for (const addOnId of rawAddOns) {
    if (typeof addOnId !== "string") {
      return NextResponse.json({ error: "add-on id ไม่ถูกต้อง" }, { status: 400 });
    }
    const foundAddOn = availableAddOns.find((a) => a.id === addOnId);
    if (!foundAddOn) {
      return NextResponse.json(
        { error: `ไม่พบ add-on ที่เลือก: ${addOnId}` },
        { status: 400 }
      );
    }
    selectedAddOnItems.push(foundAddOn);
  }

  // ---------- คำนวณระยะเวลารวม และราคารวมจากข้อมูลฝั่ง server เอง ----------
  const baseDuration = service ? service.duration : hairstyle!.duration;
  const basePrice = service ? service.price : hairstyle!.price;

  const addOnsDuration = selectedAddOnItems.reduce(
    (sum, a) => sum + a.durationMin,
    0
  );
  const addOnsPrice = selectedAddOnItems.reduce(
    (sum, a) => sum + a.price,
    0
  );

  const duration = baseDuration + addOnsDuration;
  const totalPrice = basePrice + addOnsPrice;

  const start = timeToMinutes(startTime);
  const end = start + duration;

  // ---------- ตรวจซ้ำกับฐานข้อมูลจริงอีกครั้งก่อนบันทึก ----------
  const db = await getDb();
  const collection = db.collection<Reservation>("reservations");

  const existingInDay = await collection
    .find({ date, status: "confirmed" })
    .toArray();

  let assignedBarberId = barberId;

  if (barberId === ANY_BARBER_ID) {
    // หาช่างจริงที่ว่างในช่วงเวลานี้
    const freeBarberIds: number[] = [];
    for (let candidateId = 1; candidateId <= BARBER_COUNT; candidateId++) {
      const barberBookings = existingInDay.filter((r) => r.barberId === candidateId);
      const isConflict = barberBookings.some((r) => {
        const existingStart = timeToMinutes(r.startTime);
        const existingEnd = existingStart + r.durationMinutes;
        return rangesOverlap(start, end, existingStart, existingEnd);
      });
      if (!isConflict) {
        freeBarberIds.push(candidateId);
      }
    }

    if (freeBarberIds.length === 0) {
      return NextResponse.json(
        { error: "ช่วงเวลานี้ไม่มีช่างว่าง กรุณาเลือกเวลาอื่น" },
        { status: 409 }
      );
    }

    assignedBarberId = freeBarberIds[0];
  } else {
    // ตรวจสอบคิวชนสำหรับช่างที่เลือกเฉพาะเจาะจง
    const barberBookings = existingInDay.filter((r) => r.barberId === barberId);
    const conflict = barberBookings.some((r) => {
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
  }

  // ห้ามบันทึก barberId = 0 ลงฐานข้อมูลไม่ว่ากรณีใด
  if (assignedBarberId < 1 || assignedBarberId > BARBER_COUNT) {
    return NextResponse.json(
      { error: "ไม่สามารถจัดสรรช่างได้" },
      { status: 500 }
    );
  }

  // ---------- บันทึกการจองด้วยช่างจริง ----------
  const reservation: Reservation = {
    customerName: customerName.trim(),
    customerPhone: phoneDigits,
    barberId: assignedBarberId,
    serviceId: service ? service.id : undefined,
    hairstyleId: hairstyle ? hairstyle.id : (service ? service.id : undefined),
    addOnIds: selectedAddOnItems.map((a) => a.id),
    totalPrice,
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