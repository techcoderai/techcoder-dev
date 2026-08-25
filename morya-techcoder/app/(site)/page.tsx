import type { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import TrustedBy from "@/components/sections/TrustedBy";
import TopicGrid from "@/components/sections/TopicGrid";
import HomeContent from "@/components/sections/HomeContent";
import Capabilities from "@/components/sections/Capabilities";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import NewsletterBox from "@/components/ui/NewsletterBox";
import { isFeatureEnabled } from "@/lib/featureFlags";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TechCoder",
  url: "https://techcoder.tech",
  description:
    "A premium technology publication covering programming, AI, technology, and gadgets.",
  publisher: {
    "@type": "Organization",
    name: "TechCoder",
    url: "https://techcoder.tech",
    logo: "https://techcoder.tech/icon.png",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HeroSection />
      <TrustedBy />
      {/* Discovery first: browse every topic, then dive into the latest articles. */}
      <TopicGrid />
      <HomeContent />
      <div className="render-deferred">
        <Capabilities />
      </div>
      <section className="render-deferred section-padding pt-0">
        <div className="container-wide mx-auto">
          <NewsletterBox />
        </div>
      </section>

      {isFeatureEnabled("showFAQ") && <FAQ />}
      <div className="render-deferred">
        <FinalCTA />
      </div>
    </>
  );
}
