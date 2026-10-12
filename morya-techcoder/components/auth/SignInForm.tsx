"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Field, FormMessage, TextLink, primaryButtonClass, withNext } from "@/components/auth/AuthUi";
import { authErrorMessage, callbackUrl } from "@/components/auth/GoogleButton";

export default function SignInForm({ next }: { next: string }) {
  const { getClient } = useAuth();
  const router = useRouter();
  const ids = useId();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    if (!email || !password) return;

    setPending(true);
    setError(null);
    setUnconfirmedEmail(null);
    setResent(false);
    try {
      const supabase = await getClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(authErrorMessage(error));
        if (error.code === "email_not_confirmed") setUnconfirmedEmail(email);
        setPending(false);
        return;
      }
      router.replace(next);
      router.refresh();
    } catch {
      setError(authErrorMessage(null));
      setPending(false);
    }
  };

  const resend = async () => {
    if (!unconfirmedEmail) return;
    const supabase = await getClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: unconfirmedEmail,
      options: { emailRedirectTo: callbackUrl(next) },
    });
    if (error) setError(authErrorMessage(error));
    else setResent(true);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field
        id={`${ids}-email`}
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        inputMode="email"
        required
        disabled={pending}
      />
      <Field
        id={`${ids}-password`}
        name="password"
        type="password"
        label="Password"
        autoComplete="current-password"
        required
        disabled={pending}
        aside={
          <span className="text-xs">
            <TextLink href={withNext("/auth/forgot-password", next)}>Forgot password?</TextLink>
          </span>
        }
      />
      <div aria-live="polite" className="flex flex-col gap-2 empty:hidden">
        {error && <FormMessage tone="error">{error}</FormMessage>}
        {unconfirmedEmail && !resent && (
          <button
            type="button"
            onClick={resend}
            className="focus-ring self-start rounded text-sm text-tc-text-muted underline underline-offset-4 hover:text-tc-primary"
          >
            Resend confirmation email
          </button>
        )}
        {resent && <FormMessage tone="success">Confirmation email sent. Check your inbox.</FormMessage>}
      </div>
      <button type="submit" disabled={pending} aria-busy={pending} className={primaryButtonClass}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
