import HeroSection from "@/components/sections/HeroSection";
import TrustedBy from "@/components/sections/TrustedBy";
import Capabilities from "@/components/sections/Capabilities";
import ProductShowcase from "@/components/sections/ProductShowcase";
import HomeContent from "@/components/sections/HomeContent";
import LearningPaths from "@/components/sections/LearningPaths";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import NewsletterBox from "@/components/ui/NewsletterBox";
import { postSummaries } from "@/content/loader";

export default function Home() {
  return (
    <>
      <HeroSection postCount={postSummaries.length} />
      <TrustedBy />
      <Capabilities />
      <ProductShowcase />
      <HomeContent />
      <LearningPaths />

      <section className="section-padding pt-0">
        <div className="container-wide mx-auto">
          <NewsletterBox />
        </div>
      </section>

      <FAQ />
      <FinalCTA />
    </>
  );
}
