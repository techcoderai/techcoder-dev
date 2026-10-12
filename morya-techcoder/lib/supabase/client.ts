import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase/config";

/**
 * Browser client (cookie-backed session, shared singleton in the browser).
 * Import it lazily (`await import(...)`) so supabase-js stays out of the
 * initial bundle of every page — see `components/auth/AuthProvider.tsx`.
 */
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}
