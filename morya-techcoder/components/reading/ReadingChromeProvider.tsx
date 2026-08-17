"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Heading } from "@/lib/utils";

/** Metadata about the article currently being read (null on non-article pages). */
export type ReadingChrome = {
  title: string;
  backHref: string;
  headings: Heading[];
};

type ReadingChromeContextValue = {
  chrome: ReadingChrome | null;
  setChrome: (chrome: ReadingChrome | null) => void;
  /** Whether the mobile Contents bottom sheet is open. */
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
};

const noop = () => {};

/**
 * Shared reading chrome.
 *
 * Lives above the Navbar so the navbar can morph into a reading toolbar
 * (back + fading title + contents + share) while the dedicated reading layer
 * (progress bar, floating indicator, bottom sheet) reads the same source of
 * truth. Article pages register their metadata via `SetReadingChrome`.
 *
 * Deliberately holds only low-frequency state — the per-frame scroll percentage
 * is handled imperatively by `useScrollProgress`, never here, to avoid
 * re-rendering the page on every scroll frame.
 */
const ReadingChromeContext = createContext<ReadingChromeContextValue>({
  chrome: null,
  setChrome: noop,
  sheetOpen: false,
  setSheetOpen: noop,
});

export function ReadingChromeProvider({ children }: { children: ReactNode }) {
  const [chrome, setChromeState] = useState<ReadingChrome | null>(null);
  const [sheetOpen, setSheetOpenState] = useState(false);

  const setChrome = useCallback((next: ReadingChrome | null) => {
    setChromeState(next);
    if (!next) setSheetOpenState(false);
  }, []);
  const setSheetOpen = useCallback((open: boolean) => setSheetOpenState(open), []);

  const value = useMemo<ReadingChromeContextValue>(
    () => ({ chrome, setChrome, sheetOpen, setSheetOpen }),
    [chrome, setChrome, sheetOpen, setSheetOpen]
  );

  return (
    <ReadingChromeContext.Provider value={value}>{children}</ReadingChromeContext.Provider>
  );
}

export function useReadingChrome(): ReadingChromeContextValue {
  return useContext(ReadingChromeContext);
}
