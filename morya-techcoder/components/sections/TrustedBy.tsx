import Reveal from "@/components/ui/Reveal";

const companies = [
  "React",
  "Next.js",
  "TypeScript",
  "Rust",
  "Python",
  "Go",
  "Node.js",
  "Tailwind",
  "Docker",
  "GraphQL",
];

export default function TrustedBy() {
  return (
    <section className="relative py-16 md:py-20 px-4 sm:px-6 border-y border-tc-border">
      <div className="container-wide mx-auto">
        <Reveal className="text-center mb-10">
          <p className="overline text-tc-text-light">
            Deep dives across the tools and languages you actually use
          </p>
        </Reveal>

        <div className="relative marquee-mask overflow-hidden">
          <div className="flex w-max animate-marquee gap-14 sm:gap-20 pr-14 sm:pr-20">
            {[...companies, ...companies].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-tc-text-light/70 hover:text-tc-primary transition-colors duration-300 whitespace-nowrap select-none"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
