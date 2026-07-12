"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

export default function HeadingLink({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      navigator.clipboard?.writeText(url);
    } catch {
      /* clipboard unavailable */
    }
    window.history.replaceState(null, "", `#${id}`);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <a
      href={`#${id}`}
      onClick={onClick}
      aria-label="Copy link to this section"
      className="focus-ring ml-2 inline-flex items-center align-middle text-tc-text-light opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-tc-primary"
    >
      {copied ? <Check size={15} /> : <Link2 size={15} />}
    </a>
  );
}
