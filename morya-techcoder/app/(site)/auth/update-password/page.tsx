import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthUi";
import UpdatePasswordForm from "@/components/auth/UpdatePasswordForm";
import { authMetadata } from "@/lib/auth";
import { createClient, getVerifiedUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata = authMetadata("Choose a new password");

/** Reached from the password-reset email (via /auth/callback) or the profile page. */
export default async function UpdatePasswordPage() {
  if (!isSupabaseConfigured) redirect("/auth/sign-in?error=unavailable");
  const supabase = await createClient();
  const user = await getVerifiedUser(supabase);
  if (!user) redirect("/auth/sign-in?error=link");

  return (
    <AuthShell overline="Account" title="Choose a new password" intro={`For ${user.email}.`}>
      <UpdatePasswordForm />
    </AuthShell>
  );
}
