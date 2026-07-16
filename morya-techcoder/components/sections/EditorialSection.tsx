import type { BlogPost } from "@/types/blog";
import PremiumCard from "@/components/ui/PremiumCard";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";

export interface EditorialSectionConfig {
  label: string;
  labelColor?: string;
  href?: string;
  bgColor?: string;
  layout?: "standard" | "reversed" | "thirds";
}

interface EditorialSectionProps extends EditorialSectionConfig {
  posts: BlogPost[];
}

/* ─────────────────────────────────────────────────────────────────────────
   layout "standard":  1 large cover left  +  2–3 compact right
   layout "reversed":  2–3 compact left    +  1 large cover right
   layout "thirds":    3 equal feature cards in a row
   ──────────────────────────────────────────────────────────────────────── */
export default function EditorialSection({
  posts,
  label,
  labelColor = "text-tc-primary",
  href,
  bgColor = "bg-tc-bg",
  layout = "standard",
}: EditorialSectionProps) {
  if (posts.length === 0) return null;

  const [lead, ...rest] = posts;

  return (
    <section className={`section-padding border-t border-tc-border ${bgColor}`}>
      <div className="container-wide mx-auto px-page">
        <Reveal>
          <SectionHeader label={label} labelColor={labelColor} href={href} />
        </Reveal>

        {layout === "thirds" ? (
          /* ── 3-column equal grid ── */
          <Reveal y={18} delay={0.04}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {posts.slice(0, 3).map((post) => (
                <PremiumCard key={post.id} post={post} variant="feature" />
              ))}
            </div>
          </Reveal>
        ) : (
          /* ── Standard / Reversed: 1 large + compact sidebar ── */
          <div className={`grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12 xl:gap-16
            ${layout === "reversed" ? "lg:[direction:rtl]" : ""}`}
          >
            {/* Large lead */}
            <Reveal y={18} delay={0.02}>
              <div className={layout === "reversed" ? "[direction:ltr]" : ""}>
                {lead && (
                  <PremiumCard
                    post={lead}
                    variant="cover"
                    aspectRatio="aspect-[16/10]"
                  />
                )}
                {/* Lead excerpt below the image */}
                {lead && (
                  <div className="mt-5">
                    <p className="text-[14px] text-tc-text-muted leading-relaxed line-clamp-3 max-w-lg">
                      {lead.excerpt}
                    </p>
                  </div>
                )}
              </div>
            </Reveal>

            {/* Compact sidebar */}
            {rest.length > 0 && (
              <Reveal y={18} delay={0.07}>
                <div className={layout === "reversed" ? "[direction:ltr]" : ""}>
                  <div className="flex flex-col">
                    {rest.slice(0, 4).map((post) => (
                      <PremiumCard key={post.id} post={post} variant="compact" />
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
