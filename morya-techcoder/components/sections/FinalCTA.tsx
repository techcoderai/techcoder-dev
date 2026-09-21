import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

/**
 * Closing CTA. Deliberately flat and compact (no giant glowing card) — it
 * floats over the footer via a negative bottom margin so its lower edge
 * overlaps the dark footer band, matching that boundary treatment.
 */
export default function FinalCTA() {
  return (
    <section className="relative z-10 px-4 sm:px-6">
      <div className="container-wide mx-auto">
        <Reveal>
          <div className="card-surface shadow-premium -mb-16 sm:-mb-20 md:-mb-24 flex flex-col gap-8 px-6 py-10 sm:px-10 sm:py-12 md:flex-row md:items-center md:justify-between md:px-14">
            <div className="max-w-lg">
              <span className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-tc-text-light">
                <span className="h-px w-6 bg-tc-primary" />
                Free to read — currently no subscription required
              </span>
              <h2 className="heading-lg mt-3">
                Start building. <span className="text-tc-primary">Keep learning.</span>
              </h2>
              <p className="body-base mt-3">
                Join the curious minds who learn something new here every week.
              </p>
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center shrink-0">
              <Link
                href="/blog"
                className="btn-primary focus-ring group justify-center px-7 py-3.5 text-[15px]"
              >
                Start reading
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/#topics" className="btn-secondary focus-ring justify-center px-7 py-3.5 text-[15px]">
                Explore topics
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

