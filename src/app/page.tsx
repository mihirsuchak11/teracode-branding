import { Hero } from "@/components/sections/Hero";
import { LogoTicker } from "@/components/sections/LogoTicker";
import { Statement } from "@/components/sections/Statement";
import { FeatureSpotlights } from "@/components/sections/FeatureSpotlight";
import { StackSection } from "@/components/sections/StackSection";
import { Testimonial } from "@/components/sections/Testimonial";
import { StatsBand } from "@/components/sections/StatsBand";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { statsSection } from "@/content/home";
import { faq } from "@/content/faq";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoTicker />
      <Statement />
      <FeatureSpotlights />
      <StackSection />
      <Testimonial />
      <StatsBand
        titleMuted="Your team already has the data."
        title="Strand gives you the answers."
        stats={statsSection.stats}
        icons={["/lottie/stat-1.json", "/lottie/stat-2.json", "/lottie/stat-3.json", "/lottie/stat-4.json"]}
      />
      <FaqSection items={faq} />
      <CtaBand />
    </>
  );
}
