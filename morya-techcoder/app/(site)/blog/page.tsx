import type { Metadata } from "next";
import { Suspense } from "react";
import { postSummaries, getCategories } from "@/content/loader";
import BlogListContent from "@/components/sections/BlogListContent";

export const metadata: Metadata = {
  title: "Blog | TechCoder",
  description:
    "In-depth articles, hands-on guides, and honest reviews across programming, AI, technology, and gadgets.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "/blog",
    title: "Blog | TechCoder",
    description:
      "In-depth articles, hands-on guides, and honest reviews across programming, AI, technology, and gadgets.",
    siteName: "TechCoder",
  },
};

export default function BlogPage() {
  return (
    <Suspense>
      <BlogListContent posts={postSummaries} categories={getCategories()} />
    </Suspense>
  );
}
