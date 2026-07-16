"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EditorialNewsletter() {
  const [email, setEmail]       = useState("");
  const [focused, setFocused]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <section
      id="newsletter"
      className="section-padding border-t border-tc-border bg-tc-bg"
    >
      <div className="container-narrow mx-auto px-page text-center">

        {/* Eyebrow */}
        <span className="overline text-tc-primary text-[10.5px]">Newsletter</span>

        {/* Headline */}
        <h2 className="display-lg mt-5 max-w-xl mx-auto">
          Quality tech writing,{" "}
          <span className="text-gradient">in your inbox.</span>
        </h2>

        {/* Subline */}
        <p className="mt-5 text-base text-tc-text-muted max-w-md mx-auto leading-relaxed">
          A weekly digest of the best articles across AI, programming, and gadgets.
          No noise. Unsubscribe at any time.
        </p>

        {/* Form or success */}
        <div className="mt-10 max-w-md mx-auto">
          {submitted ? (
            <div className="flex items-center gap-3 justify-center p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/60 dark:bg-emerald-900/10">
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Check size={17} />
              </span>
              <div className="text-left">
                <p className="font-semibold text-[14px] text-tc-text">You&apos;re subscribed!</p>
                <p className="text-[12.5px] text-tc-text-muted mt-0.5">First issue arrives next week.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div
                className={cn(
                  "flex items-center gap-2 p-1.5 rounded-2xl bg-tc-bg-card border transition-all duration-200",
                  focused
                    ? "border-tc-primary shadow-[0_0_0_3px_var(--tc-glow-soft)]"
                    : "border-tc-border-medium"
                )}
              >
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  className="flex-1 min-w-0 px-4 py-3 bg-transparent text-[14px] text-tc-text placeholder:text-tc-text-light outline-none"
                />
                <button
                  type="submit"
                  className="btn-primary focus-ring shrink-0 px-5 py-3 text-[13.5px] rounded-xl"
                >
                  Subscribe
                  <ArrowRight size={14} />
                </button>
              </div>
              <p className="mt-3 text-[11px] text-tc-text-light">
                Free forever · No spam · Unsubscribe any time
              </p>
            </form>
          )}
        </div>

        {/* Trust row */}
        {!submitted && (
          <div className="mt-8 flex items-center justify-center gap-6 sm:gap-10">
            {[
              { n: "500+",    l: "Articles" },
              { n: "Weekly",  l: "Cadence" },
              { n: "0",       l: "Paywalls" },
            ].map((s, i) => (
              <div key={s.l} className="flex items-center gap-6 sm:gap-10">
                {i > 0 && <span className="w-px h-6 bg-tc-border" />}
                <div className="text-center">
                  <p className="font-heading font-bold text-base text-tc-text">{s.n}</p>
                  <p className="text-[10.5px] text-tc-text-light mt-0.5">{s.l}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
