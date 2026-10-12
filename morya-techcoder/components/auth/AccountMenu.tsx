"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import UserAvatar from "@/components/ui/UserAvatar";

/** `/auth/sign-in?next=<here>` — auth pages themselves never become the destination. */
export function signInHref(pathname: string, hash = ""): string {
  if (pathname.startsWith("/auth")) return "/auth/sign-in";
  return `/auth/sign-in?next=${encodeURIComponent(pathname + hash)}`;
}

/**
 * Navbar account control: a compact "Sign in" link when signed out, or a
 * circular avatar that opens a small Profile / Sign out menu.
 */
export default function AccountMenu({ className }: { className?: string }) {
  const { status, profile, email, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const items = () => Array.from(rootRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    items()[0]?.focus();

    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const list = items();
        const i = list.indexOf(document.activeElement as HTMLElement);
        const next = e.key === "ArrowDown" ? (i + 1) % list.length : (i - 1 + list.length) % list.length;
        list[next]?.focus();
      }
      if (e.key === "Tab") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (status === "unavailable") return null;

  if (status === "loading") {
    return <span aria-hidden="true" className={cn("block h-9 w-9 shrink-0 rounded-full border border-tc-border", className)} />;
  }

  if (status === "signed-out") {
    return (
      <Link
        href={signInHref(pathname)}
        aria-label="Sign in"
        className={cn(
          "press focus-ring flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full border border-tc-border bg-tc-glass-bg text-[13.5px] font-medium text-tc-text-muted transition-colors duration-[var(--tc-dur)] hover:border-tc-primary hover:text-tc-primary",
          "w-9 sm:w-auto sm:px-3.5",
          className
        )}
      >
        <User size={16} aria-hidden="true" className="sm:hidden" />
        <span className="hidden sm:inline">Sign in</span>
      </Link>
    );
  }

  const name = profile?.displayName ?? "Reader";

  const onSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await signOut();
      setOpen(false);
      if (pathname.startsWith("/account")) router.push("/");
      else router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div ref={rootRef} className={cn("relative shrink-0", className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`Account menu for ${name}`}
        className="press focus-ring flex h-9 w-9 items-center justify-center rounded-full transition-shadow duration-[var(--tc-dur)] hover:shadow-[0_0_0_2px_var(--tc-primary)]"
      >
        <UserAvatar name={name} src={profile?.avatarUrl} size={36} />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Account"
          className="animate-fade-up absolute right-0 top-[calc(100%+0.5rem)] z-50 w-56 overflow-hidden rounded-2xl border border-tc-border bg-tc-bg-card p-1.5 shadow-[var(--tc-shadow-lg)]"
        >
          <div className="border-b border-tc-border px-3 pb-2.5 pt-2">
            <p className="truncate text-sm font-semibold text-tc-text">{name}</p>
            {email && <p className="truncate text-xs text-tc-text-light">{email}</p>}
          </div>
          <Link
            href="/account"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="focus-ring mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-tc-text-muted transition-colors duration-[var(--tc-dur)] hover:bg-tc-bg-elevated hover:text-tc-text focus-visible:bg-tc-bg-elevated"
          >
            <User size={15} aria-hidden="true" />
            Profile
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={onSignOut}
            disabled={signingOut}
            className="focus-ring flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-tc-text-muted transition-colors duration-[var(--tc-dur)] hover:bg-tc-bg-elevated hover:text-tc-text focus-visible:bg-tc-bg-elevated disabled:opacity-60"
          >
            <LogOut size={15} aria-hidden="true" />
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      )}
    </div>
  );
}
