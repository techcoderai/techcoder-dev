"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { BlogPost } from "@/content/blogs";
import { categoryColors } from "@/lib/categories";

export default function MagicBorderCard({ post }: { post: BlogPost }) {
  const isRecent = new Date(post.date) > new Date(Date.now() - 7 * 86400000);

  return (
    <article className="group h-full">
      <Link
        href={`/blog/${post.slug}`}
        className="focus-ring flex flex-col h-full rounded-xl bg-white border border-gray-200 overflow-hidden shadow-md transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]"
      >
        {/* Cover */}
        <div className="relative aspect-[16/9] bg-tc-bg-elevated overflow-hidden">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-tc-bg-elevated">
              <span className="font-heading text-6xl font-black text-tc-text/[0.04] select-none tracking-tighter">
                TC
              </span>
            </div>
          )}

          {/* Scrim — ensures badge readability on bright thumbnails */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

          {/* Category badge */}
          <span
            className={cn(
              "absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold rounded-full shadow-sm",
              categoryColors[post.category]?.badge ||
                "bg-tc-bg-elevated text-tc-text-muted border border-tc-border"
            )}
          >
            {post.category}
          </span>

          {/* New badge */}
          {isRecent && (
            <span className="absolute top-3 right-12 px-2 py-0.5 text-[10px] font-bold rounded-full bg-tc-accent text-white uppercase tracking-wider shadow-sm">
              New
            </span>
          )}

          {/* Hover arrow */}
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <ArrowRight size={15} className="text-tc-text" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 sm:p-6">
          <h3 className="font-heading font-bold text-base sm:text-lg text-tc-text leading-snug mb-2 group-hover:text-tc-primary transition-colors duration-200 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-tc-text-muted leading-relaxed line-clamp-2 mb-auto">
            {post.excerpt}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-3 pt-4 mt-4 border-t border-gray-100 text-xs text-tc-text-light font-medium">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="w-0.5 h-0.5 rounded-full bg-tc-text-light/60" />
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {post.readingTime}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
