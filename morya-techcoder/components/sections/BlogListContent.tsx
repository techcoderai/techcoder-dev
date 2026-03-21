"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { BlogPost, BlogCategory } from "@/content/blogs";
import MagicBorderCard from "@/components/ui/MagicBorderCard";
import NewsletterBox from "@/components/ui/NewsletterBox";
import { cn } from "@/lib/utils";

const validCategories: BlogCategory[] = ["AI", "WebDev", "Tricks"];

export default function BlogListPage({
  posts,
  categories,
}: {
  posts: BlogPost[];
  categories: BlogCategory[];
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<BlogCategory | "All">("All");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category") as BlogCategory | null;
    if (cat && validCategories.includes(cat)) {
      setActiveCategory(cat);
    }
  }, []);

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        activeCategory === "All" || post.category === activeCategory;
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [query, activeCategory, posts]);

  return (
    <div className="section-padding pt-28 md:pt-32">
      <div className="container-wide mx-auto">
        {/* Page header */}
        <div className="mb-10 animate-fade-up">
          <h1 className="heading-xl text-3xl md:text-4xl mb-3">Blog</h1>
          <p className="text-tc-text-muted text-base md:text-lg leading-relaxed">
            Deep dives, quick wins, and everything in between.
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
              className="focus-ring w-full pl-11 pr-4 py-3.5 rounded-xl bg-white border border-gray-200 text-sm text-tc-text placeholder:text-tc-text-light outline-none hover:border-tc-text-light/50 focus:border-tc-primary focus:shadow-[0_0_0_3px_rgba(255,180,51,0.1)] transition-all duration-200"
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
                    ? "bg-tc-primary text-tc-text border-tc-primary shadow-sm"
                    : "bg-white text-tc-text-muted border-gray-200 hover:border-tc-primary hover:text-tc-primary active:bg-tc-bg-elevated"
                )}
              >
                {cat === "All" ? "All Posts" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mb-20">
            {filtered.map((post) => (
              <MagicBorderCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-xl border border-gray-200 shadow-md mb-20">
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
