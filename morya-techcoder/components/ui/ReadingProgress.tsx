"use client";

import { useCallback, useRef } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";

/**
 * Top reading progress bar — 3px, orange gradient, rounded ends, soft glow.
 *
 * Updated imperatively every animation frame (width, so the rounded end caps
 * stay crisp) for perfectly smooth motion with no React re-renders.
 */
export default function ReadingProgress() {
  const fillRef = useRef<HTMLDivElement>(null);

  const onProgress = useCallback((p: number) => {
    if (fillRef.current) fillRef.current.style.width = `${p}%`;
  }, []);

  useScrollProgress(onProgress);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[70] h-[3px] bg-transparent pointer-events-none"
      role="progressbar"
      aria-label="Reading progress"
    >
      <div
        ref={fillRef}
        className="h-full rounded-full bg-gradient-to-r from-tc-primary to-tc-secondary shadow-glow"
        style={{ width: "0%" }}
      />
    </div>
  );
}
