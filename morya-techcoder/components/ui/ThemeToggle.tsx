"use client";

import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const nextIsDark = !root.classList.contains("dark");
    const apply = () => {
      root.classList.toggle("dark", nextIsDark);
      try {
        localStorage.setItem("tc-theme", nextIsDark ? "dark" : "light");
      } catch {
        /* ignore */
      }
    };

    // Cross-fade the theme swap via the View Transitions API where available
    // (progressive enhancement; respects reduced-motion).
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (doc.startViewTransition && !reduce) doc.startViewTransition(apply);
    else apply();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      className={`theme-toggle focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-tc-border bg-tc-glass-bg text-tc-text-muted ${className}`}
    >
      {/* The hover tilt lives on this wrapper because the icons themselves
          already animate `transform` for the sun/moon crossfade. */}
      <span className="theme-icon-wrap relative flex h-4 w-4 items-center justify-center">
        <Sun
          size={16}
          className="theme-icon-sun absolute transition-[transform,opacity] duration-[var(--tc-dur)]"
        />
        <Moon
          size={16}
          className="theme-icon-moon absolute transition-[transform,opacity] duration-[var(--tc-dur)]"
        />
      </span>
    </button>
  );
}
