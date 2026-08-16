"use client";

import { Fragment, useState, type ReactNode } from "react";
import { Search } from "lucide-react";

export type BlogListItem = {
  slug: string;
  /** Pre-computed lowercase match text; the post objects stay on the server. */
  search: string;
  /** Server-rendered card, passed through as a prop so it never ships as code. */
  card: ReactNode;
};

/**
 * Search island for the blog index. Cards arrive already rendered by the
 * server, so filtering only picks which of them to show — no post data and no
 * card implementation crosses the client boundary.
 */
export default function BlogList({
  items,
  filters,
}: {
  items: BlogListItem[];
  filters: ReactNode;
}) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const visible = q ? items.filter((item) => item.search.includes(q)) : items;

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <div className="relative flex-1">
          <label htmlFor="blog-search" className="sr-only">
            Search articles
          </label>
          <Search
            size={18}
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-tc-text-light"
          />
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="focus-ring w-full pl-11 pr-4 py-3.5 rounded-xl bg-tc-bg-card border border-tc-border text-sm text-tc-text placeholder:text-tc-text-light hover:border-tc-border-strong focus:border-tc-primary focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)] transition-all duration-200"
          />
        </div>

        {filters}
      </div>

      <p aria-live="polite" className="sr-only">
        {visible.length} {visible.length === 1 ? "article" : "articles"} shown
      </p>

      {visible.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mb-20">
          {visible.map((item) => (
            <Fragment key={item.slug}>{item.card}</Fragment>
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
    </>
  );
}
