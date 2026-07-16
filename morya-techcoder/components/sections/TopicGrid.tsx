import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, CATEGORY_KEYS, categoryHref } from "@/lib/categories";
import { categoryIcon } from "@/lib/category-icons";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * On-page content discovery: a reusable grid of every topic TechCoder covers.
 * Each card uses the shared per-category color token, so the treatment stays
 * consistent with badges elsewhere. Topics flagged `comingSoon` render as a
 * calm, non-clickable "coming soon" state instead of a dead link.
 */
export default function TopicGrid() {
  return (
    <section id="topics" className="section-padding relative scroll-mt-24">
      <div className="container-wide mx-auto">
        <SectionHeading
          eyebrow="Explore by topic"
          title={
            <>
              Everything tech, <span className="text-gradient">worth understanding</span>
            </>
          }
          description="From code and AI to the gadgets on your desk — pick a topic and start exploring."
          className="mb-14"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {CATEGORY_KEYS.map((key, i) => {
            const meta = CATEGORIES[key];
            const Icon = categoryIcon(key);

            const inner = (
              <>
                <div className="flex items-center justify-between">
                  <span
                    className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-tc-bg-elevated ${meta.accent} transition-colors duration-300 group-hover:bg-tc-primary/10`}
                  >
                    <Icon size={22} />
                  </span>
                  {meta.comingSoon ? (
                    <span className="chip py-1 px-3 text-[11px] text-tc-text-light">
                      Coming soon
                    </span>
                  ) : (
                    <ArrowRight
                      size={18}
                      className="text-tc-text-light opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-tc-primary"
                    />
                  )}
                </div>
                <h3 className="heading-sm text-[17px] mt-6">{meta.label}</h3>
                <p className="body-sm mt-2">{meta.description}</p>
              </>
            );

            const base =
              "relative h-full flex flex-col rounded-[22px] card-surface p-6 sm:p-7";

            return (
              <Reveal key={key} delay={0.05 * i}>
                <Link
                  href={categoryHref(key)}
                  className={`${base} hover-lift group focus-ring ${meta.comingSoon ? "opacity-70" : ""}`}
                >
                  {inner}
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
