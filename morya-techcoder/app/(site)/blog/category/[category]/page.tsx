import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories } from "@/content/loader";
import { CATEGORIES, categoryFromSlug, categorySlug } from "@/lib/categories";
import BlogIndex from "@/components/sections/BlogIndex";

type Props = { params: Promise<{ category: string }> };

/** Only categories that actually have posts get a page. */
export function generateStaticParams() {
  return getCategories().map((category) => ({ category: categorySlug(category) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const key = categoryFromSlug(category);
  if (!key) return { title: "Category Not Found | TechCoder" };
  return {
    title: `${CATEGORIES[key].label} | TechCoder`,
    description: CATEGORIES[key].description,
  };
}

export default async function BlogCategoryPage({ params }: Props) {
  const { category } = await params;
  const key = categoryFromSlug(category);
  if (!key || !getCategories().includes(key)) notFound();
  return <BlogIndex category={key} />;
}
