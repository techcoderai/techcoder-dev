"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AuthStatus = "loading" | "signed-in" | "signed-out" | "unavailable";

export type AuthProfile = { displayName: string; avatarUrl: string | null };

type AuthContextValue = {
  status: AuthStatus;
  email: string | null;
  profile: AuthProfile | null;
  /** Loads supabase-js on demand and subscribes to session changes. */
  getClient: () => Promise<SupabaseClient>;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// @supabase/ssr stores the session in `sb-<project-ref>-auth-token[.N]` cookies.
const AUTH_COOKIE = /(?:^|;\s*)sb-[^=]+-auth-token/;

/**
 * Client-side session state for UI only (navbar avatar, composer visibility).
 * It is never used for authorization — every mutation is re-verified on the
 * server and by RLS.
 *
 * supabase-js is imported lazily: readers without a session cookie never
 * download it unless they start signing in.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(isSupabaseConfigured ? "loading" : "unavailable");
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const clientRef = useRef<Promise<SupabaseClient> | null>(null);
  const userIdRef = useRef<string | null>(null);

  const loadProfile = useCallback(async (supabase: SupabaseClient, userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", userId)
      .maybeSingle();
    if (userIdRef.current !== userId) return;
    setProfile(data ? { displayName: data.display_name, avatarUrl: data.avatar_url } : { displayName: "Reader", avatarUrl: null });
  }, []);

  const getClient = useCallback(() => {
    if (!clientRef.current) {
      clientRef.current = import("@/lib/supabase/client").then(({ createClient }) => {
        const supabase = createClient();
        supabase.auth.onAuthStateChange((_event, session) => {
          const user = session?.user ?? null;
          userIdRef.current = user?.id ?? null;
          setEmail(user?.email ?? null);
          setStatus(user ? "signed-in" : "signed-out");
          if (!user) {
            setProfile(null);
            return;
          }
          // Supabase warns against awaiting client calls inside this callback.
          window.setTimeout(() => void loadProfile(supabase, user.id), 0);
        });
        return supabase;
      });
    }
    return clientRef.current;
  }, [loadProfile]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    if (AUTH_COOKIE.test(document.cookie)) {
      void getClient();
    } else {
      // Deferred so the first client render matches the server ("loading").
      const id = window.setTimeout(() => setStatus((s) => (s === "loading" ? "signed-out" : s)), 0);
      return () => window.clearTimeout(id);
    }
  }, [getClient]);

  const refreshProfile = useCallback(async () => {
    const supabase = await getClient();
    if (userIdRef.current) await loadProfile(supabase, userIdRef.current);
  }, [getClient, loadProfile]);

  const signOut = useCallback(async () => {
    const supabase = await getClient();
    await supabase.auth.signOut();
  }, [getClient]);

  const value = useMemo(
    () => ({ status, email, profile, getClient, refreshProfile, signOut }),
    [status, email, profile, getClient, refreshProfile, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
