"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const faqs = [
  {
    q: "What exactly is TechCoder?",
    a: "TechCoder is a premium technical publication for developers — in-depth articles, hands-on tutorials, and code snippets across AI, web engineering, and developer tooling.",
  },
  {
    q: "Who writes the articles?",
    a: "Every article is researched, written, and edited entirely by the in-house TechCoder team. There are no guest submissions, user accounts, or community posts — just one team focused on quality.",
  },
  {
    q: "Is the content actually free?",
    a: "Yes. Every article is free to read — no paywalls, no gatekeeping, no account required. We believe great developer knowledge should be open to everyone.",
  },
  {
    q: "How often do you publish?",
    a: "New tutorials and deep dives go out every week across AI, web development, and developer tips. Subscribe to the newsletter and you'll never miss one.",
  },
  {
    q: "Does the site support dark mode?",
    a: "Beautifully. Both light and dark themes are individually designed — not inverted — and your preference persists across visits, so late-night reading is easy on the eyes.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section-padding relative">
      <div className="container-wide mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-start">
          <SectionHeading
            eyebrow="FAQ"
            align="left"
            title={
              <>
                Questions,<br />
                <span className="text-gradient">answered</span>
              </>
            }
            description="Everything you need to know before you dive in. Still curious? The blog goes deeper."
          />

          <div className="flex flex-col gap-3">
            {faqs.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={item.q}
                  className={`rounded-2xl border transition-colors duration-300 ${
                    isOpen ? "border-tc-primary/40 bg-tc-bg-card" : "border-tc-border bg-tc-bg-card"
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="focus-ring w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="heading-sm text-[15px]">{item.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      className={`flex items-center justify-center w-8 h-8 shrink-0 rounded-full ${
                        isOpen ? "bg-gradient-to-br from-tc-primary to-tc-secondary text-white" : "bg-tc-bg-elevated text-tc-text-muted"
                      }`}
                    >
                      <Plus size={16} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 sm:px-6 pb-5 -mt-1 body-sm">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
