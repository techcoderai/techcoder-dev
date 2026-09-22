import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft, Clock, Calendar, Tag, History, ListChecks, Check } from "lucide-react";
import { postSummaries, getBlogBySlug, getAllSlugs, compileBlogContent } from "@/content/loader";
import { formatDate, getHeadings } from "@/lib/utils";
import { getRelatedPosts } from "@/lib/posts";
import type { BlogPost, Difficulty } from "@/types/blog";
import NewsletterBox from "@/components/ui/NewsletterBox";
import MagicBorderCard from "@/components/ui/MagicBorderCard";
import TableOfContents from "@/components/ui/TableOfContents";
import ArticleActions from "@/components/reading/ArticleActions";
import SetReadingChrome from "@/components/reading/SetReadingChrome";
import DifficultyBadge from "@/components/ui/DifficultyBadge";
import CategoryBadge from "@/components/ui/CategoryBadge";
import RatingStars from "@/components/ui/RatingStars";

type Props = {
  params: Promise<{ slug: string }>;
};

/** Pre-render all known article slugs at build time. */
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

/**
 * Every publishable article is known at build time, so anything else is a real
 * 404 and should be rejected before rendering starts.
 *
 * This matters because the route streams (see `loading.tsx`): once the shell
 * has flushed, a later `notFound()` can only swap the UI — the 200 status is
 * already committed. That soft 404 is what search engines would otherwise index
 * for every mistyped URL, and for drafts, which are absent from the list above
 * in production.
 */
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) return { title: "Article Not Found | TechCoder" };
  const ogImage = post.ogImage || post.thumbnail;
  const author = post.author;
  return {
    title: `${post.seo?.title || post.title} | TechCoder`,
    description: post.seo?.description || post.excerpt,
    authors: [{ name: author.name, url: author.url }],
    // A canonical is only overridden when the piece first ran somewhere else.
    alternates: { canonical: post.seo?.canonical || `/blog/${post.slug}` },
    robots: post.seo?.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "article",
      url: `/blog/${post.slug}`,
      siteName: "TechCoder",
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt,
      publishedTime: post.date,
      modifiedTime: post.updated || post.date,
      tags: post.tags,
      images: ogImage ? [{ url: ogImage, width: 800, height: 450, alt: post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

/** Difficulty defaults derived from the article's category when not set in frontmatter. */
function resolveDifficulty(post: BlogPost): Difficulty {
  if (post.difficulty) return post.difficulty;
  if (post.category === "AI") return "Advanced";
  return "Intermediate";
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) notFound();

  const mdxContent = await compileBlogContent(post.body);
  const headings = getHeadings(post.body);
  const difficulty = resolveDifficulty(post);
  const showUpdated = post.updated && post.updated !== post.date;
  const author = post.author;

  const related = getRelatedPosts(postSummaries, post, 2);
  const authorJsonLd = {
    "@type": "Person",
    name: author.name,
    ...(author.url ? { url: author.url } : {}),
  };
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seo?.description || post.excerpt,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    mainEntityOfPage: `https://techcoder.tech/blog/${post.slug}`,
    image: post.ogImage || post.thumbnail
      ? `https://techcoder.tech${post.ogImage || post.thumbnail}`
      : undefined,
    author: authorJsonLd,
    publisher: {
      "@type": "Organization",
      name: "TechCoder",
      url: "https://techcoder.tech",
      logo: {
        "@type": "ImageObject",
        url: "https://techcoder.tech/icon.png",
      },
    },
  };
  // Reviews get a second graph so the score is eligible for rich results —
  // `BlogPosting` has nowhere to put a rating.
  const reviewJsonLd = post.review && {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@type": "Product", name: post.review.product || post.title },
    reviewRating: {
      "@type": "Rating",
      ratingValue: post.review.rating,
      bestRating: 5,
      worstRating: 0,
    },
    author: authorJsonLd,
    datePublished: post.date,
    url: `https://techcoder.tech/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {reviewJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(reviewJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
      {/* Register this article with the reading chrome (navbar toolbar + layer) */}
      <SetReadingChrome title={post.title} backHref="/blog" headings={headings} />

      <article className="pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-20 relative">
        <div className="container-wide mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          {/* Back link */}
          <Link
            href="/blog"
            className="focus-ring rounded-lg group inline-flex items-center gap-1.5 text-sm font-medium text-tc-text-muted hover:text-tc-primary transition-colors duration-[var(--tc-dur)] mb-6 sm:mb-10"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Articles
          </Link>

          <div className="mx-auto max-w-[1180px] lg:grid lg:grid-cols-[minmax(0,1fr)_248px] lg:gap-14">
            {/* Article column */}
            <div className="min-w-0">
              {/* Header */}
              <header className="max-w-[720px] mb-8 sm:mb-10 animate-fade-up">
                <div className="flex flex-wrap items-center gap-2.5 mb-4 sm:mb-5">
                  <CategoryBadge category={post.category} variant="full" className="px-3 py-1 text-xs" />
                  <DifficultyBadge level={difficulty} />
                </div>

                <h1 className="heading-xl text-[1.9rem] sm:text-3xl md:text-4xl lg:text-[3rem] mb-4 sm:mb-5">
                  {post.title}
                </h1>
                <p className="text-[17px] sm:text-lg text-tc-text-muted leading-relaxed mb-5 sm:mb-6">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-tc-text-light">
                  <span className="flex items-center gap-2 font-medium text-tc-text-muted">
                    {author.avatar ? (
                      <Image
                        src={author.avatar}
                        alt=""
                        width={24}
                        height={24}
                        className="h-6 w-6 rounded-full border border-tc-border object-cover"
                      />
                    ) : (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tc-primary/12 text-[11px] font-bold text-tc-primary">
                        {author.name.charAt(0)}
                      </span>
                    )}
                    {author.name}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </span>
                  {showUpdated && (
                    <span className="flex items-center gap-1.5">
                      <History size={14} />
                      Updated <time dateTime={post.updated}>{formatDate(post.updated!)}</time>
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {post.readingTime}
                  </span>
                </div>
              </header>

              {/* Thumbnail — slightly shorter on mobile for a faster path to the text */}
              {post.thumbnail && (
                <div className="relative max-w-[720px] mb-8 sm:mb-10 aspect-[16/9] max-h-[248px] w-full overflow-hidden rounded-2xl border border-tc-border sm:max-h-none">
                  <Image
                    src={post.thumbnail}
                    alt={post.thumbnailAlt || post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 720px"
                    preload
                  />
                </div>
              )}

              {/* Prerequisites */}
              {post.prerequisites && post.prerequisites.length > 0 && (
                <div className="max-w-[720px] mb-10 rounded-2xl card-surface p-5 sm:p-6 animate-fade-up">
                  <div className="flex items-center gap-2 mb-3.5">
                    <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-tc-primary/12 text-tc-primary">
                      <ListChecks size={16} />
                    </span>
                    <h2 className="heading-sm text-[15px]">Before you start</h2>
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    {post.prerequisites.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-tc-text-muted">
                        <span className="flex items-center justify-center w-5 h-5 shrink-0 rounded-full bg-tc-primary/12 text-tc-primary mt-0.5">
                          <Check size={12} strokeWidth={3} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div data-reading-content>
                {/* Body */}
                <div className="prose-tc mb-12">{mdxContent}</div>

                {/* Tags */}
                <div className="reading-dim max-w-[720px] flex flex-wrap gap-2 mb-14">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="group inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-tc-bg-elevated text-tc-text-muted rounded-full border border-tc-border transition-[border-color,color,transform] duration-[var(--tc-dur)] hover:-translate-y-0.5 hover:border-tc-primary hover:text-tc-primary hover:shadow-[var(--tc-shadow-sm)]"
                    >
                      <Tag size={10} className="transition-transform duration-200 group-hover:-rotate-12" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Byline */}
                {author.bio && (
                  <div className="reading-dim max-w-[720px] mb-8 flex items-start gap-4 rounded-2xl card-surface p-5 sm:p-6">
                  {author.avatar ? (
                    <Image
                      src={author.avatar}
                      alt=""
                      width={48}
                      height={48}
                      className="h-12 w-12 shrink-0 rounded-full border border-tc-border object-cover"
                    />
                  ) : (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-tc-primary/12 text-lg font-bold text-tc-primary">
                      {author.name.charAt(0)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-tc-text">{author.name}</p>
                    {author.role && (
                      <p className="text-xs text-tc-text-light">{author.role}</p>
                    )}
                    <p className="mt-2 text-sm leading-relaxed text-tc-text-muted">
                      {author.bio}
                    </p>
                  </div>
                  </div>
                )}
              </div>

              {/* Newsletter */}
              <div className="reading-dim max-w-[720px]">
                <NewsletterBox />
              </div>
            </div>

            {/* Sticky sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 flex flex-col gap-7">
                {/* Reading companion — share, copy, bookmark, print, focus + progress */}
                <ArticleActions
                  slug={post.slug}
                  title={post.title}
                  readingTime={post.readingTime}
                />

                {post.review && (
                  <div className="rounded-2xl card-surface p-5">
                    <p className="overline text-tc-text-light mb-4">Review</p>
                    <p className="mb-3 font-semibold text-tc-text">
                      {post.review.product || post.title}
                    </p>
                    <RatingStars value={post.review.rating ?? 0} />
                    {post.review.price && (
                      <p className="mt-3 flex items-center justify-between gap-3 text-sm">
                        <span className="text-tc-text-light">Price</span>
                        <span className="font-medium text-tc-text">
                          {post.review.price}
                        </span>
                      </p>
                    )}
                  </div>
                )}

                <div className="rounded-2xl card-surface p-5">
                  <p className="overline text-tc-text-light mb-4">Article</p>
                  <dl className="flex flex-col gap-3.5 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-tc-text-light">Difficulty</dt>
                      <dd><DifficultyBadge level={difficulty} /></dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-tc-text-light">Read time</dt>
                      <dd className="text-tc-text font-medium">{post.readingTime}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-tc-text-light">Published</dt>
                      <dd className="text-tc-text font-medium">{formatDate(post.date)}</dd>
                    </div>
                    {showUpdated && (
                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-tc-text-light">Updated</dt>
                        <dd className="text-tc-text font-medium">{formatDate(post.updated!)}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {headings.length > 0 && (
                  <div className="rounded-2xl card-surface p-5">
                    <TableOfContents headings={headings} />
                  </div>
                )}
              </div>
            </aside>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="reading-dim mt-14 pt-10 sm:mt-20 sm:pt-14 border-t border-tc-border">
              <h2 className="heading-lg text-[1.375rem] md:text-2xl mb-6 sm:mb-8">Keep reading</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">
                {related.map((p) => (
                  <MagicBorderCard key={p.id} post={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}
