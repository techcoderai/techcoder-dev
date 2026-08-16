import type { Metadata } from "next";
import BlogIndex from "@/components/sections/BlogIndex";

export const metadata: Metadata = {
  title: "Blog | TechCoder",
  description:
    "Explore articles on AI, web development, and developer productivity tricks.",
};

export default function BlogPage() {
  return <BlogIndex />;
}
