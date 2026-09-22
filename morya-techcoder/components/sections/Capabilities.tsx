import {
  BookOpen,
  Route,
  Code2,
  Network,
  Gauge,
  Feather,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { postSummaries } from "@/content/loader";
import { cn } from "@/lib/utils";

export default function Capabilities() {
  const publishedCount = postSummaries.length;

const items = [
  {
    icon: BookOpen,
    title: "Deep dives, not surface-level takes",
    mobileDesc: "Understand how things work.",
    desc: "Clear, well-researched articles that go beyond the basics to explain how things work, why they matter, and where they fit in the real world.",
  },
  {
    icon: Route,
    title: "Practical guides for builders",
    mobileDesc: "Build with confidence.",
    desc: "Step-by-step guides, tutorials, and workflows designed to help you learn a technology and put it to work in your own projects.",
  },
  {
    icon: Code2,
    title: "Code you can actually use",
    mobileDesc: "Useful code patterns; for developers.",
    desc: "Practical examples, patterns, and snippets that focus on real problems developers face — with enough context to understand what you're using.",
  },
  {
    icon: Network,
    title: "How systems really work",
    mobileDesc: "APIs and architecture.",
    desc: "Explore architecture, APIs, infrastructure, and engineering decisions through practical breakdowns of the systems behind modern software.",
  },
  {
    icon: Gauge,
    title: "Performance, debugging & best practices",
    mobileDesc: "Debug and improve.",
    desc: "Learn how to diagnose problems, improve performance, and make better technical decisions with practical techniques and measurable results.",
  },
  {
    icon: Feather,
    title: "Independent & thoughtfully written",
    mobileDesc: `${publishedCount} articles and counting.`,
    desc: `Every article is researched, written, and edited with a focus on clarity and usefulness. ${publishedCount} articles published and counting.`,
  },
];

  return (
    <section className="section-padding pt-0 relative">
      <div className="container-wide mx-auto">
        <Reveal>
          <div className="border-t border-tc-border pt-10 md:pt-14">
            <span className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-tc-text-light">
              <span className="h-px w-6 bg-tc-primary" />
              What you&apos;ll find at techcoder
            </span>

            <div className="mt-6 grid gap-5 md:grid-cols-12 md:gap-10">
              <h2 className="heading-lg md:col-span-7">
                Everything you need to{" "}
                <span className="text-tc-primary">level up your craft</span>
              </h2>
              <p className="body-base max-w-lg md:col-span-5 md:pt-2">
                Depth over hype. Every piece is written to take you from first principles to
                shipping real, production-grade code.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-1 sm:gap-0 sm:border-t sm:border-b sm:border-tc-border md:mt-16 md:grid-cols-3">
            {items.map((item, i) => {
              const col = i % 3;
              return (
                <div
                  key={item.title}
                  className={cn(
                    "group rounded-2xl card-surface p-4 sm:rounded-none sm:border-0 sm:bg-transparent sm:shadow-none sm:p-0 sm:py-8 md:py-11",
                    i > 0 && "sm:border-t sm:border-tc-border md:border-t-0",
                    i >= 3 && "md:border-t",
                    col > 0 && "md:border-l md:border-tc-border",
                    col === 0 && "md:pr-8 lg:pr-14",
                    col === 1 && "md:px-8 lg:px-14",
                    col === 2 && "md:pl-8 lg:pl-14",
                  )}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <item.icon
                      size={16}
                      strokeWidth={1.75}
                      aria-hidden
                      className="text-tc-text-light transition-colors duration-[var(--tc-dur)] group-hover:text-tc-primary"
                    />
                    <span className="text-[11px] tracking-[0.18em] text-tc-primary/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="heading-sm mt-3 max-w-xs text-[15px] leading-snug transition-colors duration-[var(--tc-dur)] group-hover:text-tc-primary sm:mt-4 sm:text-[17px]">
                    {item.title}
                  </h3>
                  <p className="body-sm mt-2 text-[12px] sm:hidden">{item.mobileDesc}</p>
                  <p className="body-sm mt-2.5 max-w-sm hidden sm:block">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
