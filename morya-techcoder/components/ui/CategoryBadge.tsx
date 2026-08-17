import { cn } from "@/lib/utils";
import { CATEGORIES, type BlogCategory } from "@/lib/categories";

type Props = {
  category: BlogCategory;
  /** `short` (default) shows the compact label; `full` shows the long label. */
  variant?: "short" | "full";
  /**
   * `default` — color-coded pill from category tokens.
   * `overlay` — frosted glass pill for photo covers (no hard square border).
   */
  tone?: "default" | "overlay";
  className?: string;
};

/**
 * The single, reusable category treatment. Renders a color-coded pill using the
 * per-category tokens from `lib/categories.ts`, so cards, article headers, and
 * the topic explorer all stay visually consistent. Change a category's colors
 * once (in the tokens + `CATEGORIES`) and every badge updates.
 */
export default function CategoryBadge({
  category,
  variant = "short",
  tone = "default",
  className,
}: Props) {
  const meta = CATEGORIES[category];
  const label = variant === "full" ? meta.label : meta.short;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold tracking-wide",
        tone === "overlay"
          ? "px-3 py-1 text-[10px] uppercase tracking-[0.14em] bg-white/18 text-white border border-white/25 backdrop-blur-md shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
          : cn(
              "px-2.5 py-1 text-[11px]",
              meta?.badge ?? "bg-tc-bg-elevated text-tc-text-muted border border-tc-border"
            ),
        className
      )}
    >
      {label}
    </span>
  );
}
