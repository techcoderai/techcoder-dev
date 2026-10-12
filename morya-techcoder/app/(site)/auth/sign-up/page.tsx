import { AuthPage } from "@/components/auth/AuthUi";
import { AuthFlow } from "@/components/auth/AuthFlow";
import { authMetadata, readNext, redirectIfSignedIn, type AuthSearchParams } from "@/lib/auth";

export const metadata = authMetadata("Create account");

export default async function SignUpPage({ searchParams }: { searchParams: AuthSearchParams }) {
  const next = await readNext(searchParams);
  await redirectIfSignedIn(next);

  return (
    <AuthPage>
      <AuthFlow view="sign-up" next={next} />
    </AuthPage>
  );
}
