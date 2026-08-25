"use client";

import { useEffect, useRef } from "react";

/**
 * Soft spotlight cursor — a faint, warm radial glow that trails the pointer.
 * Deliberately barely-there (you feel it more than see it). Desktop fine-pointer
 * only, disabled under reduced motion, and painted behind content so it never
 * competes with reading. Updated on rAF via a CSS variable — no re-renders.
 */
export default function SpotlightCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let x = 0;
    let y = 0;
    const update = () => {
      raf = 0;
      el.style.setProperty("--sx", `${x}px`);
      el.style.setProperty("--sy", `${y}px`);
    };
    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      el.dataset.active = "true";
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onLeave = () => {
      el.dataset.active = "false";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} aria-hidden className="spotlight-layer" data-active="false" />;
}
