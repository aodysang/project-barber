export const hairstyles = [
  {
    id: "undercut",
    name: "อันเดอร์คัต",
    price: 250,
    duration: 30,
    suitableFaceShapes: ["oval", "square"],
    description: "โกนข้างสั้น ด้านบนปล่อยยาว ดูเท่ทันสมัย",
    aiPrompt:
      "an undercut: sides shaved very short, top left long and swept back",
    referenceImage: "/hairstyles/undercut.jpg",
  },

  {
    id: "two-block",
    name: "ทูบล็อก",
    price: 280,
    duration: 40,
    suitableFaceShapes: ["oval", "heart", "round"],
    description: "สไตล์เกาหลี ด้านบนหนา ด้านข้างสั้นกระชับ",
    aiPrompt:
      "a Korean two-block cut: thick textured hair on top with a fringe, short tapered sides",
    referenceImage: "/hairstyles/two-block.jpg",
  },

  {
    id: "buzz-cut",
    name: "ทรงหัวเกรียน",
    price: 150,
    duration: 20,
    suitableFaceShapes: ["oval", "square", "diamond"],
    description: "สั้นทั้งศีรษะ ดูแลง่าย เหมาะกับสายลุย",
    aiPrompt:
      "a buzz cut: hair clipped very short and even all over the head",
    referenceImage: "/hairstyles/buzz-cut.jpg",
  },

  {
    id: "pompadour",
    name: "ปอมปาดัวร์",
    price: 300,
    duration: 45,
    suitableFaceShapes: ["oval", "oblong"],
    description: "ยกโปงด้านหน้า ดูหรูหรามีสไตล์",
    aiPrompt:
      "a pompadour: hair swept up and back with high volume at the front, short sides",
    referenceImage: "/hairstyles/pompadour.jpg",
  },

  {
    id: "crew-cut",
    name: "ครูว์คัต",
    price: 200,
    duration: 25,
    suitableFaceShapes: ["round", "square", "heart"],
    description: "สั้นเรียบร้อย เหมาะกับการทำงาน",
    aiPrompt:
      "a crew cut: short neat hair, slightly longer on top, tapered short sides",
    referenceImage: "/hairstyles/crew-cut.jpg",
  },

  {
    id: "quiff",
    name: "ควิฟ",
    price: 270,
    duration: 35,
    suitableFaceShapes: ["oval", "round", "diamond"],
    description: "ปัดขึ้นด้านหน้า ดูเท่แบบไม่จัดจ้านเกินไป",
    aiPrompt:
      "a quiff: hair brushed upward and slightly back at the front, medium-short sides",
    referenceImage: "/hairstyles/quiff.jpg",
  },
];