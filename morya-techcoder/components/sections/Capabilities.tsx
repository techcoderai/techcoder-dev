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
      title: "In-depth articles & hands-on tutorials",
      desc: "Long-form deep dives that explain the why, not just the how — with runnable examples you can drop straight into your next project.",
    },
    {
      icon: Route,
      title: "Curated learning series",
      desc: "Structured, topic-by-topic series across React, TypeScript, Rust, Next.js and CSS — no more wondering what to read next.",
    },
    {
      icon: Code2,
      title: "Premium code snippets",
      desc: "Battle-tested utilities, hooks, and patterns, ready to use and documented well enough to trust in production.",
    },
    {
      icon: Network,
      title: "System design & architecture",
      desc: "Case studies and deep dives into how real systems are built, scaled, and kept maintainable over years.",
    },
    {
      icon: Gauge,
      title: "Performance & debugging",
      desc: "Optimization guides and debugging stories from the trenches, with the measurements that justify every change.",
    },
    {
      icon: Feather,
      title: "Written by the TechCoder team",
      desc: `Researched, written, and edited in-house. ${publishedCount} articles published, zero paywalls, no guest filler.`,
    },
  ];

  return (
    <section className="section-padding pt-0 relative">
      <div className="container-wide mx-auto">
        <Reveal>
          <div className="border-t border-tc-border pt-10 md:pt-14">
            <span className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-tc-text-light">
              <span className="h-px w-6 bg-tc-primary" />
              What you&apos;ll find
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
          <div className="mt-12 grid grid-cols-1 border-t border-b border-tc-border md:mt-16 md:grid-cols-3">
            {items.map((item, i) => {
              const col = i % 3;
              return (
                <div
                  key={item.title}
                  className={cn(
                    "group py-8 md:py-11",
                    i > 0 && "border-t border-tc-border md:border-t-0",
                    i >= 3 && "md:border-t",
                    col > 0 && "md:border-l md:border-tc-border",
                    col === 0 && "md:pr-8 lg:pr-14",
                    col === 1 && "md:px-8 lg:px-14",
                    col === 2 && "md:pl-8 lg:pl-14",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      size={15}
                      strokeWidth={1.75}
                      aria-hidden
                      className="text-tc-text-light transition-colors duration-[var(--tc-dur)] group-hover:text-tc-primary"
                    />
                    <span className="text-[11px] tracking-[0.18em] text-tc-primary/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="heading-sm mt-4 max-w-xs text-[17px] leading-snug transition-colors duration-[var(--tc-dur)] group-hover:text-tc-primary">
                    {item.title}
                  </h3>
                  <p className="body-sm mt-2.5 max-w-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
