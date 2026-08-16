import Link from "next/link";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

const paths = [
  {
    name: "Frontend Foundations",
    level: "Beginner",
    description: "Go from markup to interactive interfaces with confidence.",
    items: [
      "Semantic HTML & accessibility",
      "Modern CSS & layout",
      "JavaScript essentials",
      "Your first React app",
    ],
    cta: "Start reading",
    href: "/blog/category/webdev",
    featured: false,
  },
  {
    name: "Full-Stack Engineering",
    level: "Intermediate",
    description: "Build and ship complete products, front to back.",
    items: [
      "Everything in Foundations",
      "TypeScript in depth",
      "Next.js & the App Router",
      "APIs, data & auth",
      "Deploying to the edge",
    ],
    cta: "Start reading",
    href: "/blog/category/webdev",
    featured: true,
  },
  {
    name: "Systems & AI",
    level: "Advanced",
    description: "Reach for the frontier — performance, systems, and ML.",
    items: [
      "Everything in Full-Stack",
      "Rust & systems thinking",
      "LLMs for developers",
      "Scaling & observability",
      "Architecture deep dives",
    ],
    cta: "Start reading",
    href: "/blog/category/ai",
    featured: false,
  },
];

export default function LearningPaths() {
  return (
    <section className="section-padding relative">
      <div className="absolute inset-0 -z-10 mesh-glow opacity-40 blur-3xl" />
      <div className="container-wide mx-auto">
        <SectionHeading
          eyebrow="Learning paths"
          title={
            <>
              Guided paths from <span className="text-gradient">first commit to shipped</span>
            </>
          }
          description="Structured, topic-by-topic roadmaps so you always know exactly what to learn next. Free, forever."
          className="mb-14"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {paths.map((path, i) => (
            <Reveal key={path.name} delay={0.07 * i}>
              <div
                className={`relative h-full flex flex-col rounded-[26px] p-8 transition-all duration-300 ${
                  path.featured
                    ? "border border-tc-primary/40 bg-tc-bg-card shadow-glow lg:-translate-y-3"
                    : "card-surface hover-lift"
                }`}
              >
                {path.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 chip bg-gradient-to-r from-tc-primary to-tc-secondary text-white border-transparent">
                    <Sparkles size={12} /> Editor&apos;s pick
                  </span>
                )}
                <span className="chip w-fit py-1 px-3 text-[11px]">{path.level}</span>
                <h3 className="heading-sm text-lg mt-4">{path.name}</h3>
                <p className="body-sm mt-2 min-h-[42px]">{path.description}</p>
                <ul className="flex flex-col gap-3 mb-8 mt-6">
                  {path.items.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-tc-text-muted">
                      <span
                        className={`flex items-center justify-center w-5 h-5 shrink-0 rounded-full mt-0.5 ${
                          path.featured
                            ? "bg-gradient-to-br from-tc-primary to-tc-secondary text-white"
                            : "bg-tc-primary/12 text-tc-primary"
                        }`}
                      >
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={path.href}
                  className={`focus-ring mt-auto w-full py-3.5 text-sm ${
                    path.featured ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  {path.cta}
                  <ArrowRight size={15} />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
