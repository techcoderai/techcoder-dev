"use server";

import { revalidatePath } from "next/cache";
import { createClient, getVerifiedUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { normalizeDisplayName } from "@/lib/engagement/validation";

export type ProfileFormState = { status: "idle" | "saved" | "error"; message?: string };

/** Updates the signed-in reader's display name (the only editable field). */
export async function updateDisplayName(_prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  if (!isSupabaseConfigured) return { status: "error", message: "Accounts are not available right now." };

  const name = normalizeDisplayName(formData.get("displayName"));
  if (!name.ok) return { status: "error", message: name.error };

  const supabase = await createClient();
  const user = await getVerifiedUser(supabase);
  if (!user) return { status: "error", message: "Your session has expired. Please sign in again." };

  const { data, error } = await supabase
    .from("profiles")
    .update({ display_name: name.value })
    .eq("id", user.id)
    .select("id");
  if (error || !data?.length) {
    if (error) console.error("[account] update profile:", error.code, error.message);
    return { status: "error", message: "Couldn't save your name. Please try again." };
  }

  revalidatePath("/account");
  return { status: "saved", message: "Saved." };
}
