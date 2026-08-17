import "server-only";
import fs from "fs";
import path from "path";
import type { Author } from "@/types/blog";

const AUTHOR_FILE = path.join(process.cwd(), "content", "settings", "author.json");

/**
 * TechCoder publishes under a single byline today, so the author is a Keystatic
 * singleton rather than a field repeated on every article — there is nothing to
 * choose per post, and copying the same name into eight files invites drift.
 *
 * When a second writer joins, this becomes a collection and posts gain an
 * optional `author` field that defaults to this record. Nothing else has to
 * change: every consumer already goes through `getAuthor()`.
 */
const FALLBACK: Author = { name: "TechCoder" };

function loadAuthor(): Author {
  try {
    const parsed = JSON.parse(fs.readFileSync(AUTHOR_FILE, "utf-8")) as Author;
    return parsed.name ? parsed : FALLBACK;
  } catch {
    // The file is optional — the site should still build without it.
    return FALLBACK;
  }
}

const author = loadAuthor();

/** The byline shown on every article. Read once at startup, like posts. */
export function getAuthor(): Author {
  return author;
}
