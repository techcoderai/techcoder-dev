import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "@/keystatic.config";
import { isKeystaticEnabled } from "@/lib/keystatic-mode";

/**
 * API routes Keystatic uses to read and write content files. With
 * `storage: { kind: "local" }` these operate on the local filesystem during
 * development, and are required for the admin UI at /keystatic to function.
 *
 * In production they answer 404 like any unknown route. Gating only the UI
 * would leave the write API reachable on its own, which is the half of the
 * surface that actually matters.
 */
const handlers = makeRouteHandler({ config });

const notFound = () => new Response(null, { status: 404 });

export const GET = isKeystaticEnabled ? handlers.GET : notFound;
export const POST = isKeystaticEnabled ? handlers.POST : notFound;
