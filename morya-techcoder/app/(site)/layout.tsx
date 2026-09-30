import SiteShell from "@/components/layout/SiteShell";

/**
 * Layout for the public-facing site (home, blog, future tools). Lives in the
 * `(site)` route group so it does NOT wrap the Keystatic admin UI at
 * `/keystatic`, which needs a clean, full-screen canvas of its own.
 *
 * The `(site)` folder name is a route group — it organizes files without
 * adding a URL segment, so routes stay `/` and `/blog/...`.
 *
 * The chrome itself lives in `components/layout/SiteShell.tsx` so the root
 * 404 page (`app/not-found.tsx`) can reuse it.
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SiteShell>{children}</SiteShell>;
}
