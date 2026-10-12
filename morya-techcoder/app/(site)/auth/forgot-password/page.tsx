import { AuthPage } from "@/components/auth/AuthUi";
import { AuthFlow } from "@/components/auth/AuthFlow";
import { authMetadata, readNext, type AuthSearchParams } from "@/lib/auth";

export const metadata = authMetadata("Reset password");

export default async function ForgotPasswordPage({ searchParams }: { searchParams: AuthSearchParams }) {
  const next = await readNext(searchParams);

  return (
    <AuthPage>
      <AuthFlow view="forgot-password" next={next} />
    </AuthPage>
  );
}
