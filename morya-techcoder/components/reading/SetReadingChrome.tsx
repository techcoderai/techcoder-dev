"use client";

import { useEffect } from "react";
import type { Heading } from "@/lib/utils";
import { useReadingChrome } from "@/components/reading/ReadingChromeProvider";

/**
 * Registers the current article with the reading chrome context so the navbar
 * and reading layer can react to it. Rendered by the (server) article page;
 * clears itself on unmount so other routes fall back to the normal navbar.
 */
export default function SetReadingChrome({
  title,
  backHref,
  headings,
}: {
  title: string;
  backHref: string;
  headings: Heading[];
}) {
  const { setChrome } = useReadingChrome();

  // Re-register only when the article identity changes, not on every render.
  const headingsKey = headings.map((h) => h.id).join("|");

  useEffect(() => {
    setChrome({ title, backHref, headings });
    return () => setChrome(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, backHref, headingsKey, setChrome]);

  return null;
}
