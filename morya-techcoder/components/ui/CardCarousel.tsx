"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BlogPost } from "@/types/blog";
import MagicBorderCard from "@/components/ui/MagicBorderCard";

/**
 * A responsive, snapping horizontal slider for article cards. Falls back to a
 * native touch-swipe on mobile and shows glass prev/next controls on larger
 * screens (only when the track actually overflows). Used for featured articles
 * and other editorial rails where a horizontal scroll reads more elegantly than
 * a tall grid.
 */
export default function CardCarousel({ posts }: { posts: BlogPost[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.85 * dir, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={update}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {posts.map((post) => (
          <div
            key={post.id}
            className="snap-start shrink-0 w-[280px] sm:w-[300px] lg:w-[320px]"
          >
            <MagicBorderCard post={post} />
          </div>
        ))}
      </div>

      {/* Controls */}
      {canPrev && (
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="Previous"
          className="focus-ring hidden md:flex items-center justify-center absolute -left-4 top-[38%] -translate-y-1/2 w-10 h-10 rounded-full glass-strong text-tc-text hover:text-tc-primary hover:border-tc-primary transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
      )}
      {canNext && (
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="Next"
          className="focus-ring hidden md:flex items-center justify-center absolute -right-4 top-[38%] -translate-y-1/2 w-10 h-10 rounded-full glass-strong text-tc-text hover:text-tc-primary hover:border-tc-primary transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}
