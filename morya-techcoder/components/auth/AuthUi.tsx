import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Compact, centered frame shared by every /auth page and the account page. */
export function AuthShell({
  overline,
  title,
  intro,
  children,
  footer,
}: {
  overline: string;
  title: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="px-4 pb-16 pt-28 sm:px-6 sm:pt-32 md:pb-24">
      <div className="mx-auto w-full max-w-[400px]">
        <p className="overline mb-3 text-tc-text-light">{overline}</p>
        <h1 className="heading-lg text-[1.75rem] sm:text-[2rem]">{title}</h1>
        {intro && <p className="body-base mt-2.5 text-[15px]">{intro}</p>}
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-8 border-t border-tc-border pt-5 text-sm text-tc-text-muted">{footer}</div>}
      </div>
    </div>
  );
}

export const inputClass =
  "focus-ring w-full rounded-xl border border-tc-border bg-tc-bg-card px-3.5 py-3 text-[15px] text-tc-text placeholder:text-tc-text-light outline-none transition-[border-color,box-shadow] duration-[var(--tc-dur)] hover:border-tc-border-strong focus:border-tc-primary focus:shadow-[0_0_0_3px_var(--tc-glow-soft)] disabled:opacity-60";

export function Field({
  id,
  label,
  hint,
  aside,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: string;
  aside?: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-tc-text">
          {label}
        </label>
        {aside}
      </div>
      <input id={id} aria-describedby={hint ? `${id}-hint` : undefined} className={inputClass} {...props} />
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-tc-text-light">
          {hint}
        </p>
      )}
    </div>
  );
}

export function FormMessage({ tone, children }: { tone: "error" | "success"; children: React.ReactNode }) {
  const Icon = tone === "error" ? AlertCircle : CheckCircle2;
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2 text-sm",
        tone === "error" ? "text-tc-text" : "font-medium text-tc-primary-dark"
      )}
    >
      <Icon size={17} aria-hidden="true" className={cn("mt-px shrink-0", tone === "error" ? "text-tc-accent" : "")} />
      <span>{children}</span>
    </p>
  );
}

export const primaryButtonClass =
  "btn-primary focus-ring w-full py-3 text-[14.5px] disabled:pointer-events-none disabled:opacity-60";

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="focus-ring rounded font-medium text-tc-text underline decoration-tc-border-strong underline-offset-4 transition-colors duration-[var(--tc-dur)] hover:text-tc-primary hover:decoration-tc-primary"
    >
      {children}
    </Link>
  );
}

/** Appends `?next=` to an auth link when there's a destination to keep. */
export function withNext(path: string, next: string): string {
  return next === "/" ? path : `${path}?next=${encodeURIComponent(next)}`;
}
