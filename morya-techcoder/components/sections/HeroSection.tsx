"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Terminal,
  GitBranch,
  BookOpen,
  Code2,
  FileCode2,
} from "lucide-react";

/* Restrained, on-brand syntax tokens */
const K = ({ children }: { children: ReactNode }) => (
  <span className="text-tc-primary">{children}</span>
);
const F = ({ children }: { children: ReactNode }) => (
  <span className="text-tc-primary-dark font-medium">{children}</span>
);
const S = ({ children }: { children: ReactNode }) => (
  <span className="text-emerald-600 dark:text-emerald-400">{children}</span>
);
const C = ({ children }: { children: ReactNode }) => (
  <span className="text-tc-text-light italic">{children}</span>
);

const codeLines: ReactNode[] = [
  <C key="c">{"// usePrefersDark.ts — from 1,200+ snippets"}</C>,
  <span key="1">
    <K>import</K> {"{ useEffect, useState }"} <K>from</K> <S>&quot;react&quot;</S>;
  </span>,
  <span key="2">&nbsp;</span>,
  <span key="3">
    <K>export function</K> <F>usePrefersDark</F>() {"{"}
  </span>,
  <span key="4">
    {"  "}
    <K>const</K> [dark, setDark] = <F>useState</F>(<K>false</K>);
  </span>,
  <span key="5">&nbsp;</span>,
  <span key="6">
    {"  "}
    <F>useEffect</F>(() =&gt; {"{"}
  </span>,
  <span key="7">
    {"    "}
    <K>const</K> mq = <F>matchMedia</F>(<S>&quot;(prefers-color-scheme: dark)&quot;</S>);
  </span>,
  <span key="8">
    {"    "}
    <F>setDark</F>(mq.matches);
  </span>,
  <span key="9">{"  }, []);"}</span>,
  <span key="10">&nbsp;</span>,
  <span key="11">
    {"  "}
    <K>return</K> dark;
  </span>,
  <span key="12">{"}"}</span>,
];

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 18 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section className="relative overflow-hidden pt-36 md:pt-44 pb-20 md:pb-28 px-4 sm:px-6">
      {/* Ambient mesh */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] mesh-glow opacity-80 blur-[40px]" />
        <div
          className="absolute inset-x-0 top-0 h-[520px] dot-overlay opacity-70"
          style={{
            maskImage: "radial-gradient(ellipse 60% 70% at 50% 30%, #000 20%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 60% 70% at 50% 30%, #000 20%, transparent 75%)",
          }}
        />
      </div>

      <div className="container-wide mx-auto flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link href="/blog" className="chip group hover:border-tc-primary transition-colors">
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-tc-primary text-white">
              <Sparkles size={9} className="fill-current" />
            </span>
            New tutorials & deep dives every week
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="display-xl mt-7 max-w-4xl"
        >
          Learn, build, and grow
          <br className="hidden sm:block" /> as a <span className="text-gradient-animated">developer.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-xl text-base sm:text-lg text-tc-text-muted leading-relaxed"
        >
          TechCoder is the developer publication for people who build — in-depth articles,
          hands-on tutorials, and copy-paste snippets across AI, web engineering, and tooling.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 flex flex-col sm:flex-row items-center gap-3.5"
        >
          <Link href="/blog" className="btn-primary focus-ring group px-7 py-3.5 text-[15px]">
            Start reading
            <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link href="/blog?category=WebDev" className="btn-secondary focus-ring px-7 py-3.5 text-[15px]">
            <Code2 size={15} />
            Browse tutorials
          </Link>
        </motion.div>
      </div>

      {/* Code editor preview */}
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
        style={{ perspective: 1400 }}
        className="container-wide mx-auto mt-16 md:mt-20 relative max-w-4xl"
      >
        <motion.div
          style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
          className="relative rounded-[26px] card-surface shadow-premium p-2.5 sm:p-3"
        >
          {/* Window chrome + file tabs */}
          <div className="rounded-[18px] overflow-hidden border border-tc-border bg-tc-bg-secondary">
            <div className="flex items-center gap-2 px-4 h-11 border-b border-tc-border bg-tc-surface/60">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <span className="w-3 h-3 rounded-full bg-[#28C840]" />
              <div className="ml-3 hidden sm:flex items-center gap-1">
                {[
                  { name: "usePrefersDark.ts", active: true },
                  { name: "Button.tsx", active: false },
                  { name: "README.md", active: false },
                ].map((t) => (
                  <span
                    key={t.name}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono ${
                      t.active
                        ? "bg-tc-bg-elevated text-tc-text border-b-2 border-tc-primary"
                        : "text-tc-text-light"
                    }`}
                  >
                    <FileCode2 size={11} className={t.active ? "text-tc-primary" : ""} />
                    {t.name}
                  </span>
                ))}
              </div>
              <span className="ml-auto flex items-center gap-1.5 text-[11px] text-tc-text-light font-mono">
                <GitBranch size={12} className="text-tc-primary" />
                main
              </span>
            </div>

            {/* Code body */}
            <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr]">
              {/* File explorer */}
              <aside className="hidden sm:block border-r border-tc-border bg-tc-bg-card/40 p-3 text-[11.5px] font-mono text-tc-text-light">
                <p className="uppercase tracking-wider text-[10px] mb-2 text-tc-text-light/70">
                  hooks
                </p>
                {["usePrefersDark.ts", "useReveal.ts", "useMediaQuery.ts"].map((f, i) => (
                  <p
                    key={f}
                    className={`flex items-center gap-1.5 py-1 rounded px-1.5 ${
                      i === 0 ? "bg-tc-primary/10 text-tc-primary" : ""
                    }`}
                  >
                    <FileCode2 size={11} /> {f}
                  </p>
                ))}
              </aside>

              {/* Editor */}
              <div className="bg-tc-bg-card/60 p-4 sm:p-5 overflow-x-auto">
                <pre className="font-mono text-[12.5px] leading-[1.75]">
                  {codeLines.map((line, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="select-none w-5 text-right text-tc-text-light/50">
                        {i + 1}
                      </span>
                      <code className="text-tc-text">{line}</code>
                    </div>
                  ))}
                </pre>
              </div>
            </div>

            {/* Status bar */}
            <div className="flex items-center gap-3 px-4 h-8 border-t border-tc-border bg-tc-surface/60 text-[10.5px] font-mono text-tc-text-light">
              <span className="flex items-center gap-1 text-tc-primary">
                <GitBranch size={11} /> main
              </span>
              <span className="flex items-center gap-1">
                <Terminal size={11} /> npm run dev · ready
              </span>
              <span className="ml-auto">TypeScript</span>
              <span>UTF-8</span>
              <span>Ln 8, Col 24</span>
            </div>
          </div>
        </motion.div>

        {/* Floating cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="hidden md:flex absolute -left-4 lg:-left-10 top-24 items-center gap-2.5 px-4 py-3 rounded-2xl glass-strong animate-float"
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-tc-primary to-tc-secondary text-white">
            <BookOpen size={16} />
          </span>
          <div className="text-left">
            <p className="text-[11px] text-tc-text-light">Tutorials</p>
            <p className="heading-sm text-sm">320+ guides</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.05 }}
          className="hidden md:flex absolute -right-4 lg:-right-10 bottom-16 items-center gap-2.5 px-4 py-3 rounded-2xl glass-strong animate-float-delay"
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-tc-primary/12 text-tc-primary">
            <Code2 size={16} />
          </span>
          <div className="text-left">
            <p className="text-[11px] text-tc-text-light">Snippets</p>
            <p className="heading-sm text-sm">1,200+ ready</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
