import Link from "next/link";
import * as Icons from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A grid of highlight cards. Wrap `<InfoCard>` items in `<InfoCards>`.
 *
 * MDX usage:
 *   <InfoCards>
 *   <InfoCard title="Fast" icon="Zap">Ships static HTML.</InfoCard>
 *   <InfoCard title="Docs" icon="BookOpen" href="/docs">Read more.</InfoCard>
 *   </InfoCards>
 */
export function InfoCards({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
  );
}

export function InfoCard({
  title,
  icon,
  href,
  children,
}: {
  title: string;
  /** Any lucide-react icon name, e.g. "Zap", "BookOpen". */
  icon?: string;
  href?: string;
  children?: React.ReactNode;
}) {
  const Icon =
    (icon && (Icons[icon as keyof typeof Icons] as React.ElementType)) || undefined;

  const inner = (
    <>
      <div className="mb-2 flex items-center gap-2">
        {Icon && <Icon size={18} className="text-tc-primary" />}
        <span className="font-semibold text-tc-text">{title}</span>
        {href && (
          <ArrowUpRight
            size={15}
            className="ml-auto text-tc-text-light transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        )}
      </div>
      {children && (
        <div className="text-sm leading-relaxed text-tc-text-muted [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {children}
        </div>
      )}
    </>
  );

  const className = cn(
    "group block rounded-xl border border-tc-border bg-tc-bg-card p-4 transition-all duration-200",
    href && "hover:border-tc-border-strong hover:-translate-y-0.5"
  );

  return href ? (
    <Link href={href} className={className}>
      {inner}
    </Link>
  ) : (
    <div className={className}>{inner}</div>
  );
}
