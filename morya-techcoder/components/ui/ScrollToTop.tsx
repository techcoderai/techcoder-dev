"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Calm scroll-to-top affordance. Fades in past ~700px of scroll and glides the
 * page home. Sits bottom-left on mobile so it never collides with the article
 * reading indicator (bottom-right); bottom-right on desktop.
 */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        setVisible(window.scrollY > 700);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Scroll to top"
      className="float-btn-in press focus-ring glass-strong fixed bottom-5 left-4 z-30 flex h-11 w-11 items-center justify-center rounded-full text-tc-text shadow-[var(--tc-shadow-lg)] hover:text-tc-primary lg:left-auto lg:right-6"
    >
      <ArrowUp size={18} />
    </button>
  );
}
