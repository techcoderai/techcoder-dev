import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Compass, Star, TrendingUp } from "lucide-react";
import CategoryBadge from "@/components/ui/CategoryBadge";
import { CATEGORIES } from "@/lib/categories";
import { categoryIcon } from "@/lib/category-icons";
import TiltSurface from "@/components/ui/TiltSurface";

/* Representative headlines for the editorial preview — decorative, not live data. */
const previewFeature = {
  category: "AI" as const,
  title: "The AI models quietly reshaping how we work",
  meta: "6 min read",
};

const previewList = [
  { category: "Reviews" as const, title: "Our honest verdict on this year's flagship phones", meta: "8 min read" },
  { category: "Technology" as const, title: "The quiet rise of on-device computing", meta: "5 min read" },
  { category: "Programming" as const, title: "Patterns that keep large codebases sane", meta: "7 min read" },
] as const;

const previewItems = previewList.map((item) => ({
  ...item,
  Icon: categoryIcon(item.category),
}));

export default function HeroSection() {
  return (
    <section className="relative px-4 pb-12 pt-24 sm:px-6 sm:pb-20 sm:pt-36 md:pb-28 md:pt-44">
      {/* Ambient mesh — clipped so glow doesn't spill; floats live outside this layer */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 h-[700px] w-[1100px] -translate-x-1/2 mesh-glow opacity-80" />
        <div
          className="absolute inset-x-0 top-0 h-[520px] dot-overlay opacity-50"
          style={{
            maskImage: "radial-gradient(ellipse 60% 70% at 50% 30%, #000 20%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 60% 70% at 50% 30%, #000 20%, transparent 75%)",
          }}
        />
      </div>

      <div className="container-wide mx-auto flex flex-col items-center text-center">
        {/* Badge */}
        <div className="hero-enter-fade" style={{ animationDelay: "80ms" }}>
          <Link href="/blog" className="chip hero-badge focus-ring group">
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-tc-primary text-white">
              <Sparkles size={9} className="fill-current" />
            </span>
            <span className="relative">Trustworthy tech insights, every week</span>
            <ArrowRight size={12} className="icon-nudge" />
          </Link>
        </div>

        {/* Headline — no enter animation: this is the LCP element */}
        <h1 className="display-xl mt-5 max-w-4xl sm:mt-7">
          Discover the technology
          <br className="hidden sm:block" /> that&apos;s{" "}
          <span className="text-gradient">worth knowing.</span>
        </h1>

        {/* Subtitle */}
        <p
          className="hero-enter mt-4 max-w-2xl text-[17px] leading-relaxed text-tc-text-muted sm:mt-6 sm:text-lg"
          style={{ animationDelay: "240ms" }}
        >
          From breakthrough AI and honest gadget reviews to deep programming guides —
          TechCoder is where curious minds find clear, trustworthy takes on the technology
          that actually matters.
        </p>

        {/* CTAs */}
        <div
          className="hero-enter mt-6 flex w-full flex-col items-stretch gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:items-center"
          style={{ animationDelay: "320ms" }}
        >
          <Link href="/blog" className="btn-primary focus-ring group w-full sm:w-auto justify-center px-7 py-3.5 text-[15px]">
            Start exploring
            <ArrowRight size={17} className="icon-nudge" />
          </Link>
          <Link href="/#topics" className="btn-secondary focus-ring group w-full sm:w-auto justify-center px-7 py-3.5 text-[15px]">
            <Compass size={15} className="icon-lift" />
            Browse topics
          </Link>
        </div>
      </div>

      {/* Editorial preview */}
      <div
        aria-hidden="true"
        style={{ perspective: 1400, animationDelay: "400ms" }}
        className="hero-browser-enter container-wide relative mx-auto mt-10 w-[calc(100%-1rem)] max-w-5xl sm:mt-16 sm:w-full md:mt-20"
      >
        <div className="hero-browser-glow" aria-hidden="true" />
        <TiltSurface
          className="hero-browser-float"
          surfaceClassName="relative rounded-[26px] card-surface shadow-premium p-2.5 sm:p-3"
        >
            <div className="rounded-[18px] overflow-hidden border border-tc-border bg-tc-bg-secondary">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 h-11 border-b border-tc-border bg-tc-surface/60">
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                <span className="mx-auto flex items-center gap-1.5 rounded-md bg-tc-bg-elevated px-3 py-1 text-[11px] font-medium text-tc-text-light">
                  techcoder.tech
                </span>
              </div>

              {/* Magazine layout */}
              <div className="p-4 sm:p-5 grid gap-4 sm:grid-cols-[1.35fr_1fr]">
              {/* Featured story */}
              <div className="relative overflow-hidden rounded-2xl border border-tc-border">
                <div className="relative h-40 sm:h-full min-h-[168px] bg-tc-bg-elevated">
                  <Image
                    src="/hero_preview.svg"
                    alt=""
                    fill
                    className="object-cover object-[center_20%]"
                    sizes="(max-width: 768px) 90vw, 420px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <CategoryBadge
                    category={previewFeature.category}
                    className="absolute top-3 left-3 !bg-white/90 !text-tc-primary-dark !border-transparent shadow-sm"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="font-heading font-bold text-sm sm:text-[15px] leading-snug text-white line-clamp-2">
                      {previewFeature.title}
                    </p>
                    <p className="mt-1.5 text-[11px] text-white/75">{previewFeature.meta}</p>
                  </div>
                </div>
              </div>

              {/* Story list */}
              <div className="flex flex-col gap-3">
                {previewItems.map((item) => (
                    <div
                      key={item.title}
                      className="flex items-center gap-3 rounded-xl border border-tc-border bg-tc-bg-card/60 p-2.5"
                    >
                      <span
                        className={`flex items-center justify-center shrink-0 w-11 h-11 rounded-lg bg-tc-bg-elevated ${CATEGORIES[item.category].accent}`}
                      >
                        <item.Icon size={18} />
                      </span>
                      <div className="min-w-0">
                        <CategoryBadge category={item.category} className="!px-2 !py-0.5 !text-[9px]" />
                        <p className="mt-1 font-heading font-semibold text-[12.5px] leading-tight text-tc-text line-clamp-1">
                          {item.title}
                        </p>
                      </div>
                    </div>
                ))}
              </div>
              </div>
            </div>
        </TiltSurface>

        {/* Floating cards — z-10 so they sit above .hero-browser-float (z-1) */}
        <div
          className="pointer-events-none hidden md:flex absolute z-10 -left-6 lg:-left-12 top-20 items-center gap-2.5 px-4 py-3 rounded-2xl glass-strong animate-float whitespace-nowrap"
        >
          <span className="flex shrink-0 items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-tc-primary to-tc-secondary text-white">
            <Compass size={16} />
          </span>
          <div className="text-left">
            <p className="text-[11px] text-tc-text-light">Topics to explore</p>
            <p className="heading-sm text-sm">6 and growing</p>
          </div>
        </div>

        <div
          className="pointer-events-none hidden md:flex absolute z-10 -right-6 lg:-right-12 bottom-14 items-center gap-2.5 px-4 py-3 rounded-2xl glass-strong animate-float-delay whitespace-nowrap"
        >
          <span className="flex shrink-0 items-center justify-center w-9 h-9 rounded-xl bg-tc-primary/12 text-tc-primary">
            <Star size={16} className="fill-current" />
          </span>
          <div className="text-left">
            <p className="text-[11px] text-tc-text-light">Reviews</p>
            <p className="heading-sm text-sm">Hands-on & unbiased</p>
          </div>
        </div>

        <div
          className="pointer-events-none hidden lg:flex absolute z-10 -right-8 top-8 items-center gap-2 px-3.5 py-2.5 rounded-2xl glass-strong animate-float-delay-2 whitespace-nowrap"
        >
          <span className="flex shrink-0 items-center justify-center w-8 h-8 rounded-lg bg-tc-primary/12 text-tc-primary">
            <TrendingUp size={15} />
          </span>
          <div className="text-left">
            <p className="text-[10px] text-tc-text-light">Fresh every</p>
            <p className="heading-sm text-[13px]">Week</p>
          </div>
        </div>
      </div>
    </section>
  );
}
