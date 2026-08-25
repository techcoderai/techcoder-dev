import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { KEYSTATIC_ENABLED } from "@/lib/keystatic";

/**
 * Mounts the Keystatic admin UI at `/keystatic` and every sub-route (the
 * optional catch-all `[[...params]]` segment) — but only outside production,
 * where the file-based editor can actually write.
 *
 * The editor is imported lazily so that a production build never pulls the
 * admin bundle into a route it refuses to serve.
 */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function KeystaticAdminPage() {
  if (!KEYSTATIC_ENABLED) notFound();

  const { default: KeystaticApp } = await import("./keystatic-app");
  return <KeystaticApp />;
}
