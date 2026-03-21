import HeroSection from "@/components/sections/HeroSection";
import HomeContent from "@/components/sections/HomeContent";
import NewsletterBox from "@/components/ui/NewsletterBox";

export default function Home() {
  return (
    <>
      <HeroSection />
      <HomeContent />

      <section className="section-padding pt-0">
        <div className="container-wide mx-auto">
          <NewsletterBox />
        </div>
      </section>
    </>
  );
}
