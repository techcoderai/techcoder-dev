export type BlogCategory = "AI" | "WebDev" | "Tricks";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

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
  /** Optional difficulty label. Falls back to a value derived from category. */
  difficulty?: Difficulty;
  /** Optional "last updated" ISO date shown alongside the publish date. */
  updated?: string;
  /** Optional list of prerequisites shown in a callout at the top of the article. */
  prerequisites?: string[];
  /** Raw MDX/markdown body of the article */
  body: string;
}
