import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase/config";

/**
 * Per-request server client acting as the signed-in reader (RLS applies).
 * Create a new one for every request — never share it across requests.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component, which can't write cookies. The
          // proxy (`proxy.ts`) refreshes sessions for the routes that need it.
        }
      },
    },
  });
}

/**
 * The verified reader for this request, or null. `getUser()` validates the
 * session with Supabase Auth instead of trusting the cookie's contents.
 */
export async function getVerifiedUser(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();
  return error ? null : data.user;
}

export function isModerator(user: User | null): boolean {
  return user?.app_metadata?.role === "moderator";
}
