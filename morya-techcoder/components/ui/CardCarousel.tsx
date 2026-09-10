"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogPostSummary } from "@/types/blog";
import MagicBorderCard from "@/components/ui/MagicBorderCard";

type Props = {
  posts: BlogPostSummary[];
  /** Larger cards with taller media — used for the AI rail. */
  size?: "default" | "lg";
  /** Pixels per second for the continuous drift. Slow = premium. */
  speed?: number;
  className?: string;
};

/**
 * Premium infinite editorial carousel.
 *
 * Continuous transform-based drift (no snap, no abrupt resets). The track is
 * duplicated; when the offset crosses one full set width we wrap by that width
 * so the loop is seamless. Hover / focus / drag pause the autoplay; pointer
 * drag and keyboard arrows nudge the rail with momentum.
 */
export default function CardCarousel({
  posts,
  size = "default",
  speed = 28,
  className,
}: Props) {
  const labelId = useId();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const setWidthRef = useRef(0);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const dragMovedRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTRef = useRef(0);
  const rafRef = useRef(0);
  const reducedMotionRef = useRef(false);

  const [paused, setPaused] = useState(false);
  const [inViewport, setInViewport] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  // Keep one set wide enough for a seamless desktop wrap without rendering
  // more duplicate cards than necessary.
  const repeatCount = posts.length === 0 ? 0 : Math.max(1, Math.ceil(4 / posts.length));
  const loopPosts = Array.from({ length: repeatCount }, () => posts).flat();

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    // Half the track = one full set (we render two identical sets).
    setWidthRef.current = track.scrollWidth / 2;
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mq.matches;
    const onChange = () => {
      reducedMotionRef.current = mq.matches;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInViewport(entry.isIntersecting),
      { rootMargin: "160px 0px" }
    );
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, loopPosts.length, size]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (!inViewport || !pageVisible || reducedMotionRef.current) return;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(32, now - last) / 1000;
      last = now;

      const setW = setWidthRef.current;
      if (setW > 0 && trackRef.current) {
        if (!draggingRef.current) {
          // Decay leftover drag velocity into a soft coast.
          if (Math.abs(velocityRef.current) > 2) {
            offsetRef.current += velocityRef.current * dt;
            velocityRef.current *= 0.92;
          } else {
            velocityRef.current = 0;
            if (!pausedRef.current && !reducedMotionRef.current) {
              offsetRef.current -= speed * dt;
            }
          }
        }

        // Seamless wrap — never snaps visually because content is duplicated.
        if (offsetRef.current <= -setW) offsetRef.current += setW;
        if (offsetRef.current > 0) offsetRef.current -= setW;

        trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inViewport, pageVisible, speed]);

  const nudge = (dir: 1 | -1) => {
    const step = (viewportRef.current?.clientWidth ?? 320) * 0.7;
    if (reducedMotionRef.current) {
      offsetRef.current += dir * step;
      const setW = setWidthRef.current;
      if (setW > 0) {
        if (offsetRef.current <= -setW) offsetRef.current += setW;
        if (offsetRef.current > 0) offsetRef.current -= setW;
      }
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }
      return;
    }
    velocityRef.current += dir * step * 1.8;
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    draggingRef.current = true;
    dragMovedRef.current = false;
    lastXRef.current = e.clientX;
    lastTRef.current = performance.now();
    velocityRef.current = 0;
    setPaused(true);
    // Pointer capture is deferred to the first real move (see onPointerMove):
    // capturing on every press retargets the resulting `click` event to this
    // div instead of the link the user pressed, which silently breaks
    // navigation on a plain tap/click.
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const now = performance.now();
    const dx = e.clientX - lastXRef.current;
    if (Math.abs(dx) > 6 && !dragMovedRef.current) {
      dragMovedRef.current = true;
      // Now that this is a genuine drag (not a click), capture the pointer so
      // move/up events keep arriving even if the cursor leaves the viewport.
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    const dt = Math.max(1, now - lastTRef.current);
    offsetRef.current += dx;
    velocityRef.current = (dx / dt) * 1000;
    lastXRef.current = e.clientX;
    lastTRef.current = now;
    if (reducedMotionRef.current && trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    }
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    if (reducedMotionRef.current) {
      velocityRef.current = 0;
      setPaused(false);
      return;
    }
    // Resume autoplay after a short beat so the coast can finish.
    window.setTimeout(() => {
      if (!draggingRef.current) setPaused(false);
    }, 900);
  };

  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    // Suppress link navigation after a real drag so cards stay clickable on tap.
    if (dragMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      dragMovedRef.current = false;
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      nudge(1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nudge(-1);
    }
  };

  if (posts.length === 0) return null;

  // Mobile-first: one primary card fills the viewport with a ~10% peek of the
  // next card (Apple News / App Store editorial feel). Fixed pixel widths kick
  // in from sm+ so the desktop rail keeps its multi-card cadence.
  const cardWidth =
    size === "lg"
      ? "w-[87vw] max-w-[380px] sm:w-[340px] sm:max-w-none lg:w-[380px]"
      : "w-[84vw] max-w-[340px] sm:w-[300px] sm:max-w-none lg:w-[320px]";

  return (
    <div className={cn("relative group/carousel", className)}>
      <p id={labelId} className="sr-only">
        Article carousel. Use left and right arrow keys to move, or drag.
      </p>

      <div
        ref={viewportRef}
        role="region"
        aria-roledescription="carousel"
        aria-labelledby={labelId}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => {
          if (!draggingRef.current) setPaused(false);
        }}
        onFocus={() => setPaused(true)}
        onBlur={() => {
          if (!draggingRef.current) setPaused(false);
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        className={cn(
          "carousel-fade overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-tc-primary focus-visible:ring-offset-2 focus-visible:ring-offset-tc-bg rounded-xl cursor-grab active:cursor-grabbing select-none",
          "touch-pan-y"
        )}
      >
        <div
          ref={trackRef}
          className="flex gap-4 sm:gap-5 w-max"
          style={{ transform: "translate3d(0,0,0)" }}
        >
          {[0, 1].map((copy) =>
            loopPosts.map((post, i) => {
              // The track scrolls continuously and wraps seamlessly, so both
              // copies (and any padding repeats used to fill out fewer than 4
              // unique posts) are real, visible, clickable cards at different
              // points in the animation — never disable pointer events on them.
              // `aria-hidden` on repeats just avoids the same title being
              // announced more than once to assistive tech.
              const isDuplicateContent = copy === 1 || i >= posts.length;
              return (
                <div
                  key={`${copy}-${post.id}-${i}`}
                  className={cn("shrink-0", cardWidth)}
                  aria-hidden={isDuplicateContent || undefined}
                >
                  <MagicBorderCard post={post} size={size} />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Desktop nudge controls — optional, never gate the infinite loop */}
      <button
        type="button"
        onClick={() => nudge(1)}
        aria-label="Scroll articles left"
        className="focus-ring hidden md:flex items-center justify-center absolute -left-3 lg:-left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-strong text-tc-text hover:text-tc-primary hover:border-tc-primary transition-colors opacity-0 group-hover/carousel:opacity-100 focus-visible:opacity-100"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        onClick={() => nudge(-1)}
        aria-label="Scroll articles right"
        className="focus-ring hidden md:flex items-center justify-center absolute -right-3 lg:-right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-strong text-tc-text hover:text-tc-primary hover:border-tc-primary transition-colors opacity-0 group-hover/carousel:opacity-100 focus-visible:opacity-100"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
