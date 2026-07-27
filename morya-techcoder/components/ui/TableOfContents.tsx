"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Heading } from "@/lib/utils";
import { useActiveHeading } from "@/hooks/useActiveHeading";

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const active = useActiveHeading(headings);

  if (!headings.length) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="overline text-tc-text-light mb-4">On this page</p>
      <ul className="relative flex flex-col border-l border-tc-border">
        {headings.map((h) => {
          const isActive = active === h.id;
          return (
            <li key={h.id} className="relative">
              {/* Single indicator that glides between items (layout animation) */}
              {isActive && (
                <motion.span
                  layoutId="toc-active-indicator"
                  className="absolute -left-px top-1 bottom-1 w-0.5 rounded-full bg-tc-primary"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <a
                href={`#${h.id}`}
                style={{ paddingLeft: h.level === 3 ? 28 : 14 }}
                className={cn(
                  "block py-1.5 text-[13px] leading-snug transition-[color,transform] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isActive
                    ? "translate-x-0.5 font-medium text-tc-primary"
                    : "text-tc-text-muted hover:text-tc-text"
                )}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
