import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { blogPosts } from "@/content/loader";
import { categoryHref, type BlogCategory } from "@/lib/categories";
import { getFeaturedPosts, getPostsByCategory } from "@/lib/posts";
import { cn, formatDate } from "@/lib/utils";
import MagicBorderCard from "@/components/ui/MagicBorderCard";
import CardCarousel from "@/components/ui/CardCarousel";
import ArticleCard from "@/components/ui/ArticleCard";
import CategoryBadge from "@/components/ui/CategoryBadge";
import type { BlogPost } from "@/types/blog";

/**
 * Editorial rails shown on the home page, in reading order. Each rail uses a
 * distinct layout so the homepage reads like a magazine rather than a repeated
 * card grid. A rail with no published posts is skipped automatically.
 */
type RailLayout = "carousel" | "ranked" | "editorial" | "compact" | "grid";

const RAILS: {
  title: string;
  subtitle: string;
  category: BlogCategory;
  layout: RailLayout;
}[] = [
  {
    title: "Latest in AI",
    subtitle: "Breakthrough models and the tools built on them, explained clearly.",
    category: "AI",
    layout: "carousel",
  },
  {
    title: "Trending in technology",
    subtitle: "The ideas and shifts shaping how we live, work, and build.",
    category: "Technology",
    layout: "ranked",
  },
  {
    title: "For the builders",
    subtitle: "Programming deep dives, patterns, and hands-on guides.",
    category: "Programming",
    layout: "editorial",
  },
  {
    title: "Reviews",
    subtitle: "Honest, hands-on verdicts on the products worth your attention.",
    category: "Reviews",
    layout: "compact",
  },
  {
    title: "Buying guides",
    subtitle: "Clear recommendations to help you choose with confidence.",
    category: "Guides",
    layout: "grid",
  },
];

function RailHeader({
  title,
  subtitle,
  category,
}: {
  title: string;
  subtitle: string;
  category: BlogCategory;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
      <div>
        <h3 className="heading-lg text-xl md:text-2xl">{title}</h3>
        <p className="text-sm text-tc-text-muted mt-1.5 max-w-lg">{subtitle}</p>
      </div>
      <Link
        href={categoryHref(category)}
        className="focus-ring rounded-lg group inline-flex items-center gap-1.5 text-sm font-semibold text-tc-primary hover:text-tc-primary-dark transition-colors duration-200 shrink-0"
      >
        View all
        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
      </Link>
    </div>
  );
}

/* ── Featured: asymmetric hero + supporting stack ─────────────────────────── */
function FeaturedAsymmetric({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;
  const [lead, ...rest] = posts;
  const supporting = rest.slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_1fr] gap-5 lg:gap-6">
      {/* Hero lead */}
      <article className="group">
        <Link
          href={`/blog/${lead.slug}`}
          aria-label={`Read: ${lead.title}`}
          className="card-premium card-premium-cover focus-ring relative flex flex-col h-full min-h-[320px] sm:min-h-[380px] rounded-2xl overflow-hidden border border-tc-border bg-tc-bg-card shadow-[var(--tc-shadow-sm)]"
        >
          <div className="card-premium-media absolute inset-0 overflow-hidden">
            {lead.thumbnail ? (
              <Image
                src={lead.thumbnail}
                alt={lead.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-tc-bg-elevated to-tc-bg-secondary" />
            )}
            {/* Deep bottom scrim so title/meta stay legible on busy/bright covers */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.62) 28%, rgba(0,0,0,0.28) 52%, rgba(0,0,0,0.06) 72%, transparent 100%)",
              }}
            />
          </div>
          <div className="relative z-[1] mt-auto p-6 sm:p-8">
            <CategoryBadge
              category={lead.category}
              tone="overlay"
              className="card-premium-badge mb-4"
            />
            <h3 className="card-premium-title font-heading font-bold !text-white text-xl sm:text-2xl md:text-[1.75rem] leading-tight tracking-tight max-w-xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
              {lead.title}
            </h3>
            <p className="mt-2.5 text-sm text-white/80 leading-relaxed line-clamp-2 max-w-lg hidden sm:block">
              {lead.excerpt}
            </p>
            <div className="mt-4 flex items-center gap-2.5 text-[11.5px] font-medium text-white/75">
              <time dateTime={lead.date}>{formatDate(lead.date)}</time>
              <span className="w-px h-3 bg-white/35" />
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {lead.readingTime}
              </span>
            </div>
          </div>
        </Link>
      </article>

      {/* Supporting stack */}
      <div className="flex flex-col rounded-2xl border border-tc-border bg-tc-bg-card/60 overflow-hidden divide-y divide-tc-border">
        {supporting.map((post, i) => (
          <ArticleCard key={post.id} post={post} variant="horizontal" index={i} />
        ))}
        {supporting.length === 0 && (
          <p className="p-6 text-sm text-tc-text-muted">More featured reads coming soon.</p>
        )}
      </div>
    </div>
  );
}

/* ── Ranked dense list (Technology) ───────────────────────────────────────── */
function RankedList({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="rounded-2xl border border-tc-border bg-tc-bg-card overflow-hidden divide-y divide-tc-border">
      {posts.map((post, i) => (
        <article key={post.id} className="group">
          <Link
            href={`/blog/${post.slug}`}
            className="card-premium card-premium-flat focus-ring flex items-center gap-4 sm:gap-5 px-4 sm:px-5 py-4 sm:py-4.5 border-0 rounded-none shadow-none hover:bg-tc-bg-elevated/50"
          >
            <span
              className={cn(
                "shrink-0 font-heading font-black text-2xl sm:text-3xl tabular-nums tracking-tighter w-10 text-center",
                i === 0 ? "text-tc-primary" : "text-tc-border-strong"
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="relative shrink-0 w-16 sm:w-20 aspect-[4/3] rounded-lg bg-tc-bg-elevated overflow-hidden card-premium-media">
              {post.thumbnail ? (
                <Image
                  src={post.thumbnail}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-tc-text/10 font-heading font-black text-lg">
                  TC
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <CategoryBadge
                category={post.category}
                className="card-premium-badge !px-2 !py-0.5 !text-[9px] mb-1.5"
              />
              <h4 className="card-premium-title font-heading font-semibold text-[14px] sm:text-[15px] text-tc-text leading-snug line-clamp-2 transition-colors duration-300">
                {post.title}
              </h4>
              <div className="mt-1.5 flex items-center gap-2 text-[11px] font-medium text-tc-text-light">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span className="w-0.5 h-0.5 rounded-full bg-tc-text-light/60" />
                <span>{post.readingTime}</span>
              </div>
            </div>
            <ArrowRight
              size={16}
              className="shrink-0 text-tc-text-light opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-tc-primary hidden sm:block"
            />
          </Link>
        </article>
      ))}
    </div>
  );
}

/* ── Editorial two-column (Programming) ───────────────────────────────────── */
function EditorialGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      {posts.map((post) => (
        <article key={post.id} className="group">
          <Link
            href={`/blog/${post.slug}`}
            aria-label={`Read: ${post.title}`}
            className="card-premium focus-ring flex flex-col sm:flex-row gap-0 h-full rounded-2xl border border-tc-border bg-tc-bg-card overflow-hidden shadow-[var(--tc-shadow-sm)]"
          >
            <div className="card-premium-media relative sm:w-[42%] aspect-[16/10] sm:aspect-auto sm:min-h-[200px] bg-tc-bg-elevated overflow-hidden shrink-0">
              {post.thumbnail ? (
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 40vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-heading text-5xl font-black text-tc-text/[0.04]">TC</span>
                </div>
              )}
            </div>
            <div className="flex flex-col flex-1 p-5 sm:p-6 justify-center">
              <CategoryBadge
                category={post.category}
                className="card-premium-badge w-fit mb-3"
              />
              <h4 className="card-premium-title font-heading font-bold text-lg sm:text-xl text-tc-text leading-snug tracking-tight line-clamp-3 transition-colors duration-300">
                {post.title}
              </h4>
              <p className="mt-2.5 text-sm text-tc-text-muted leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11.5px] font-medium text-tc-text-light">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span className="w-0.5 h-0.5 rounded-full bg-tc-text-light/60" />
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {post.readingTime}
                </span>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}

/* ── Compact horizontal stack (Reviews) ───────────────────────────────────── */
function CompactStack({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post) => (
        <ArticleCard key={post.id} post={post} variant="featured" />
      ))}
    </div>
  );
}

function Rail({
  title,
  subtitle,
  category,
  layout,
}: {
  title: string;
  subtitle: string;
  category: BlogCategory;
  layout: RailLayout;
}) {
  const count = layout === "carousel" ? 6 : layout === "ranked" ? 5 : 4;
  const posts = getPostsByCategory(blogPosts, category, count);
  if (posts.length === 0) return null;

  return (
    <section className="animate-fade-up" aria-label={title}>
      <RailHeader title={title} subtitle={subtitle} category={category} />

      {layout === "carousel" && (
        <div className="relative">
          {/* Soft category accent behind the AI carousel */}
          <div
            className="pointer-events-none absolute -inset-x-4 -inset-y-6 rounded-3xl opacity-60 blur-2xl -z-10"
            style={{
              background: `radial-gradient(ellipse at 30% 50%, color-mix(in srgb, var(--tc-primary) 12%, transparent), transparent 70%)`,
            }}
            aria-hidden
          />
          <CardCarousel posts={posts} size="lg" speed={24} />
        </div>
      )}

      {layout === "ranked" && <RankedList posts={posts} />}
      {layout === "editorial" && <EditorialGrid posts={posts} />}
      {layout === "compact" && <CompactStack posts={posts} />}
      {layout === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <MagicBorderCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function HomeContent() {
  const featured = getFeaturedPosts(blogPosts, 4);

  return (
    <div className="section-padding pt-0">
      <div className="container-wide mx-auto">
        {/* Featured — large editorial + supporting stack */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 animate-fade-up">
            <div>
              <span className="chip mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-tc-primary" />
                Editor&apos;s picks
              </span>
              <h2 className="heading-lg mb-3">Featured articles</h2>
              <p className="body-lg max-w-xl">
                Hand-picked reads worth your time — the stories and guides we&apos;re proudest of.
              </p>
            </div>
            <Link
              href="/blog"
              className="focus-ring rounded-lg group inline-flex items-center gap-1.5 text-sm font-semibold text-tc-primary hover:text-tc-primary-dark transition-colors duration-200 shrink-0"
            >
              View all
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </div>
          <FeaturedAsymmetric posts={featured} />
        </div>

        {/* Topic rails — each with a distinct layout */}
        <div className="flex flex-col gap-20">
          {RAILS.map((rail) => (
            <Rail key={rail.category} {...rail} />
          ))}
        </div>
      </div>
    </div>
  );
}
