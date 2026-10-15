"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { MailCheck } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Field, FormMessage, primaryButtonClass } from "@/components/auth/AuthUi";
import { authErrorMessage, callbackUrl } from "@/components/auth/GoogleButton";
import { DISPLAY_NAME_MAX_LENGTH, isAcceptablePassword, isPlausibleEmail, normalizeDisplayName } from "@/lib/engagement/validation";

type FieldErrors = { displayName?: string; email?: string; password?: string };

export default function SignUpForm({
  next,
  onSignedIn,
  onVerificationSent,
  defaultEmail,
  onEmailChange,
}: {
  next: string;
  /** Defaults to navigating to `next`; the dialog closes in place instead. */
  onSignedIn?: () => void;
  onVerificationSent?: () => void;
  defaultEmail?: string;
  onEmailChange?: (email: string) => void;
}) {
  const { getClient } = useAuth();
  const router = useRouter();
  const ids = useId();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [sentTo, setSentTo] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const name = normalizeDisplayName(form.get("displayName"));
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    const errors: FieldErrors = {};
    if (!name.ok) errors.displayName = name.error;
    if (!isPlausibleEmail(email)) errors.email = email ? "Enter a valid email address." : "Enter your email address.";
    if (!isAcceptablePassword(password)) errors.password = "Use at least 8 characters, including a letter and a number.";
    setFieldErrors(errors);
    const firstInvalid = (["displayName", "email", "password"] as const).find((key) => errors[key]);
    if (firstInvalid) {
      formEl.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    if (!name.ok) return;

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
        if (onSignedIn) {
          onSignedIn();
          return;
        }
        router.replace(next);
        router.refresh();
        return;
      }
      setSentTo(email);
      onVerificationSent?.();
    } catch {
      setError(authErrorMessage(null));
    }
    setPending(false);
  };

  if (sentTo) {
    return (
      <div role="status" className="flex items-start gap-3">
        <MailCheck size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-tc-primary" />
        <div className="text-sm leading-relaxed text-tc-text-muted">
          <p className="font-semibold text-tc-text">Verify your email to finish</p>
          <p className="mt-1">
            We sent a confirmation link to <span className="break-all font-medium text-tc-text">{sentTo}</span>.
            You&apos;re not signed in yet — open the link to verify your address and we&apos;ll bring you straight
            back here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <Field
        id={`${ids}-name`}
        name="displayName"
        label="Display name"
        autoComplete="name"
        maxLength={DISPLAY_NAME_MAX_LENGTH}
        hint="Shown next to your comments."
        required
        disabled={pending}
        error={fieldErrors.displayName}
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
        defaultValue={defaultEmail}
        onChange={(e) => onEmailChange?.(e.target.value)}
        error={fieldErrors.email}
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
        error={fieldErrors.password}
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
