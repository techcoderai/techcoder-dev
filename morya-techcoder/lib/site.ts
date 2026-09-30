/**
 * Single source of truth for the site's public origin. Every absolute URL
 * (metadataBase, canonical links, sitemap, robots, JSON-LD) derives from here.
 *
 * Resolution order:
 *   1. `NEXT_PUBLIC_SITE_URL` — explicit override (custom host, staging).
 *   2. `VERCEL_PROJECT_PRODUCTION_URL` — set by Vercel on every deployment,
 *      previews included, so canonicals always point at production.
 *   3. `http://localhost:3000` — local dev and CI builds.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProduction) return `https://${vercelProduction}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

/** Resolves a site-relative path (`/blog/x`) to an absolute URL. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).href;
}

/** Generated site-wide share image (`app/og/route.tsx`). */
export const DEFAULT_OG_IMAGE = {
  url: "/og",
  width: 1200,
  height: 630,
  alt: "TechCoder — technology knowledge you can trust",
};

/** Generated per-article share image (`app/og/blog/[slug]/route.tsx`). */
export function articleOgImagePath(slug: string): string {
  return `/og/blog/${slug}`;
}
