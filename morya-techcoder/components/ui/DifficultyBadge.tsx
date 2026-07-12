import { cn } from "@/lib/utils";
import type { Difficulty } from "@/content/blogs";

const rank: Record<Difficulty, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

export default function DifficultyBadge({
  level,
  className,
}: {
  level: Difficulty;
  className?: string;
}) {
  const n = rank[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-tc-border bg-tc-bg-elevated text-tc-text-muted",
        className
      )}
    >
      <span className="flex items-end gap-[2px] h-3" aria-hidden="true">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn("w-[3px] rounded-sm", i <= n ? "bg-tc-primary" : "bg-tc-border-strong")}
            style={{ height: `${i * 3 + 2}px` }}
          />
        ))}
      </span>
      {level}
    </span>
  );
}
