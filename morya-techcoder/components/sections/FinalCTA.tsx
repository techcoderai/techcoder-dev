import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

export default function FinalCTA() {
  return (
    <section className="px-4 sm:px-6 pb-24 md:pb-32">
      <div className="container-wide mx-auto">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] border border-tc-border bg-tc-bg-card px-6 sm:px-12 py-16 sm:py-24 text-center shadow-premium">
            {/* Glow layers */}
            <div className="absolute inset-0 -z-10 mesh-glow opacity-90" />
            <div className="absolute inset-0 -z-10 grid-overlay opacity-40" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full bg-tc-primary/20 blur-[120px] animate-pulse-glow" />

            <div className="relative flex flex-col items-center">
              <span className="chip mb-6">
                <Sparkles size={12} className="text-tc-primary" />
                Free to read — no account required
              </span>
              <h2 className="display-xl max-w-3xl">
                Start building. <span className="text-gradient">Keep learning.</span>
              </h2>
              <p className="mt-6 max-w-lg body-lg">
                Join the curious minds who learn something new here every week. Your next
                article, deep dive, or review is one click away.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row items-center gap-3.5">
                <Link href="/blog" className="btn-primary focus-ring group px-8 py-4 text-[15px]">
                  Start reading
                  <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link href="/#topics" className="btn-secondary focus-ring px-8 py-4 text-[15px]">
                  Explore topics
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
