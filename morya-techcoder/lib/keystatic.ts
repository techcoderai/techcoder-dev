/**
 * Keystatic uses `storage: { kind: "local" }`, which exposes an unauthenticated
 * filesystem read/write API. That is safe on a developer machine and unsafe on a
 * deployed server, so the admin UI and its API routes are disabled in production
 * unless explicitly opted in.
 *
 * `ENABLE_KEYSTATIC=true` exists only to exercise a production build locally
 * (`next build && next start`). Never set it on a public deployment while the
 * storage kind is `local`.
 */
export const KEYSTATIC_ENABLED =
  process.env.NODE_ENV !== "production" || process.env.ENABLE_KEYSTATIC === "true";
