import type { MetadataRoute } from "next";
import { blogPosts } from "@/content/loader";
import { ACTIVE_CATEGORY_KEYS, categoryHref } from "@/lib/categories";

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
    {
      url: `${SITE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // "Coming soon" topics render a placeholder and have nothing to index yet.
  const topicRoutes: MetadataRoute.Sitemap = ACTIVE_CATEGORY_KEYS.map((category) => ({
    url: `${SITE_URL}${categoryHref(category)}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // `blogPosts` is already free of drafts in production; `noindex` articles stay
  // reachable but are deliberately kept out of the index.
  const articleRoutes: MetadataRoute.Sitemap = blogPosts
    .filter((post) => !post.seo?.noindex)
    .map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updated || post.date,
      changeFrequency: "monthly",
      priority: 0.8,
      images: post.thumbnail ? [`${SITE_URL}${post.thumbnail}`] : undefined,
    }));

  return [...staticRoutes, ...topicRoutes, ...articleRoutes];
}
