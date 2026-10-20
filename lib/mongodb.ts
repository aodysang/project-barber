import { MongoClient } from "mongodb";

const globalForMongo = global as unknown as { mongoClientPromise?: Promise<MongoClient> };

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("ไม่พบ MONGODB_URI ใน .env.local");

  if (process.env.NODE_ENV === "development") {
    if (!globalForMongo.mongoClientPromise) {
      const client = new MongoClient(uri);
      globalForMongo.mongoClientPromise = client.connect();
    }
    return globalForMongo.mongoClientPromise;
  } else {
    if (!globalForMongo.mongoClientPromise) {
      const client = new MongoClient(uri);
      globalForMongo.mongoClientPromise = client.connect();
    }
    return globalForMongo.mongoClientPromise;
  }
}

// เรียกใช้ฟังก์ชันนี้จากที่อื่นในโปรเจกต์ เพื่อเอาฐานข้อมูลไปใช้งาน
export async function getDb() {
  const dbName = process.env.MONGODB_DB;
  if (!dbName) throw new Error("ไม่พบ MONGODB_DB ใน .env.local");
  const client = await getClientPromise();
  return client.db(dbName);
}