import "server-only";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient, getVerifiedUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { safeNextPath } from "@/lib/engagement/validation";

export type AuthSearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Auth pages are utility screens: never indexed, never cached. */
export function authMetadata(title: string): Metadata {
  return { title: `${title} | TechCoder`, robots: { index: false, follow: false } };
}

export async function readNext(searchParams: AuthSearchParams): Promise<string> {
  const value = (await searchParams).next;
  return safeNextPath(Array.isArray(value) ? value[0] : value);
}

/** Signed-in readers have no business on sign-in/up; send them on. */
export async function redirectIfSignedIn(next: string) {
  if (!isSupabaseConfigured) return;
  const supabase = await createClient();
  if (await getVerifiedUser(supabase)) redirect(next);
}
