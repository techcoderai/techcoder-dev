"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/utils";

/**
 * Returns the id of the heading currently in view, using an IntersectionObserver
 * scroll-spy. Extracted from `TableOfContents` so the active-section logic is
 * reusable and testable on its own.
 */
export function useActiveHeading(headings: Heading[]): string {
  const [active, setActive] = useState<string>(headings[0]?.id ?? "");

  useEffect(() => {
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-104px 0px -68% 0px", threshold: [0, 1] }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  return active;
}
