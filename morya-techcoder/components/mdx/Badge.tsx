import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger";

const VARIANTS: Record<BadgeVariant, string> = {
  default: "bg-tc-bg-elevated text-tc-text-muted border-tc-border",
  primary: "bg-tc-cat-ai-bg text-tc-cat-ai-text border-tc-cat-ai-border",
  success: "bg-tc-cat-tricks-bg text-tc-cat-tricks-text border-tc-cat-tricks-border",
  warning: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  danger: "bg-red-500/10 text-red-500 border-red-500/30",
};

/**
 * A small inline label/pill.
 *
 * Accepts its label either as children (natural in hand-written MDX) or as a
 * `text` prop, which is what the Keystatic editor writes — inline components
 * there carry fields rather than nested content.
 *
 * MDX usage:
 *   <Badge variant="success">New</Badge>
 *   <Badge variant="success" text="New" />
 */
export default function Badge({
  variant = "default",
  text,
  children,
}: {
  variant?: BadgeVariant;
  text?: string;
  children?: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold align-middle",
        VARIANTS[variant] ?? VARIANTS.default
      )}
    >
      {children ?? text}
    </span>
  );
}
