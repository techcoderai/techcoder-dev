import Link from "next/link";
import { ArrowUpRight, Newspaper } from "lucide-react";
import { blogPosts } from "@/content/loader";

/**
 * An in-body list of further reading, hand-picked by the author.
 *
 * Only the slugs live in the MDX file — titles, categories, and reading times
 * are resolved from the content loader at build time, so a retitled article
 * never leaves a stale label behind. Slugs that no longer resolve are dropped
 * rather than rendered as dead links.
 *
 * This complements, rather than replaces, the automatic "Keep reading" rail at
 * the end of every article: that one is same-category and algorithmic, this one
 * is an editorial choice made mid-argument.
 *
 * MDX usage:
 *   <RelatedArticles slugs={["hello-world", "css-container-queries-guide"]} />
 */
export default function RelatedArticles({
  title = "Related reading",
  slugs = [],
}: {
  title?: string;
  slugs?: (string | null)[];
}) {
  const posts = slugs
    .map((slug) => blogPosts.find((post) => post.slug === slug))
    .filter((post) => post !== undefined);

  if (posts.length === 0) return null;

  return (
    <aside className="my-7 rounded-2xl border border-tc-border bg-tc-bg-elevated p-5 sm:p-6">
      <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-tc-text-light">
        <Newspaper size={14} aria-hidden="true" />
        {title}
      </p>
      <ul className="flex flex-col !mb-0 !pl-0">
        {posts.map((post) => (
          <li key={post.slug} className="!mb-0 !list-none">
            <Link
              href={`/blog/${post.slug}`}
              className="focus-ring group -mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 !bg-none transition-colors duration-[var(--tc-dur)] hover:bg-tc-bg-card"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-tc-text group-hover:text-tc-primary">
                  {post.title}
                </span>
                <span className="block text-xs text-tc-text-light">
                  {post.category} · {post.readingTime}
                </span>
              </span>
              <ArrowUpRight
                size={16}
                className="shrink-0 text-tc-text-light transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
