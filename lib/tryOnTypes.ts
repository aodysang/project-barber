// สถานะการสร้างภาพของแต่ละทรงผม (มีได้ทีละอย่างต่อทรง)
export type TryOnEntry =
  | { status: "loading" } // กำลังสร้าง
  | { status: "done"; image: string; mock: boolean } // เสร็จแล้ว (mock = ภาพจำลองปลอม)
  | { status: "error"; message: string }; // พลาด

// เก็บสถานะของทุกทรง โดยใช้ id ของทรงผมเป็นกุญแจ
export type TryOnMap = { [styleId: string]: TryOnEntry };