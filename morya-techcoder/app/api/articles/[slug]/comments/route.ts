import { createClient, getVerifiedUser } from "@/lib/supabase/server";
import {
  COMMENT_COLUMNS,
  databaseErrorResponse,
  isPublishedSlug,
  json,
  jsonError,
  readJson,
  rejectUnsafeMutation,
  toCommentView,
  type CommentRow,
} from "@/lib/engagement/server";
import { normalizeCommentBody } from "@/lib/engagement/validation";
import type { CommentView } from "@/types/engagement";

/** POST { body } → creates a top-level comment as the signed-in reader. */
export async function POST(request: Request, ctx: RouteContext<"/api/articles/[slug]/comments">) {
  const rejected = rejectUnsafeMutation(request);
  if (rejected) return rejected;

  const { slug } = await ctx.params;
  if (!isPublishedSlug(slug)) return jsonError("Article not found.", 404);

  const payload = await readJson(request);
  const body = normalizeCommentBody(payload?.body);
  if (!body.ok) return jsonError(body.error, 400);

  const supabase = await createClient();
  const user = await getVerifiedUser(supabase);
  if (!user) return jsonError("Sign in to comment.", 401);

  // user_id and status come from column defaults; RLS re-checks both.
  const { data, error } = await supabase
    .from("article_comments")
    .insert({ article_slug: slug, body: body.value })
    .select(COMMENT_COLUMNS)
    .single()
    .overrideTypes<CommentRow, { merge: false }>();
  if (error) return databaseErrorResponse(error, "create comment");

  return json<CommentView>(toCommentView(data, user.id), 201);
}
