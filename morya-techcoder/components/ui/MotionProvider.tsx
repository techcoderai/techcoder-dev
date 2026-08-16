"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Centralized motion policy. `reducedMotion="user"` makes every Framer Motion
 * animation below this provider honour `prefers-reduced-motion`, so individual
 * components do not each have to handle it.
 *
 * Motion values driven imperatively (the hero tilt) are not covered by this and
 * are gated with `useReducedMotion()` at their source.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
