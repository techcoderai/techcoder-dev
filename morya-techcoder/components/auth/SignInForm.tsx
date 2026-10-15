"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Field, FormMessage, primaryButtonClass } from "@/components/auth/AuthUi";
import { authErrorMessage, callbackUrl } from "@/components/auth/GoogleButton";
import { isPlausibleEmail } from "@/lib/engagement/validation";

type FieldErrors = { email?: string; password?: string };

export default function SignInForm({
  next,
  forgotLink,
  onSignedIn,
  defaultEmail,
  onEmailChange,
}: {
  next: string;
  forgotLink: React.ReactNode;
  /** Defaults to navigating to `next`; the dialog closes in place instead. */
  onSignedIn?: () => void;
  defaultEmail?: string;
  onEmailChange?: (email: string) => void;
}) {
  const { getClient } = useAuth();
  const router = useRouter();
  const ids = useId();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    const errors: FieldErrors = {};
    if (!isPlausibleEmail(email)) errors.email = email ? "Enter a valid email address." : "Enter your email address.";
    if (!password) errors.password = "Enter your password.";
    setFieldErrors(errors);
    if (errors.email || errors.password) {
      formEl.querySelector<HTMLInputElement>(`[name="${errors.email ? "email" : "password"}"]`)?.focus();
      return;
    }

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
      if (onSignedIn) {
        onSignedIn();
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
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <Field
        id={`${ids}-email`}
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        inputMode="email"
        required
        disabled={pending}
        defaultValue={defaultEmail}
        onChange={(e) => onEmailChange?.(e.target.value)}
        error={fieldErrors.email}
      />
      <Field
        id={`${ids}-password`}
        name="password"
        type="password"
        label="Password"
        autoComplete="current-password"
        required
        disabled={pending}
        error={fieldErrors.password}
        aside={<span className="text-xs">{forgotLink}</span>}
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
