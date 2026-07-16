import type { BlogPost } from "@/types/blog";
import PremiumCard from "@/components/ui/PremiumCard";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";

interface LatestSectionProps {
  posts: BlogPost[];
}

export default function LatestSection({ posts }: LatestSectionProps) {
  if (posts.length === 0) return null;

  const left  = posts.slice(0, Math.ceil(posts.length / 2));
  const right = posts.slice(Math.ceil(posts.length / 2));

  return (
    <section className="section-padding bg-tc-bg border-t border-tc-border">
      <div className="container-wide mx-auto px-page">
        <Reveal>
          <SectionHeader label="Latest News" href="/blog" />
        </Reveal>

        <Reveal y={16} delay={0.04}>
          <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-tc-border gap-0">
            {/* Left column */}
            <div className="md:pr-10 lg:pr-14">
              {left.map((post, i) => (
                <PremiumCard key={post.id} post={post} variant="list" index={i} />
              ))}
            </div>
            {/* Right column */}
            {right.length > 0 && (
              <div className="md:pl-10 lg:pl-14 border-t border-tc-border md:border-t-0">
                {right.map((post, i) => (
                  <PremiumCard key={post.id} post={post} variant="list" index={left.length + i} />
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
