"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import { ARTICLE_ACTIONS_ID, COMMENTS_ID, useEngagement } from "@/components/engagement/EngagementProvider";
import ClapIcon from "@/components/engagement/ClapIcon";

const compact = new Intl.NumberFormat("en", { notation: "compact" });

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/**
 * End-of-article action row: clap (one per reader, backed by the like API)
 * and a comments shortcut. Deliberately quiet — icon + number, a hairline
 * above and below.
 */
export default function ArticleActionBar() {
  const { status: authStatus } = useAuth();
  const { status, likes, liked, likePending, commentCount, setLiked, requestSignIn } = useEngagement();
  const [message, setMessage] = useState<string | null>(null);

  if (status === "unavailable") return null;
  const ready = status === "ready";

  const onClap = async () => {
    if (!ready || likePending) return;
    setMessage(null);
    if (authStatus !== "signed-in") {
      requestSignIn("clap");
      return;
    }
    const result = await setLiked(!liked);
    if (result.ok) return;
    if (result.needsSignIn) requestSignIn("clap");
    else setMessage(result.error);
  };

  const claps = plural(likes, "clap", "claps");

  return (
    <div id={ARTICLE_ACTIONS_ID} className="reading-dim max-w-[720px] mb-10 scroll-mt-28">
      <div className="flex items-center gap-5 border-y border-tc-border py-2.5">
        <button
          type="button"
          onClick={onClap}
          aria-pressed={liked}
          aria-disabled={!ready || likePending}
          aria-label={`Clap for this article (${claps})`}
          title={liked ? "Remove your clap" : "Clap"}
          className={cn(
            "press focus-ring group -ml-2 inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm tabular-nums transition-colors duration-[var(--tc-dur)]",
            liked ? "text-tc-primary" : "text-tc-text-muted hover:text-tc-text",
            !ready && "cursor-default"
          )}
        >
          <ClapIcon
            key={String(liked)}
            size={22}
            active={liked}
            className={cn(liked && "animate-bookmark-pop")}
          />
          <span aria-hidden="true" className="min-w-[1ch]">
            {ready ? compact.format(likes) : "\u00a0"}
          </span>
        </button>

        <a
          href={`#${COMMENTS_ID}`}
          aria-label={`Comments (${commentCount})`}
          title="Comments"
          className="press focus-ring inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm tabular-nums text-tc-text-muted transition-colors duration-[var(--tc-dur)] hover:text-tc-text"
        >
          <MessageCircle size={20} aria-hidden="true" />
          <span aria-hidden="true" className="min-w-[1ch]">
            {ready ? compact.format(commentCount) : "\u00a0"}
          </span>
        </a>
      </div>

      <div aria-live="polite" className="empty:hidden">
        {message && <p className="mt-2.5 text-sm text-tc-text-muted animate-fade-up">{message}</p>}
      </div>
    </div>
  );
}
