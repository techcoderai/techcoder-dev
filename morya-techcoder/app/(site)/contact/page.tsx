import type { Metadata } from "next";
import Link from "next/link";

const CONTACT_EMAIL = "mailtechcoder@gmail.com";

const reasons = [
  {
    title: "Feedback",
    body: "What's working, what isn't, what you'd read more of.",
  },
  {
    title: "Corrections",
    body: "A factual error, outdated information, or a code sample that doesn't run.",
  },
  {
    title: "Story ideas",
    body: "Something you think we should be covering.",
  },
  {
    title: "Partnerships",
    body: "A collaboration worth discussing.",
  },
];

export const metadata: Metadata = {
  title: "Contact | TechCoder",
  description: "How to reach TechCoder directly.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: "/contact",
    title: "Contact | TechCoder",
    description: "How to reach TechCoder directly.",
    siteName: "TechCoder",
  },
};

export default function ContactPage() {
  return (
    <div className="bg-tc-bg section-padding pt-28 md:pt-32">
      <div className="container-wide mx-auto max-w-2xl">
        <p className="overline text-tc-text-light mb-4">Contact</p>
        <h1 className="heading-xl text-3xl md:text-4xl">Reach us directly.</h1>
        <p className="mt-5 body-lg max-w-xl">
          There&apos;s no contact form or ticketing system here — email is the only way in.
        </p>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="focus-ring inline-block mt-8 heading-md text-2xl sm:text-3xl text-tc-primary hover:underline break-all"
        >
          {CONTACT_EMAIL}
        </a>

        <section className="mt-16">
          <h2 className="heading-sm text-tc-text-light mb-6">What to write about</h2>
          <div className="divide-y divide-tc-border border-t border-tc-border">
            {reasons.map((r) => (
              <div key={r.title} className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-8 py-4">
                <h3 className="heading-sm text-[15px] sm:w-40 shrink-0">{r.title}</h3>
                <p className="text-sm text-tc-text-muted leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-16 pt-8 border-t border-tc-border text-sm text-tc-text-muted">
          Looking for our writing instead?{" "}
          <Link href="/blog" className="text-tc-primary hover:underline font-medium">
            Browse all articles
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
