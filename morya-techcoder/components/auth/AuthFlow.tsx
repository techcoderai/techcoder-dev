"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormMessage, TextLink, textLinkClass, withNext } from "@/components/auth/AuthUi";
import { GoogleButton, OrDivider } from "@/components/auth/GoogleButton";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AuthView = "sign-in" | "sign-up" | "forgot-password";

const PATHS: Record<AuthView, string> = {
  "sign-in": "/auth/sign-in",
  "sign-up": "/auth/sign-up",
  "forgot-password": "/auth/forgot-password",
};

const COPY: Record<AuthView, { title: string; intro: string }> = {
  "sign-in": {
    title: "Sign in to TechCoder",
    intro: "Clap for articles and join the comments. Reading stays free and open.",
  },
  "sign-up": {
    title: "Create your account",
    intro: "A free account lets you clap for articles and join the comments.",
  },
  "forgot-password": {
    title: "Reset your password",
    intro: "Enter the email you signed up with and we'll send you a link to choose a new one.",
  },
};

type AuthFlowProps = {
  view: AuthView;
  /** Sanitized same-site path to land on after email links and Google. */
  next: string;
  /** Dialog: switch views in place. Pages omit it, so view switches are links. */
  onViewChange?: (view: AuthView) => void;
  /** Dialog: close in place. Pages omit it and navigate to `next`. */
  onSignedIn?: () => void;
  /** Runs before a Google redirect leaves the page. */
  onBeforeRedirect?: () => void;
  /** Replaces the default intro on sign-in/sign-up, e.g. why the reader was asked. */
  reason?: string;
  /** An error carried in from /auth/callback. */
  notice?: string;
  headingId?: string;
  headingRef?: React.Ref<HTMLHeadingElement>;
  headingLevel?: "h1" | "h2";
};

/**
 * Sign in, sign up and password reset as one flow. Rendered inside the
 * site-wide dialog (components/auth/AuthModal.tsx) and on the direct
 * /auth/* pages, so both share the same forms, copy and validation.
 */
export function AuthFlow({
  view,
  next,
  onViewChange,
  onSignedIn,
  onBeforeRedirect,
  reason,
  notice,
  headingId,
  headingRef,
  headingLevel: Heading = "h1",
}: AuthFlowProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const { title, intro } = COPY[view];

  const signedIn =
    onSignedIn ??
    (() => {
      router.replace(next);
      router.refresh();
    });

  const switchTo = onViewChange
    ? (to: AuthView) => {
        setAwaitingVerification(false);
        onViewChange(to);
      }
    : undefined;

  const viewLink = (to: AuthView, label: string) =>
    switchTo ? (
      <button type="button" onClick={() => switchTo(to)} className={textLinkClass}>
        {label}
      </button>
    ) : (
      <TextLink href={withNext(PATHS[to], next)}>{label}</TextLink>
    );

  return (
    <div>
      <Heading
        id={headingId}
        ref={headingRef}
        tabIndex={-1}
        className="pr-8 font-heading text-[1.375rem] font-bold leading-tight tracking-tight text-tc-text outline-none"
      >
        {title}
      </Heading>
      <p className="mt-1.5 text-sm leading-relaxed text-tc-text-muted">
        {view !== "forgot-password" && reason ? reason : intro}
      </p>

      <div className="mt-6">
        {!isSupabaseConfigured ? (
          <FormMessage tone="error">Accounts are not available right now.</FormMessage>
        ) : (
          <>
            {notice && (
              <div className="mb-5">
                <FormMessage tone="error">{notice}</FormMessage>
              </div>
            )}

            {view === "sign-in" && (
              <>
                <GoogleButton next={next} onBeforeRedirect={onBeforeRedirect} />
                <OrDivider />
                <SignInForm
                  next={next}
                  onSignedIn={signedIn}
                  defaultEmail={email}
                  onEmailChange={setEmail}
                  forgotLink={viewLink("forgot-password", "Forgot password?")}
                />
              </>
            )}

            {view === "sign-up" && (
              <>
                {!awaitingVerification && (
                  <>
                    <GoogleButton next={next} label="Sign up with Google" onBeforeRedirect={onBeforeRedirect} />
                    <OrDivider />
                  </>
                )}
                <SignUpForm
                  next={next}
                  onSignedIn={signedIn}
                  onVerificationSent={() => setAwaitingVerification(true)}
                  defaultEmail={email}
                  onEmailChange={setEmail}
                />
                {!awaitingVerification && (
                  <p className="mt-4 text-xs leading-relaxed text-tc-text-light">
                    By creating an account you agree to our{" "}
                    <TextLink href="/terms" newTab={!!switchTo}>
                      Terms
                    </TextLink>{" "}
                    and{" "}
                    <TextLink href="/privacy" newTab={!!switchTo}>
                      Privacy Policy
                    </TextLink>
                    .
                  </p>
                )}
              </>
            )}

            {view === "forgot-password" && <ForgotPasswordForm defaultEmail={email} onEmailChange={setEmail} />}
          </>
        )}
      </div>

      <p className="mt-6 border-t border-tc-border pt-4 text-sm text-tc-text-muted">
        {view === "sign-in" ? (
          <>New to TechCoder? {viewLink("sign-up", "Create an account")}</>
        ) : view === "sign-up" ? (
          <>Already have an account? {viewLink("sign-in", "Sign in")}</>
        ) : (
          <>Remembered it? {viewLink("sign-in", "Back to sign in")}</>
        )}
      </p>
    </div>
  );
}
