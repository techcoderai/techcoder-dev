"use client";

import { cn } from "@/lib/utils";
import type { Heading } from "@/lib/utils";
import { useActiveHeading } from "@/hooks/useActiveHeading";

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const active = useActiveHeading(headings);

  if (!headings.length) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="overline text-tc-text-light mb-4">On this page</p>
      <ul className="flex flex-col border-l border-tc-border">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              style={{ paddingLeft: h.level === 3 ? 28 : 14 }}
              className={cn(
                "block -ml-px border-l-2 py-1.5 text-[13px] leading-snug transition-colors duration-200",
                active === h.id
                  ? "border-tc-primary text-tc-primary font-medium"
                  : "border-transparent text-tc-text-muted hover:text-tc-text hover:border-tc-border-strong"
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
