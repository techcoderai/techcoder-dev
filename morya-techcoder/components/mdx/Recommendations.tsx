import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Trophy } from "lucide-react";

/**
 * The backbone of a buying guide: a set of awarded picks, each with the award
 * it won, what it costs, and why it earned the spot.
 *
 * Keeping the award and price as fields rather than prose means a guide reads
 * consistently from article to article, and the structure survives a redesign.
 *
 * MDX usage:
 *   <Recommendations>
 *   <Recommendation award="Best overall" product="Framework 13" price="$1,049"
 *                   href="https://frame.work">
 *   The only laptop here you can still repair in five years.
 *   </Recommendation>
 *   </Recommendations>
 */
export function Recommendations({ children }: { children: React.ReactNode }) {
  return <div className="my-7 flex flex-col gap-4">{children}</div>;
}

export function Recommendation({
  award,
  product,
  price,
  href,
  image,
  children,
}: {
  /** The superlative this pick won, e.g. "Best overall", "Best budget". */
  award?: string;
  product?: string;
  price?: string;
  href?: string;
  image?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-tc-border bg-tc-bg-card p-5 transition-[border-color] duration-[var(--tc-dur)] hover:border-tc-border-strong">
      <div className="flex items-start gap-4">
        {image && (
          <Image
            src={image}
            alt=""
            width={88}
            height={88}
            className="!my-0 hidden h-22 w-22 shrink-0 rounded-xl border border-tc-border object-cover sm:block"
          />
        )}
        <div className="min-w-0 flex-1">
          {award && (
            <p className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-tc-primary/12 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-tc-primary">
              <Trophy size={12} aria-hidden="true" />
              {award}
            </p>
          )}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="font-semibold text-tc-text">{product}</p>
            {price && (
              <p className="font-mono text-sm text-tc-text-muted">{price}</p>
            )}
          </div>
          <div className="mt-2 text-[15px] leading-relaxed text-tc-text-muted [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p]:!text-[15px]">
            {children}
          </div>
          {href && (
            <Link
              href={href}
              className="focus-ring mt-3 inline-flex items-center gap-1 rounded-lg !bg-none text-sm font-medium text-tc-primary hover:underline"
              rel="nofollow noopener"
              target="_blank"
            >
              View product
              <ArrowUpRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
