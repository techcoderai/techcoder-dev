import { Children, isValidElement, type ReactNode } from "react";
import { Check, X } from "lucide-react";

/**
 * A balanced pros-and-cons panel for reviews and comparisons. Wrap `<Pro>` and
 * `<Con>` items in `<ProsCons>` — order doesn't matter, they're sorted into the
 * two columns automatically.
 *
 * MDX usage:
 *   <ProsCons>
 *   <Pro>Genuinely repairable — every part has a QR code to its spare.</Pro>
 *   <Con>Battery life still trails the competition by two hours.</Con>
 *   </ProsCons>
 */
export function ProsCons({ children }: { children: ReactNode }) {
  const items = Children.toArray(children).filter(isValidElement);
  const pros = items.filter((item) => item.type === Pro);
  const cons = items.filter((item) => item.type === Con);

  return (
    <div className="my-7 grid gap-4 sm:grid-cols-2">
      <Column
        heading="Pros"
        empty={pros.length === 0}
        className="border-tc-cat-guides-border bg-tc-cat-guides-bg"
        headingClassName="text-tc-cat-guides-text"
      >
        {pros}
      </Column>
      <Column
        heading="Cons"
        empty={cons.length === 0}
        className="border-tc-cat-reviews-border bg-tc-bg-elevated"
        headingClassName="text-tc-accent"
      >
        {cons}
      </Column>
    </div>
  );
}

function Column({
  heading,
  empty,
  className,
  headingClassName,
  children,
}: {
  heading: string;
  empty: boolean;
  className: string;
  headingClassName: string;
  children: ReactNode;
}) {
  if (empty) return null;
  return (
    <div className={`rounded-2xl border p-5 ${className}`}>
      <p
        className={`mb-3 text-[11px] font-bold uppercase tracking-[0.12em] ${headingClassName}`}
      >
        {heading}
      </p>
      {/* `!` overrides win against the `.prose-tc ul/li` element styles. */}
      <ul className="flex flex-col gap-2.5 !mb-0 !pl-0">{children}</ul>
    </div>
  );
}

function Item({
  icon: Icon,
  iconClassName,
  children,
}: {
  icon: typeof Check;
  iconClassName: string;
  children: ReactNode;
}) {
  return (
    <li className="flex items-start gap-2.5 !mb-0 !list-none !text-[15px] leading-relaxed text-tc-text-muted [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${iconClassName}`}
        aria-hidden="true"
      >
        <Icon size={12} strokeWidth={3} />
      </span>
      <span className="min-w-0">{children}</span>
    </li>
  );
}

export function Pro({ children }: { children: ReactNode }) {
  return (
    <Item
      icon={Check}
      iconClassName="bg-tc-cat-guides-text/15 text-tc-cat-guides-text"
    >
      {children}
    </Item>
  );
}

export function Con({ children }: { children: ReactNode }) {
  return (
    <Item icon={X} iconClassName="bg-tc-accent/15 text-tc-accent">
      {children}
    </Item>
  );
}
