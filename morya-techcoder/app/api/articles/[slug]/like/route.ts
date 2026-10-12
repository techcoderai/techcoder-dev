import { createClient, getVerifiedUser } from "@/lib/supabase/server";
import {
  databaseErrorResponse,
  fetchLikeState,
  isPublishedSlug,
  json,
  jsonError,
  readJson,
  rejectUnsafeMutation,
} from "@/lib/engagement/server";
import type { LikePayload } from "@/types/engagement";

/**
 * PUT { liked: boolean } → sets (not toggles) the reader's like, so retries
 * and double submissions are idempotent. Uniqueness is a primary key.
 */
export async function PUT(request: Request, ctx: RouteContext<"/api/articles/[slug]/like">) {
  const rejected = rejectUnsafeMutation(request);
  if (rejected) return rejected;

  const { slug } = await ctx.params;
  if (!isPublishedSlug(slug)) return jsonError("Article not found.", 404);

  const body = await readJson(request);
  if (typeof body?.liked !== "boolean") return jsonError("Expected { liked: boolean }.", 400);

  const supabase = await createClient();
  const user = await getVerifiedUser(supabase);
  if (!user) return jsonError("Sign in to like articles.", 401);

  if (body.liked) {
    // user_id comes from the column default (auth.uid()), never from the client.
    const { error } = await supabase.from("article_likes").insert({ article_slug: slug });
    if (error && error.code !== "23505") return databaseErrorResponse(error, "like");
  } else {
    const { error } = await supabase.from("article_likes").delete().eq("article_slug", slug);
    if (error) return databaseErrorResponse(error, "unlike");
  }

  const state = await fetchLikeState(supabase, slug, user.id);
  if (!state.ok) return databaseErrorResponse(state.error, "like count");
  return json<LikePayload>({ likes: state.likes, liked: state.liked });
}
