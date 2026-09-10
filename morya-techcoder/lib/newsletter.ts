import "server-only";

/**
 * Server-only newsletter subscription service. The UI never talks to Resend
 * directly — it calls `subscribeToNewsletter`, which is the single seam this
 * project would swap if the provider ever changed.
 *
 * Uses Resend's REST API directly (no `resend` SDK dependency) since the
 * request shape is a single JSON POST/GET — not worth a new dependency.
 */

export type SubscribeResult =
  | { status: "subscribed" }
  | { status: "duplicate" }
  | { status: "invalid" }
  | { status: "error" };

const RESEND_API_BASE = "https://api.resend.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Trims, lowercases, and loosely validates an email. Returns null if unusable. */
function normalizeEmail(raw: string): string | null {
  const email = raw.trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) return null;
  return email;
}

/**
 * Resend's Contacts API is global (`/contacts`) under the current model, but
 * some workspaces still use the older, audience-scoped model. Supporting an
 * optional `RESEND_AUDIENCE_ID` covers both without hardcoding either.
 */
function contactsUrl(email?: string): string {
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const base = audienceId
    ? `${RESEND_API_BASE}/audiences/${audienceId}/contacts`
    : `${RESEND_API_BASE}/contacts`;
  return email ? `${base}/${encodeURIComponent(email)}` : base;
}

export async function subscribeToNewsletter(rawEmail: string): Promise<SubscribeResult> {
  const email = normalizeEmail(rawEmail);
  if (!email) return { status: "invalid" };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[newsletter] RESEND_API_KEY is not configured");
    return { status: "error" };
  }

  const authHeader = { Authorization: `Bearer ${apiKey}` };

  try {
    // Contacts are addressable by email, so a lookup tells us whether this
    // is a fresh signup or an existing subscriber, without guessing at
    // provider error text.
    const existing = await fetch(contactsUrl(email), {
      headers: authHeader,
      cache: "no-store",
    });
    if (existing.ok) return { status: "duplicate" };
    if (existing.status !== 404) {
      console.error(`[newsletter] Resend lookup failed (${existing.status})`);
      return { status: "error" };
    }

    const created = await fetch(contactsUrl(), {
      method: "POST",
      headers: { ...authHeader, "Content-Type": "application/json" },
      body: JSON.stringify({ email, unsubscribed: false }),
      cache: "no-store",
    });
    if (!created.ok) {
      console.error(`[newsletter] Resend create failed (${created.status})`);
      return { status: "error" };
    }

    return { status: "subscribed" };
  } catch (err) {
    console.error("[newsletter] Unexpected error contacting Resend", err);
    return { status: "error" };
  }
}
