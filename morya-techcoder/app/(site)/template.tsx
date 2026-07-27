"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Route transition for the public site.
 *
 * A `template` re-mounts on every navigation (unlike `layout`), so page content
 * eases in — a calm upward fade — while the navbar, footer and reading chrome
 * (all in the layout, outside this wrapper) stay put. Next handles scroll
 * restoration; the background is painted by the layout, so there is no white
 * flash between routes.
 */
export default function SiteTemplate({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.2 : 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
