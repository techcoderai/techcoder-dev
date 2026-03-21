import type { Metadata } from "next";
import { blogPosts, getCategories } from "@/content/loader";
import BlogListContent from "@/components/sections/BlogListContent";

export const metadata: Metadata = {
  title: "Blog | TechCoder",
  description:
    "Explore articles on AI, web development, and developer productivity tricks.",
};

export default function BlogPage() {
  return <BlogListContent posts={blogPosts} categories={getCategories()} />;
}
