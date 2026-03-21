import type { BlogCategory } from "@/content/blogs";

export const categoryColors: Record<BlogCategory, { badge: string; dot: string }> = {
  AI: {
    badge: "bg-tc-cat-ai-bg text-tc-cat-ai-text border border-tc-cat-ai-border",
    dot: "bg-tc-cat-ai-text",
  },
  WebDev: {
    badge: "bg-tc-cat-webdev-bg text-tc-cat-webdev-text border border-tc-cat-webdev-border",
    dot: "bg-tc-cat-webdev-text",
  },
  Tricks: {
    badge: "bg-tc-cat-tricks-bg text-tc-cat-tricks-text border border-tc-cat-tricks-border",
    dot: "bg-tc-cat-tricks-text",
  },
};
