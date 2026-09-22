"use client";

import { useEffect } from "react";

/**
 * Imperative, 60fps-friendly scroll progress.
 *
 * Rather than storing the 0–100 percentage in React state (which would re-render
 * the tree on every scroll frame), this hook batches reads with
 * `requestAnimationFrame` and hands the value to a callback. Consumers write it
 * straight to a ref's style/textContent — buttery smooth, zero render churn.
 *
 * `onProgress` must be stable (wrap it in `useCallback`).
 */
export function useScrollProgress(onProgress: (progress: number) => void): void {
  useEffect(() => {
    let ticking = false;
    let frame = 0;

    const compute = () => {
      ticking = false;
      const el = document.scrollingElement || document.documentElement;
      const readingEnd = document.querySelector<HTMLElement>("[data-reading-content]");
      const hasMeasuredReadingEnd = readingEnd && readingEnd.offsetHeight > 0;
      const end = hasMeasuredReadingEnd
        ? readingEnd.getBoundingClientRect().bottom + el.scrollTop
        : el.scrollHeight;
      const max = end - el.clientHeight;
      const p = max > 0 ? Math.min(100, Math.max(0, (el.scrollTop / max) * 100)) : 0;
      onProgress(p);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      frame = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [onProgress]);
}
