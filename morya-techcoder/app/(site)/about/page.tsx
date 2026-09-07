import type { Metadata } from "next";
import Link from "next/link";
import { Linkedin, Twitter } from "lucide-react";
import { CATEGORY_KEYS, CATEGORIES } from "@/lib/categories";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "About | TechCoder",
  description:
    "TechCoder is an independent publication about software, AI, and the devices we use every day.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: "/about",
    title: "About | TechCoder",
    description: "TechCoder is an independent publication about software, AI, and the devices we use every day.",
    siteName: "TechCoder",
  },
};

const principles = [
  {
    title: "Written in-house",
    body: "Every article is researched and edited by the people who run this site — no guest posts, no aggregated content.",
  },
  {
    title: "Free to read",
    body: "Nothing here sits behind a paywall or an account wall.",
  },
  {
    title: "Plain text, in Git",
    body: "Articles are Markdown files in a repository, not exports from a CMS. What you're reading is the source.",
  },
  {
    title: "Corrected when wrong",
    body: "If something in an article turns out to be inaccurate, it gets fixed — the article's updated date reflects that.",
  },
];

const team = [
  { name: "Atharva Yadav", linkedin: "https://www.linkedin.com/in/atharvayadav/", x: "https://x.com/atharvayadav28" },
  { name: "Aaditya Yadav", linkedin: "https://www.linkedin.com/in/aaditya9/", x: "https://x.com/aadityaa_9" },
];

export default function AboutPage() {
  return (
    <div className="bg-tc-bg section-padding pt-28 md:pt-32">
      <div className="container-wide mx-auto max-w-3xl">
        {/* Masthead */}
        <Reveal>
          <p className="overline text-tc-text-light mb-4">About</p>
          <h1 className="heading-xl text-3xl md:text-4xl max-w-2xl">
            An independent publication about software, AI, and the devices we use every day.
          </h1>
          <p className="mt-5 body-lg max-w-xl">
            It&apos;s written and edited by a small team rather than a newsroom — fewer
            articles, but each one gets read closely before it goes out.
          </p>
        </Reveal>

        {/* What we write about */}
        <section className="mt-20">
          <h2 className="heading-sm text-tc-text-light mb-6">What we write about</h2>
          <div className="divide-y divide-tc-border border-t border-tc-border">
            {CATEGORY_KEYS.map((key) => {
              const meta = CATEGORIES[key];
              return (
                <div
                  key={key}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-8 py-4"
                >
                  <h3 className="heading-sm text-[15px] sm:w-48 shrink-0">{meta.label}</h3>
                  <p className="text-sm text-tc-text-muted leading-relaxed">
                    {meta.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How we work */}
        {/* <section className="mt-16">
          <h2 className="heading-sm text-tc-text-light mb-6">How we work</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {principles.map((p) => (
              <div key={p.title}>
                <h3 className="heading-sm text-[15px] mb-1.5">{p.title}</h3>
                <p className="text-sm text-tc-text-muted leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </section> */}

        {/* Team */}
        <section className="mt-16">
          <h2 className="heading-sm text-tc-text-light mb-6">Team</h2>
          <div className="divide-y divide-tc-border border-t border-tc-border">
            {team.map((person) => (
              <div key={person.name} className="flex items-center justify-between py-4">
                <span className="heading-sm text-[15px]">{person.name}</span>
                <div className="flex items-center gap-3 text-tc-text-light">
                  <a
                    href={person.linkedin}
                    aria-label={`${person.name} on LinkedIn`}
                    className="focus-ring rounded hover:text-tc-primary transition-colors duration-200"
                  >
                    <Linkedin size={16} />
                  </a>
                  <a
                    href={person.x}
                    aria-label={`${person.name} on X`}
                    className="focus-ring rounded hover:text-tc-primary transition-colors duration-200"
                  >
                    <Twitter size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Closing */}
        <p className="mt-16 pt-8 border-t border-tc-border text-sm text-tc-text-muted">
          Questions, corrections, or a story idea —{" "}
          <Link href="/contact" className="text-tc-primary hover:underline font-medium">
            get in touch
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
