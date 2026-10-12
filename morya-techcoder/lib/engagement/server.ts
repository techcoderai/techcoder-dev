import "server-only";
import { NextResponse } from "next/server";
import type { PostgrestError } from "@supabase/supabase-js";
import { getAllSlugs } from "@/content/loader";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isSameOriginRequest, isValidSlugFormat } from "@/lib/engagement/validation";
import type { createClient } from "@/lib/supabase/server";
import type { CommentView } from "@/types/engagement";

type ServerClient = Awaited<ReturnType<typeof createClient>>;

export const COMMENTS_PAGE_SIZE = 100;

const NO_STORE = { "Cache-Control": "private, no-store" };

export function json<T>(data: T, status = 200) {
  return NextResponse.json(data, { status, headers: NO_STORE });
}

export function jsonError(error: string, status: number) {
  return json({ error }, status);
}

/** Only slugs of articles published in this build can be liked or commented on. */
export function isPublishedSlug(slug: unknown): slug is string {
  return isValidSlugFormat(slug) && getAllSlugs().includes(slug);
}

/**
 * Shared preconditions for every mutation: Supabase is configured, the request
 * comes from this site (CSRF), and the body is JSON. Returns an error response
 * to send, or null to continue.
 */
export function rejectUnsafeMutation(request: Request): NextResponse | null {
  if (!isSupabaseConfigured) return jsonError("Accounts are not available right now.", 503);
  const headers = request.headers;
  if (!isSameOriginRequest(headers.get("origin"), [headers.get("x-forwarded-host"), headers.get("host")])) {
    return jsonError("Cross-site request blocked.", 403);
  }
  if (request.method !== "DELETE" && !headers.get("content-type")?.startsWith("application/json")) {
    return jsonError("Expected a JSON body.", 415);
  }
  return null;
}

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return body && typeof body === "object" && !Array.isArray(body) ? body : null;
  } catch {
    return null;
  }
}

/** Maps database errors (constraints, RLS, rate limits) to safe client messages. */
export function databaseErrorResponse(error: PostgrestError, context: string) {
  switch (error.code) {
    case "PT429":
      return jsonError("You're doing that too often. Please wait a minute and try again.", 429);
    case "23514":
      return jsonError("That doesn't look valid. Please check and try again.", 400);
    case "42501":
      return jsonError("You don't have permission to do that.", 403);
    default:
      console.error(`[engagement] ${context}:`, error.code, error.message);
      return jsonError("Something went wrong. Please try again.", 500);
  }
}

type CommentRow = {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  author: { display_name: string; avatar_url: string | null } | null;
};

export const COMMENT_COLUMNS = "id, body, created_at, user_id, author:profiles(display_name, avatar_url)";

export function toCommentView(row: CommentRow, viewerId: string | null): CommentView {
  return {
    id: row.id,
    body: row.body,
    createdAt: row.created_at,
    author: {
      name: row.author?.display_name ?? "Reader",
      avatarUrl: row.author?.avatar_url ?? null,
    },
    isOwn: viewerId !== null && row.user_id === viewerId,
  };
}

export async function fetchApprovedComments(supabase: ServerClient, slug: string, viewerId: string | null) {
  const { data, count, error } = await supabase
    .from("article_comments")
    .select(COMMENT_COLUMNS, { count: "exact" })
    .eq("article_slug", slug)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(COMMENTS_PAGE_SIZE)
    .overrideTypes<CommentRow[], { merge: false }>();
  if (error) return { ok: false, error } as const;
  return {
    ok: true,
    comments: (data ?? []).map((row) => toCommentView(row, viewerId)),
    count: count ?? 0,
  } as const;
}

export async function fetchLikeState(supabase: ServerClient, slug: string, viewerId: string | null) {
  const [countResult, ownResult] = await Promise.all([
    supabase.rpc("article_like_count", { p_slug: slug }),
    viewerId
      ? supabase.from("article_likes").select("article_slug").eq("article_slug", slug).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);
  const error = countResult.error ?? ownResult.error;
  if (error) return { ok: false, error } as const;
  return { ok: true, likes: Number(countResult.data ?? 0), liked: Boolean(ownResult.data) } as const;
}

export type { CommentRow };
