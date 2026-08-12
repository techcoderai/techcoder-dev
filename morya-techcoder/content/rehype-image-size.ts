import "server-only";
import fs from "fs";
import path from "path";
import { imageSize } from "image-size";

/**
 * Minimal structural view of the hast nodes this plugin touches. Declared
 * locally so the content pipeline doesn't need the full `@types/hast`
 * dependency for a plugin that only reads `img` elements.
 */
type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const PUBLIC_DIR = path.join(process.cwd(), "public");

/** Dimensions are read from disk once per build; the same hero repeats often. */
const cache = new Map<string, { width: number; height: number } | null>();

function measure(src: string): { width: number; height: number } | null {
  if (cache.has(src)) return cache.get(src)!;

  let result: { width: number; height: number } | null = null;
  // Only root-relative paths are ours to measure; remote images have no file.
  if (src.startsWith("/")) {
    try {
      const file = path.join(PUBLIC_DIR, decodeURIComponent(src));
      const { width, height } = imageSize(fs.readFileSync(file));
      if (width && height) result = { width, height };
    } catch {
      // Missing or unreadable file — fall back to the component's defaults.
    }
  }

  cache.set(src, result);
  return result;
}

function walk(node: HastNode) {
  if (node.tagName === "img" && node.properties) {
    const src = node.properties.src;
    if (typeof src === "string" && !node.properties.width) {
      const size = measure(src);
      if (size) {
        node.properties.width = size.width;
        node.properties.height = size.height;
      }
    }
  }
  node.children?.forEach(walk);
}

/**
 * Annotates markdown images with their real intrinsic dimensions.
 *
 * Authors write `![alt](/content/blog/…)` (or insert an image in Keystatic) and
 * never think about size. Reading the file at compile time lets `next/image`
 * reserve the correct aspect ratio, which removes the layout shift that a
 * hardcoded fallback size causes on any non-16:9 image.
 */
export function rehypeImageSize() {
  return (tree: HastNode) => walk(tree);
}
