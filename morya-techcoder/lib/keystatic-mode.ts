/**
 * Whether the Keystatic admin UI and its file API are mounted.
 *
 * Storage is `local`, which means the editor writes to the filesystem of the
 * machine running it. On a deployed host that filesystem is read-only and
 * ephemeral, so a production `/keystatic` could never save anything — it would
 * be an admin surface that exists only to be probed.
 *
 * Both `/keystatic` and `/api/keystatic/*` therefore return a real 404 outside
 * development. This is access control, not SEO: `robots.txt` asks crawlers not
 * to look, which does nothing about anyone who simply types the URL.
 *
 * `NODE_ENV` is inlined at build time, so the check costs nothing at runtime
 * and the branch is eliminated from the production bundle entirely.
 *
 * To enable editing on a deployed site later, switch `keystatic.config.ts` to
 * GitHub storage and gate this on authentication instead of the environment —
 * see docs/keystatic.md.
 */
export const isKeystaticEnabled = process.env.NODE_ENV !== "production";
