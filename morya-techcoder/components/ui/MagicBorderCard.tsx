import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { PostSummary } from "@/types/blog";
import CategoryBadge from "@/components/ui/CategoryBadge";

const RECENT_POST_CUTOFF = Date.now() - 7 * 86400000;

type Size = "default" | "lg";

type Props = {
  post: PostSummary;
  /** `lg` uses a taller media area — intended for premium carousels. */
  size?: Size;
  className?: string;
};

export default function MagicBorderCard({ post, size = "default", className }: Props) {
  const isRecent = new Date(post.date).getTime() > RECENT_POST_CUTOFF;
  const isLg = size === "lg";

  return (
    <article className={cn("group h-full", className)}>
      <Link
        href={`/blog/${post.slug}`}
        aria-label={`Read: ${post.title}`}
        className={cn(
          "card-premium focus-ring flex flex-col h-full rounded-xl bg-tc-bg-card border border-tc-border overflow-hidden shadow-[var(--tc-shadow-sm)]",
          isLg && "rounded-2xl"
        )}
      >
        {/* Cover */}
        <div
          className={cn(
            "card-premium-media relative bg-tc-bg-elevated overflow-hidden",
            isLg ? "aspect-[16/10]" : "aspect-[16/9]"
          )}
        >
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              sizes={
                isLg
                  ? "(max-width: 640px) 85vw, (max-width: 1024px) 40vw, 360px"
                  : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              }
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-tc-bg-elevated">
              <span className="font-heading text-5xl font-black text-tc-text/[0.04] select-none tracking-tighter">
                TC
              </span>
            </div>
          )}

          {/* Category accent wash — subtle on larger carousel cards */}
          {isLg && (
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--tc-primary) 18%, transparent), transparent 55%)",
              }}
            />
          )}

          {/* Scrim — keeps the badge legible on bright thumbnails */}
          <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

          <CategoryBadge
            category={post.category}
            className={cn(
              "card-premium-badge absolute top-2.5 left-2.5 !px-2 !py-0.5 !text-[10px] shadow-sm transition-[filter] duration-300",
              isLg && "top-3.5 left-3.5 !px-2.5 !py-1 !text-[11px]"
            )}
          />

          {isRecent && (
            <span className="absolute top-2.5 right-2.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-tc-accent text-white uppercase tracking-wider shadow-sm">
              New
            </span>
          )}
        </div>

        {/* Content — tightened for quick mobile scanning */}
        <div className={cn("flex flex-col flex-1", isLg ? "p-4 sm:p-5" : "p-3.5 sm:p-4")}>
          <h3
            className={cn(
              "card-premium-title font-heading font-bold text-tc-text leading-snug mb-1 line-clamp-2 transition-colors duration-300",
              isLg ? "text-[15px] sm:text-lg" : "text-[14.5px] sm:text-base"
            )}
          >
            {post.title}
          </h3>
          <p
            className={cn(
              "text-tc-text-muted leading-relaxed line-clamp-2 mb-auto",
              isLg ? "text-[13px] sm:text-[13.5px]" : "text-[12.5px] sm:text-[13px]"
            )}
          >
            {post.excerpt}
          </p>

          <div className="card-premium-meta flex items-center gap-2 pt-2.5 mt-2.5 border-t border-tc-border text-[11px] font-medium text-tc-text-light">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="w-0.5 h-0.5 rounded-full bg-tc-text-light/60" />
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {post.readingTime}
            </span>
            <span className="ml-auto inline-flex items-center gap-1 text-tc-primary opacity-0 -translate-x-1 transition-[opacity,transform] duration-[var(--tc-dur)] group-hover:opacity-100 group-hover:translate-x-0">
              Read
              <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
