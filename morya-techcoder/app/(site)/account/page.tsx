import { redirect } from "next/navigation";
import { AuthShell, TextLink } from "@/components/auth/AuthUi";
import { ProfileForm, SignOutButton } from "@/components/auth/ProfileForm";
import UserAvatar from "@/components/ui/UserAvatar";
import { authMetadata } from "@/lib/auth";
import { createClient, getVerifiedUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata = authMetadata("Your profile");

/** Minimal profile: avatar, display name (editable), email, password, sign out. */
export default async function AccountPage() {
  if (!isSupabaseConfigured) redirect("/auth/sign-in?error=unavailable");
  const supabase = await createClient();
  const user = await getVerifiedUser(supabase);
  if (!user) redirect("/auth/sign-in?next=%2Faccount");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle();
  const displayName = profile?.display_name ?? "Reader";
  const hasPassword = user.identities?.some((identity) => identity.provider === "email") ?? false;

  return (
    <AuthShell overline="Account" title="Your profile">
      <div className="flex items-center gap-4">
        <UserAvatar name={displayName} src={profile?.avatar_url} size={56} />
        <div className="min-w-0">
          <p className="truncate font-semibold text-tc-text">{displayName}</p>
          <p className="truncate text-sm text-tc-text-light">{user.email}</p>
        </div>
      </div>

      <div className="mt-8 border-t border-tc-border pt-6">
        <ProfileForm displayName={displayName} />
      </div>

      <dl className="mt-8 divide-y divide-tc-border border-y border-tc-border text-sm">
        <div className="flex items-center justify-between gap-4 py-3.5">
          <dt className="text-tc-text-light">Email</dt>
          <dd className="truncate font-medium text-tc-text">{user.email}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 py-3.5">
          <dt className="text-tc-text-light">Password</dt>
          <dd>
            <TextLink href="/auth/update-password">{hasPassword ? "Change password" : "Set a password"}</TextLink>
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <SignOutButton />
      </div>
    </AuthShell>
  );
}
