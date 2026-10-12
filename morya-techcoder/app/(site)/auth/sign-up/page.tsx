import { AuthShell, FormMessage, TextLink, withNext } from "@/components/auth/AuthUi";
import { GoogleButton, OrDivider } from "@/components/auth/GoogleButton";
import SignUpForm from "@/components/auth/SignUpForm";
import { authMetadata, readNext, redirectIfSignedIn, type AuthSearchParams } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata = authMetadata("Create account");

export default async function SignUpPage({ searchParams }: { searchParams: AuthSearchParams }) {
  const next = await readNext(searchParams);
  await redirectIfSignedIn(next);

  return (
    <AuthShell
      overline="Account"
      title="Create your account"
      intro="A free account lets you like articles and post responses."
      footer={
        <>
          Already have an account? <TextLink href={withNext("/auth/sign-in", next)}>Sign in</TextLink>
        </>
      }
    >
      {!isSupabaseConfigured ? (
        <FormMessage tone="error">Accounts are not available right now.</FormMessage>
      ) : (
        <>
          <GoogleButton next={next} label="Sign up with Google" />
          <OrDivider />
          <SignUpForm next={next} />
          <p className="mt-5 text-xs leading-relaxed text-tc-text-light">
            By creating an account you agree to our <TextLink href="/terms">Terms</TextLink> and{" "}
            <TextLink href="/privacy">Privacy Policy</TextLink>.
          </p>
        </>
      )}
    </AuthShell>
  );
}
