"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, List, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Heading } from "@/lib/utils";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useReadingState } from "@/hooks/useReadingState";
import { useReadingChrome } from "@/components/reading/ReadingChromeProvider";
import ReadingProgress from "@/components/ui/ReadingProgress";

/* Ring geometry (kept module-level so the progress callback stays stable). */
const RING_R = 15.5;
const RING_C = 2 * Math.PI * RING_R;
const COMPLETE_AT = 99.5;

/* ─── Floating circular progress + Contents trigger ──────────────────────── */
function FloatingReadingButton() {
  const { setSheetOpen } = useReadingChrome();
  const [done, setDone] = useState(false);
  const circleRef = useRef<SVGCircleElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  const onProgress = useCallback((p: number) => {
    if (circleRef.current) {
      circleRef.current.style.strokeDashoffset = String(RING_C * (1 - p / 100));
    }
    if (pctRef.current) pctRef.current.textContent = `${Math.round(p)}%`;
    setDone((prev) => {
      const next = p >= COMPLETE_AT;
      return prev === next ? prev : next;
    });
  }, []);

  useScrollProgress(onProgress);

  return (
    <button
      type="button"
      onClick={() => setSheetOpen(true)}
      aria-label={done ? "Article read — open contents" : "Open contents"}
      className="press focus-ring glass-strong fixed bottom-5 right-4 z-40 flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3.5 text-tc-text shadow-[var(--tc-shadow-lg)] lg:hidden"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <span className="relative flex h-9 w-9 items-center justify-center">
        <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90" aria-hidden>
          <defs>
            <linearGradient id="tcReadRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--tc-primary)" />
              <stop offset="100%" stopColor="var(--tc-primary-light)" />
            </linearGradient>
          </defs>
          <circle
            cx="18"
            cy="18"
            r={RING_R}
            fill="none"
            stroke="var(--tc-border-strong)"
            strokeWidth="3"
          />
          <circle
            ref={circleRef}
            cx="18"
            cy="18"
            r={RING_R}
            fill="none"
            stroke="url(#tcReadRing)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={RING_C}
            style={{ strokeDashoffset: RING_C }}
          />
        </svg>
        <span className="absolute flex items-center justify-center text-tc-primary">
          {done ? (
            <Check key="done" size={16} strokeWidth={3} className="animate-read-pop" />
          ) : (
            <List size={15} />
          )}
        </span>
        {done && (
          <span className="animate-read-pulse pointer-events-none absolute inset-0 rounded-full ring-2 ring-tc-primary/60" />
        )}
      </span>
      <span className="text-[13px] font-semibold tabular-nums">
        {done ? "100% Read" : <span ref={pctRef}>0%</span>}
      </span>
    </button>
  );
}

/* ─── Section indicator: completed check · active dot · upcoming dot ──────── */
function SectionIndicator({ state }: { state: "done" | "active" | "upcoming" }) {
  if (state === "done") {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-tc-primary/12 text-tc-primary">
        <Check size={12} strokeWidth={3} />
      </span>
    );
  }
  if (state === "active") {
    return (
      <span className="flex h-5 w-5 items-center justify-center">
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex h-2.5 w-2.5 items-center justify-center rounded-full bg-tc-primary"
        >
          <span className="absolute inset-0 rounded-full bg-tc-primary/40 blur-[3px]" />
        </motion.span>
      </span>
    );
  }
  return (
    <span className="flex h-5 w-5 items-center justify-center">
      <span className="h-1.5 w-1.5 rounded-full bg-tc-border-strong" />
    </span>
  );
}

/* ─── Premium bottom sheet ────────────────────────────────────────────────── */
function ReadingSheet({ headings }: { headings: Heading[] }) {
  const { sheetOpen, setSheetOpen } = useReadingChrome();
  const { activeId, completed } = useReadingState(headings);
  const headerPctRef = useRef<HTMLSpanElement>(null);

  const onProgress = useCallback((p: number) => {
    if (headerPctRef.current) headerPctRef.current.textContent = `${Math.round(p)}%`;
  }, []);
  useScrollProgress(onProgress);

  // Lock body scroll + close on Escape while open.
  useEffect(() => {
    if (!sheetOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheetOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen, setSheetOpen]);

  const allDone = headings.length > 0 && completed.size >= headings.length;

  return (
    <AnimatePresence>
      {sheetOpen && (
        <div className="lg:hidden">
          {/* Backdrop */}
          <motion.div
            key="reading-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSheetOpen(false)}
            className="fixed inset-0 z-[65] bg-black/40 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            key="reading-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Table of contents"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            className="fixed inset-x-0 bottom-0 z-[66] flex max-h-[74vh] flex-col rounded-t-[26px] border-t border-tc-border bg-tc-bg-card shadow-[0_-16px_50px_-12px_rgba(0,0,0,0.35)]"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            {/* Grabber */}
            <div className="flex shrink-0 justify-center pt-3 pb-1">
              <span className="h-1.5 w-10 rounded-full bg-tc-border-strong" />
            </div>

            <div className="flex shrink-0 items-center justify-between px-5 pb-3 pt-1">
              <div className="flex items-center gap-2.5">
                <p className="overline text-tc-text-light">On this page</p>
                <span className="rounded-full bg-tc-primary/10 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-tc-primary">
                  <span ref={headerPctRef}>0%</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                aria-label="Close"
                className="press focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-tc-border text-tc-text-muted"
              >
                <X size={16} />
              </button>
            </div>

            <nav
              aria-label="Table of contents"
              className="scrollbar-none flex-1 overflow-y-auto px-3 pb-3"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <ul className="flex flex-col">
                {headings.map((h) => {
                  const state = completed.has(h.id)
                    ? "done"
                    : activeId === h.id
                      ? "active"
                      : "upcoming";
                  return (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        onClick={() => setSheetOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl py-2.5 pr-3 transition-colors duration-200",
                          h.level === 3 ? "pl-8" : "pl-3",
                          state === "active"
                            ? "bg-tc-primary/10 font-semibold text-tc-primary"
                            : state === "done"
                              ? "text-tc-text-muted"
                              : "text-tc-text-muted hover:text-tc-text"
                        )}
                      >
                        <SectionIndicator state={state} />
                        <span
                          className={cn(
                            "min-w-0 flex-1 leading-snug",
                            h.level === 3 ? "text-[14px]" : "text-[15px]"
                          )}
                        >
                          {h.text}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Completion reward */}
            <AnimatePresence>
              {allDone && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="shrink-0 border-t border-tc-border px-5 py-3.5"
                >
                  <div className="flex items-center justify-center gap-2 text-[13px] font-semibold text-tc-primary">
                    <span className="animate-read-pop flex h-5 w-5 items-center justify-center rounded-full bg-tc-primary/12">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    100% Read — nicely done
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/**
 * Immersive mobile reading layer: the smooth top progress bar (all sizes) plus
 * the floating circular progress / Contents indicator and premium bottom sheet
 * (mobile only). Renders nothing outside of article pages.
 */
export default function ReadingLayer() {
  const { chrome } = useReadingChrome();
  if (!chrome) return null;

  return (
    <>
      <ReadingProgress />
      <FloatingReadingButton />
      <ReadingSheet headings={chrome.headings} />
    </>
  );
}
