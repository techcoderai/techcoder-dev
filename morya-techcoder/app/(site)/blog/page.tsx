import type { Metadata } from "next";
import { Suspense } from "react";
import { blogPosts, getCategories } from "@/content/loader";
import BlogListContent from "@/components/sections/BlogListContent";

export const metadata: Metadata = {
  title: "Blog | TechCoder",
  description:
    "In-depth articles, hands-on guides, and honest reviews across programming, AI, technology, and gadgets.",
};

export default function BlogPage() {
  return (
    <Suspense>
      <BlogListContent posts={blogPosts} categories={getCategories()} />
    </Suspense>
  );
}
