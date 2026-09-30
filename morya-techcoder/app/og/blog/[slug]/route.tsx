import { getAllSlugs, getBlogBySlug } from "@/content/loader";
import { CATEGORIES } from "@/lib/categories";
import { formatDate } from "@/lib/utils";
import { renderOgCard } from "../../og-card";

/** One share image per article, generated at build time. */
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function GET(_request: Request, { params }: RouteContext<"/og/blog/[slug]">) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) return new Response("Not found", { status: 404 });

  return renderOgCard({
    eyebrow: CATEGORIES[post.category]?.label ?? post.category,
    title: post.seo?.title || post.title,
    meta: [post.author.name, formatDate(post.date), post.readingTime],
  });
}
