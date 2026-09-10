import type { Metadata } from "next";

const CONTACT_EMAIL = "mailtechcoder@gmail.com";

const sections = [
  {
    title: "What we collect",
    body: "If you subscribe to the newsletter, we store the email address you provide. If you switch between light and dark mode, that preference is saved in your browser's local storage — it never leaves your device. We don't run account systems, so there's no profile, password, or personal data tied to reading the site.",
  },
  {
    title: "Cookies & analytics",
    body: "We use privacy-respecting, aggregate analytics to understand which articles are useful — page views and rough traffic sources, not individual tracking profiles. We don't sell data, run ad networks, or use cross-site tracking cookies.",
  },
  {
    title: "Third parties",
    body: "Embedded content (like a tweet or a video) may load resources from its original platform, which is subject to that platform's own privacy policy. Our hosting and email providers process data only to the extent needed to run the site and send the newsletter.",
  },
  {
    title: "Your choices",
    body: "You can unsubscribe from the newsletter at any time via the link in every email, or by writing to us directly. You can also ask us to delete any email address we hold for you.",
  },
  {
    title: "Changes to this policy",
    body: "If this policy changes in a meaningful way, we'll update the date below and, where practical, note it in the newsletter.",
  },
];

export const metadata: Metadata = {
  title: "Privacy Policy | TechCoder",
  description: "What TechCoder collects, why, and how you can control it.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "website",
    url: "/privacy",
    title: "Privacy Policy | TechCoder",
    description: "What TechCoder collects, why, and how you can control it.",
    siteName: "TechCoder",
  },
};

export default function PrivacyPage() {
  return (
    <div className="bg-tc-bg section-padding pt-28 md:pt-32">
      <div className="container-wide mx-auto max-w-2xl">
        <p className="overline text-tc-text-light mb-4">Privacy Policy</p>
        <h1 className="heading-xl text-3xl md:text-4xl">
          What we collect, and what we don&apos;t.
        </h1>
        <p className="mt-5 body-lg max-w-xl">
          TechCoder doesn&apos;t have user accounts or a paywall, so there&apos;s very little
          of yours for us to hold in the first place. Here&apos;s the full picture.
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
          Last updated September 2026. Questions about this policy?{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-tc-primary hover:underline font-medium">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
