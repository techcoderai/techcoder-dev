import type { Metadata } from "next";
import { Suspense } from "react";
import { blogPosts, getCategories } from "@/content/loader";
import BlogListContent from "@/components/sections/BlogListContent";

export const metadata: Metadata = {
  title: "Blog | TechCoder",
  description:
    "Explore articles on AI, web development, and developer productivity tricks.",
};

export default function BlogPage() {
  return (
    <Suspense>
      <BlogListContent posts={blogPosts} categories={getCategories()} />
    </Suspense>
  );
}
