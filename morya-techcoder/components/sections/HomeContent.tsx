import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/content/loader";
import { categoryHref, type BlogCategory } from "@/lib/categories";
import { getFeaturedPosts, getPostsByCategory } from "@/lib/posts";
import MagicBorderCard from "@/components/ui/MagicBorderCard";
import CardCarousel from "@/components/ui/CardCarousel";

/**
 * Editorial rails shown on the home page, in reading order. A rail with no
 * published posts is skipped automatically — so Reviews and Buying Guides light
 * up the moment their first article ships, with no code change.
 */
const RAILS: { title: string; subtitle: string; category: BlogCategory }[] = [
  {
    title: "Latest in AI",
    subtitle: "Breakthrough models and the tools built on them, explained clearly.",
    category: "AI",
  },
  {
    title: "Trending in technology",
    subtitle: "The ideas and shifts shaping how we live, work, and build.",
    category: "Technology",
  },
  {
    title: "For the builders",
    subtitle: "Programming deep dives, patterns, and hands-on guides.",
    category: "Programming",
  },
  {
    title: "Reviews",
    subtitle: "Honest, hands-on verdicts on the products worth your attention.",
    category: "Reviews",
  },
  {
    title: "Buying guides",
    subtitle: "Clear recommendations to help you choose with confidence.",
    category: "Guides",
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

function Rail({ title, subtitle, category }: { title: string; subtitle: string; category: BlogCategory }) {
  const posts = getPostsByCategory(blogPosts, category, 3);
  if (posts.length === 0) return null;

  return (
    <section className="animate-fade-up">
      <RailHeader title={title} subtitle={subtitle} category={category} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post) => (
          <MagicBorderCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

export default function HomeContent() {
  const featured = getFeaturedPosts(blogPosts, 6);

  return (
    <div className="section-padding pt-0">
      <div className="container-wide mx-auto">
        {/* Editor's Picks — a horizontal, swipeable rail of standout reads */}
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
          <CardCarousel posts={featured} />
        </div>

        {/* Topic rails */}
        <div className="flex flex-col gap-16">
          {RAILS.map((rail) => (
            <Rail key={rail.category} {...rail} />
          ))}
        </div>
      </div>
    </div>
  );
}
