import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "@/keystatic.config";

/**
 * API routes Keystatic uses to read and write content files. With
 * `storage: { kind: "local" }` these operate on the local filesystem during
 * development. Required for the admin UI at /keystatic to function.
 */
export const { POST, GET } = makeRouteHandler({ config });
