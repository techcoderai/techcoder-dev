import Link from "next/link";
import { ArrowRight, Zap, BookOpen, Lightbulb, Code2 } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] md:min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* ── Background layers ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial warm glow — centered behind headline */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] rounded-full bg-tc-primary opacity-[0.045] blur-[140px]" />
        {/* Secondary soft glow — offset for depth */}
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-tc-primary-light opacity-[0.035] blur-[100px]" />
        {/* Fine dot grid that fades toward edges */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, var(--tc-text-light) 0.5px, transparent 0.5px)",
            backgroundSize: "24px 24px",
            maskImage: "radial-gradient(ellipse 60% 50% at 50% 40%, black 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 40%, black 30%, transparent 80%)",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="container-wide mx-auto relative z-10 flex flex-col items-center text-center px-4 sm:px-6 md:px-8 pt-24 md:pt-28 pb-16 md:pb-20">
        {/* Badge */}
        <div className="animate-fade-up mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 overline text-tc-primary-dark bg-white border border-gray-200 rounded-full shadow-sm">
            <Zap size={13} className="fill-current" />
            Developer-first content
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up animate-delay-1 heading-xl text-[2.75rem] sm:text-5xl md:text-6xl lg:text-[4.75rem] max-w-3xl mb-7 leading-[1.05]">
          Code Smarter.
          <br />
          <span className="text-tc-primary">Ship Faster.</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-up animate-delay-2 text-base sm:text-lg md:text-xl text-tc-text-muted max-w-xl mb-12 leading-relaxed">
          Your curated feed of{" "}
          <strong className="text-tc-text font-semibold">AI breakthroughs</strong>,
          web development deep dives, and the developer tricks that actually save time.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up animate-delay-3 flex flex-col sm:flex-row gap-4">
          <Link
            href="/blog"
            className="group btn-primary focus-ring justify-center px-8 py-4 text-[15px] shadow-md"
          >
            Explore Articles
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
          <Link
            href="/blog?category=AI"
            className="btn-secondary focus-ring justify-center px-8 py-4 text-[15px]"
          >
            <Code2 size={16} />
            AI &amp; ML Trends
          </Link>
        </div>

        {/* Stats strip */}
        <div className="animate-fade-up animate-delay-5 mt-20 w-full max-w-xl">
          <div className="flex items-center justify-center gap-8 sm:gap-12 md:gap-16 px-6 py-5 bg-white border border-gray-200 rounded-2xl shadow-md">
            {[
              { icon: BookOpen, value: "50+", label: "Articles", floatClass: "animate-float" },
              { icon: Lightbulb, value: "Daily", label: "New Tricks", floatClass: "animate-float-delay" },
              { icon: Zap, value: "3", label: "Categories", floatClass: "animate-float-delay-2" },
            ].map(({ icon: Icon, value, label, floatClass }) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`${floatClass} flex items-center justify-center w-10 h-10 rounded-xl bg-tc-primary/[0.08] text-tc-primary`}>
                  <Icon size={19} strokeWidth={2} />
                </div>
                <div className="text-left">
                  <p className="heading-md text-lg leading-tight">{value}</p>
                  <p className="text-[11px] text-tc-text-light font-medium">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
