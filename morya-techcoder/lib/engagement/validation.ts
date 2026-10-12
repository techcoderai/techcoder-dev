/**
 * Pure validation helpers for auth redirects and reader input. No framework or
 * alias imports, so `node --test` can exercise them directly
 * (see `validation.test.ts`). The database re-checks every limit here.
 */

export const COMMENT_MAX_LENGTH = 2000;
export const DISPLAY_NAME_MAX_LENGTH = 50;
export const REPORT_REASON_MAX_LENGTH = 500;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// C0/C1 control characters except tab (\x09) and newline (\x0A).
const CONTROL_CHARS = /[\x00-\x08\x0B-\x1F\x7F-\x9F]/g;
// Bidi overrides can visually disguise text (e.g. reversed links).
const BIDI_CONTROLS = /[\u202A-\u202E\u2066-\u2069]/g;

/** Same shape the database CHECK constraint enforces. */
export function isValidSlugFormat(value: unknown): value is string {
  return typeof value === "string" && value.length <= 200 && SLUG_PATTERN.test(value);
}

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

/**
 * Only same-site relative paths are allowed as post-auth destinations, so a
 * crafted `?next=` can never bounce a user to another origin.
 */
export function safeNextPath(value: unknown, fallback = "/"): string {
  if (typeof value !== "string" || value.length === 0 || value.length > 512) return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  if (/[\x00-\x1F\x7F]/.test(value)) return fallback;
  try {
    const url = new URL(value, "http://n");
    if (url.origin !== "http://n") return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export type ValidationResult = { ok: true; value: string } | { ok: false; error: string };

/** Normalizes a comment: strips control chars, caps blank lines, trims. */
export function normalizeCommentBody(value: unknown): ValidationResult {
  if (typeof value !== "string") return { ok: false, error: "Write a comment first." };
  const body = value
    .replace(/\r\n?/g, "\n")
    .replace(CONTROL_CHARS, "")
    .replace(BIDI_CONTROLS, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (body.length === 0) return { ok: false, error: "Write a comment first." };
  if (body.length > COMMENT_MAX_LENGTH) {
    return { ok: false, error: `Comments can be up to ${COMMENT_MAX_LENGTH} characters.` };
  }
  return { ok: true, value: body };
}

export function normalizeDisplayName(value: unknown): ValidationResult {
  if (typeof value !== "string") return { ok: false, error: "Enter a display name." };
  const name = value
    .replace(CONTROL_CHARS, "")
    .replace(BIDI_CONTROLS, "")
    .replace(/\s+/g, " ")
    .trim();
  if (name.length === 0) return { ok: false, error: "Enter a display name." };
  if (name.length > DISPLAY_NAME_MAX_LENGTH) {
    return { ok: false, error: `Display names can be up to ${DISPLAY_NAME_MAX_LENGTH} characters.` };
  }
  return { ok: true, value: name };
}

export function normalizeReportReason(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const reason = value.replace(CONTROL_CHARS, "").replace(BIDI_CONTROLS, "").trim();
  return reason ? reason.slice(0, REPORT_REASON_MAX_LENGTH) : null;
}

/**
 * CSRF defence for cookie-authenticated JSON mutations: browsers always send
 * `Origin` on cross-origin POST/PUT/DELETE, so a mismatch means another site.
 * Mirrors Next's Server Action check: compare against `x-forwarded-host`
 * (set by Vercel and dev tunnels) and `host`.
 */
export function isSameOriginRequest(
  originHeader: string | null,
  hosts: ReadonlyArray<string | null | undefined>
): boolean {
  if (!originHeader) return false;
  try {
    const originHost = new URL(originHeader).host;
    return hosts.some((host) => !!host && host.split(",")[0].trim() === originHost);
  } catch {
    return false;
  }
}

/** Mirrors Supabase Auth's `minimum_password_length = 8` + `letters_digits` setting. */
export function isAcceptablePassword(value: string): boolean {
  return value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);
}

/** Catches typos before a round trip; Supabase Auth remains the real check. */
export function isPlausibleEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** Avatars are only ever rendered from Google's image CDN (matches the DB CHECK). */
export function isAllowedAvatarUrl(value: unknown): value is string {
  return typeof value === "string" && /^https:\/\/[a-z0-9-]+\.googleusercontent\.com\//.test(value);
}
