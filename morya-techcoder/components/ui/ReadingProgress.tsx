"use client";

import { useReadingProgress } from "@/hooks/useReadingProgress";

export default function ReadingProgress() {
  const progress = useReadingProgress();

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent pointer-events-none">
      <div
        className="h-full rounded-r-full bg-gradient-to-r from-tc-primary to-tc-secondary shadow-glow transition-[width] duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
