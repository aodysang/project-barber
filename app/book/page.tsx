import { Suspense } from "react";
import BookingFlow from "@/components/BookingFlow";

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F1EC] flex items-center justify-center text-[#6B6B66] font-thai-looped">
          กำลังโหลด...
        </div>
      }
    >
      <BookingFlow />
    </Suspense>
  );
}