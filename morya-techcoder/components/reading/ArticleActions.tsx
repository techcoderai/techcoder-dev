"use client";

import {
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  Bookmark,
  Check,
  Link2,
  Printer,
  Share2,
  TextQuote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollProgress } from "@/hooks/useScrollProgress";

const BOOKMARKS_KEY = "tc:bookmarks";
const BOOKMARKS_EVENT = "tc:bookmarks-change";

function readBookmarks(): string[] {
  try {
    return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || "[]");
  } catch {
    return [];
  }
}

/** Bookmarks via `useSyncExternalStore` — no effect-setState, no SSR mismatch. */
function useBookmarked(slug: string): boolean {
  const subscribe = useCallback((cb: () => void) => {
    window.addEventListener(BOOKMARKS_EVENT, cb);
    window.addEventListener("storage", cb);
    return () => {
      window.removeEventListener(BOOKMARKS_EVENT, cb);
      window.removeEventListener("storage", cb);
    };
  }, []);
  return useSyncExternalStore(
    subscribe,
    () => readBookmarks().includes(slug),
    () => false
  );
}

function toggleBookmark(slug: string) {
  const set = new Set(readBookmarks());
  if (set.has(slug)) set.delete(slug);
  else set.add(slug);
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...set]));
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new Event(BOOKMARKS_EVENT));
}

function ActionButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "press focus-ring flex flex-col items-center gap-1 rounded-xl py-2 transition-colors duration-[var(--tc-dur)]",
        active
          ? "bg-tc-primary/10 text-tc-primary"
          : "text-tc-text-muted hover:bg-tc-bg-elevated hover:text-tc-primary"
      )}
    >
      {children}
      <span className="text-[10px] font-medium leading-none">{label}</span>
    </button>
  );
}

/**
 * Desktop reading companion for the article sidebar: live progress + time
 * remaining, plus Share, Copy Link, Bookmark, Print and a distraction-free
 * Reading Mode. Progress/time update imperatively (refs) so scrolling never
 * re-renders the tree.
 */
export default function ArticleActions({
  slug,
  title,
  readingTime,
}: {
  slug: string;
  title: string;
  readingTime: string;
}) {
  const totalMin = Math.max(1, parseInt(readingTime, 10) || 1);
  const pctRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const bookmarked = useBookmarked(slug);
  const [copied, setCopied] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  const onProgress = useCallback(
    (p: number) => {
      if (barRef.current) barRef.current.style.width = `${p}%`;
      if (pctRef.current) pctRef.current.textContent = String(Math.round(p));
      if (timeRef.current) {
        timeRef.current.textContent =
          p >= 99
            ? "Finished"
            : `~${Math.max(1, Math.ceil(totalMin * (1 - p / 100)))} min left`;
      }
    },
    [totalMin]
  );
  useScrollProgress(onProgress);

  const shareUrl = () =>
    typeof window === "undefined" ? "" : window.location.href;

  const onShare = async () => {
    const url = shareUrl();
    try {
      if (navigator.share) await navigator.share({ title, url });
      else await copyLink();
    } catch {
      /* dismissed / unsupported */
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  const onReadingMode = () => {
    const next = !focusMode;
    setFocusMode(next);
    document.documentElement.classList.toggle("reading-focus", next);
  };

  return (
    <div className="rounded-2xl card-surface p-4">
      <p className="overline text-tc-text-light mb-3">Reading</p>

      {/* Progress + time remaining */}
      <div className="mb-2 flex items-center justify-between text-[13px]">
        <span className="font-semibold text-tc-text tabular-nums">
          <span ref={pctRef}>0</span>% read
        </span>
        <span ref={timeRef} className="text-tc-text-light tabular-nums">
          {readingTime}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-tc-bg-elevated">
        <div
          ref={barRef}
          className="h-full rounded-full bg-gradient-to-r from-tc-primary to-tc-secondary"
          style={{ width: "0%" }}
        />
      </div>

      {/* Actions */}
      <div className="mt-4 grid grid-cols-5 gap-1">
        <ActionButton label="Share" onClick={onShare}>
          <Share2 size={17} />
        </ActionButton>
        <ActionButton label={copied ? "Copied" : "Copy"} onClick={copyLink} active={copied}>
          {copied ? <Check size={17} strokeWidth={2.5} className="animate-read-pop" /> : <Link2 size={17} />}
        </ActionButton>
        <ActionButton
          label="Save"
          active={bookmarked}
          onClick={() => toggleBookmark(slug)}
        >
          <Bookmark
            key={String(bookmarked)}
            size={17}
            className={bookmarked ? "animate-bookmark-pop fill-current" : ""}
          />
        </ActionButton>
        <ActionButton label="Print" onClick={() => window.print()}>
          <Printer size={17} />
        </ActionButton>
        <ActionButton label="Focus" active={focusMode} onClick={onReadingMode}>
          <TextQuote size={17} />
        </ActionButton>
      </div>
    </div>
  );
}
