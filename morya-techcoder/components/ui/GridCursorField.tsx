"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor-reactive grid (homepage only).
 *
 * Replaces the old spotlight glow. Instead of painting light *over* the page,
 * this draws a second copy of the existing 64px grid — same spacing, same
 * neutral line colour, plus a hairline dot at each intersection — and reveals
 * it only in the pointer's immediate neighbourhood via a mask. The radial is
 * purely a proximity function: nothing is rendered except grid, so there is no
 * visible circle, only lines that firm up slightly as the cursor passes.
 *
 * Pointer position is written to CSS variables inside one rAF — no React state,
 * no re-renders, no layout reads. Desktop fine-pointer only, off under reduced
 * motion, and it fades back to nothing when the pointer leaves the document.
 */
export default function GridCursorField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      raf = 0;
      el.style.setProperty("--cursor-x", `${x}px`);
      el.style.setProperty("--cursor-y", `${y}px`);
      el.dataset.active = "true";
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      el.dataset.active = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} aria-hidden className="grid-cursor-field" data-active="false" />;
}
