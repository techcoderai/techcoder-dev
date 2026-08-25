import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Renders a 0–5 score as filled, partially filled, and empty stars, with the
 * numeric value alongside so the rating survives without color or icons.
 */
export default function RatingStars({
  value,
  size = 15,
  className,
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  const score = Math.max(0, Math.min(5, value));

  return (
    <span
      className={cn("flex items-center gap-1.5", className)}
      role="img"
      aria-label={`Rated ${score} out of 5`}
    >
      <span className="flex" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => {
          const fill = Math.max(0, Math.min(1, score - i));
          return (
            <span key={i} className="relative">
              <Star size={size} className="text-tc-border-strong" />
              {fill > 0 && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fill * 100}%` }}
                >
                  <Star
                    size={size}
                    className="fill-tc-cat-reviews-text text-tc-cat-reviews-text"
                  />
                </span>
              )}
            </span>
          );
        })}
      </span>
      <span className="text-sm font-bold text-tc-text">{score.toFixed(1)}</span>
    </span>
  );
}
