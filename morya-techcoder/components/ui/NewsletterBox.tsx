"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function NewsletterBox() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section className="relative overflow-hidden rounded-[26px] card-surface p-6 sm:p-8 md:p-12">
      <div className="absolute inset-0 -z-10 mesh-glow opacity-60" />
      <div className="relative z-10 max-w-xl mx-auto text-center">
        <h2 className="heading-lg text-xl sm:text-2xl md:text-3xl text-tc-text mb-3">
          Stay Ahead of the Curve
        </h2>
        <p className="text-tc-text-muted text-sm md:text-base mb-8 leading-relaxed max-w-md mx-auto">
          Get weekly handpicked AI news, coding tricks, and web dev insights.
          No spam, unsubscribe anytime.
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-2.5 text-tc-primary-dark font-bold text-lg animate-fade-up">
            <CheckCircle2 size={24} />
            You&apos;re in! Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="focus-ring flex-1 px-5 py-3.5 rounded-full bg-tc-bg-card text-tc-text placeholder:text-tc-text-light border border-tc-border hover:border-tc-border-strong focus:border-tc-primary focus:shadow-[0_0_0_3px_rgba(249,115,22,0.12)] outline-none transition-all duration-200 text-sm"
            />
            <button
              type="submit"
              className="group/btn btn-primary focus-ring px-6 py-3.5 text-sm"
            >
              Subscribe
              <Send size={14} className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
