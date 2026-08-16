"use client";

import { makePage } from "@keystatic/next/ui/app";
import config from "@/keystatic.config";

/**
 * The Keystatic editor runs entirely in the browser. It is rendered only when
 * `app/keystatic/[[...params]]/page.tsx` decides the editor is enabled.
 */
export default makePage(config);
