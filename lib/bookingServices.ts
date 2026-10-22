// Service type
export interface ServiceItem {
  id: string;
  name: string;
  enName: string;
  price: number;
  duration: number;
  image: string;
}

// Add-on type
export interface AddOnItem {
  id: string;
  nameTh: string;
  enName: string;
  price: number;
  durationMin: number;
}

// Services used in booking flow
export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "haircut-adult",
    name: "ตัดผมผู้ใหญ่",
    enName: "Haircut",
    price: 250,
    duration: 30,
    image: "/images/service-haircut.jpg",
  },
  {
    id: "haircut-shave",
    name: "ตัดผม + โกนหนวด",
    enName: "Haircut + Shave",
    price: 400,
    duration: 45,
    image: "/images/service-shave.jpg",
  },
  {
    id: "wash-blow",
    name: "สระ + ไดร์",
    enName: "Wash & Blow",
    price: 150,
    duration: 30,
    image: "/images/service-wash.jpg",
  },
  {
    id: "perm",
    name: "ดัดผม",
    enName: "Perm",
    price: 1200,
    duration: 90,
    image: "/images/service-haircut.jpg",
  },
  {
    id: "dye",
    name: "ทำสีผม",
    enName: "Hair Color",
    price: 800,
    duration: 60,
    image: "/images/service-kid.jpg",
  },
];

export const SERVICE_DESCRIPTIONS: Record<string, string> = {
  "haircut-adult": "ตัดผมทรงมาตรฐาน เหมาะสำหรับทุกสไตล์",
  "haircut-shave": "ตัดผมพร้อมโกนหนวด ดูแลผิวหน้าอย่างพิถีพิถัน",
  "wash-blow": "สระผมด้วยผลิตภัณฑ์คุณภาพ พร้อมไดร์จัดทรง",
  "perm": "เพิ่มวอลลุ่มและจัดทรงง่าย ดูเป็นธรรมชาติ",
  "dye": "เลือกเฉดสีที่เหมาะกับคุณ พร้อมดูแลเส้นผม",
};

export const SERVICE_CATEGORIES = [
  "ทั้งหมด",
  "ตัดผม",
  "โกนหนวด",
  "สระผม",
  "ดูแลเส้นผม",
  "ทรีตเมนต์",
  "อื่นๆ",
];

export const SERVICE_CATEGORY_MAP: Record<string, string[]> = {
  "haircut-adult": ["ตัดผม"],
  "haircut-shave": ["ตัดผม", "โกนหนวด"],
  "wash-blow": ["สระผม", "ดูแลเส้นผม"],
  "perm": ["ดูแลเส้นผม", "ทรีตเมนต์"],
  "dye": ["ดูแลเส้นผม", "อื่นๆ"],
};

// Configurable Add-ons mapped by primary service ID
export const SERVICE_ADDONS_CONFIG: Record<string, AddOnItem[]> = {
  "haircut-adult": [
    {
      id: "wash",
      nameTh: "สระผม",
      enName: "Hair Wash",
      price: 50,
      durationMin: 15,
    },
  ],
  "haircut-shave": [
    {
      id: "wash",
      nameTh: "สระผม",
      enName: "Hair Wash",
      price: 50,
      durationMin: 15,
    },
  ],
};
