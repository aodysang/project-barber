import { getDb } from "@/lib/mongodb";

const LIMIT_PER_WINDOW = 5; // เรียกได้สูงสุดกี่ครั้ง
const WINDOW_MINUTES = 60; // ต่อกี่นาที

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
};

// เช็กว่า key นี้ (เช่น IP + ชื่อ API) ยังเรียกได้อีกไหม
// ถ้าเรียกได้ จะบันทึกการเรียกครั้งนี้ไปในตัวด้วยเลย (เรียกครั้งเดียวจบ)
export async function checkRateLimit(key: string): Promise<RateLimitResult> {
  const db = await getDb();
  const col = db.collection("rateLimits");

  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);

  // นับว่า key นี้มีการเรียกกี่ครั้งในช่วงเวลาที่ยังไม่หมดอายุ
  const count = await col.countDocuments({
    key,
    createdAt: { $gte: windowStart },
  });

  if (count >= LIMIT_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }

  // ยังไม่เกิน บันทึกการเรียกครั้งนี้
  await col.insertOne({ key, createdAt: new Date() });

  return { allowed: true, remaining: LIMIT_PER_WINDOW - count - 1 };
}