import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isSupabaseConfigured, SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase/config";

/**
 * Refreshes the Supabase session cookie before Server Components that read it
 * render (they can't write cookies themselves). Scoped to the signed-in pages on
 * purpose: articles and other static pages never depend on the session, so
 * they shouldn't pay for a function invocation. Route Handlers refresh the
 * session on their own via `lib/supabase/server.ts`.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!isSupabaseConfigured) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // Do not run code between createServerClient and getClaims(): it triggers
  // the token refresh that setAll() persists.
  await supabase.auth.getClaims();

  return response;
}

export const config = {
  matcher: ["/account/:path*", "/auth/:path*"],
};
