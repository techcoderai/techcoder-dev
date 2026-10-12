import { AuthShell, FormMessage, TextLink, withNext } from "@/components/auth/AuthUi";
import { GoogleButton, OrDivider } from "@/components/auth/GoogleButton";
import SignInForm from "@/components/auth/SignInForm";
import { authMetadata, readNext, redirectIfSignedIn, type AuthSearchParams } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata = authMetadata("Sign in");

const CALLBACK_ERRORS: Record<string, string> = {
  link: "That sign-in link is invalid or has expired. Please try again.",
  cancelled: "Sign-in was cancelled.",
  unavailable: "Accounts are not available right now.",
};

export default async function SignInPage({ searchParams }: { searchParams: AuthSearchParams }) {
  const next = await readNext(searchParams);
  await redirectIfSignedIn(next);
  const errorKey = (await searchParams).error;
  const callbackError = typeof errorKey === "string" ? CALLBACK_ERRORS[errorKey] : undefined;

  return (
    <AuthShell
      overline="Account"
      title="Sign in to TechCoder"
      intro="Like articles and join the conversation. Reading stays free and open."
      footer={
        <>
          New here? <TextLink href={withNext("/auth/sign-up", next)}>Create an account</TextLink>
        </>
      }
    >
      {!isSupabaseConfigured ? (
        <FormMessage tone="error">{CALLBACK_ERRORS.unavailable}</FormMessage>
      ) : (
        <>
          {callbackError && (
            <div className="mb-6">
              <FormMessage tone="error">{callbackError}</FormMessage>
            </div>
          )}
          <GoogleButton next={next} />
          <OrDivider />
          <SignInForm next={next} />
        </>
      )}
    </AuthShell>
  );
}
