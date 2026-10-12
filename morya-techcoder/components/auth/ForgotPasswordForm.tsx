"use client";

import { useId, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Field, FormMessage, primaryButtonClass } from "@/components/auth/AuthUi";
import { authErrorMessage, callbackUrl } from "@/components/auth/GoogleButton";
import { isPlausibleEmail } from "@/lib/engagement/validation";

export default function ForgotPasswordForm({
  defaultEmail,
  onEmailChange,
}: {
  defaultEmail?: string;
  onEmailChange?: (email: string) => void;
} = {}) {
  const { getClient } = useAuth();
  const ids = useId();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    const formEl = e.currentTarget;
    const email = String(new FormData(formEl).get("email") ?? "").trim();
    if (!isPlausibleEmail(email)) {
      setEmailError(email ? "Enter a valid email address." : "Enter your email address.");
      formEl.querySelector<HTMLInputElement>('[name="email"]')?.focus();
      return;
    }
    setEmailError(null);

    setPending(true);
    setError(null);
    try {
      const supabase = await getClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: callbackUrl("/auth/update-password"),
      });
      // Rate limits are worth surfacing; anything else stays generic so the
      // form never reveals whether an address has an account.
      if (error && error.code?.startsWith("over_")) setError(authErrorMessage(error));
      else setSent(true);
    } catch {
      setError(authErrorMessage(null));
    }
    setPending(false);
  };

  if (sent) {
    return (
      <FormMessage tone="success">
        If an account exists for that address, a reset link is on its way. Check your inbox.
      </FormMessage>
    );
  }

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
        error={emailError}
      />
      <div aria-live="polite" className="empty:hidden">
        {error && <FormMessage tone="error">{error}</FormMessage>}
      </div>
      <button type="submit" disabled={pending} aria-busy={pending} className={primaryButtonClass}>
        {pending ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}
