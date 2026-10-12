import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { safeNextPath } from "@/lib/engagement/validation";

const OTP_TYPES: ReadonlySet<string> = new Set(["email", "signup", "recovery", "email_change", "invite", "magiclink"]);

// Relative Location: the browser resolves it against the URL it actually used,
// so the session cookie and the destination always share a host (proxies and
// tunnels can rewrite the Host header the server sees).
function redirectTo(path: string) {
  return new NextResponse(null, { status: 303, headers: { Location: path } });
}

/**
 * Lands every auth redirect: Google OAuth and default (PKCE) email links send
 * `?code=`; the token-hash email templates (docs/auth-and-engagement.md) send
 * `?token_hash=&type=`. Either way the session cookie is set here and the
 * reader continues to the sanitized `next` path.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const next = safeNextPath(searchParams.get("next"));
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  const fail = (reason: string) => {
    const params = new URLSearchParams({ error: reason });
    if (next !== "/") params.set("next", next);
    return redirectTo(`/auth/sign-in?${params}`);
  };

  if (!isSupabaseConfigured) return fail("unavailable");
  // Provider-side errors (e.g. the user cancelled Google consent).
  if (searchParams.get("error")) return fail("cancelled");

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return fail("link");
  } else if (tokenHash && type && OTP_TYPES.has(type)) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as EmailOtpType });
    if (error) return fail("link");
  } else {
    return fail("link");
  }

  return redirectTo(next);
}
