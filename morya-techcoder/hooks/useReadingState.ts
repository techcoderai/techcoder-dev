"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/utils";

export type ReadingState = {
  /** Id of the heading whose section the reader is currently in. */
  activeId: string;
  /** Ids of headings whose sections have been read (scrolled past). */
  completed: Set<string>;
};

/** Distance from the top (navbar + toolbar) at which a heading counts as "reached". */
const REACHED_OFFSET = 120;
/** Progress at which we treat the article as finished and mark all sections done. */
const COMPLETE_AT = 99;

/**
 * Scroll-spy for the reading experience: which heading is active and which
 * sections are already read. Kept separate from `useScrollProgress` because
 * these values change infrequently (only when crossing a section), so storing
 * them in state is cheap — unlike the per-frame progress percentage.
 */
export function useReadingState(headings: Heading[]): ReadingState {
  const [activeId, setActiveId] = useState<string>("");
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    // No headings → nothing to track; initial state ("" / []) already applies.
    if (!headings.length) return;

    let ticking = false;

    const compute = () => {
      ticking = false;
      const el = document.scrollingElement || document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const progress = max > 0 ? (el.scrollTop / max) * 100 : 0;

      let activeIndex = 0;
      for (let i = 0; i < headings.length; i++) {
        const node = document.getElementById(headings[i].id);
        if (!node) continue;
        if (node.getBoundingClientRect().top - REACHED_OFFSET <= 0) activeIndex = i;
      }

      const active = headings[activeIndex]?.id ?? "";
      setActiveId((prev) => (prev === active ? prev : active));

      const done: string[] = [];
      for (let i = 0; i < activeIndex; i++) done.push(headings[i].id);
      if (progress >= COMPLETE_AT) {
        for (const h of headings) if (!done.includes(h.id)) done.push(h.id);
      }
      setCompleted((prev) =>
        prev.length === done.length && prev.every((v, i) => v === done[i]) ? prev : done
      );
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  return { activeId, completed: new Set(completed) };
}
