"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import { signInHref } from "@/components/auth/AccountMenu";
import { useEngagement } from "@/components/engagement/EngagementProvider";

const compact = new Intl.NumberFormat("en", { notation: "compact" });

/**
 * End-of-article action row: like (heart + count) and a responses shortcut.
 * Deliberately quiet — icon + number, a hairline above and below.
 */
export default function ArticleActionBar() {
  const { status: authStatus } = useAuth();
  const { status, likes, liked, likePending, commentCount, setLiked } = useEngagement();
  const pathname = usePathname();
  const [message, setMessage] = useState<{ text: string; signIn?: boolean } | null>(null);

  if (status === "unavailable") return null;
  const ready = status === "ready";

  const onLike = async () => {
    if (!ready || likePending) return;
    if (authStatus !== "signed-in") {
      setMessage({ text: "Sign in to like this article.", signIn: true });
      return;
    }
    setMessage(null);
    const result = await setLiked(!liked);
    if (!result.ok) setMessage({ text: result.error, signIn: result.needsSignIn });
  };

  return (
    <div className="reading-dim max-w-[720px] mb-10">
      <div className="flex items-center gap-5 border-y border-tc-border py-2.5">
        <button
          type="button"
          onClick={onLike}
          aria-pressed={liked}
          aria-disabled={!ready || likePending}
          aria-label={liked ? `Unlike this article (${likes} likes)` : `Like this article (${likes} likes)`}
          className={cn(
            "press focus-ring group -ml-2 inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm tabular-nums transition-colors duration-[var(--tc-dur)]",
            liked ? "text-tc-primary" : "text-tc-text-muted hover:text-tc-text",
            !ready && "cursor-default"
          )}
        >
          <Heart
            key={String(liked)}
            size={20}
            aria-hidden="true"
            className={cn(
              "transition-transform duration-[var(--tc-dur)] group-hover:scale-110",
              liked && "animate-bookmark-pop fill-current"
            )}
          />
          <span aria-hidden="true" className="min-w-[1ch]">
            {ready ? compact.format(likes) : "\u00a0"}
          </span>
        </button>

        <a
          href="#responses"
          aria-label={`Responses (${commentCount})`}
          className="press focus-ring inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm tabular-nums text-tc-text-muted transition-colors duration-[var(--tc-dur)] hover:text-tc-text"
        >
          <MessageCircle size={20} aria-hidden="true" />
          <span aria-hidden="true" className="min-w-[1ch]">
            {ready ? compact.format(commentCount) : "\u00a0"}
          </span>
        </a>
      </div>

      <div aria-live="polite" className="empty:hidden">
        {message && (
          <p className="mt-2.5 text-sm text-tc-text-muted animate-fade-up">
            {message.text}{" "}
            {message.signIn && (
              <Link
                href={signInHref(pathname)}
                className="focus-ring rounded font-semibold text-tc-text underline underline-offset-4 hover:text-tc-primary"
              >
                Sign in
              </Link>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
