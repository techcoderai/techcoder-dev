"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types/blog";
import CategoryBadge from "@/components/ui/CategoryBadge";

export default function MagicBorderCard({ post }: { post: BlogPost }) {
  const isRecent = new Date(post.date) > new Date(Date.now() - 7 * 86400000);

  return (
    <article className="group h-full">
      <Link
        href={`/blog/${post.slug}`}
        aria-label={`Read: ${post.title}`}
        className="focus-ring flex flex-col h-full rounded-xl bg-tc-bg-card border border-tc-border overflow-hidden shadow-[var(--tc-shadow-sm)] transition-all duration-300 ease-out hover:shadow-[var(--tc-shadow-lg)] hover:-translate-y-1 hover:border-tc-border-strong"
      >
        {/* Cover */}
        <div className="relative aspect-[16/9] bg-tc-bg-elevated overflow-hidden">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-tc-bg-elevated">
              <span className="font-heading text-5xl font-black text-tc-text/[0.04] select-none tracking-tighter">
                TC
              </span>
            </div>
          )}

          {/* Scrim — keeps the badge legible on bright thumbnails */}
          <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

          {/* Category badge */}
          <CategoryBadge
            category={post.category}
            className="absolute top-2.5 left-2.5 !px-2 !py-0.5 !text-[10px] shadow-sm"
          />

          {/* New badge */}
          {isRecent && (
            <span className="absolute top-2.5 right-2.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-tc-accent text-white uppercase tracking-wider shadow-sm">
              New
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4">
          <h3 className="font-heading font-bold text-[15px] sm:text-base text-tc-text leading-snug mb-1.5 line-clamp-2 transition-colors duration-200 group-hover:text-tc-primary">
            {post.title}
          </h3>
          <p className="text-[13px] text-tc-text-muted leading-relaxed line-clamp-2 mb-auto">
            {post.excerpt}
          </p>

          {/* Metadata + read affordance */}
          <div className="flex items-center gap-2.5 pt-3 mt-3.5 border-t border-tc-border text-[11px] font-medium text-tc-text-light">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="w-0.5 h-0.5 rounded-full bg-tc-text-light/60" />
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {post.readingTime}
            </span>
            <span className="ml-auto inline-flex items-center gap-1 text-tc-primary opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
              Read
              <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
