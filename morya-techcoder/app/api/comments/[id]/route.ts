import { createClient, getVerifiedUser, isModerator } from "@/lib/supabase/server";
import { databaseErrorResponse, json, jsonError, rejectUnsafeMutation } from "@/lib/engagement/server";
import { isUuid } from "@/lib/engagement/validation";

/**
 * DELETE → the author deletes their own comment; a moderator removes (hides)
 * anyone else's. RLS enforces both — a reader who is neither affects 0 rows.
 */
export async function DELETE(request: Request, ctx: RouteContext<"/api/comments/[id]">) {
  const rejected = rejectUnsafeMutation(request);
  if (rejected) return rejected;

  const { id } = await ctx.params;
  if (!isUuid(id)) return jsonError("Comment not found.", 404);

  const supabase = await createClient();
  const user = await getVerifiedUser(supabase);
  if (!user) return jsonError("Sign in to manage comments.", 401);

  const { data: deleted, error } = await supabase
    .from("article_comments")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id");
  if (error) return databaseErrorResponse(error, "delete comment");
  if (deleted.length > 0) return json({ id, removed: "deleted" });

  if (isModerator(user)) {
    const { data: hidden, error: modError } = await supabase
      .from("article_comments")
      .update({ status: "removed" })
      .eq("id", id)
      .select("id");
    if (modError) return databaseErrorResponse(modError, "moderate comment");
    if (hidden.length > 0) return json({ id, removed: "moderated" });
    // The JWT's app_metadata only updates on refresh; RLS reads the JWT.
    return jsonError("Sign out and back in to activate moderator access.", 403);
  }

  return jsonError("Comment not found.", 404);
}
