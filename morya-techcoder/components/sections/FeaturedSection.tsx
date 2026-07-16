import type { BlogPost } from "@/types/blog";
import PremiumCard from "@/components/ui/PremiumCard";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";

interface FeaturedSectionProps {
  posts: BlogPost[];
}

export default function FeaturedSection({ posts }: FeaturedSectionProps) {
  if (posts.length === 0) return null;

  const [lead, second, third, ...rest] = posts;

  return (
    <section className="section-padding bg-tc-bg">
      <div className="container-wide mx-auto px-page">
        <Reveal>
          <SectionHeader label="Featured Stories" href="/blog" labelColor="text-tc-primary" />
        </Reveal>

        {/* ── Bento grid: large lead left, 2 stacked right ── */}
        <Reveal y={20}>
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-5 sm:gap-6">

            {/* Lead — large cover card */}
            {lead && (
              <PremiumCard
                post={lead}
                variant="cover"
                className="lg:row-span-2"
                aspectRatio="aspect-[16/10] lg:h-full"
              />
            )}

            {/* Secondary cards stacked on the right */}
            <div className="flex flex-col gap-5 sm:gap-6">
              {second && (
                <PremiumCard post={second} variant="feature" />
              )}
              {third && (
                <PremiumCard post={third} variant="feature" />
              )}
            </div>
          </div>
        </Reveal>

        {/* ── Optional: 3-column row of additional picks below ── */}
        {rest.length > 0 && (
          <Reveal delay={0.08} y={18}>
            <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
              {rest.slice(0, 3).map((post) => (
                <PremiumCard key={post.id} post={post} variant="feature" />
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
