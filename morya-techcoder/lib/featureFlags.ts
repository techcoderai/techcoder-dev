/**
 * Centralized feature flags for progressive rollout of homepage (and later
 * site-wide) sections. Keep flags here — components should call
 * `isFeatureEnabled()` instead of hardcoding show/hide conditions.
 *
 * Add new flags as optional booleans; default to `false` until the feature
 * is ready to ship. Flags are compile-time constants today; swap the lookup
 * for an env/remote source later without changing call sites.
 */
export const featureFlags = {
  /** Testimonials carousel on the homepage. */
  showTestimonials: false,
  /** FAQ accordion on the homepage. */
  showFAQ: false,
} as const satisfies Record<string, boolean>;

export type FeatureFlag = keyof typeof featureFlags;

/** Returns whether a named feature flag is currently enabled. */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return featureFlags[flag];
}
