import { Star, Quote } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

const testimonials = [
  {
    quote:
      "TechCoder tutorials are the ones I actually finish. They go deep enough to be useful but never waste your time — I've shipped features straight from their examples.",
    name: "Ava Chen",
    role: "Staff Engineer, Fintech",
    initials: "AC",
  },
  {
    quote:
      "The learning paths took me from shaky on TypeScript to confident in a weekend. It's the closest thing to having a patient senior dev walking you through it.",
    name: "Marcus Reid",
    role: "Self-taught Developer",
    initials: "MR",
  },
  {
    quote:
      "I keep their CSS and React snippets bookmarked. Copy, paste, understand why it works — then I actually remember it. That's rare for a technical blog.",
    name: "Priya Nair",
    role: "Frontend Lead",
    initials: "PN",
  },
  {
    quote:
      "Beautifully written and genuinely rigorous. This is what a developer publication should feel like — every article respects your intelligence.",
    name: "Tom Alvarez",
    role: "DevRel Engineer",
    initials: "TA",
  },
];

export default function Testimonials() {
  return (
    <section className="section-padding relative">
      <div className="container-wide mx-auto">
        <SectionHeading
          eyebrow="Reader reactions"
          title={
            <>
              Trusted reading for <span className="text-gradient">developers who ship</span>
            </>
          }
          description="Thousands of engineers, students, and self-taught builders learn something new here every week."
          className="mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={0.06 * i}>
              <figure className="hover-lift group relative h-full rounded-[24px] card-surface p-7 sm:p-8">
                <Quote
                  size={40}
                  className="absolute top-6 right-7 text-tc-primary/12 group-hover:text-tc-primary/25 transition-colors"
                />
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={15} className="fill-tc-primary text-tc-primary" />
                  ))}
                </div>
                <blockquote className="relative text-[15px] leading-relaxed text-tc-text">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-tc-primary to-tc-secondary text-white font-heading font-semibold text-sm">
                    {t.initials}
                  </span>
                  <div>
                    <p className="heading-sm text-sm">{t.name}</p>
                    <p className="text-[12px] text-tc-text-light">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
