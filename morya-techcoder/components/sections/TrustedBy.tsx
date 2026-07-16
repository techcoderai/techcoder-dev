import Reveal from "@/components/ui/Reveal";

/** The breadth of what TechCoder covers — the whole ecosystem, not just code. */
const topics = [
  "Artificial Intelligence",
  "Programming",
  "Technology",
  "Reviews",
  "Gadgets",
  "Buying Guides",
  "Open Source",
  "Startups",
  "Productivity",
  "Cybersecurity",
  "Mobile",
  "Cloud",
  "Web Development",
];

export default function TrustedBy() {
  return (
    <section className="relative py-16 md:py-20 px-4 sm:px-6 border-y border-tc-border">
      <div className="container-wide mx-auto">
        <Reveal className="text-center mb-10">
          <p className="overline text-tc-text-light">
            One publication for everything technology
          </p>
        </Reveal>

        <div className="relative marquee-mask overflow-hidden">
          <div className="flex w-max animate-marquee gap-8 sm:gap-12 pr-8 sm:pr-12">
            {[...topics, ...topics].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="flex items-center gap-3 font-heading text-lg sm:text-xl font-semibold tracking-tight text-tc-text-light/70 hover:text-tc-primary transition-colors duration-300 whitespace-nowrap select-none"
              >
                {name}
                <span className="w-1.5 h-1.5 rounded-full bg-tc-primary/40" aria-hidden="true" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
