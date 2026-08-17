"use client";

import { useCallback, useRef } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";

/**
 * Top reading progress bar — 3px, orange gradient, rounded ends, soft glow.
 *
 * Updated imperatively with a compositor-only scale transform, avoiding layout
 * recalculation while the page scrolls.
 */
export default function ReadingProgress() {
  const fillRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const lastRoundedRef = useRef(-1);

  const onProgress = useCallback((p: number) => {
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${p / 100})`;
    const rounded = Math.round(p);
    if (rounded !== lastRoundedRef.current) {
      progressRef.current?.setAttribute("aria-valuenow", String(rounded));
      lastRoundedRef.current = rounded;
    }
  }, []);

  useScrollProgress(onProgress);

  return (
    <div
      ref={progressRef}
      className="fixed top-0 left-0 right-0 z-[70] h-[3px] bg-transparent pointer-events-none"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <div
        ref={fillRef}
        className="h-full origin-left rounded-full bg-gradient-to-r from-tc-primary to-tc-secondary shadow-glow will-change-transform"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
