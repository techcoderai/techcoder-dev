import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, CATEGORY_KEYS, categoryHref } from "@/lib/categories";
import { categoryIcon } from "@/lib/category-icons";
import { cn } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";

/**
 * On-page content discovery: a reusable grid of every topic TechCoder covers.
 * Each card uses the shared per-category color token, so the treatment stays
 * consistent with badges elsewhere. Topics flagged `comingSoon` render as a
 * calm, non-clickable "coming soon" state instead of a dead link.
 */
export default function TopicGrid() {
  return (
    <section id="topics" className="section-padding pt-0 relative scroll-mt-24">
      <div className="container-wide mx-auto">
        <Reveal>
          <div className="border-t border-tc-border pt-10 md:pt-14">
            <span className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-tc-text-light">
              <span className="h-px w-6 bg-tc-primary" />
              Explore by topic
            </span>

            <div className="mt-6 grid gap-5 md:grid-cols-12 md:gap-10">
              <h2 className="heading-lg md:col-span-7">
                Everything tech, <span className="text-tc-primary">worth understanding</span>
              </h2>
              <p className="body-base max-w-lg md:col-span-5 md:pt-2">
                From code and AI to the gadgets on your desk — pick a topic and start exploring.
              </p>
            </div>
          </div>
        </Reveal>

        {/*
          Mobile-first: compact, thumb-friendly rows (~96px tall) — icon left,
          label + one-line description right. At sm+ this unfolds into the
          roomier vertical card treatment the desktop layout expects.
        */}
        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 md:mt-16 lg:grid-cols-3 md:gap-6">
          {CATEGORY_KEYS.map((key, i) => {
            const meta = CATEGORIES[key];
            const Icon = categoryIcon(key);

            return (
              <Reveal key={key} delay={0.05 * i}>
                <Link
                  href={categoryHref(key)}
                  className={cn(
                    "press group focus-ring moving-border relative flex h-full min-h-[96px] items-center gap-4 rounded-2xl card-surface p-4",
                    "sm:min-h-0 sm:flex-col sm:items-stretch sm:gap-0 sm:rounded-[22px] sm:p-6 sm:hover-lift",
                    meta.comingSoon && "opacity-70"
                  )}
                >
                  {/* Icon — subtly tilts, scales & warms on hover */}
                  <span
                    className={cn(
                      "flex shrink-0 items-center justify-center rounded-xl bg-tc-bg-elevated group-hover:bg-tc-primary/10 group-hover:rotate-[5deg] group-hover:scale-105",
                      "transition-[transform,background-color] duration-[var(--tc-dur)] ease-[cubic-bezier(0.22,1,0.36,1)]",
                      "h-11 w-11 sm:h-12 sm:w-12 sm:rounded-2xl",
                      meta.accent
                    )}
                  >
                    <Icon className="h-[20px] w-[20px] sm:h-[22px] sm:w-[22px]" />
                  </span>

                  {/* Body */}
                  <div className="min-w-0 flex-1 sm:mt-6 sm:flex-none">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="heading-sm text-[16px] sm:text-[17px]">{meta.label}</h3>
                      {meta.comingSoon ? (
                        <span className="chip shrink-0 px-2.5 py-1 text-[10.5px] text-tc-text-light sm:px-3 sm:text-[11px]">
                          Soon
                        </span>
                      ) : (
                        <ArrowRight
                          size={18}
                          className="shrink-0 text-tc-text-light transition-[color,opacity,transform] duration-[var(--tc-dur)] group-hover:text-tc-primary sm:opacity-0 sm:-translate-x-1 sm:group-hover:opacity-100 sm:group-hover:translate-x-0"
                        />
                      )}
                    </div>
                    <p className="body-sm mt-1 line-clamp-1 text-[12.5px] sm:mt-2 sm:text-sm sm:line-clamp-none">
                      {meta.description}
                    </p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
