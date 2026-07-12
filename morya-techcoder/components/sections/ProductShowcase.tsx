"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Atom, FileType2, Paintbrush, TerminalSquare } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

/* Restrained, on-brand syntax tokens */
const K = ({ children }: { children: ReactNode }) => <span className="text-tc-primary">{children}</span>;
const F = ({ children }: { children: ReactNode }) => (
  <span className="text-tc-primary-dark font-medium">{children}</span>
);
const S = ({ children }: { children: ReactNode }) => (
  <span className="text-emerald-600 dark:text-emerald-400">{children}</span>
);
const C = ({ children }: { children: ReactNode }) => (
  <span className="text-tc-text-light italic">{children}</span>
);

const tabs = [
  { id: "react", label: "React", icon: Atom, file: "useReveal.ts" },
  { id: "typescript", label: "TypeScript", icon: FileType2, file: "result.ts" },
  { id: "css", label: "CSS", icon: Paintbrush, file: "glass.css" },
  { id: "shell", label: "Terminal", icon: TerminalSquare, file: "aliases.sh" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const snippets: Record<TabId, ReactNode[]> = {
  react: [
    <C key="c">{"// Reveal on scroll with the Intersection Observer"}</C>,
    <span key="1"><K>export function</K> <F>useReveal</F>&lt;T <K>extends</K> HTMLElement&gt;() {"{"}</span>,
    <span key="2">{"  "}<K>const</K> ref = <F>useRef</F>&lt;T&gt;(<K>null</K>);</span>,
    <span key="3">{"  "}<K>const</K> [shown, setShown] = <F>useState</F>(<K>false</K>);</span>,
    <span key="4">&nbsp;</span>,
    <span key="5">{"  "}<F>useEffect</F>(() =&gt; {"{"}</span>,
    <span key="6">{"    "}<K>const</K> io = <K>new</K> <F>IntersectionObserver</F>(</span>,
    <span key="7">{"      "}([e]) =&gt; e.isIntersecting &amp;&amp; <F>setShown</F>(<K>true</K>)</span>,
    <span key="8">{"    );"}</span>,
    <span key="9">{"    "}ref.current &amp;&amp; io.<F>observe</F>(ref.current);</span>,
    <span key="10">{"  }, []);"}</span>,
    <span key="11">&nbsp;</span>,
    <span key="12">{"  "}<K>return</K> {"{ ref, shown }"};</span>,
    <span key="13">{"}"}</span>,
  ],
  typescript: [
    <C key="c">{"// A tiny type-safe Result helper"}</C>,
    <span key="1"><K>type</K> <F>Result</F>&lt;T&gt; =</span>,
    <span key="2">{"  "}| {"{ ok: "}<K>true</K>{"; value: T }"}</span>,
    <span key="3">{"  "}| {"{ ok: "}<K>false</K>{"; error: string };"}</span>,
    <span key="4">&nbsp;</span>,
    <span key="5"><K>function</K> <F>safe</F>&lt;T&gt;(fn: () =&gt; T): <F>Result</F>&lt;T&gt; {"{"}</span>,
    <span key="6">{"  "}<K>try</K> {"{"}</span>,
    <span key="7">{"    "}<K>return</K> {"{ ok: "}<K>true</K>, value: <F>fn</F>() {"};"}</span>,
    <span key="8">{"  }"} <K>catch</K> (e) {"{"}</span>,
    <span key="9">{"    "}<K>return</K> {"{ ok: "}<K>false</K>, error: <F>String</F>(e) {"};"}</span>,
    <span key="10">{"  }"}</span>,
    <span key="11">{"}"}</span>,
  ],
  css: [
    <C key="c">{"/* Frosted glass surface, theme-aware */"}</C>,
    <span key="1">.glass {"{"}</span>,
    <span key="2">{"  "}background: <S>rgba(255, 255, 255, 0.72)</S>;</span>,
    <span key="3">{"  "}backdrop-filter: <F>blur</F>(<S>18px</S>) <F>saturate</F>(<S>160%</S>);</span>,
    <span key="4">{"  "}border: <S>1px solid rgba(15, 23, 42, 0.08)</S>;</span>,
    <span key="5">{"  "}border-radius: <S>24px</S>;</span>,
    <span key="6">{"}"}</span>,
    <span key="7">&nbsp;</span>,
    <span key="8">.glass<K>:hover</K> {"{"}</span>,
    <span key="9">{"  "}box-shadow: <S>0 24px 60px -12px rgba(15, 23, 42, 0.16)</S>;</span>,
    <span key="10">{"}"}</span>,
  ],
  shell: [
    <C key="c">{"# Handy git aliases for your ~/.zshrc"}</C>,
    <span key="1"><K>alias</K> gs=<S>&quot;git status -sb&quot;</S></span>,
    <span key="2"><K>alias</K> gl=<S>&quot;git log --oneline --graph -20&quot;</S></span>,
    <span key="3"><K>alias</K> gco=<S>&quot;git checkout&quot;</S></span>,
    <span key="4">&nbsp;</span>,
    <span key="5"><C>{"# Create a branch and switch to it"}</C></span>,
    <span key="6"><F>gnb</F>() {"{ git checkout -b "}<S>&quot;$1&quot;</S>{"; }"}</span>,
    <span key="7">&nbsp;</span>,
    <span key="8"><span className="text-emerald-600 dark:text-emerald-400">$</span> gnb feature/hero-redesign</span>,
    <span key="9"><span className="text-tc-text-light">Switched to a new branch &apos;feature/hero-redesign&apos;</span></span>,
  ],
};

export default function ProductShowcase() {
  const [active, setActive] = useState<TabId>("react");
  const activeTab = tabs.find((t) => t.id === active)!;

  return (
    <section className="section-padding relative">
      <div className="container-wide mx-auto">
        <SectionHeading
          eyebrow="Code snippets"
          title={
            <>
              Learn by reading <span className="text-gradient">real, working code</span>
            </>
          }
          description="Every article ships with runnable examples. Browse a few of our most-copied snippets — across languages and topics."
          className="mb-12"
        />

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex flex-wrap justify-center gap-1 p-1.5 rounded-full glass-strong">
            {tabs.map((t) => {
              const isActive = active === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  className="focus-ring relative rounded-full px-4 sm:px-5 py-2.5 text-[13px] font-medium transition-colors duration-200"
                >
                  {isActive && (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-tc-primary to-tc-secondary shadow-glow"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span
                    className={`relative flex items-center gap-1.5 ${
                      isActive ? "text-white" : "text-tc-text-muted hover:text-tc-text"
                    }`}
                  >
                    <t.icon size={14} />
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor panel */}
        <div className="relative rounded-[26px] card-surface shadow-premium p-2.5 sm:p-3 max-w-4xl mx-auto">
          <div className="rounded-[18px] overflow-hidden border border-tc-border bg-tc-bg-secondary min-h-[360px]">
            <div className="flex items-center gap-2 px-4 h-11 border-b border-tc-border bg-tc-surface/60">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <span className="w-3 h-3 rounded-full bg-[#28C840]" />
              <span className="ml-3 flex items-center gap-1.5 text-[11px] font-mono text-tc-text-light">
                <activeTab.icon size={12} className="text-tc-primary" />
                {activeTab.file}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="bg-tc-bg-card/60 p-5 sm:p-7 overflow-x-auto"
              >
                <pre className="font-mono text-[12.5px] sm:text-[13px] leading-[1.85]">
                  {snippets[active].map((line, i) => (
                    <div key={i} className="flex gap-4 sm:gap-5">
                      <span className="select-none w-5 text-right text-tc-text-light/50">
                        {i + 1}
                      </span>
                      <code className="text-tc-text">{line}</code>
                    </div>
                  ))}
                </pre>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
