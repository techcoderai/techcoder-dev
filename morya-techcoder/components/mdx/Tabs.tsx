"use client";

import { Children, isValidElement, useState, type ReactElement } from "react";
import { cn } from "@/lib/utils";

type TabProps = { label: string; children: React.ReactNode };

/**
 * Tabbed content. Wrap `<Tab label="...">` items in `<Tabs>`.
 *
 * MDX usage:
 *   <Tabs>
 *   <Tab label="npm">```bash\nnpm install\n```</Tab>
 *   <Tab label="pnpm">```bash\npnpm add\n```</Tab>
 *   </Tabs>
 */
export function Tabs({ children }: { children: React.ReactNode }) {
  const tabs = Children.toArray(children).filter(
    (child): child is ReactElement<TabProps> => isValidElement(child)
  );
  const [active, setActive] = useState(0);

  if (tabs.length === 0) return null;

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-tc-border bg-tc-bg-card">
      <div
        role="tablist"
        className="flex gap-1 border-b border-tc-border bg-tc-bg-elevated px-2 pt-2"
      >
        {tabs.map((tab, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={cn(
              "focus-ring rounded-t-lg px-3.5 py-2 text-sm font-medium transition-colors",
              active === i
                ? "bg-tc-bg-card text-tc-primary"
                : "text-tc-text-muted hover:text-tc-text"
            )}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div className="p-4 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {tabs[active]}
      </div>
    </div>
  );
}

export function Tab({ children }: TabProps) {
  return <>{children}</>;
}
