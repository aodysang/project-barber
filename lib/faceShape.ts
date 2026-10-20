export type FaceShape =
  | "oval"
  | "round"
  | "square"
  | "heart"
  | "diamond"
  | "oblong";

// ชื่อและคำอธิบายภาษาไทยของแต่ละโครงหน้า (ใช้แสดงผล)
export const FACE_SHAPE_INFO: {
  [K in FaceShape]: { label: string; description: string };
} = {
  oval: { label: "หน้ารูปไข่", description: "สัดส่วนสมดุล ความกว้างกับความยาวพอดี" },
  round: { label: "หน้ากลม", description: "ความกว้างกับความยาวใกล้เคียงกัน กรามโค้งมน" },
  square: { label: "หน้าเหลี่ยม", description: "กรามชัด หน้าผากกับกรามกว้างใกล้เคียงกัน" },
  heart: { label: "หน้าหัวใจ", description: "หน้าผากกว้าง คางเรียวแหลม" },
  diamond: { label: "หน้าเพชร", description: "โหนกแก้มกว้างที่สุด หน้าผากและกรามแคบกว่า" },
  oblong: { label: "หน้ายาว", description: "ใบหน้ายาวกว่าความกว้างค่อนข้างมาก" },
};

// ============================================================
// ค่าเกณฑ์ตัดสิน (ปรับได้ทั้งหมดที่นี่ที่เดียว)
// ตัวเลขเหล่านี้เป็นค่าเริ่มต้นที่ประมาณไว้ ต้องปรับให้เข้ากับคนจริงในขั้น 4.9
// ============================================================
export const THRESHOLDS = {
  oblongLengthRatio: 1.45, // lengthRatio ตั้งแต่ค่านี้ขึ้นไป = หน้ายาว
  roundLengthRatio: 1.25, // lengthRatio ต่ำกว่าค่านี้ = กลุ่มหน้าสั้น/กว้าง (กลมหรือเหลี่ยม)
  squareJawRatio: 0.85, // jawRatio ตั้งแต่ค่านี้ขึ้นไป = กรามเหลี่ยม
  narrowJawRatio: 0.75, // jawRatio ต่ำกว่าค่านี้ = คางเรียว
  wideForeheadRatio: 0.85, // foreheadRatio ตั้งแต่ค่านี้ขึ้นไป = หน้าผากกว้าง (หัวใจ)

  // เกณฑ์เตือนคุณภาพรูป
  maxTurnImbalance: 0.12, // หันหน้าเกินนี้ให้เตือน
  maxTiltDegrees: 8, // ศีรษะเอียงเกินกี่องศาให้เตือน
  minFaceHeight: 0.3, // หน้าสูงน้อยกว่า 30% ของรูป = ไกลเกินไป
  maxFaceHeight: 0.75, // หน้าสูงมากกว่า 75% ของรูป = ใกล้เกินไป
  maxCenterOffset: 0.12, // หน้าห่างจากกึ่งกลางรูปเกินนี้ให้เตือน
};

// เลขประจำตัวของจุดบนใบหน้าที่เราใช้ (มาตรฐานของ MediaPipe Face Mesh)
const LM = {
  foreheadTop: 10, // กลางหน้าผากด้านบน
  chin: 152, // ปลายคาง
  cheekA: 234, // ขอบแก้มด้านหนึ่ง
  cheekB: 454, // ขอบแก้มอีกด้าน
  foreheadA: 103, // ขอบหน้าผากด้านหนึ่ง
  foreheadB: 332, // ขอบหน้าผากอีกด้าน
  jawA: 172, // กรามด้านหนึ่ง
  jawB: 397, // กรามอีกด้าน
  noseTip: 1, // ปลายจมูก
  eyeA: 33, // หางตาด้านหนึ่ง
  eyeB: 263, // หางตาอีกด้าน
} as const;

type Point = { x: number; y: number };

export type Metrics = {
  lengthRatio: number;
  jawRatio: number;
  foreheadRatio: number;
};

export type FaceAnalysis = {
  shape: FaceShape;
  metrics: Metrics;
  warnings: string[];
};

// วัดระยะระหว่าง 2 จุดเป็นพิกเซลจริง
// จุดจาก MediaPipe เป็นสัดส่วน 0-1 ของรูป จึงต้องคูณความกว้าง/สูงของรูปก่อน
// (รูปเราเป็นแนวตั้ง 768x1024 ถ้าไม่คูณ ระยะจะเพี้ยน)
function dist(a: Point, b: Point, w: number, h: number) {
  return Math.hypot((a.x - b.x) * w, (a.y - b.y) * h);
}

function classify(m: Metrics): FaceShape {
  const T = THRESHOLDS;

  // 1) หน้ายาวมาก
  if (m.lengthRatio >= T.oblongLengthRatio) return "oblong";

  // 2) หน้าสั้น/กว้าง: แยกกลมกับเหลี่ยมด้วยความกว้างของกราม
  if (m.lengthRatio < T.roundLengthRatio) {
    return m.jawRatio >= T.squareJawRatio ? "square" : "round";
  }

  // 3) สัดส่วนกลางๆ
  if (m.jawRatio >= T.squareJawRatio) return "square";
  if (m.jawRatio < T.narrowJawRatio) {
    // คางเรียว: ถ้าหน้าผากกว้างคือหัวใจ ถ้าหน้าผากแคบคือเพชร
    return m.foreheadRatio >= T.wideForeheadRatio ? "heart" : "diamond";
  }
  return "oval";
}

// ตรวจว่ารูปถ่ายดีพอไหม
function checkPose(lm: Point[], w: number, h: number): string[] {
  const T = THRESHOLDS;
  const warnings: string[] = [];

  // หันหน้า: เทียบระยะจากปลายจมูกไปขอบแก้มสองข้าง ถ้าหน้าตรงจะเท่ากัน
  const toA = dist(lm[LM.noseTip], lm[LM.cheekA], w, h);
  const toB = dist(lm[LM.noseTip], lm[LM.cheekB], w, h);
  const turn = Math.abs(toA - toB) / (toA + toB);
  if (turn > T.maxTurnImbalance) {
    warnings.push("ใบหน้าหันไปด้านข้างเล็กน้อย ควรมองตรงเข้ากล้อง");
  }

  // เอียงศีรษะ: วัดมุมของเส้นที่ลากผ่านหางตาสองข้าง
  const a = lm[LM.eyeA];
  const b = lm[LM.eyeB];
  let tilt = Math.abs(
    (Math.atan2((b.y - a.y) * h, (b.x - a.x) * w) * 180) / Math.PI
  );
  if (tilt > 90) tilt = 180 - tilt; // รูปกลับซ้ายขวา มุมอาจได้ค่าใกล้ 180
  if (tilt > T.maxTiltDegrees) {
    warnings.push("ศีรษะเอียง ควรตั้งศีรษะให้ตรง");
  }

  // ขนาดหน้าเทียบกับรูป
  const faceHeight = lm[LM.chin].y - lm[LM.foreheadTop].y;
  if (faceHeight < T.minFaceHeight) {
    warnings.push("หน้าอยู่ไกลกล้องเกินไป ควรขยับเข้าใกล้อีกนิด");
  } else if (faceHeight > T.maxFaceHeight) {
    warnings.push("หน้าอยู่ใกล้กล้องเกินไป ควรถอยห่างอีกนิด");
  }

  // ตำแหน่งกึ่งกลาง
  if (Math.abs(lm[LM.noseTip].x - 0.5) > T.maxCenterOffset) {
    warnings.push("ใบหน้าไม่อยู่กลางภาพ ควรวางให้อยู่กลางกรอบ");
  }

  return warnings;
}

export function analyzeFace(lm: Point[], w: number, h: number): FaceAnalysis {
  const d = (a: number, b: number) => dist(lm[a], lm[b], w, h);

  const faceLength = d(LM.foreheadTop, LM.chin);
  const cheekWidth = d(LM.cheekA, LM.cheekB);
  const jawWidth = d(LM.jawA, LM.jawB);
  const foreheadWidth = d(LM.foreheadA, LM.foreheadB);

  const metrics: Metrics = {
    lengthRatio: faceLength / cheekWidth,
    jawRatio: jawWidth / cheekWidth,
    foreheadRatio: foreheadWidth / cheekWidth,
  };

  return {
    shape: classify(metrics),
    metrics,
    warnings: checkPose(lm, w, h),
  };
}