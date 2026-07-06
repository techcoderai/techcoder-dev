"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Copy, ChevronDown } from "lucide-react";

export default function CodeBlock({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const [tall, setTall] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (ref.current) setTall(ref.current.scrollHeight > 460);
  }, []);

  const copy = async () => {
    const text = ref.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const collapsed = tall && !expanded;

  return (
    <div className="relative group my-6">
      <button
        onClick={copy}
        aria-label="Copy code"
        className="focus-ring absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-white/80 bg-white/10 border border-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white/20 hover:text-white"
      >
        {copied ? (
          <>
            <Check size={12} /> Copied
          </>
        ) : (
          <>
            <Copy size={12} /> Copy
          </>
        )}
      </button>

      <pre
        ref={ref}
        style={collapsed ? { maxHeight: 380, overflow: "hidden" } : undefined}
        className="!my-0"
      >
        {children}
      </pre>

      {collapsed && (
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center h-24 rounded-b-[14px] bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/80 to-transparent">
          <button
            onClick={() => setExpanded(true)}
            className="focus-ring mb-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium text-white bg-white/10 border border-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            Expand code
            <ChevronDown size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
