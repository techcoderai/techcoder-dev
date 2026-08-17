"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Heading } from "@/lib/utils";
import { useReadingState } from "@/hooks/useReadingState";

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const { activeId, completed } = useReadingState(headings);
  const reduceMotion = useReducedMotion();

  if (!headings.length) return null;

  return (
    <nav aria-label="Table of contents">
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="overline text-tc-text-light">On this page</p>
        <span className="text-[11px] font-medium tabular-nums text-tc-text-light">
          {completed.size}/{headings.length}
        </span>
      </div>
      <ul className="relative flex flex-col border-l border-tc-border">
        {headings.map((h) => {
          const isActive = activeId === h.id;
          const isDone = completed.has(h.id);
          return (
            <li key={h.id} className="relative">
              {/* Single indicator that glides between items (layout animation) */}
              {isActive && (
                <motion.span
                  layoutId="toc-active-indicator"
                  className="absolute -left-px top-1 bottom-1 w-0.5 rounded-full bg-tc-primary"
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 420, damping: 34 }
                  }
                />
              )}
              <a
                href={`#${h.id}`}
                style={{ paddingLeft: h.level === 3 ? 28 : 14 }}
                className={cn(
                  "flex items-center gap-2 py-1.5 pr-2 text-[13px] leading-snug transition-[color,transform] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isActive
                    ? "translate-x-0.5 font-medium text-tc-primary"
                    : "text-tc-text-muted hover:text-tc-text"
                )}
              >
                <span className="min-w-0 flex-1">{h.text}</span>
                {isDone && !isActive && (
                  <Check
                    size={12}
                    strokeWidth={3}
                    className="animate-read-pop shrink-0 text-tc-primary/70"
                  />
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
