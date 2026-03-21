export type BlogCategory = "AI" | "WebDev" | "Tricks";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  category: BlogCategory;
  tags: string[];
  readingTime: string;
  coverImage: string;
  thumbnail: string;
  ogImage: string;
  /** Raw MDX/markdown body of the article */
  body: string;
}
