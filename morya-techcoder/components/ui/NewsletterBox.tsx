"use client";

import { useId, useState } from "react";
import { ArrowRight, CheckCircle2, Info, AlertCircle } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "duplicate" | "error";

const ERROR_COPY = "Something went wrong. Please try again.";
const INVALID_COPY = "Enter a valid email address.";

export default function NewsletterBox() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState(ERROR_COPY);
  const inputId = useId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    if (!email.trim()) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => null)) as { status?: string } | null;

      switch (data?.status) {
        case "subscribed":
          setStatus("success");
          setEmail("");
          break;
        case "duplicate":
          setStatus("duplicate");
          break;
        case "invalid":
          setMessage(INVALID_COPY);
          setStatus("error");
          break;
        default:
          setMessage(ERROR_COPY);
          setStatus("error");
      }
    } catch {
      setMessage(ERROR_COPY);
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setMessage(ERROR_COPY);
  };

  return (
    <section className="border-t border-tc-border pt-10 md:pt-14">
      <div className="grid gap-8 md:grid-cols-12 md:gap-10 md:items-center">
        <div className="md:col-span-5">
          <span className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-tc-text-light">
            <span className="h-px w-6 bg-tc-primary" />
            Newsletter
          </span>
          <h2 className="heading-lg mt-4">Get the useful stuff.</h2>
          <p className="body-base mt-3 max-w-sm">
            Practical engineering, AI and technology insights — without the noise.
          </p>
        </div>

        <div className="md:col-span-7">
          {status === "success" && (
            <div
              role="status"
              aria-live="polite"
              className="flex items-center gap-2.5 font-semibold text-tc-primary-dark animate-fade-up"
            >
              <CheckCircle2 size={20} />
              You&apos;re in. Thanks for subscribing.
            </div>
          )}

          {status === "duplicate" && (
            <div className="flex flex-wrap items-center gap-3 animate-fade-up">
              <p role="status" aria-live="polite" className="flex items-center gap-2.5 font-semibold text-tc-text">
                <Info size={20} className="text-tc-text-light" />
                You&apos;re already subscribed.
              </p>
              <button
                type="button"
                onClick={reset}
                className="focus-ring rounded text-sm text-tc-text-muted underline underline-offset-4 hover:text-tc-primary transition-colors duration-200"
              >
                Use a different email
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-wrap items-center gap-3 animate-fade-up">
              <p role="alert" aria-live="assertive" className="flex items-center gap-2.5 font-semibold text-tc-text">
                <AlertCircle size={20} className="text-tc-accent" />
                {message}
              </p>
              <button
                type="button"
                onClick={reset}
                className="focus-ring rounded text-sm text-tc-text-muted underline underline-offset-4 hover:text-tc-primary transition-colors duration-200"
              >
                Try again
              </button>
            </div>
          )}

          {(status === "idle" || status === "submitting") && (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-end max-w-md">
                <div className="flex-1">
                  <label htmlFor={inputId} className="sr-only">
                    Email address
                  </label>
                  <input
                    id={inputId}
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    disabled={status === "submitting"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="focus-ring w-full border-b border-tc-border bg-transparent px-0 py-2.5 text-sm text-tc-text placeholder:text-tc-text-light outline-none transition-colors duration-[var(--tc-dur)] hover:border-tc-border-strong focus:border-tc-primary disabled:opacity-60"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  aria-busy={status === "submitting"}
                  className="group/btn focus-ring shrink-0 inline-flex items-center gap-1.5 border-b border-transparent pb-2.5 text-sm font-semibold text-tc-text transition-colors duration-200 hover:border-tc-primary hover:text-tc-primary disabled:opacity-60 disabled:pointer-events-none"
                >
                  {status === "submitting" ? "Subscribing…" : "Subscribe"}
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover/btn:translate-x-1"
                  />
                </button>
              </form>
              <p className="mt-3 text-xs text-tc-text-light">
                Occasional. Useful. Unsubscribe anytime.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
