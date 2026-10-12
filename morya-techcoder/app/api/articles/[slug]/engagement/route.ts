import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  fetchApprovedComments,
  fetchLikeState,
  isPublishedSlug,
  json,
  jsonError,
} from "@/lib/engagement/server";
import type { EngagementPayload } from "@/types/engagement";

/** GET → likes, the reader's own like state, and approved comments. Public. */
export async function GET(_request: Request, ctx: RouteContext<"/api/articles/[slug]/engagement">) {
  const { slug } = await ctx.params;
  if (!isPublishedSlug(slug)) return jsonError("Article not found.", 404);
  if (!isSupabaseConfigured) return jsonError("Accounts are not available right now.", 503);

  const supabase = await createClient();
  // Reads only need the verified JWT (signature-checked); RLS does the rest.
  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  const viewerId = typeof claims?.sub === "string" ? claims.sub : null;

  const [likeState, comments] = await Promise.all([
    fetchLikeState(supabase, slug, viewerId),
    fetchApprovedComments(supabase, slug, viewerId),
  ]);
  if (!likeState.ok || !comments.ok) {
    console.error("[engagement] load failed:", likeState.ok ? comments.error : likeState.error);
    return jsonError("Couldn't load comments.", 500);
  }

  const payload: EngagementPayload = {
    likes: likeState.likes,
    liked: likeState.liked,
    comments: comments.comments,
    commentCount: comments.count,
    viewer: viewerId
      ? { canModerate: (claims?.app_metadata as { role?: string } | undefined)?.role === "moderator" }
      : null,
  };
  return json(payload);
}
