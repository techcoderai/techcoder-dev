"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

type NavLink = { href: string; label: string };

/**
 * Desktop primary navigation.
 *
 * Two effects run here, and neither touches React state — the component
 * re-renders only when the route changes:
 *
 *   1. A single shared indicator that *travels* between items. Because it's one
 *      persistent DOM node moved with `translate3d`, going Home → Articles reads
 *      as one object sliding rather than two states swapping. Its width is
 *      fixed, so nothing animates layout and the rounded ends stay round.
 *   2. A faint warm highlight that trails the pointer across the group. The
 *      pointer position is written to a CSS variable on `requestAnimationFrame`
 *      (the same approach as `SpotlightCursor`), and `@property` lets the
 *      browser interpolate it — so there is no per-frame React work and no lerp
 *      loop of our own.
 *
 * Intentionally Framer-free: magnetic springs + layoutId pills pulled ~90KB of
 * motion into every route.
 */
export default function NavLinks({
  links,
  pathname,
}: {
  links: NavLink[];
  pathname: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const activeHref = links.find((l) => l.href === pathname)?.href ?? null;

  // Position the shared indicator under the active item.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const item = el.querySelector<HTMLElement>('a[data-active="true"]');
      if (!item) return;
      // offsetLeft is relative to the container, which is the offset parent.
      el.style.setProperty(
        "--nav-ind-x",
        `${item.offsetLeft + item.offsetWidth / 2}px`
      );
    };

    measure();
    // Transitions are enabled only after the first placement, so the indicator
    // fades in where it belongs instead of sliding in from the left edge.
    const raf = requestAnimationFrame(() => {
      el.dataset.ready = "true";
    });

    // Web fonts land after hydration and change label widths.
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [activeHref]);

  // Pointer-following ambient highlight.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Pointless on touch, and unwelcome when motion is reduced — in both cases
    // no listeners are attached at all.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let x = 0;
    let rect: DOMRect | null = null;

    const write = () => {
      raf = 0;
      el.style.setProperty("--nav-mx", `${x}px`);
    };
    const onEnter = (e: PointerEvent) => {
      rect = el.getBoundingClientRect();
      // Seed the position from the entry point, so the highlight arrives where
      // the pointer actually is rather than gliding in from the last one.
      x = e.clientX - rect.left;
      write();
      el.dataset.glow = "true";
    };
    const onMove = (e: PointerEvent) => {
      // Cached so pointer movement never forces a layout read.
      if (!rect) rect = el.getBoundingClientRect();
      x = e.clientX - rect.left;
      if (!raf) raf = requestAnimationFrame(write);
    };
    const onLeave = () => {
      el.dataset.glow = "false";
    };
    // The bar changes height when the page scrolls past the compact threshold.
    const invalidate = () => {
      rect = null;
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate, { passive: true });
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="nav-links hidden lg:flex items-center gap-0.5 mx-auto"
      data-has-active={activeHref ? "true" : "false"}
    >
      <span aria-hidden className="nav-glow" />

      {links.map((link) => {
        const active = activeHref === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            data-active={active ? "true" : "false"}
            className="nav-link focus-ring"
          >
            <span className="nav-link-label">{link.label}</span>
            <span aria-hidden className="nav-link-underline" />
          </Link>
        );
      })}

      <span aria-hidden className="nav-indicator" />
    </div>
  );
}
