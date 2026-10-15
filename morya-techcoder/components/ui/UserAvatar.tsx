import { cn } from "@/lib/utils";
import { isAllowedAvatarUrl } from "@/lib/engagement/validation";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "R";
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0][0];
  return letters.toUpperCase();
}

/**
 * Small circular reader avatar with an initials fallback. Only Google-hosted
 * avatars are rendered (same allow-list as the database CHECK constraint).
 */
export default function UserAvatar({
  name,
  src,
  size = 32,
  className,
}: {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
}) {
  const style = { width: size, height: size };
  if (isAllowedAvatarUrl(src)) {
    return (
      // A plain <img>: tiny, already-sized CDN avatars don't need the optimizer.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        loading="lazy"
        style={style}
        className={cn("shrink-0 rounded-full border border-tc-border object-cover", className)}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      style={{ ...style, fontSize: Math.max(10, Math.round(size * 0.38)) }}
      className={cn(
        "flex shrink-0 select-none items-center justify-center rounded-full bg-tc-primary/12 font-bold text-tc-primary",
        className
      )}
    >
      {initials(name)}
    </span>
  );
}
