import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react";
import { blogPosts, getBlogBySlug, compileBlogContent } from "@/content/loader";
import { formatDate } from "@/lib/utils";
import { categoryColors } from "@/lib/categories";
import NewsletterBox from "@/components/ui/NewsletterBox";
import MagicBorderCard from "@/components/ui/MagicBorderCard";

type Props = {
  params: Promise<{ slug: string }>;
};

/** Pre-render all known blog slugs at build time. */
export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) return { title: "Post Not Found | TechCoder" };
  return {
    title: `${post.title} | TechCoder`,
    description: post.excerpt,
    openGraph: post.ogImage
      ? { images: [{ url: post.ogImage, width: 800, height: 450 }] }
      : undefined,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) notFound();

  // Compile MDX body to React element
  const mdxContent = await compileBlogContent(post.body);

  // Related posts: same category, excluding current
  const related = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 2);

  return (
    <article className="pt-28 md:pt-32 pb-16 md:pb-20 relative">
      <div className="container-wide mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* Back link */}
        <Link
          href="/blog"
          className="focus-ring rounded-lg group inline-flex items-center gap-1.5 text-sm font-medium text-tc-text-muted hover:text-tc-primary transition-all duration-200 mb-10"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Blog
        </Link>

        {/* Header */}
        <header className="container-narrow mb-10 animate-fade-up">
          <span
            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-5 ${
              categoryColors[post.category]?.badge || "bg-tc-bg-elevated text-tc-text-muted border border-tc-border"
            }`}
          >
            {post.category}
          </span>
          <h1 className="heading-xl text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-5">
            {post.title}
          </h1>
          <p className="text-base sm:text-lg text-tc-text-muted leading-relaxed mb-6">
            {post.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-tc-text-light">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {post.readingTime}
            </span>
          </div>
        </header>

        {/* Thumbnail */}
        {post.thumbnail && (
          <div className="container-narrow mb-12">
            <Image
              src={post.thumbnail}
              alt={post.title}
              width={800}
              height={450}
              className="rounded-xl w-full h-auto"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        {/* MDX Body */}
        <div className="container-narrow prose-tc mb-16">
          {mdxContent}
        </div>

        {/* Tags */}
        <div className="container-narrow flex flex-wrap gap-2 mb-16">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-tc-bg-elevated text-tc-text-muted rounded-full transition-colors duration-200 hover:bg-tc-primary/10 hover:text-tc-primary-dark"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>

        {/* Newsletter */}
        <div className="container-narrow mb-16">
          <NewsletterBox />
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="container-wide">
            <h2 className="heading-lg text-xl md:text-2xl mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              {related.map((p) => (
                <MagicBorderCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
