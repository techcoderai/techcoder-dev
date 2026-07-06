import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes intelligently — resolves conflicts so the last class wins.
 * Uses clsx for conditional classes + tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats an ISO date string into a human-friendly format.
 * @example formatDate("2025-03-15") → "Mar 15, 2025"
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Estimates reading time based on word count (average 238 wpm for technical content).
 */
export function calcReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 238));
  return `${minutes} min read`;
}

/**
 * Converts heading text into a URL-safe slug used for anchor links and the TOC.
 * @example slugify("Reading Experience!") → "reading-experience"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[`*_~]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export type Heading = { id: string; text: string; level: number };

/**
 * Extracts h2/h3 headings from a markdown body for the table of contents.
 * Fenced code blocks are stripped first so `# comments` inside code are ignored.
 */
export function getHeadings(markdown: string): Heading[] {
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, "");
  const headings: Heading[] = [];
  for (const line of withoutCode.split("\n")) {
    const match = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
    if (!match) continue;
    const level = match[1].length;
    const text = match[2].replace(/[`*_~]/g, "").trim();
    headings.push({ id: slugify(text), text, level });
  }
  return headings;
}
