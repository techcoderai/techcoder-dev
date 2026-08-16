"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

/** The theme lives on <html>, so read it from the DOM instead of mirroring it in state. */
function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const isDark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => false
  );

  const toggle = () => {
    const next = document.documentElement.classList.toggle("dark") ? "dark" : "light";
    try {
      localStorage.setItem("tc-theme", next);
    } catch {
      /* storage unavailable (private mode) — the class still applies */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className={`focus-ring group relative flex h-9 w-9 items-center justify-center rounded-full border border-tc-border bg-tc-glass-bg text-tc-text-muted transition-colors duration-300 hover:border-tc-primary hover:text-tc-primary ${className}`}
    >
      {/* Icon state is CSS-driven so it is correct on first paint, before hydration. */}
      <Sun
        size={16}
        aria-hidden="true"
        className="absolute rotate-0 scale-100 opacity-100 transition-all duration-500 dark:rotate-90 dark:scale-0 dark:opacity-0"
      />
      <Moon
        size={16}
        aria-hidden="true"
        className="absolute -rotate-90 scale-0 opacity-0 transition-all duration-500 dark:rotate-0 dark:scale-100 dark:opacity-100"
      />
    </button>
  );
}
