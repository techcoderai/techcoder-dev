import { createClient, getVerifiedUser } from "@/lib/supabase/server";
import {
  databaseErrorResponse,
  json,
  jsonError,
  readJson,
  rejectUnsafeMutation,
} from "@/lib/engagement/server";
import { isUuid, normalizeReportReason } from "@/lib/engagement/validation";

/** POST { reason? } → flags someone else's comment for moderator review. */
export async function POST(request: Request, ctx: RouteContext<"/api/comments/[id]/report">) {
  const rejected = rejectUnsafeMutation(request);
  if (rejected) return rejected;

  const { id } = await ctx.params;
  if (!isUuid(id)) return jsonError("Response not found.", 404);

  const payload = await readJson(request);
  const reason = normalizeReportReason(payload?.reason);

  const supabase = await createClient();
  const user = await getVerifiedUser(supabase);
  if (!user) return jsonError("Sign in to report responses.", 401);

  const { error } = await supabase.from("comment_reports").insert({ comment_id: id, reason });
  // A repeat report from the same reader is already on file — not an error.
  if (error && error.code !== "23505") {
    if (error.code === "42501") return jsonError("You can't report this response.", 403);
    return databaseErrorResponse(error, "report comment");
  }
  return json({ reported: true });
}
