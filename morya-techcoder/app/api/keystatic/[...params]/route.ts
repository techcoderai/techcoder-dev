import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "@/keystatic.config";
import { KEYSTATIC_ENABLED } from "@/lib/keystatic";

/**
 * API routes Keystatic uses to read and write content files. With
 * `storage: { kind: "local" }` these read and write the local filesystem with
 * no authentication, so they are only mounted when the editor is enabled.
 *
 * In production they answer 404 like any unknown route. Gating only the UI
 * would leave the write API reachable on its own, which is the half of the
 * surface that actually matters.
 */
const notFound = () => new Response("Not Found", { status: 404 });

const handlers = KEYSTATIC_ENABLED ? makeRouteHandler({ config }) : null;

export const GET = handlers?.GET ?? notFound;
export const POST = handlers?.POST ?? notFound;
