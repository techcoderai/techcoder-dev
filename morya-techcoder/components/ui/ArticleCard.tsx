"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowUpRight } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types/blog";
import { categoryColors, CATEGORIES } from "@/lib/categories";

interface ArticleCardProps {
  post: BlogPost;
  variant?: "hero" | "featured" | "horizontal" | "minimal";
  className?: string;
  index?: number;
}

function CategoryPill({ category, className }: { category: BlogPost["category"]; className?: string }) {
  const colors = categoryColors[category];
  return (
    <span className={cn("category-pill", colors?.badge || "bg-tc-bg-elevated text-tc-text-muted border-tc-border", className)}>
      {CATEGORIES[category]?.label ?? category}
    </span>
  );
}

function Meta({ post, muted = false }: { post: BlogPost; muted?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5 text-[11.5px] font-medium", muted ? "text-tc-text-light" : "text-tc-text-muted")}>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span className="w-px h-3 bg-current opacity-30" />
      <span className="flex items-center gap-1">
        <Clock size={11} />
        {post.readingTime}
      </span>
    </div>
  );
}

/* ─── Hero card: large image, big title, prominent CTA ─────── */
function HeroCard({ post, className }: { post: BlogPost; className?: string }) {
  return (
    <article className={cn("group relative", className)}>
      <Link href={`/blog/${post.slug}`} className="focus-ring block rounded-2xl overflow-hidden">
        {/* Image */}
        <div className="relative aspect-[16/9] bg-tc-bg-elevated img-zoom">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-tc-bg-elevated to-tc-bg-secondary flex items-center justify-center">
              <span className="font-heading text-9xl font-black text-tc-text/[0.035] tracking-tighter select-none">TC</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Overlay content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
            <CategoryPill category={post.category} className="w-fit mb-4 bg-white/15 text-white border-white/20 backdrop-blur-sm" />
            <h2 className="font-heading font-bold text-white text-xl sm:text-2xl md:text-3xl leading-tight tracking-tight max-w-2xl link-underline">
              {post.title}
            </h2>
            <p className="mt-2 text-sm text-white/70 leading-relaxed line-clamp-2 max-w-xl hidden sm:block">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2.5 text-[11.5px] font-medium text-white/60">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span className="w-px h-3 bg-white/30" />
                <span className="flex items-center gap-1"><Clock size={11} />{post.readingTime}</span>
              </div>
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <ArrowUpRight size={16} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

/* ─── Featured card: card with top image and text below ─────── */
function FeaturedCard({ post, className, index }: { post: BlogPost; className?: string; index?: number }) {
  const isRecent = new Date(post.date) > new Date(Date.now() - 7 * 86400000);

  return (
    <article className={cn("group flex flex-col h-full", className)}>
      <Link
        href={`/blog/${post.slug}`}
        className="focus-ring flex flex-col h-full rounded-2xl bg-tc-bg-card border border-tc-border overflow-hidden transition-all duration-300 hover:border-tc-border-strong hover:shadow-[var(--tc-shadow-lg)] hover:-translate-y-1"
      >
        {/* Image */}
        <div className="relative aspect-[3/2] bg-tc-bg-elevated img-zoom overflow-hidden">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-tc-bg-elevated to-tc-bg-secondary flex items-center justify-center">
              {index !== undefined && (
                <span className="article-stamp">{String(index + 1).padStart(2, "0")}</span>
              )}
            </div>
          )}
          {isRecent && (
            <span className="absolute top-3 right-3 px-2 py-0.5 text-[9px] font-bold rounded-full bg-tc-accent text-white uppercase tracking-widest">
              New
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          <CategoryPill category={post.category} className="w-fit mb-3" />
          <h3 className="font-heading font-bold text-[15px] text-tc-text leading-snug tracking-tight line-clamp-2 group-hover:text-tc-primary transition-colors duration-200 link-underline">
            {post.title}
          </h3>
          <p className="mt-2 text-[13px] text-tc-text-muted leading-relaxed line-clamp-2 mb-auto">
            {post.excerpt}
          </p>
          <div className="pt-4 mt-4 border-t border-tc-border">
            <Meta post={post} />
          </div>
        </div>
      </Link>
    </article>
  );
}

/* ─── Horizontal card: image left, text right ─────────────── */
function HorizontalCard({ post, className, index }: { post: BlogPost; className?: string; index?: number }) {
  return (
    <article className={cn("group", className)}>
      <Link
        href={`/blog/${post.slug}`}
        className="focus-ring flex gap-4 py-5 border-b border-tc-border transition-colors duration-200 hover:border-tc-border-strong"
      >
        {/* Number stamp or image */}
        <div className="relative flex-shrink-0 w-24 sm:w-28 aspect-[4/3] rounded-xl bg-tc-bg-elevated overflow-hidden img-zoom">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              sizes="112px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              {index !== undefined && (
                <span className="font-heading font-black text-3xl text-tc-text/10 tracking-tighter select-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <CategoryPill category={post.category} className="w-fit mb-1.5" />
          <h3 className="font-heading font-semibold text-[14px] sm:text-[15px] text-tc-text leading-snug tracking-tight line-clamp-2 group-hover:text-tc-primary transition-colors duration-200">
            {post.title}
          </h3>
          <div className="mt-2">
            <Meta post={post} muted />
          </div>
        </div>

        <ArrowUpRight
          size={16}
          className="flex-shrink-0 self-center text-tc-text-light opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
        />
      </Link>
    </article>
  );
}

/* ─── Minimal card: text-only, no image ───────────────────── */
function MinimalCard({ post, className, index }: { post: BlogPost; className?: string; index?: number }) {
  return (
    <article className={cn("group", className)}>
      <Link
        href={`/blog/${post.slug}`}
        className="focus-ring flex items-start gap-4 py-4 border-b border-tc-border last:border-b-0"
      >
        {index !== undefined && (
          <span className="flex-shrink-0 font-heading font-black text-lg text-tc-border-strong w-7 tabular-nums select-none">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-[14px] text-tc-text leading-snug tracking-tight group-hover:text-tc-primary transition-colors duration-200 link-underline">
            {post.title}
          </h3>
          <div className="mt-1.5">
            <Meta post={post} muted />
          </div>
        </div>
      </Link>
    </article>
  );
}

/* ─── Public component dispatcher ─────────────────────────── */
export default function ArticleCard({ post, variant = "featured", className, index }: ArticleCardProps) {
  if (variant === "hero") return <HeroCard post={post} className={className} />;
  if (variant === "horizontal") return <HorizontalCard post={post} className={className} index={index} />;
  if (variant === "minimal") return <MinimalCard post={post} className={className} index={index} />;
  return <FeaturedCard post={post} className={className} index={index} />;
}

export { CategoryPill, Meta };
