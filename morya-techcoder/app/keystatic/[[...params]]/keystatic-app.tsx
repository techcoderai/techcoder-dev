"use client";

import { makePage } from "@keystatic/next/ui/app";
import config from "@/keystatic.config";

/**
 * The Keystatic editor itself. Must be a client component because the editor
 * runs entirely in the browser.
 *
 * Split out from `page.tsx` so the route can decide whether to mount it at all
 * — the page is a server component that 404s in production before this module
 * is ever imported.
 */
export default makePage(config);
