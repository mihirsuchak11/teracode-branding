import { Hero } from "@/components/sections/Hero";
import { LogoTicker } from "@/components/sections/LogoTicker";
import { Statement } from "@/components/sections/Statement";
import { ProductSpotlights } from "@/components/sections/ProductSpotlight";
import { ProductLineup } from "@/components/sections/ProductLineup";
import { StackSection } from "@/components/sections/StackSection";
import { Testimonial } from "@/components/sections/Testimonial";
import { StatsBand } from "@/components/sections/StatsBand";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { statsSection } from "@/content/home";
import { faq } from "@/content/faq";
import { faqJsonLd } from "@/lib/jsonLd";
import { JsonLd } from "@/components/seo/JsonLd";

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faq)} />
      <Hero />
      <LogoTicker />
      <Statement />
      <ProductSpotlights />
      <ProductLineup />
      <StackSection />
      <Testimonial />
      <StatsBand
        titleMuted={statsSection.titleMuted}
        title={statsSection.title}
        stats={statsSection.stats}
        icons={["/lottie/stat-1.json", "/lottie/stat-2.json", "/lottie/stat-3.json", "/lottie/stat-4.json"]}
      />
      <FaqSection items={faq} />
      <CtaBand />
    </>
  );
}
