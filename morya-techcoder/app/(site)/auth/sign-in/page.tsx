import { AuthPage } from "@/components/auth/AuthUi";
import { AuthFlow } from "@/components/auth/AuthFlow";
import { authMetadata, readNext, redirectIfSignedIn, type AuthSearchParams } from "@/lib/auth";

export const metadata = authMetadata("Sign in");

const CALLBACK_ERRORS: Record<string, string> = {
  link: "That sign-in link is invalid or has expired. Please try again.",
  cancelled: "Sign-in was cancelled.",
  unavailable: "Accounts are not available right now.",
};

/** Direct URL and the landing spot for /auth/callback errors; the navbar opens the same flow in a dialog. */
export default async function SignInPage({ searchParams }: { searchParams: AuthSearchParams }) {
  const next = await readNext(searchParams);
  await redirectIfSignedIn(next);
  const errorKey = (await searchParams).error;
  const callbackError = typeof errorKey === "string" ? CALLBACK_ERRORS[errorKey] : undefined;

  return (
    <AuthPage>
      <AuthFlow view="sign-in" next={next} notice={callbackError} />
    </AuthPage>
  );
}
