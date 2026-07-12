import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft, Clock, Calendar, Tag, History, ListChecks, Check } from "lucide-react";
import { blogPosts, getBlogBySlug, compileBlogContent } from "@/content/loader";
import { formatDate, getHeadings } from "@/lib/utils";
import { getRelatedPosts } from "@/lib/posts";
import { categoryColors } from "@/lib/categories";
import type { BlogPost, Difficulty } from "@/types/blog";
import NewsletterBox from "@/components/ui/NewsletterBox";
import MagicBorderCard from "@/components/ui/MagicBorderCard";
import ReadingProgress from "@/components/ui/ReadingProgress";
import TableOfContents from "@/components/ui/TableOfContents";
import DifficultyBadge from "@/components/ui/DifficultyBadge";

type Props = {
  params: Promise<{ slug: string }>;
};

/** Pre-render all known article slugs at build time. */
export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) return { title: "Article Not Found | TechCoder" };
  const ogImage = post.ogImage || post.thumbnail;
  return {
    title: `${post.seo?.title || post.title} | TechCoder`,
    description: post.seo?.description || post.excerpt,
    openGraph: ogImage
      ? { images: [{ url: ogImage, width: 800, height: 450 }] }
      : undefined,
  };
}

/** Difficulty defaults derived from the article's category when not set in frontmatter. */
function resolveDifficulty(post: BlogPost): Difficulty {
  if (post.difficulty) return post.difficulty;
  if (post.category === "Tricks") return "Beginner";
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

  const related = getRelatedPosts(blogPosts, post, 2);

  return (
    <>
      <ReadingProgress />

      <article className="pt-28 md:pt-32 pb-16 md:pb-20 relative">
        <div className="container-wide mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          {/* Back link */}
          <Link
            href="/blog"
            className="focus-ring rounded-lg group inline-flex items-center gap-1.5 text-sm font-medium text-tc-text-muted hover:text-tc-primary transition-all duration-200 mb-10"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Articles
          </Link>

          <div className="mx-auto max-w-[1180px] lg:grid lg:grid-cols-[minmax(0,1fr)_248px] lg:gap-14">
            {/* Article column */}
            <div className="min-w-0">
              {/* Header */}
              <header className="max-w-[720px] mb-10 animate-fade-up">
                <div className="flex flex-wrap items-center gap-2.5 mb-5">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      categoryColors[post.category]?.badge ||
                      "bg-tc-bg-elevated text-tc-text-muted border border-tc-border"
                    }`}
                  >
                    {post.category}
                  </span>
                  <DifficultyBadge level={difficulty} />
                </div>

                <h1 className="heading-xl text-2xl sm:text-3xl md:text-4xl lg:text-[3rem] mb-5">
                  {post.title}
                </h1>
                <p className="text-base sm:text-lg text-tc-text-muted leading-relaxed mb-6">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-tc-text-light">
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

              {/* Thumbnail */}
              {post.thumbnail && (
                <div className="max-w-[720px] mb-10">
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    width={800}
                    height={450}
                    className="rounded-2xl w-full h-auto border border-tc-border"
                    sizes="(max-width: 768px) 100vw, 720px"
                    priority
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

              {/* Body */}
              <div className="prose-tc mb-12">{mdxContent}</div>

              {/* Tags */}
              <div className="max-w-[720px] flex flex-wrap gap-2 mb-14">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="group inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-tc-bg-elevated text-tc-text-muted rounded-full border border-tc-border transition-all duration-200 hover:-translate-y-0.5 hover:border-tc-primary hover:text-tc-primary hover:shadow-[var(--tc-shadow-sm)]"
                  >
                    <Tag size={10} className="transition-transform duration-200 group-hover:-rotate-12" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Newsletter */}
              <div className="max-w-[720px]">
                <NewsletterBox />
              </div>
            </div>

            {/* Sticky sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 flex flex-col gap-7">
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
            <div className="mt-20 pt-14 border-t border-tc-border">
              <h2 className="heading-lg text-xl md:text-2xl mb-8">Keep reading</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
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
