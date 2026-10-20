import { hairstyles } from "@/data/hairstyles";

export default function HairstylesPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        ทรงผมทั้งหมดของร้าน
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {hairstyles.map((style) => (
          <div
            key={style.id}
            className="border rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">{style.name}</h2>
            <p className="text-gray-600 mt-1">{style.description}</p>
            <div className="flex justify-between mt-4 text-sm text-gray-700">
              <span>{style.price} บาท</span>
              <span>{style.duration} นาที</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}