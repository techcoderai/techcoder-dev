import { cn } from "@/lib/utils";
import { CATEGORIES, type BlogCategory } from "@/lib/categories";

type Props = {
  category: BlogCategory;
  /** `short` (default) shows the compact label; `full` shows the long label. */
  variant?: "short" | "full";
  className?: string;
};

/**
 * The single, reusable category treatment. Renders a color-coded pill using the
 * per-category tokens from `lib/categories.ts`, so cards, article headers, and
 * the topic explorer all stay visually consistent. Change a category's colors
 * once (in the tokens + `CATEGORIES`) and every badge updates.
 */
export default function CategoryBadge({ category, variant = "short", className }: Props) {
  const meta = CATEGORIES[category];
  const label = variant === "full" ? meta.label : meta.short;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide",
        meta?.badge ?? "bg-tc-bg-elevated text-tc-text-muted border border-tc-border",
        className
      )}
    >
      {label}
    </span>
  );
}
