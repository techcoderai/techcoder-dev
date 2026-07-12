"use client";

import { makePage } from "@keystatic/next/ui/app";
import config from "@/keystatic.config";

/**
 * Renders the Keystatic admin UI at `/keystatic` and every sub-route (the
 * optional catch-all `[[...params]]` segment). Must be a client component
 * because the editor runs entirely in the browser.
 */
export default makePage(config);
