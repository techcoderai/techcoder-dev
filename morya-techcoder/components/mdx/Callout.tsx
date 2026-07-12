import { Info, Lightbulb, AlertTriangle, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutType = "note" | "tip" | "warning" | "danger";

const STYLES: Record<
  CalloutType,
  { icon: typeof Info; container: string; iconColor: string; label: string }
> = {
  note: {
    icon: Info,
    container: "border-tc-cat-webdev-border bg-tc-cat-webdev-bg",
    iconColor: "text-tc-cat-webdev-text",
    label: "Note",
  },
  tip: {
    icon: Lightbulb,
    container: "border-tc-cat-tricks-border bg-tc-cat-tricks-bg",
    iconColor: "text-tc-cat-tricks-text",
    label: "Tip",
  },
  warning: {
    icon: AlertTriangle,
    container: "border-tc-cat-ai-border bg-tc-cat-ai-bg",
    iconColor: "text-tc-cat-ai-text",
    label: "Warning",
  },
  danger: {
    icon: AlertOctagon,
    container: "border-red-500/30 bg-red-500/10",
    iconColor: "text-red-500",
    label: "Danger",
  },
};

/**
 * A colored callout box for notes, tips, warnings, and danger alerts.
 *
 * MDX usage:
 *   <Callout type="tip" title="Pro tip">
 *   Use `cn()` to merge Tailwind classes.
 *   </Callout>
 */
export default function Callout({
  type = "note",
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}) {
  const style = STYLES[type] ?? STYLES.note;
  const Icon = style.icon;

  return (
    <div
      className={cn(
        "my-6 flex gap-3 rounded-xl border p-4 text-tc-text",
        style.container
      )}
    >
      <Icon size={20} className={cn("mt-0.5 shrink-0", style.iconColor)} />
      <div className="min-w-0 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        <p className={cn("mb-1 font-semibold", style.iconColor)}>
          {title ?? style.label}
        </p>
        <div className="text-sm leading-relaxed text-tc-text-muted [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {children}
        </div>
      </div>
    </div>
  );
}
