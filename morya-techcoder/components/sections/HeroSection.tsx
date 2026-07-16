"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Compass, Star, TrendingUp } from "lucide-react";
import CategoryBadge from "@/components/ui/CategoryBadge";
import { CATEGORIES } from "@/lib/categories";
import { categoryIcon } from "@/lib/category-icons";

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

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 18 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section className="relative overflow-hidden pt-36 md:pt-44 pb-20 md:pb-28 px-4 sm:px-6">
      {/* Ambient mesh */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] mesh-glow opacity-80 blur-[40px]" />
        <div
          className="absolute inset-x-0 top-0 h-[520px] dot-overlay opacity-70"
          style={{
            maskImage: "radial-gradient(ellipse 60% 70% at 50% 30%, #000 20%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 60% 70% at 50% 30%, #000 20%, transparent 75%)",
          }}
        />
      </div>

      <div className="container-wide mx-auto flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link href="/blog" className="chip group hover:border-tc-primary transition-colors">
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-tc-primary text-white">
              <Sparkles size={9} className="fill-current" />
            </span>
            Trustworthy tech insights, every week
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="display-xl mt-7 max-w-4xl"
        >
          Discover the technology
          <br className="hidden sm:block" /> that&apos;s{" "}
          <span className="text-gradient-animated">worth knowing.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-2xl text-base sm:text-lg text-tc-text-muted leading-relaxed"
        >
          From breakthrough AI and honest gadget reviews to deep programming guides —
          TechCoder is where curious minds find clear, trustworthy takes on the technology
          that actually matters.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 flex flex-col sm:flex-row items-center gap-3.5"
        >
          <Link href="/blog" className="btn-primary focus-ring group px-7 py-3.5 text-[15px]">
            Start exploring
            <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link href="/#topics" className="btn-secondary focus-ring px-7 py-3.5 text-[15px]">
            <Compass size={15} />
            Browse topics
          </Link>
        </motion.div>
      </div>

      {/* Editorial preview */}
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
        style={{ perspective: 1400 }}
        className="container-wide mx-auto mt-16 md:mt-20 relative max-w-3xl"
      >
        <motion.div
          style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
          className="relative rounded-[26px] card-surface shadow-premium p-2.5 sm:p-3"
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
                <div className="relative h-40 sm:h-full min-h-[168px] bg-gradient-to-br from-tc-primary via-tc-secondary to-tc-primary-light">
                  <div className="absolute inset-0 dot-overlay opacity-20" />
                  <CategoryBadge
                    category={previewFeature.category}
                    className="absolute top-3 left-3 !bg-white/90 !text-tc-primary-dark !border-transparent shadow-sm"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/55 to-transparent">
                    <p className="font-heading font-bold text-sm sm:text-[15px] leading-snug text-white line-clamp-2">
                      {previewFeature.title}
                    </p>
                    <p className="mt-1.5 text-[11px] text-white/75">{previewFeature.meta}</p>
                  </div>
                </div>
              </div>

              {/* Story list */}
              <div className="flex flex-col gap-3">
                {previewList.map((item) => {
                  const Icon = categoryIcon(item.category);
                  return (
                    <div
                      key={item.title}
                      className="flex items-center gap-3 rounded-xl border border-tc-border bg-tc-bg-card/60 p-2.5"
                    >
                      <span
                        className={`flex items-center justify-center shrink-0 w-11 h-11 rounded-lg bg-tc-bg-elevated ${CATEGORIES[item.category].accent}`}
                      >
                        <Icon size={18} />
                      </span>
                      <div className="min-w-0">
                        <CategoryBadge category={item.category} className="!px-2 !py-0.5 !text-[9px]" />
                        <p className="mt-1 font-heading font-semibold text-[12.5px] leading-tight text-tc-text line-clamp-1">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="hidden md:flex absolute -left-6 lg:-left-12 top-20 items-center gap-2.5 px-4 py-3 rounded-2xl glass-strong animate-float"
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-tc-primary to-tc-secondary text-white">
            <Compass size={16} />
          </span>
          <div className="text-left">
            <p className="text-[11px] text-tc-text-light">Topics to explore</p>
            <p className="heading-sm text-sm">6 and growing</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.05 }}
          className="hidden md:flex absolute -right-6 lg:-right-12 bottom-14 items-center gap-2.5 px-4 py-3 rounded-2xl glass-strong animate-float-delay"
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-tc-primary/12 text-tc-primary">
            <Star size={16} className="fill-current" />
          </span>
          <div className="text-left">
            <p className="text-[11px] text-tc-text-light">Reviews</p>
            <p className="heading-sm text-sm">Hands-on & unbiased</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="hidden lg:flex absolute -right-8 top-8 items-center gap-2 px-3.5 py-2.5 rounded-2xl glass-strong animate-float-delay-2"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-tc-primary/12 text-tc-primary">
            <TrendingUp size={15} />
          </span>
          <div className="text-left">
            <p className="text-[10px] text-tc-text-light">Fresh every</p>
            <p className="heading-sm text-[13px]">Week</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
