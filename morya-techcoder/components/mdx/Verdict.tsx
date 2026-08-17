import { Award } from "lucide-react";
import EditorialPanel from "@/components/mdx/EditorialPanel";

/**
 * The closing judgement of a review: what TechCoder actually thinks, and who
 * should or shouldn't buy it. One per article, at the end.
 *
 * The numeric score deliberately lives in frontmatter rather than here — it's
 * also needed by the article sidebar and by the review structured data, and a
 * rating that exists in two places will eventually disagree with itself.
 *
 * MDX usage:
 *   <Verdict product="Framework 13" bestFor="Tinkerers"
 *            avoidIf="You need all-day battery">
 *   The most repairable laptop you can buy, and it no longer asks you to
 *   sacrifice much to get there.
 *   </Verdict>
 */
export default function Verdict({
  product,
  bestFor,
  avoidIf,
  children,
}: {
  product?: string;
  bestFor?: string;
  avoidIf?: string;
  children: React.ReactNode;
}) {
  return (
    <EditorialPanel
      icon={Award}
      eyebrow="TechCoder verdict"
      title={product}
      tone="violet"
    >
      {children}
      {(bestFor || avoidIf) && (
        <dl className="mt-4 grid gap-3 border-t border-tc-border pt-4 sm:grid-cols-2">
          {bestFor && (
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-tc-cat-guides-text">
                Best for
              </dt>
              <dd className="mt-1 text-sm text-tc-text">{bestFor}</dd>
            </div>
          )}
          {avoidIf && (
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-tc-accent">
                Avoid if
              </dt>
              <dd className="mt-1 text-sm text-tc-text">{avoidIf}</dd>
            </div>
          )}
        </dl>
      )}
    </EditorialPanel>
  );
}
