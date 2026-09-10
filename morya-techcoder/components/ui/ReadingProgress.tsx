"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll progress bar for article pages.
 *
 * Writes `transform: scaleX()` straight to the DOM inside a rAF-coalesced
 * scroll handler: no React state, no per-event re-render, and no layout-
 * triggering width animation. The bar is purely scroll-linked, so there is no
 * independent motion to reduce for `prefers-reduced-motion` users.
 */
export default function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const lastRoundedRef = useRef(-1);

  useEffect(() => {
    let frame = 0;

    const paint = () => {
      frame = 0;
      const el = document.scrollingElement || document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
      const rounded = Math.round(progress * 100);
      if (rounded !== lastRoundedRef.current) {
        progressRef.current?.setAttribute("aria-valuenow", String(rounded));
        lastRoundedRef.current = rounded;
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      ref={progressRef}
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]"
    >
      <div
        ref={barRef}
        style={{ transform: "scaleX(0)" }}
        className="h-full w-full origin-left rounded-r-full bg-gradient-to-r from-tc-primary to-tc-secondary shadow-glow will-change-transform"
      />
    </div>
  );
}
