import type { Metadata } from "next";

const CONTACT_EMAIL = "mailtechcoder@gmail.com";

const sections = [
  {
    title: "Using the site",
    body: "Everything published on TechCoder is free to read, with no account required. You're welcome to link to articles, quote short excerpts with attribution, and share them — just don't republish full articles elsewhere without asking first.",
  },
  {
    title: "Content accuracy",
    body: "Articles are written and fact-checked in-house, but software and best practices change quickly. Code samples and guides are provided as-is; test anything before relying on it in production.",
  },
  {
    title: "No professional advice",
    body: "Nothing here — including reviews, buying guides, or security write-ups — is professional, legal, or financial advice. Use your own judgement for decisions that matter.",
  },
  {
    title: "External links",
    body: "Articles may link to third-party sites, tools, or products we don't control and aren't responsible for. Some outbound links may be affiliate links; this doesn't change what we write.",
  },
  {
    title: "Availability",
    body: "We aim to keep the site fast and reachable, but we don't guarantee uninterrupted access and may change or remove content at any time.",
  },
  {
    title: "Changes to these terms",
    body: "If these terms change materially, we'll update the date below.",
  },
];

export const metadata: Metadata = {
  title: "Terms & Conditions | TechCoder",
  description: "The terms that apply to reading and using TechCoder.",
  alternates: { canonical: "/terms" },
  openGraph: {
    type: "website",
    url: "/terms",
    title: "Terms & Conditions | TechCoder",
    description: "The terms that apply to reading and using TechCoder.",
    siteName: "TechCoder",
  },
};

export default function TermsPage() {
  return (
    <div className="bg-tc-bg section-padding pt-28 md:pt-32">
      <div className="container-wide mx-auto max-w-2xl">
        <p className="overline text-tc-text-light mb-4">Terms & Conditions</p>
        <h1 className="heading-xl text-3xl md:text-4xl">
          The short version of the fine print.
        </h1>
        <p className="mt-5 body-lg max-w-xl">
          By reading and using TechCoder, you&apos;re agreeing to the following. It&apos;s
          written in plain language on purpose.
        </p>

        <section className="mt-16">
          <div className="divide-y divide-tc-border border-t border-tc-border">
            {sections.map((s) => (
              <div key={s.title} className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-8 py-5">
                <h2 className="heading-sm text-[15px] sm:w-48 shrink-0">{s.title}</h2>
                <p className="text-sm text-tc-text-muted leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-16 pt-8 border-t border-tc-border text-sm text-tc-text-muted">
          Last updated September 2026. Questions about these terms?{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-tc-primary hover:underline font-medium">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
