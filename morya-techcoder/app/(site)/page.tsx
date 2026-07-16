import HeroSection from "@/components/sections/HeroSection";
import TrustedBy from "@/components/sections/TrustedBy";
import TopicGrid from "@/components/sections/TopicGrid";
import HomeContent from "@/components/sections/HomeContent";
import Capabilities from "@/components/sections/Capabilities";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import NewsletterBox from "@/components/ui/NewsletterBox";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustedBy />
      {/* Discovery first: browse every topic, then dive into the latest articles. */}
      <TopicGrid />
      <HomeContent />
      <Capabilities />
      <Testimonials />

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
