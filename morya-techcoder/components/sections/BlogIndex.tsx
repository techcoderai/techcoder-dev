import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { postSummaries, getCategories } from "@/content/loader";
import { getPostsByCategory, searchIndexOf } from "@/lib/posts";
import { CATEGORIES, categorySlug, type BlogCategory } from "@/lib/categories";
import MagicBorderCard from "@/components/ui/MagicBorderCard";
import NewsletterBox from "@/components/ui/NewsletterBox";
import BlogList from "@/components/ui/BlogList";
import { cn } from "@/lib/utils";

function CategoryLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "focus-ring px-4 py-2.5 text-xs font-bold rounded-full border transition-all duration-200",
        active
          ? "bg-gradient-to-r from-tc-primary to-tc-secondary text-white border-transparent shadow-glow"
          : "bg-tc-bg-card text-tc-text-muted border-tc-border hover:border-tc-primary hover:text-tc-primary active:bg-tc-bg-elevated"
      )}
    >
      {children}
    </Link>
  );
}

/**
 * Shared blog index, used by `/blog` and `/blog/category/[category]`.
 * Both routes are statically generated: category filtering happens here on the
 * server, and only free-text search runs on the client.
 */
export default function BlogIndex({ category }: { category?: BlogCategory }) {
  const posts = category
    ? getPostsByCategory(postSummaries, category)
    : postSummaries;
  const meta = category ? CATEGORIES[category] : null;

  const items = posts.map((post) => ({
    slug: post.slug,
    search: searchIndexOf(post),
    card: <MagicBorderCard post={post} />,
  }));

  const filters = (
    <nav aria-label="Filter by category" className="flex items-center gap-2 flex-wrap">
      <SlidersHorizontal
        size={15}
        aria-hidden="true"
        className="text-tc-text-light mr-1 shrink-0"
      />
      <CategoryLink href="/blog" active={!category}>
        All Posts
      </CategoryLink>
      {getCategories().map((key) => (
        <CategoryLink
          key={key}
          href={`/blog/category/${categorySlug(key)}`}
          active={category === key}
        >
          {key}
        </CategoryLink>
      ))}
    </nav>
  );

  return (
    <div className="section-padding pt-28 md:pt-32">
      <div className="container-wide mx-auto">
        <div className="mb-10">
          <span className="chip mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-tc-primary" />
            The Library
          </span>
          <h1 className="heading-xl text-3xl md:text-4xl mb-3">
            {meta ? meta.label : "Articles & guides"}
          </h1>
          <p className="text-tc-text-muted text-base md:text-lg leading-relaxed max-w-xl">
            {meta
              ? meta.description
              : "In-depth guides, hands-on tutorials, and deep dives — every one written and edited by the TechCoder team."}
          </p>
        </div>

        <BlogList items={items} filters={filters} />

        <NewsletterBox />
      </div>
    </div>
  );
}
