import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/content/loader";
import type { BlogCategory } from "@/content/blogs";
import MagicBorderCard from "@/components/ui/MagicBorderCard";

const categoryMeta: Record<BlogCategory, { label: string; description: string }> = {
  AI: { label: "AI & Machine Learning", description: "Latest breakthroughs and practical AI engineering" },
  WebDev: { label: "Web Development", description: "Modern frameworks, tools, and best practices" },
  Tricks: { label: "Tips & Tricks", description: "Shortcuts and hacks that boost your productivity" },
};

function CategorySection({ category, index }: { category: BlogCategory; index: number }) {
  const meta = categoryMeta[category];
  const filtered = blogPosts.filter((p) => p.category === category).slice(0, 3);
  if (filtered.length === 0) return null;

  const delayClass = index === 0 ? "animate-delay-2" : index === 1 ? "animate-delay-3" : "animate-delay-4";

  return (
    <section className={`animate-fade-up ${delayClass}`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <h3 className="heading-lg text-xl md:text-2xl">{meta.label}</h3>
          <p className="text-sm text-tc-text-muted mt-1.5">{meta.description}</p>
        </div>
        <Link
          href={`/blog?category=${category}`}
          className="focus-ring rounded-lg group inline-flex items-center gap-1.5 text-sm font-semibold text-tc-primary hover:text-tc-primary-dark transition-colors duration-200 shrink-0"
        >
          View all
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {filtered.map((post) => (
          <MagicBorderCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

export default function HomeContent() {
  const categories: BlogCategory[] = ["AI", "WebDev", "Tricks"];
  const featured = blogPosts.slice(0, 3);

  return (
    <div className="section-padding">
      <div className="container-wide mx-auto">
        {/* Featured Picks */}
        <div className="mb-20">
          <div className="mb-10 animate-fade-up animate-delay-1">
            <h2 className="heading-lg text-2xl md:text-3xl mb-3">Featured Picks</h2>
            <p className="text-tc-text-muted text-sm sm:text-base leading-relaxed">
              Hand-picked reads with that extra spark.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {featured.map((post) => (
              <MagicBorderCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Latest Articles by Category */}
        <div className="mb-10 animate-fade-up">
          <h2 className="heading-lg text-2xl md:text-3xl mb-3">Latest Articles</h2>
          <p className="text-tc-text-muted text-sm sm:text-base leading-relaxed">
            Fresh content across AI, web development, and developer tooling.
          </p>
        </div>
        <div className="flex flex-col gap-16">
          {categories.map((cat, i) => (
            <CategorySection key={cat} category={cat} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
