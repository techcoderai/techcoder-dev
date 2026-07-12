"use client";

import { useEffect, useState } from "react";

/**
 * Tracks how far the user has scrolled through the page, as a 0–100 percentage.
 * Extracted from `ReadingProgress` so the scroll math can be reused (e.g. a
 * future "back to top" button or per-section progress).
 */
export function useReadingProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = document.scrollingElement || document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return progress;
}
