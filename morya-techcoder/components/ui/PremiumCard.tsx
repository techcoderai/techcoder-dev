"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowUpRight } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types/blog";

/* ── Category accent map ──────────────────────────────────────────────────── */
export const CATEGORY_STYLES: Record<string, {
  pill: string;
  label: string;
  accentText: string;
  dot: string;
}> = {
  AI: {
    pill: "bg-tc-cat-ai-bg text-tc-cat-ai-text border-tc-cat-ai-border",
    label: "Artificial Intelligence",
    accentText: "text-tc-cat-ai-text",
    dot: "bg-tc-cat-ai-text",
  },
  WebDev: {
    pill: "bg-tc-cat-prog-bg text-tc-cat-prog-text border-tc-cat-prog-border",
    label: "Programming",
    accentText: "text-tc-cat-prog-text",
    dot: "bg-tc-cat-prog-text",
  },
  Tricks: {
    pill: "bg-tc-cat-tricks-bg text-tc-cat-tricks-text border-tc-cat-tricks-border",
    label: "Tips & Tricks",
    accentText: "text-tc-cat-tricks-text",
    dot: "bg-tc-cat-tricks-text",
  },
  Technology: {
    pill: "bg-tc-cat-tech-bg text-tc-cat-tech-text border-tc-cat-tech-border",
    label: "Technology",
    accentText: "text-tc-cat-tech-text",
    dot: "bg-tc-cat-tech-text",
  },
  Reviews: {
    pill: "bg-tc-cat-reviews-bg text-tc-cat-reviews-text border-tc-cat-reviews-border",
    label: "Reviews",
    accentText: "text-tc-cat-reviews-text",
    dot: "bg-tc-cat-reviews-text",
  },
  BuyingGuides: {
    pill: "bg-tc-cat-buying-bg text-tc-cat-buying-text border-tc-cat-buying-border",
    label: "Buying Guides",
    accentText: "text-tc-cat-buying-text",
    dot: "bg-tc-cat-buying-text",
  },
  Tools: {
    pill: "bg-tc-cat-tools-bg text-tc-cat-tools-text border-tc-cat-tools-border",
    label: "Developer Tools",
    accentText: "text-tc-cat-tools-text",
    dot: "bg-tc-cat-tools-text",
  },
};

function fallbackStyle() {
  return {
    pill: "bg-tc-bg-elevated text-tc-text-muted border-tc-border",
    label: "Article",
    accentText: "text-tc-text-muted",
    dot: "bg-tc-text-muted",
  };
}

export function getCategoryStyle(category: string) {
  return CATEGORY_STYLES[category] ?? fallbackStyle();
}

/* ── Category pill ─────────────────────────────────────────────────────────── */
function CatPill({ category, className }: { category: string; className?: string }) {
  const style = getCategoryStyle(category);
  return (
    <span className={cn("cat-pill border", style.pill, className)}>
      <span className={cn("w-1 h-1 rounded-full", style.dot)} />
      {style.label}
    </span>
  );
}

/* ── Post metadata ─────────────────────────────────────────────────────────── */
function PostMeta({ post, light = false }: { post: BlogPost; light?: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-2 text-[11.5px] font-medium",
      light ? "text-white/55" : "text-tc-text-light"
    )}>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span className={cn("w-px h-3", light ? "bg-white/25" : "bg-tc-border-medium")} />
      <span className="flex items-center gap-1">
        <Clock size={10} />
        {post.readingTime}
      </span>
    </div>
  );
}

/* ── Placeholder image fill ────────────────────────────────────────────────── */
function PlaceholderFill({ category }: { category: string }) {
  const style = getCategoryStyle(category);
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-tc-bg-elevated">
      <span className={cn(
        "font-heading font-black select-none tracking-tighter leading-none",
        "text-[5rem] opacity-[0.06]",
        style.accentText
      )}>
        TC
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VARIANT: cover — large immersive card with full-bleed image & overlay text
   Use: Hero feature, bento lead, large editorial spotlights
   ══════════════════════════════════════════════════════════════════════════ */
function CoverCard({ post, className, aspectRatio = "aspect-[16/10]" }: {
  post: BlogPost;
  className?: string;
  aspectRatio?: string;
}) {
  return (
    <article className={cn("group relative overflow-hidden rounded-2xl", className)}>
      <Link href={`/blog/${post.slug}`} className="focus-ring block">
        {/* Image */}
        <div className={cn("relative bg-tc-bg-elevated img-zoom", aspectRatio)}>
          {post.thumbnail
            ? <Image src={post.thumbnail} alt={post.title} fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 55vw" />
            : <PlaceholderFill category={post.category} />}
          {/* Gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          {/* Corner arrow */}
          <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/12 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <ArrowUpRight size={15} className="text-white" />
          </div>
        </div>
        {/* Overlay text */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-7">
          <CatPill
            category={post.category}
            className="w-fit mb-4 bg-white/14 text-white border-white/20 backdrop-blur-sm"
          />
          <h2 className="font-heading font-bold text-white leading-tight tracking-tight link-underline
                         text-xl sm:text-2xl lg:text-3xl max-w-2xl">
            {post.title}
          </h2>
          <p className="mt-2 text-[13.5px] text-white/65 leading-relaxed line-clamp-2 max-w-xl hidden sm:block">
            {post.excerpt}
          </p>
          <div className="mt-4">
            <PostMeta post={post} light />
          </div>
        </div>
      </Link>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VARIANT: feature — card with top image, text below, white background
   Use: Bento secondary cards, category grids, 3-column rows
   ══════════════════════════════════════════════════════════════════════════ */
function FeatureCard({ post, className, index }: {
  post: BlogPost;
  className?: string;
  index?: number;
}) {
  const isNew = new Date(post.date) > new Date(Date.now() - 8 * 86400000);

  return (
    <article className={cn("group flex flex-col h-full", className)}>
      <Link
        href={`/blog/${post.slug}`}
        className="focus-ring flex flex-col h-full rounded-2xl bg-tc-bg-card border border-tc-border overflow-hidden transition-all duration-300 hover:border-tc-border-medium hover:shadow-[var(--tc-shadow-lg)] hover:-translate-y-1"
      >
        {/* Image */}
        <div className="relative aspect-[3/2] bg-tc-bg-elevated overflow-hidden img-zoom shrink-0">
          {post.thumbnail
            ? <Image src={post.thumbnail} alt={post.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
            : <PlaceholderFill category={post.category} />}
          {isNew && (
            <span className="absolute top-3 right-3 px-2 py-0.5 text-[9.5px] font-bold rounded-full bg-tc-accent text-white uppercase tracking-widest shadow-sm">
              New
            </span>
          )}
        </div>
        {/* Content */}
        <div className="flex flex-col flex-1 p-5 sm:p-6">
          <CatPill category={post.category} className="w-fit mb-3" />
          <h3 className="font-heading font-bold text-[15px] sm:text-[16.5px] text-tc-text leading-snug tracking-tight line-clamp-2 mb-auto group-hover:text-tc-primary transition-colors duration-200">
            {post.title}
          </h3>
          <p className="mt-2.5 text-[13px] text-tc-text-muted leading-relaxed line-clamp-2 mb-4">
            {post.excerpt}
          </p>
          <div className="pt-4 border-t border-tc-border">
            <PostMeta post={post} />
          </div>
        </div>
      </Link>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VARIANT: compact — horizontal thumbnail + text, borderless
   Use: Sidebars, "More from this category", secondary article lists
   ══════════════════════════════════════════════════════════════════════════ */
function CompactCard({ post, className }: {
  post: BlogPost;
  className?: string;
}) {
  return (
    <article className={cn("group", className)}>
      <Link
        href={`/blog/${post.slug}`}
        className="focus-ring flex gap-4 py-5 border-b border-tc-border last:border-b-0 transition-colors duration-150 hover:border-tc-border-medium"
      >
        {/* Thumbnail */}
        <div className="relative flex-shrink-0 w-[88px] aspect-[4/3] rounded-xl bg-tc-bg-elevated overflow-hidden img-zoom">
          {post.thumbnail
            ? <Image src={post.thumbnail} alt={post.title} fill className="object-cover" sizes="88px" />
            : <PlaceholderFill category={post.category} />}
        </div>
        {/* Text */}
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <CatPill category={post.category} className="w-fit mb-1.5 scale-[0.92] origin-left" />
          <h3 className="font-heading font-semibold text-[13.5px] text-tc-text leading-snug tracking-tight line-clamp-2 group-hover:text-tc-primary transition-colors duration-200">
            {post.title}
          </h3>
          <div className="mt-1.5">
            <PostMeta post={post} />
          </div>
        </div>
        <ArrowUpRight
          size={15}
          className="self-center flex-shrink-0 text-tc-text-light opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
        />
      </Link>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VARIANT: list — numbered text-only row, no image
   Use: "Latest" sections, trending lists, reading queues
   ══════════════════════════════════════════════════════════════════════════ */
function ListCard({ post, index = 0, className }: {
  post: BlogPost;
  index?: number;
  className?: string;
}) {
  const style = getCategoryStyle(post.category);

  return (
    <article className={cn("group", className)}>
      <Link
        href={`/blog/${post.slug}`}
        className="focus-ring flex items-start gap-5 py-5 border-b border-tc-border last:border-b-0 hover:border-tc-border-medium transition-colors duration-150"
      >
        {/* Number */}
        <span className="flex-shrink-0 font-heading font-black text-[1.75rem] leading-none tracking-tighter text-tc-border-strong tabular-nums select-none w-8 mt-0.5">
          {String(index + 1).padStart(2, "0")}
        </span>
        {/* Text */}
        <div className="flex-1 min-w-0">
          <span className={cn("overline text-[10px] mb-1 block", style.accentText)}>
            {style.label}
          </span>
          <h3 className="font-heading font-semibold text-[14.5px] text-tc-text leading-snug tracking-tight group-hover:text-tc-primary transition-colors duration-200 link-underline">
            {post.title}
          </h3>
          <div className="mt-1.5">
            <PostMeta post={post} />
          </div>
        </div>
        <ArrowUpRight
          size={15}
          className="self-center flex-shrink-0 mt-0.5 text-tc-text-light opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
        />
      </Link>
    </article>
  );
}

/* ── Main dispatcher ───────────────────────────────────────────────────────── */
interface PremiumCardProps {
  post: BlogPost;
  variant?: "cover" | "feature" | "compact" | "list";
  className?: string;
  index?: number;
  aspectRatio?: string;
}

export default function PremiumCard({
  post,
  variant = "feature",
  className,
  index,
  aspectRatio,
}: PremiumCardProps) {
  switch (variant) {
    case "cover":   return <CoverCard   post={post} className={className} aspectRatio={aspectRatio} />;
    case "compact": return <CompactCard post={post} className={className} />;
    case "list":    return <ListCard    post={post} className={className} index={index} />;
    default:        return <FeatureCard post={post} className={className} index={index} />;
  }
}

export { CatPill, PostMeta };
