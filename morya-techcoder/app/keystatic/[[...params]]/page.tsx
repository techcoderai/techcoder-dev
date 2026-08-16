import { notFound } from "next/navigation";
import { KEYSTATIC_ENABLED } from "@/lib/keystatic";
import KeystaticApp from "./keystatic-app";

/**
 * Server boundary for the Keystatic admin UI at `/keystatic` and every
 * sub-route (the optional catch-all `[[...params]]` segment).
 *
 * The editor itself is a client component, but the decision to serve it is made
 * here on the server so a production deployment never ships the admin UI.
 */
export default function KeystaticPage() {
  if (!KEYSTATIC_ENABLED) notFound();
  return <KeystaticApp />;
}
