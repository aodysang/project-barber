/**
 * Target Hairstyle Reference Library
 * Maps the 6 Asian hairstyles (from Step 2) to reference image URLs and fallback assets.
 * Users can update the referenceImageUrl with actual shop photo models.
 */

export interface TargetHairstyle {
  id: string;
  name: string;
  referenceImageUrl: string;
  localFallbackPath: string;
  desc: string;
  price: string;
}

export const TARGET_HAIRSTYLES: Record<string, TargetHairstyle> = {
  "แสกกลางสไตล์เกาหลี (Curtain Hair)": {
    id: "curtain-hair",
    name: "แสกกลางสไตล์เกาหลี (Curtain Hair)",
    referenceImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    localFallbackPath: "public/hairstyles/two-block.jpg",
    desc: "เปิดหน้าผากสร้างกรอบหน้าละมุน สไตล์โอปป้าเกาหลีสุดฮิต",
    price: "฿280 / 40 นาที",
  },
  "แสกข้าง 6:4 (Side Part)": {
    id: "side-part",
    name: "แสกข้าง 6:4 (Side Part)",
    referenceImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
    localFallbackPath: "public/hairstyles/quiff.jpg",
    desc: "แสกข้างรับแนวกราม เพิ่มมิติและความสุขุม เรียบหรูดูดี",
    price: "฿270 / 35 นาที",
  },
  "หน้าม้าเท็กซ์เจอร์ (Textured Fringe)": {
    id: "textured-fringe",
    name: "หน้าม้าเท็กซ์เจอร์ (Textured Fringe)",
    referenceImageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop",
    localFallbackPath: "public/hairstyles/two-block.jpg",
    desc: "เพิ่มวอลลุ่มผมด้านบนด้วยเลเยอร์มีมิติ ดูเด็กลงและสดใส",
    price: "฿280 / 40 นาที",
  },
  "ผมยาวปัดข้าง (Long Flow)": {
    id: "long-flow",
    name: "ผมยาวปัดข้าง (Long Flow)",
    referenceImageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
    localFallbackPath: "public/hairstyles/pompadour.jpg",
    desc: "ปล่อยปลายผมพลิ้วไหวอย่างเป็นธรรมชาติ สไตล์เซอร์แต่สะอาดตา",
    price: "฿300 / 45 นาที",
  },
  "รองทรงต่ำ + Volume ด้านบน": {
    id: "low-fade-volume",
    name: "รองทรงต่ำ + Volume ด้านบน",
    referenceImageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
    localFallbackPath: "public/hairstyles/undercut.jpg",
    desc: "ไล่ระดับช่วงล่างสะอาดเรียบร้อย ยกโคนด้านบนเพิ่มความหนา",
    price: "฿250 / 30 นาที",
  },
  "หน้าม้าปัดเกาหลี (Soft Fringe)": {
    id: "soft-fringe",
    name: "หน้าม้าปัดเกาหลี (Soft Fringe)",
    referenceImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
    localFallbackPath: "public/hairstyles/crew-cut.jpg",
    desc: "หน้าม้าบางปัดข้างเบาๆ สุภาพ ละมุน เซ็ตง่ายในชีวิตประจำวัน",
    price: "฿260 / 35 นาที",
  },
};

export function getTargetHairstyle(styleName?: string | null): TargetHairstyle {
  if (!styleName) {
    return TARGET_HAIRSTYLES["แสกกลางสไตล์เกาหลี (Curtain Hair)"];
  }

  // Exact match
  if (TARGET_HAIRSTYLES[styleName]) {
    return TARGET_HAIRSTYLES[styleName];
  }

  // Partial match
  const normalized = styleName.toLowerCase();
  for (const [key, value] of Object.entries(TARGET_HAIRSTYLES)) {
    if (
      key.toLowerCase().includes(normalized) ||
      normalized.includes(key.toLowerCase()) ||
      value.id.toLowerCase().includes(normalized) ||
      normalized.includes(value.id.toLowerCase())
    ) {
      return value;
    }
  }

  // Default to first style
  return TARGET_HAIRSTYLES["แสกกลางสไตล์เกาหลี (Curtain Hair)"];
}
