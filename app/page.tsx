import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import Barbers from "@/components/home/Barbers";
import Standards from "@/components/home/Standards";
import Reviews from "@/components/home/Reviews";
import About from "@/components/home/About";
import AiBanner from "@/components/home/AiBanner";
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. SERVICES SECTION */}
      <Services />

      {/* 3. BARBERS SECTION */}
      <Barbers />

      {/* 4. STANDARDS SECTION (Full-width image band with 12px page gutter) */}
      <Standards />

      {/* 5. REVIEWS SECTION */}
      <Reviews />

      {/* 6. ABOUT / HOURS / WHY-US EDITORIAL SECTION */}
      <About />

      {/* 7. AI BANNER */}
      <AiBanner />

      {/* 8. CONTACT SECTION */}
      <Contact />
    </div>
  );
}
