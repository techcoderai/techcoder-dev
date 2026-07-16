"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import type { BlogPost } from "@/types/blog";
import { CATEGORY_KEYS, type BlogCategory } from "@/lib/categories";
import { filterPosts, type CategoryFilter } from "@/lib/posts";
import MagicBorderCard from "@/components/ui/MagicBorderCard";
import NewsletterBox from "@/components/ui/NewsletterBox";
import { cn } from "@/lib/utils";

export default function BlogListPage({
  posts,
  categories,
}: {
  posts: BlogPost[];
  categories: BlogCategory[];
}) {
  const searchParams = useSearchParams();
  // Seed the active filter from a `?category=` URL param (e.g. links from the
  // home page). Read during render — no effect needed.
  const paramCategory = searchParams.get("category");
  const initialCategory: CategoryFilter =
    paramCategory && CATEGORY_KEYS.includes(paramCategory as BlogCategory)
      ? (paramCategory as BlogCategory)
      : "All";

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<CategoryFilter>(initialCategory);

  const filtered = useMemo(
    () => filterPosts(posts, { query, category: activeCategory }),
    [query, activeCategory, posts]
  );

  return (
    <div className="section-padding pt-28 md:pt-32">
      <div className="container-wide mx-auto">
        {/* Page header */}
        <div className="mb-10 animate-fade-up">
          <span className="chip mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-tc-primary" />
            The Library
          </span>
          <h1 className="heading-xl text-3xl md:text-4xl mb-3">Articles &amp; guides</h1>
          <p className="text-tc-text-muted text-base md:text-lg leading-relaxed max-w-xl">
            In-depth guides, hands-on tutorials, and deep dives — every one written and
            edited by the TechCoder team.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-tc-text-light"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="focus-ring w-full pl-11 pr-4 py-3.5 rounded-xl bg-tc-bg-card border border-tc-border text-sm text-tc-text placeholder:text-tc-text-light outline-none hover:border-tc-border-strong focus:border-tc-primary focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)] transition-all duration-200"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal size={15} className="text-tc-text-light mr-1 shrink-0" />
            {(["All", ...categories] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "focus-ring px-4 py-2.5 text-xs font-bold rounded-full border transition-all duration-200",
                  activeCategory === cat
                    ? "bg-gradient-to-r from-tc-primary to-tc-secondary text-white border-transparent shadow-glow"
                    : "bg-tc-bg-card text-tc-text-muted border-tc-border hover:border-tc-primary hover:text-tc-primary active:bg-tc-bg-elevated"
                )}
              >
                {cat === "All" ? "All Posts" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-20">
            {filtered.map((post) => (
              <MagicBorderCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 card-surface mb-20">
            <p className="text-tc-text text-lg font-semibold mb-2">No posts found</p>
            <p className="text-sm text-tc-text-light">
              Try adjusting your search or filter.
            </p>
          </div>
        )}

        {/* Newsletter */}
        <NewsletterBox />
      </div>
    </div>
  );
}
