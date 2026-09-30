import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteShell from "@/components/layout/SiteShell";
import { ACTIVE_CATEGORY_KEYS, CATEGORIES, categoryHref } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Page Not Found | TechCoder",
  robots: { index: false, follow: true },
};

/**
 * Site-wide 404. Handles both unmatched URLs and `notFound()` calls from any
 * `(site)` route — neither passes through the `(site)` layout, so the page
 * brings its own chrome via `SiteShell`.
 */
export default function NotFound() {
  return (
    <SiteShell>
      <div className="bg-tc-bg section-padding pt-28 md:pt-32">
        <div className="container-wide mx-auto max-w-2xl">
          <p className="overline text-tc-text-light mb-4">404</p>
          <h1 className="heading-xl text-3xl md:text-4xl">This page doesn&apos;t exist.</h1>
          <p className="mt-5 body-lg max-w-xl">
            The link may be broken, or the article may have moved. Try one of these instead.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/" className="btn-primary focus-ring group justify-center px-7 py-3.5 text-[15px]">
              Back to home
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link href="/blog" className="btn-secondary focus-ring justify-center px-7 py-3.5 text-[15px]">
              Browse all articles
            </Link>
          </div>

          <section className="mt-16">
            <h2 className="heading-sm text-tc-text-light mb-6">Explore a topic</h2>
            <div className="divide-y divide-tc-border border-t border-tc-border">
              {ACTIVE_CATEGORY_KEYS.map((key) => (
                <Link
                  key={key}
                  href={categoryHref(key)}
                  className="focus-ring group flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-8 py-4"
                >
                  <span className="heading-sm text-[15px] sm:w-40 shrink-0 group-hover:text-tc-primary transition-colors duration-200">
                    {CATEGORIES[key].label}
                  </span>
                  <span className="text-sm text-tc-text-muted leading-relaxed">
                    {CATEGORIES[key].description}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
