import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Accent palettes reused by every editorial block, mapped to design tokens. */
export const PANEL_TONES = {
  primary: {
    container: "border-tc-cat-ai-border bg-tc-cat-ai-bg",
    accent: "text-tc-cat-ai-text",
    chip: "bg-tc-cat-ai-text/12 text-tc-cat-ai-text",
  },
  blue: {
    container: "border-tc-cat-programming-border bg-tc-cat-programming-bg",
    accent: "text-tc-cat-programming-text",
    chip: "bg-tc-cat-programming-text/12 text-tc-cat-programming-text",
  },
  emerald: {
    container: "border-tc-cat-guides-border bg-tc-cat-guides-bg",
    accent: "text-tc-cat-guides-text",
    chip: "bg-tc-cat-guides-text/12 text-tc-cat-guides-text",
  },
  violet: {
    container: "border-tc-cat-reviews-border bg-tc-cat-reviews-bg",
    accent: "text-tc-cat-reviews-text",
    chip: "bg-tc-cat-reviews-text/12 text-tc-cat-reviews-text",
  },
  slate: {
    container: "border-tc-border bg-tc-bg-elevated",
    accent: "text-tc-text",
    chip: "bg-tc-text/10 text-tc-text",
  },
} as const;

export type PanelTone = keyof typeof PANEL_TONES;

/**
 * The shared frame behind every TechCoder editorial block (TL;DR, Verdict,
 * Key Takeaway, …).
 *
 * Not exported to MDX on purpose: authors insert a block with a specific
 * editorial meaning, and that block decides its own label, icon, and tone. This
 * only exists so those blocks stay visually consistent as the set grows.
 */
export default function EditorialPanel({
  icon: Icon,
  eyebrow,
  title,
  tone = "primary",
  aside,
  children,
}: {
  icon: LucideIcon;
  /** Fixed editorial label, e.g. "TL;DR" — identifies the kind of block. */
  eyebrow: string;
  /** Optional author-supplied headline shown under the eyebrow. */
  title?: string;
  tone?: PanelTone;
  /** Optional element pinned to the top-right, e.g. a rating. */
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  const styles = PANEL_TONES[tone] ?? PANEL_TONES.primary;

  return (
    <div className={cn("my-7 rounded-2xl border p-5 sm:p-6", styles.container)}>
      <div className="mb-3 flex items-start gap-3">
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
            styles.chip
          )}
          aria-hidden="true"
        >
          <Icon size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-[11px] font-bold uppercase tracking-[0.12em]",
              styles.accent
            )}
          >
            {eyebrow}
          </p>
          {title && (
            <p className="mt-0.5 font-semibold leading-snug text-tc-text">{title}</p>
          )}
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </div>
      <div className="text-[15px] leading-relaxed text-tc-text-muted [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_li]:text-[15px] [&_p]:text-[15px]">
        {children}
      </div>
    </div>
  );
}
