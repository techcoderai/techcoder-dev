"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Heading } from "@/lib/utils";

export default function TableOfContents({ headings }: { headings: Heading[] }) {
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
