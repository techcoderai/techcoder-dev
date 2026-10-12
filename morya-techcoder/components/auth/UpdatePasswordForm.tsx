"use client";

import { useId, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Field, FormMessage, TextLink, primaryButtonClass } from "@/components/auth/AuthUi";
import { authErrorMessage } from "@/components/auth/GoogleButton";
import { isAcceptablePassword } from "@/lib/engagement/validation";

export default function UpdatePasswordForm() {
  const { getClient } = useAuth();
  const ids = useId();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");
    if (!isAcceptablePassword(password)) {
      return setError("Use at least 8 characters, including a letter and a number.");
    }
    if (password !== confirm) return setError("The passwords don't match.");

    setPending(true);
    setError(null);
    try {
      const supabase = await getClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) setError(authErrorMessage(error));
      else setDone(true);
    } catch {
      setError(authErrorMessage(null));
    }
    setPending(false);
  };

  if (done) {
    return (
      <div className="flex flex-col gap-4">
        <FormMessage tone="success">Your password has been updated.</FormMessage>
        <p className="text-sm text-tc-text-muted">
          <TextLink href="/blog">Continue reading</TextLink> or go to your <TextLink href="/account">profile</TextLink>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field
        id={`${ids}-password`}
        name="password"
        type="password"
        label="New password"
        autoComplete="new-password"
        minLength={8}
        hint="At least 8 characters, with a letter and a number."
        required
        disabled={pending}
      />
      <Field
        id={`${ids}-confirm`}
        name="confirm"
        type="password"
        label="Confirm new password"
        autoComplete="new-password"
        minLength={8}
        required
        disabled={pending}
      />
      <div aria-live="polite" className="empty:hidden">
        {error && <FormMessage tone="error">{error}</FormMessage>}
      </div>
      <button type="submit" disabled={pending} aria-busy={pending} className={primaryButtonClass}>
        {pending ? "Saving…" : "Update password"}
      </button>
    </form>
  );
}
