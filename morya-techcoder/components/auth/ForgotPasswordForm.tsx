"use client";

import { useId, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Field, FormMessage, primaryButtonClass } from "@/components/auth/AuthUi";
import { authErrorMessage, callbackUrl } from "@/components/auth/GoogleButton";

export default function ForgotPasswordForm() {
  const { getClient } = useAuth();
  const ids = useId();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    if (!email) return;

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
      <div aria-live="polite" className="empty:hidden">
        {error && <FormMessage tone="error">{error}</FormMessage>}
      </div>
      <button type="submit" disabled={pending} aria-busy={pending} className={primaryButtonClass}>
        {pending ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}
