"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { MailCheck } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Field, FormMessage, primaryButtonClass } from "@/components/auth/AuthUi";
import { authErrorMessage, callbackUrl } from "@/components/auth/GoogleButton";
import { DISPLAY_NAME_MAX_LENGTH, isAcceptablePassword, normalizeDisplayName } from "@/lib/engagement/validation";

export default function SignUpForm({ next }: { next: string }) {
  const { getClient } = useAuth();
  const router = useRouter();
  const ids = useId();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    const form = new FormData(e.currentTarget);
    const name = normalizeDisplayName(form.get("displayName"));
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!name.ok) return setError(name.error);
    if (!isAcceptablePassword(password)) {
      return setError("Use at least 8 characters, including a letter and a number.");
    }

    setPending(true);
    setError(null);
    try {
      const supabase = await getClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: callbackUrl(next),
          data: { display_name: name.value },
        },
      });
      if (error) {
        setError(authErrorMessage(error));
        setPending(false);
        return;
      }
      if (data.session) {
        // Email confirmation is off for this project: already signed in.
        router.replace(next);
        router.refresh();
        return;
      }
      setSentTo(email);
    } catch {
      setError(authErrorMessage(null));
    }
    setPending(false);
  };

  if (sentTo) {
    return (
      <div role="status" className="flex items-start gap-3 animate-fade-up">
        <MailCheck size={22} aria-hidden="true" className="mt-0.5 shrink-0 text-tc-primary" />
        <div className="text-[15px] text-tc-text-muted">
          <p className="font-semibold text-tc-text">Check your inbox</p>
          <p className="mt-1">
            We sent a confirmation link to <span className="font-medium text-tc-text">{sentTo}</span>. Open it to finish
            creating your account — it brings you straight back here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field
        id={`${ids}-name`}
        name="displayName"
        label="Display name"
        autoComplete="name"
        maxLength={DISPLAY_NAME_MAX_LENGTH}
        hint="Shown next to your responses."
        required
        disabled={pending}
      />
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
        autoComplete="new-password"
        minLength={8}
        hint="At least 8 characters, with a letter and a number."
        required
        disabled={pending}
      />
      <div aria-live="polite" className="empty:hidden">
        {error && <FormMessage tone="error">{error}</FormMessage>}
      </div>
      <button type="submit" disabled={pending} aria-busy={pending} className={primaryButtonClass}>
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
