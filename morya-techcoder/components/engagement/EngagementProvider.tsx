"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useAuthModal } from "@/components/auth/AuthModal";
import type { ApiError, CommentView, EngagementPayload, LikePayload } from "@/types/engagement";

type LoadStatus = "loading" | "ready" | "error" | "unavailable";

export type ActionResult = { ok: true } | { ok: false; error: string; needsSignIn?: boolean };

/** What the reader was trying to do when asked to sign in. */
export type PendingAction = "clap" | "comment";

export const COMMENTS_ID = "comments";
export const ARTICLE_ACTIONS_ID = "article-actions";
export const COMMENT_COMPOSER_ID = "comment-composer";

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
  /** Opens the sign-in dialog and finishes `action` once the reader is signed in. */
  requestSignIn: (action: PendingAction) => void;
};

const EngagementContext = createContext<EngagementContextValue | null>(null);

const GENERIC_ERROR = "Something went wrong. Please try again.";

const SIGN_IN_REASONS: Record<PendingAction, string> = {
  clap: "Sign in to clap for this article. Reading stays free for everyone.",
  comment: "Sign in to join the conversation. Anyone can read the comments.",
};

// Google sign-in leaves the page, so the intent rides along in this tab's
// sessionStorage and is picked up when the article loads again.
const PENDING_KEY = "tc:pending-engagement";
const PENDING_TTL_MS = 30 * 60 * 1000;

function persistPendingAction(slug: string, action: PendingAction) {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify({ slug, action, at: Date.now() }));
  } catch {
    /* storage unavailable: the reader just lands back on the article */
  }
}

function takePersistedAction(slug: string): PendingAction | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(PENDING_KEY);
    const saved = JSON.parse(raw) as { slug?: unknown; action?: unknown; at?: unknown };
    const fresh = typeof saved.at === "number" && Date.now() - saved.at < PENDING_TTL_MS;
    if (!fresh || saved.slug !== slug) return null;
    return saved.action === "clap" || saved.action === "comment" ? saved.action : null;
  } catch {
    return null;
  }
}

function focusComposer() {
  window.requestAnimationFrame(() => {
    const field = document.getElementById(COMMENT_COMPOSER_ID);
    if (!field) return;
    field.scrollIntoView({ block: "center" });
    field.focus({ preventScroll: true });
  });
}

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
 * Likes (shown as claps) + comments for one article. Articles are static HTML;
 * this island fetches the live counts after hydration so reading never waits
 * on the database, and refetches when the reader signs in or out.
 */
export function EngagementProvider({ slug, children }: { slug: string; children: React.ReactNode }) {
  const { status: authStatus } = useAuth();
  const { openAuth } = useAuthModal();
  const [status, setStatus] = useState<LoadStatus>(authStatus === "unavailable" ? "unavailable" : "loading");
  const [data, setData] = useState<EngagementPayload | null>(null);
  const [likePending, setLikePending] = useState(false);
  const likeInFlight = useRef(false);
  const pendingAction = useRef<PendingAction | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const base = `/api/articles/${encodeURIComponent(slug)}`;

  const sendLike = useCallback(
    async (liked: boolean, previous: { likes: number; liked: boolean }): Promise<ActionResult> => {
      if (likeInFlight.current) return { ok: true };
      likeInFlight.current = true;
      setLikePending(true);
      // Optimistic, then reconciled with the server's authoritative count.
      const delta = liked === previous.liked ? 0 : liked ? 1 : -1;
      setData((d) => d && { ...d, liked, likes: Math.max(0, previous.likes + delta) });
      const res = await request<LikePayload>(`${base}/like`, { method: "PUT", body: JSON.stringify({ liked }) });
      setData((d) => d && { ...d, ...(res.ok ? res.data : { likes: previous.likes, liked: previous.liked }) });
      likeInFlight.current = false;
      setLikePending(false);
      return res.ok ? { ok: true } : failure(res);
    },
    [base]
  );

  useEffect(() => {
    if (authStatus === "loading" || authStatus === "unavailable") return;
    let cancelled = false;
    void request<EngagementPayload>(`${base}/engagement`).then((res) => {
      if (cancelled) return;
      if (!res.ok) {
        setStatus(res.status === 503 ? "unavailable" : "error");
        return;
      }
      setData(res.data);
      setStatus("ready");
      if (authStatus !== "signed-in") return;
      // Finish what the reader started before signing in.
      const persisted = takePersistedAction(slug);
      const action = pendingAction.current ?? persisted;
      pendingAction.current = null;
      if (action === "clap" && !res.data.liked) void sendLike(true, res.data);
      if (action === "comment") focusComposer();
    });
    return () => {
      cancelled = true;
    };
  }, [authStatus, base, slug, reloadKey, sendLike]);

  const reload = useCallback(() => {
    setStatus("loading");
    setReloadKey((k) => k + 1);
  }, []);

  const setLiked = useCallback(
    async (liked: boolean): Promise<ActionResult> => (data ? sendLike(liked, data) : { ok: true }),
    [data, sendLike]
  );

  const requestSignIn = useCallback(
    (action: PendingAction) => {
      pendingAction.current = action;
      const anchor = action === "comment" ? COMMENTS_ID : ARTICLE_ACTIONS_ID;
      openAuth({
        next: `${window.location.pathname}#${anchor}`,
        reason: SIGN_IN_REASONS[action],
        onDismiss: () => {
          pendingAction.current = null;
        },
        onBeforeRedirect: () => persistPendingAction(slug, action),
      });
    },
    [openAuth, slug]
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
      requestSignIn,
    }),
    [slug, authStatus, status, data, likePending, reload, setLiked, addComment, removeComment, reportComment, requestSignIn]
  );

  return <EngagementContext.Provider value={value}>{children}</EngagementContext.Provider>;
}

export function useEngagement(): EngagementContextValue {
  const ctx = useContext(EngagementContext);
  if (!ctx) throw new Error("useEngagement must be used inside <EngagementProvider>");
  return ctx;
}
