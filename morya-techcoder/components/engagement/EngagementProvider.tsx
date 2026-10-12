"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import type { ApiError, CommentView, EngagementPayload, LikePayload } from "@/types/engagement";

type LoadStatus = "loading" | "ready" | "error" | "unavailable";

export type ActionResult = { ok: true } | { ok: false; error: string; needsSignIn?: boolean };

type EngagementContextValue = {
  slug: string;
  status: LoadStatus;
  likes: number;
  liked: boolean;
  likePending: boolean;
  comments: CommentView[];
  commentCount: number;
  canModerate: boolean;
  reload: () => void;
  setLiked: (liked: boolean) => Promise<ActionResult>;
  addComment: (body: string) => Promise<ActionResult>;
  removeComment: (id: string) => Promise<ActionResult>;
  reportComment: (id: string) => Promise<ActionResult>;
};

const EngagementContext = createContext<EngagementContextValue | null>(null);

const GENERIC_ERROR = "Something went wrong. Please try again.";

async function request<T>(url: string, init?: RequestInit): Promise<{ ok: true; data: T } | { ok: false; status: number; error: string }> {
  try {
    const res = await fetch(url, {
      ...init,
      cache: "no-store",
      headers: init?.body ? { "Content-Type": "application/json" } : undefined,
    });
    const data = (await res.json().catch(() => null)) as (T & Partial<ApiError>) | null;
    if (!res.ok) return { ok: false, status: res.status, error: data?.error || GENERIC_ERROR };
    return { ok: true, data: data as T };
  } catch {
    return { ok: false, status: 0, error: "You appear to be offline. Please try again." };
  }
}

function failure(res: { status: number; error: string }): ActionResult {
  return { ok: false, error: res.error, needsSignIn: res.status === 401 };
}

/**
 * Likes + comments for one article. Articles are static HTML; this island
 * fetches the live counts after hydration so reading never waits on the
 * database, and refetches when the reader signs in or out.
 */
export function EngagementProvider({ slug, children }: { slug: string; children: React.ReactNode }) {
  const { status: authStatus } = useAuth();
  const [status, setStatus] = useState<LoadStatus>(authStatus === "unavailable" ? "unavailable" : "loading");
  const [data, setData] = useState<EngagementPayload | null>(null);
  const [likePending, setLikePending] = useState(false);
  const likeInFlight = useRef(false);
  const [reloadKey, setReloadKey] = useState(0);

  const base = `/api/articles/${encodeURIComponent(slug)}`;

  useEffect(() => {
    if (authStatus === "loading" || authStatus === "unavailable") return;
    let cancelled = false;
    void request<EngagementPayload>(`${base}/engagement`).then((res) => {
      if (cancelled) return;
      if (res.ok) {
        setData(res.data);
        setStatus("ready");
      } else {
        setStatus(res.status === 503 ? "unavailable" : "error");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [authStatus, base, reloadKey]);

  const reload = useCallback(() => {
    setStatus("loading");
    setReloadKey((k) => k + 1);
  }, []);

  const setLiked = useCallback(
    async (liked: boolean): Promise<ActionResult> => {
      if (likeInFlight.current || !data) return { ok: true };
      likeInFlight.current = true;
      setLikePending(true);
      const previous = { likes: data.likes, liked: data.liked };
      // Optimistic, then reconciled with the server's authoritative count.
      setData((d) => d && { ...d, liked, likes: Math.max(0, d.likes + (liked === d.liked ? 0 : liked ? 1 : -1)) });
      const res = await request<LikePayload>(`${base}/like`, { method: "PUT", body: JSON.stringify({ liked }) });
      setData((d) => d && { ...d, ...(res.ok ? res.data : previous) });
      likeInFlight.current = false;
      setLikePending(false);
      return res.ok ? { ok: true } : failure(res);
    },
    [base, data]
  );

  const addComment = useCallback(
    async (body: string): Promise<ActionResult> => {
      const res = await request<CommentView>(`${base}/comments`, { method: "POST", body: JSON.stringify({ body }) });
      if (!res.ok) return failure(res);
      setData((d) => d && { ...d, comments: [res.data, ...d.comments], commentCount: d.commentCount + 1 });
      return { ok: true };
    },
    [base]
  );

  const removeComment = useCallback(async (id: string): Promise<ActionResult> => {
    const res = await request<{ id: string }>(`/api/comments/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) return failure(res);
    setData(
      (d) =>
        d && {
          ...d,
          comments: d.comments.filter((c) => c.id !== id),
          commentCount: Math.max(0, d.commentCount - 1),
        }
    );
    return { ok: true };
  }, []);

  const reportComment = useCallback(async (id: string): Promise<ActionResult> => {
    const res = await request<{ reported: boolean }>(`/api/comments/${encodeURIComponent(id)}/report`, {
      method: "POST",
      body: JSON.stringify({}),
    });
    return res.ok ? { ok: true } : failure(res);
  }, []);

  const value = useMemo<EngagementContextValue>(
    () => ({
      slug,
      status: authStatus === "unavailable" ? "unavailable" : status,
      likes: data?.likes ?? 0,
      liked: data?.liked ?? false,
      likePending,
      comments: data?.comments ?? [],
      commentCount: data?.commentCount ?? 0,
      canModerate: data?.viewer?.canModerate ?? false,
      reload,
      setLiked,
      addComment,
      removeComment,
      reportComment,
    }),
    [slug, authStatus, status, data, likePending, reload, setLiked, addComment, removeComment, reportComment]
  );

  return <EngagementContext.Provider value={value}>{children}</EngagementContext.Provider>;
}

export function useEngagement(): EngagementContextValue {
  const ctx = useContext(EngagementContext);
  if (!ctx) throw new Error("useEngagement must be used inside <EngagementProvider>");
  return ctx;
}
