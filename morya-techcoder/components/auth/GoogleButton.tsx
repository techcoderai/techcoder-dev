"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { FormMessage } from "@/components/auth/AuthUi";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase/config";

/** Asks Supabase Auth whether the Google provider is switched on (public endpoint). */
async function isGoogleEnabled(): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY },
    });
    const settings = (await res.json()) as { external?: { google?: boolean } };
    return settings.external?.google === true;
  } catch {
    // Unknown — let the redirect attempt surface any real problem.
    return true;
  }
}

/** Where Supabase sends the reader back after Google / email links. */
export function callbackUrl(next: string): string {
  return `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
}

/** Maps Supabase Auth errors to short, non-enumerating copy. */
export function authErrorMessage(error: { code?: string; message?: string } | null): string {
  switch (error?.code) {
    case "invalid_credentials":
      return "Email or password is incorrect.";
    case "email_not_confirmed":
      return "Confirm your email address first — check your inbox for the link.";
    case "weak_password":
      return "Choose a stronger password: at least 8 characters with letters and numbers.";
    case "same_password":
      return "Choose a password you haven't used here before.";
    case "user_already_exists":
    case "email_exists":
      return "An account with this email already exists. Sign in instead.";
    case "email_address_invalid":
      return "Enter a valid email address.";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "Too many attempts. Please wait a minute and try again.";
    case "signup_disabled":
      return "New sign-ups are paused right now.";
    case "validation_failed":
      return "Check your details and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

export function GoogleButton({ next, label = "Continue with Google" }: { next: string; label?: string }) {
  const { getClient } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const [supabase, enabled] = await Promise.all([getClient(), isGoogleEnabled()]);
      if (!enabled) {
        setError("Google sign-in isn't available yet. Please use email and password.");
        setPending(false);
        return;
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: callbackUrl(next) },
      });
      // On success the browser is already navigating to Google.
      if (error) {
        setError(authErrorMessage(error));
        setPending(false);
      }
    } catch {
      setError(authErrorMessage(null));
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        aria-busy={pending}
        className="btn-secondary focus-ring w-full py-3 text-[14.5px] disabled:pointer-events-none disabled:opacity-60"
      >
        <GoogleMark />
        {pending ? "Redirecting to Google…" : label}
      </button>
      {error && <FormMessage tone="error">{error}</FormMessage>}
    </div>
  );
}

export function OrDivider() {
  return (
    <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-tc-text-light" aria-hidden="true">
      <span className="h-px flex-1 bg-tc-border" />
      or
      <span className="h-px flex-1 bg-tc-border" />
    </div>
  );
}
