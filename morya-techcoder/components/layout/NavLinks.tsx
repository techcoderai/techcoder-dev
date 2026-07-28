"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type NavLink = { href: string; label: string };

/**
 * Desktop primary navigation — CSS-only active/hover treatment.
 *
 * Intentionally Framer-free: magnetic springs + layoutId pills pulled
 * ~90KB of motion into every route. The underline + soft pill still
 * communicate state without blocking TBT on the homepage.
 */
export default function NavLinks({
  links,
  pathname,
}: {
  links: NavLink[];
  pathname: string;
}) {
  const activeHref = links.find((l) => l.href === pathname)?.href ?? null;

  return (
    <div className="hidden lg:flex items-center gap-0.5 mx-auto">
      {links.map((link) => {
        const active = activeHref === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "nav-link focus-ring relative rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors duration-[var(--tc-dur)]",
              active ? "text-tc-text nav-link-active" : "text-tc-text-muted hover:text-tc-text"
            )}
          >
            <span className="relative z-10">{link.label}</span>
            <span
              aria-hidden
              data-active={active ? "true" : "false"}
              className="nav-underline pointer-events-none absolute left-1/2 -bottom-0.5 h-px -translate-x-1/2 rounded-full bg-gradient-to-r from-tc-primary to-tc-primary-light"
            />
          </Link>
        );
      })}
    </div>
  );
}
