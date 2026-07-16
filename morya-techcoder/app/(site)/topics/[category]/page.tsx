import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { blogPosts } from "@/content/loader";
import { getPostsByCategory } from "@/lib/posts";
import {
  CATEGORIES,
  CATEGORY_KEYS,
  categorySlug,
  categoryFromSlug,
} from "@/lib/categories";
import { categoryIcon } from "@/lib/category-icons";
import MagicBorderCard from "@/components/ui/MagicBorderCard";
import NewsletterBox from "@/components/ui/NewsletterBox";

type Props = {
  params: Promise<{ category: string }>;
};

/** Pre-render a landing page for every topic (including "coming soon" ones). */
export function generateStaticParams() {
  return CATEGORY_KEYS.map((key) => ({ category: categorySlug(key) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const key = categoryFromSlug(category);
  if (!key) return { title: "Topic Not Found | TechCoder" };
  const meta = CATEGORIES[key];
  return {
    title: `${meta.label} | TechCoder`,
    description: meta.description,
  };
}

export default async function TopicPage({ params }: Props) {
  const { category } = await params;
  const key = categoryFromSlug(category);
  if (!key) notFound();

  const meta = CATEGORIES[key];
  const posts = getPostsByCategory(blogPosts, key);
  const Icon = categoryIcon(key);
  const isEmpty = posts.length === 0;

  // Other browsable topics for cross-navigation at the bottom of the page.
  const otherTopics = CATEGORY_KEYS.filter((k) => k !== key);

  return (
    <div className="section-padding pt-28 md:pt-32">
      <div className="container-wide mx-auto">
        {/* Back link */}
        <Link
          href="/blog"
          className="focus-ring rounded-lg group inline-flex items-center gap-1.5 text-sm font-medium text-tc-text-muted hover:text-tc-primary transition-all duration-200 mb-8"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
          All articles
        </Link>

        {/* Header */}
        <header className="mb-12 animate-fade-up">
          <span
            className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-tc-bg-elevated ${meta.accent} mb-6`}
          >
            <Icon size={26} />
          </span>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="heading-xl text-3xl md:text-4xl lg:text-5xl">{meta.label}</h1>
            {meta.comingSoon && (
              <span className="chip py-1 px-3 text-[11px] text-tc-text-light">Coming soon</span>
            )}
          </div>
          <p className="mt-4 body-lg max-w-2xl">{meta.description}</p>
          {!isEmpty && (
            <p className="mt-3 text-sm text-tc-text-light">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </p>
          )}
        </header>

        {/* Posts or empty state */}
        {!isEmpty ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {posts.map((post) => (
              <MagicBorderCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="mb-20 rounded-[26px] card-surface p-10 sm:p-14 text-center">
            <span className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-tc-bg-elevated ${meta.accent} mb-5`}>
              <Icon size={26} />
            </span>
            <h2 className="heading-md">
              {meta.comingSoon ? "This topic is on the way" : "No articles here yet"}
            </h2>
            <p className="body-base mt-3 max-w-md mx-auto">
              {meta.comingSoon
                ? `We're putting the finishing touches on our ${meta.label.toLowerCase()} coverage. Subscribe below and you'll be first to know.`
                : `We're working on our first ${meta.label.toLowerCase()} pieces. In the meantime, explore our other topics.`}
            </p>
            <Link
              href="/blog"
              className="btn-primary focus-ring group mt-7 px-6 py-3 text-sm"
            >
              Browse all articles
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        )}

        {/* Explore other topics */}
        <div className="pt-12 border-t border-tc-border">
          <h2 className="overline text-tc-text-light mb-5">Explore more topics</h2>
          <div className="flex flex-wrap gap-2.5">
            {otherTopics.map((k) => {
              const m = CATEGORIES[k];
              const OtherIcon = categoryIcon(k);
              return (
                <Link
                  key={k}
                  href={`/topics/${categorySlug(k)}`}
                  className={`focus-ring group inline-flex items-center gap-2 rounded-full border border-tc-border bg-tc-bg-card px-4 py-2.5 text-sm font-medium text-tc-text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-tc-primary hover:text-tc-primary ${m.comingSoon ? "opacity-60" : ""}`}
                >
                  <OtherIcon size={15} className={m.accent} />
                  {m.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-20">
          <NewsletterBox />
        </div>
      </div>
    </div>
  );
}
