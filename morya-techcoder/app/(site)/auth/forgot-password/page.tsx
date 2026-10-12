import { AuthShell, FormMessage, TextLink, withNext } from "@/components/auth/AuthUi";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { authMetadata, readNext, type AuthSearchParams } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata = authMetadata("Reset password");

export default async function ForgotPasswordPage({ searchParams }: { searchParams: AuthSearchParams }) {
  const next = await readNext(searchParams);

  return (
    <AuthShell
      overline="Account"
      title="Reset your password"
      intro="Enter the email you signed up with and we'll send you a link to choose a new password."
      footer={
        <>
          Remembered it? <TextLink href={withNext("/auth/sign-in", next)}>Back to sign in</TextLink>
        </>
      }
    >
      {isSupabaseConfigured ? (
        <ForgotPasswordForm />
      ) : (
        <FormMessage tone="error">Accounts are not available right now.</FormMessage>
      )}
    </AuthShell>
  );
}
