import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Surface shared by the sign-in dialog and the direct /auth/* pages. */
export const authPanelClass =
  "w-full max-w-[400px] rounded-xl border border-tc-border bg-tc-bg-card p-5 text-left sm:p-7";

/** Direct-URL frame for /auth/sign-in, /sign-up and /forgot-password: the dialog's panel, on the page. */
export function AuthPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pb-16 pt-24 sm:px-6 sm:pt-32 md:pb-24">
      <div className={cn(authPanelClass, "mx-auto")}>{children}</div>
    </div>
  );
}

/** Compact, centered frame for the account and update-password pages. */
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

// 16px on phones so iOS doesn't zoom the page when a field gains focus.
export const inputClass =
  "block h-10 w-full rounded-lg border border-tc-border-strong bg-tc-bg-card px-3 text-base text-tc-text placeholder:text-tc-text-light outline-none transition-[border-color,box-shadow] duration-[var(--tc-dur)] focus:border-tc-primary focus:shadow-[0_0_0_3px_var(--tc-glow)] disabled:opacity-60 aria-[invalid=true]:border-tc-accent sm:text-[15px]";

export function Field({
  id,
  label,
  hint,
  error,
  aside,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: string;
  error?: string | null;
  aside?: React.ReactNode;
}) {
  const note = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13.5px] font-medium text-tc-text">
          {label}
        </label>
        {aside}
      </div>
      <input id={id} aria-describedby={note} aria-invalid={error ? true : undefined} className={inputClass} {...props} />
      {error ? (
        <p id={note} className="mt-1.5 text-xs font-medium text-tc-accent">
          {error}
        </p>
      ) : (
        hint && (
          <p id={note} className="mt-1.5 text-xs text-tc-text-light">
            {hint}
          </p>
        )
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
  "focus-ring inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-tc-primary px-4 text-sm font-semibold text-white transition-colors duration-[var(--tc-dur)] hover:bg-tc-primary-dark disabled:pointer-events-none disabled:opacity-60";

export const secondaryButtonClass =
  "focus-ring inline-flex h-10 w-full items-center justify-center gap-2.5 rounded-lg border border-tc-border-strong bg-tc-bg-card px-4 text-sm font-medium text-tc-text transition-colors duration-[var(--tc-dur)] hover:bg-tc-bg-elevated disabled:pointer-events-none disabled:opacity-60";

export const textLinkClass =
  "focus-ring rounded font-medium text-tc-text underline decoration-tc-border-strong underline-offset-4 transition-colors duration-[var(--tc-dur)] hover:text-tc-primary hover:decoration-tc-primary";

export function TextLink({
  href,
  children,
  newTab,
}: {
  href: string;
  children: React.ReactNode;
  newTab?: boolean;
}) {
  return (
    <Link
      href={href}
      className={textLinkClass}
      {...(newTab && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children}
    </Link>
  );
}

/** Appends `?next=` to an auth link when there's a destination to keep. */
export function withNext(path: string, next: string): string {
  return next === "/" ? path : `${path}?next=${encodeURIComponent(next)}`;
}
