import { Suspense } from "react";
import BookingFlow from "@/components/BookingFlow";

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center text-zinc-400">
          กำลังโหลด...
        </div>
      }
    >
      <BookingFlow />
    </Suspense>
  );
}
