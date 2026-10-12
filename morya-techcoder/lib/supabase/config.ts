/**
 * Public Supabase settings. Both values are safe to ship to the browser — data
 * access is enforced by Row Level Security. The service-role/secret key is
 * never used by this app.
 *
 * Without them the site still builds and serves every article; reader accounts,
 * likes and comments simply report themselves as unavailable.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
