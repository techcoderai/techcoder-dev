import {
  BookOpen,
  Route,
  Code2,
  Network,
  Gauge,
  Feather,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Capabilities() {
  return (
    <section className="section-padding relative">
      <div className="container-wide mx-auto">
        <SectionHeading
          eyebrow="What you'll find"
          title={
            <>
              Everything you need to{" "}
              <span className="text-gradient">level up your craft</span>
            </>
          }
          description="Depth over hype. Every piece is written to take you from first principles to shipping real, production-grade code."
          className="mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-6 gap-5 md:gap-6">
          {/* Large feature — spans 4 */}
          <Reveal className="md:col-span-4">
            <div className="hover-lift group relative h-full overflow-hidden rounded-[24px] card-surface p-7 sm:p-9">
              <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full mesh-glow opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative">
                <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-tc-primary to-tc-secondary text-white shadow-glow">
                  <BookOpen size={22} />
                </span>
                <h3 className="heading-md mt-6 max-w-md">
                  In-depth articles &amp; hands-on tutorials
                </h3>
                <p className="body-base mt-3 max-w-lg">
                  Long-form deep dives that explain the why, not just the how — with runnable
                  examples you can drop straight into your next project.
                </p>

                {/* Content pillars */}
                <div className="mt-7 grid grid-cols-3 gap-3 max-w-md">
                  {["Fundamentals", "Patterns", "Production"].map((step, i) => (
                    <div
                      key={step}
                      className="rounded-xl border border-tc-border bg-tc-bg-elevated px-3 py-3 text-center"
                    >
                      <span className="block text-[11px] text-tc-text-light mb-1">
                        Level {i + 1}
                      </span>
                      <span className="heading-sm text-[13px]">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Tall/portrait — spans 2 */}
          <Reveal delay={0.08} className="md:col-span-2">
            <div className="hover-lift group h-full rounded-[24px] card-surface p-7">
              <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-tc-primary/12 text-tc-primary">
                <Route size={22} />
              </span>
              <h3 className="heading-md mt-6">Curated learning series</h3>
              <p className="body-base mt-3">
                Structured, topic-by-topic series that guide you from the basics to mastery —
                no more wondering what to read next.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["React", "TypeScript", "Rust", "Next.js", "CSS"].map((t) => (
                  <span key={t} className="chip py-1 px-3 text-[11px]">{t}</span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Three equal supporting cards */}
          {[
            {
              icon: Code2,
              title: "Premium code snippets",
              desc: "Battle-tested utilities, hooks, and patterns ready to use.",
            },
            {
              icon: Network,
              title: "System design & architecture",
              desc: "Case studies and deep dives into how real systems are built.",
            },
            {
              icon: Gauge,
              title: "Performance & debugging",
              desc: "Optimization guides and debugging stories from the trenches.",
            },
          ].map((c, i) => (
            <Reveal key={c.title} delay={0.05 * i} className="md:col-span-2">
              <div className="hover-lift group h-full rounded-[24px] card-surface p-7">
                <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-tc-primary/12 text-tc-primary transition-colors duration-300 group-hover:bg-tc-primary group-hover:text-white">
                  <c.icon size={20} />
                </span>
                <h3 className="heading-sm mt-5 text-[15px]">{c.title}</h3>
                <p className="body-sm mt-2">{c.desc}</p>
              </div>
            </Reveal>
          ))}

          {/* Wide community strip — spans 6 */}
          <Reveal className="md:col-span-6">
            <div className="hover-lift flex flex-col sm:flex-row items-start sm:items-center gap-5 rounded-[24px] card-surface p-7 sm:p-8">
              <span className="flex items-center justify-center w-12 h-12 shrink-0 rounded-2xl bg-tc-primary/12 text-tc-primary">
                <Feather size={22} />
              </span>
              <div className="flex-1">
                <h3 className="heading-sm text-[15px]">Written by the TechCoder team</h3>
                <p className="body-sm mt-1.5 max-w-2xl">
                  Every article is researched, written, and edited in-house — then published
                  free to read. No guest submissions, no filler, no paywalls. Just one team
                  obsessed with technical quality.
                </p>
              </div>
              <div className="flex items-center gap-6 sm:gap-10">
                {[
                  { v: "500+", l: "Articles published" },
                  { v: "0", l: "Paywalls" },
                ].map((s) => (
                  <div key={s.l} className="text-left">
                    <p className="heading-md text-gradient">{s.v}</p>
                    <p className="text-[11px] text-tc-text-light">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
