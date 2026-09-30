import type { MetadataRoute } from "next";
import { blogPosts, getCategories } from "@/content/loader";
import { categoryHref } from "@/lib/categories";

const SITE_URL = "https://techcoder.tech";

function parseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function postLastModified(post: (typeof blogPosts)[number]): Date | undefined {
  return parseDate(post.updated) ?? parseDate(post.date);
}

function latestModification(posts: typeof blogPosts): Date | undefined {
  return posts.reduce<Date | undefined>((latest, post) => {
    const modified = postLastModified(post);
    return modified && (!latest || modified > latest) ? modified : latest;
  }, undefined);
}

function hasSelfCanonical(post: (typeof blogPosts)[number]): boolean {
  const path = `/blog/${post.slug}`;
  try {
    return new URL(post.seo?.canonical || path, SITE_URL).href === new URL(path, SITE_URL).href;
  } catch {
    return false;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const indexablePosts = blogPosts.filter(
    (post) => !post.seo?.noindex && hasSelfCanonical(post)
  );

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: latestModification(blogPosts),
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: latestModification(blogPosts),
    },
    {
      url: `${SITE_URL}/about`,
    },
    {
      url: `${SITE_URL}/contact`,
    },
    {
      url: `${SITE_URL}/privacy`,
    },
    {
      url: `${SITE_URL}/terms`,
    },
  ];

  const topicRoutes: MetadataRoute.Sitemap = getCategories().map((category) => {
    const categoryPosts = blogPosts.filter((post) => post.category === category);
    return {
      url: `${SITE_URL}${categoryHref(category)}`,
      lastModified: latestModification(categoryPosts),
    };
  });

  const articleRoutes: MetadataRoute.Sitemap = indexablePosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: postLastModified(post),
    images: post.thumbnail ? [`${SITE_URL}${post.thumbnail}`] : undefined,
  }));

  return [...staticRoutes, ...topicRoutes, ...articleRoutes];
}
