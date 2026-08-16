import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * There is no newsletter backend yet, so this section links to the blog instead
 * of collecting addresses it cannot deliver to. Server-rendered: no state.
 */
export default function NewsletterBox() {
  return (
    <section className="relative overflow-hidden rounded-[26px] card-surface p-6 sm:p-8 md:p-12">
      <div className="absolute inset-0 -z-10 mesh-glow opacity-60" />
      <div className="relative z-10 max-w-xl mx-auto text-center">
        <h2 className="heading-lg text-xl sm:text-2xl md:text-3xl text-tc-text mb-3">
          Stay Ahead of the Curve
        </h2>
        <p className="text-tc-text-muted text-sm md:text-base mb-8 leading-relaxed max-w-md mx-auto">
          Handpicked AI news, coding tricks, and web dev insights. The newsletter isn&apos;t
          open for signups yet — every new article lands on the blog first.
        </p>
        <Link href="/blog" className="btn-primary focus-ring px-6 py-3.5 text-sm">
          Read the latest articles
          <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}
