import Link from "next/link";
import { ArrowRight, Sparkles, Code2, Cpu, Star, ShoppingBag, Wrench } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";

const topics = [
  {
    key: "AI",
    label: "Artificial Intelligence",
    description: "LLMs, agents, machine learning, and the future of software.",
    href: "/blog?category=AI",
    Icon: Sparkles,
    accentBg: "bg-tc-cat-ai-bg hover:bg-[var(--tc-cat-ai-bg-hover)]",
    accentBorder: "border-tc-cat-ai-border",
    accentText: "text-tc-cat-ai-text",
    accentIcon: "text-tc-cat-ai",
  },
  {
    key: "WebDev",
    label: "Programming",
    description: "Modern frameworks, architecture patterns, and developer tools.",
    href: "/blog?category=WebDev",
    Icon: Code2,
    accentBg: "bg-tc-cat-prog-bg hover:bg-[var(--tc-cat-prog-bg-hover)]",
    accentBorder: "border-tc-cat-prog-border",
    accentText: "text-tc-cat-prog-text",
    accentIcon: "text-tc-cat-prog",
  },
  {
    key: "Technology",
    label: "Technology",
    description: "The platforms, products, and companies defining the future.",
    href: "/blog?category=Technology",
    Icon: Cpu,
    accentBg: "bg-tc-cat-tech-bg hover:bg-[var(--tc-cat-tech-bg-hover)]",
    accentBorder: "border-tc-cat-tech-border",
    accentText: "text-tc-cat-tech-text",
    accentIcon: "text-tc-cat-tech",
  },
  {
    key: "Reviews",
    label: "Reviews & Gadgets",
    description: "Honest reviews of hardware, software, and the tools you rely on.",
    href: "/blog?category=Reviews",
    Icon: Star,
    accentBg: "bg-tc-cat-reviews-bg hover:bg-[var(--tc-cat-reviews-bg-hover)]",
    accentBorder: "border-tc-cat-reviews-border",
    accentText: "text-tc-cat-reviews-text",
    accentIcon: "text-tc-cat-reviews",
  },
  {
    key: "BuyingGuides",
    label: "Buying Guides",
    description: "Research-backed guides that help you spend your money wisely.",
    href: "/blog?category=BuyingGuides",
    Icon: ShoppingBag,
    accentBg: "bg-tc-cat-buying-bg hover:bg-[var(--tc-cat-buying-bg-hover)]",
    accentBorder: "border-tc-cat-buying-border",
    accentText: "text-tc-cat-buying-text",
    accentIcon: "text-tc-cat-buying",
  },
  {
    key: "Tools",
    label: "Developer Tools",
    description: "IDEs, CLIs, and the full stack of tools that make you faster.",
    href: "/blog?category=Tools",
    Icon: Wrench,
    accentBg: "bg-tc-cat-tools-bg hover:bg-[var(--tc-cat-tools-bg-hover)]",
    accentBorder: "border-tc-cat-tools-border",
    accentText: "text-tc-cat-tools-text",
    accentIcon: "text-tc-cat-tools",
    comingSoon: true,
  },
];

export default function ExploreTopics() {
  return (
    <section className="section-padding bg-tc-bg-secondary/50 border-t border-tc-border">
      <div className="container-wide mx-auto px-page">
        <Reveal>
          <SectionHeader label="Explore by Topic" />
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {topics.map((topic, i) => (
            <Reveal key={topic.key} delay={i * 0.04} y={14}>
              <Link
                href={topic.href}
                className={`focus-ring group relative flex flex-col gap-4 p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--tc-shadow-lg)] ${topic.accentBg} ${topic.accentBorder}`}
              >
                {/* Icon */}
                <div className="flex items-center justify-between">
                  <span className={`flex items-center justify-center w-10 h-10 rounded-xl bg-white/60 dark:bg-white/8 border border-tc-border ${topic.accentIcon}`}>
                    <topic.Icon size={18} />
                  </span>
                  {topic.comingSoon && (
                    <span className="text-[9.5px] font-bold uppercase tracking-widest text-tc-text-light border border-tc-border rounded-full px-2.5 py-1 bg-tc-bg-card">
                      Soon
                    </span>
                  )}
                  {!topic.comingSoon && (
                    <ArrowRight
                      size={15}
                      className={`${topic.accentText} opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200`}
                    />
                  )}
                </div>

                {/* Text */}
                <div>
                  <h3 className={`font-heading font-semibold text-[15px] tracking-tight mb-1.5 ${topic.accentText}`}>
                    {topic.label}
                  </h3>
                  <p className="text-[13px] text-tc-text-muted leading-relaxed">
                    {topic.description}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
