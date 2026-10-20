export type ReservationStatus = "confirmed" | "cancelled";

export type Reservation = {
  customerName: string;
  customerPhone: string;
  barberId: number;
  hairstyleId: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  durationMinutes: number;
  status: ReservationStatus;
  createdAt: Date;
};

// เวลาเปิด-ปิดร้าน (นาทีนับจากเที่ยงคืน ใช้คำนวณช่วงเวลาว่าง)
export const SHOP_OPEN_MINUTES = 8 * 60 + 30; // 08:30
export const SHOP_CLOSE_MINUTES = 21 * 60; // 21:00
export const BARBER_COUNT = 4;
export const SLOT_STEP_MINUTES = 30; // ช่วงเวลาที่ให้เลือกจอง ทุก 30 นาที

// แปลง "14:30" เป็นจำนวนนาทีนับจากเที่ยงคืน (870)
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// แปลงกลับ 870 เป็น "14:30"
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// เช็กว่าสองช่วงเวลาทับกันไหม (ใช้ตอนหาคิวว่าง)
export function rangesOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number
): boolean {
  return startA < endB && startB < endA;
}