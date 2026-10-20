import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    return NextResponse.json({ ok: true, database: db.databaseName });
  } catch (err) {
    console.error("เชื่อมต่อฐานข้อมูลไม่สำเร็จ:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "unknown-error" },
      { status: 500 }
    );
  }
}