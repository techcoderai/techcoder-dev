import type { MetadataRoute } from "next";
import { blogPosts } from "@/content/loader";
import { CATEGORY_KEYS, categoryHref } from "@/lib/categories";

const SITE_URL = "https://techcoder.tech";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const topicRoutes: MetadataRoute.Sitemap = CATEGORY_KEYS.map((category) => ({
    url: `${SITE_URL}${categoryHref(category)}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const articleRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updated || post.date,
    changeFrequency: "monthly",
    priority: 0.8,
    images: post.thumbnail ? [`${SITE_URL}${post.thumbnail}`] : undefined,
  }));

  return [...staticRoutes, ...topicRoutes, ...articleRoutes];
}
