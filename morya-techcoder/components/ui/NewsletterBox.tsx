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
    <section className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-md p-6 sm:p-8 md:p-10">
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
              className="focus-ring flex-1 px-5 py-3.5 rounded-full bg-tc-bg text-tc-text placeholder:text-tc-text-light border border-gray-200 hover:border-tc-text-light/50 focus:border-tc-primary focus:shadow-[0_0_0_3px_rgba(255,180,51,0.1)] outline-none transition-all duration-200 text-sm"
            />
            <button
              type="submit"
              className="group/btn focus-ring inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-tc-primary text-tc-text font-bold rounded-full hover:bg-tc-primary-dark transition-all duration-200 ease-in-out text-sm hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(255,180,51,0.25)] active:translate-y-0 active:shadow-none"
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
