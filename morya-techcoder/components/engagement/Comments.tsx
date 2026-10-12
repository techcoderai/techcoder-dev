"use client";

import { useId, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import { FormMessage, primaryButtonClass, textLinkClass } from "@/components/auth/AuthUi";
import { COMMENT_COMPOSER_ID, COMMENTS_ID, useEngagement } from "@/components/engagement/EngagementProvider";
import CommentItem from "@/components/engagement/CommentItem";
import UserAvatar from "@/components/ui/UserAvatar";
import { COMMENT_MAX_LENGTH } from "@/lib/engagement/validation";

function Composer() {
  const { profile } = useAuth();
  const { addComment, requestSignIn } = useEngagement();
  const id = COMMENT_COMPOSER_ID;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [body, setBody] = useState("");
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  const trimmedLength = body.trim().length;
  const overLimit = body.length > COMMENT_MAX_LENGTH;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pending || trimmedLength === 0 || overLimit) return;
    setPending(true);
    setFeedback(null);
    const result = await addComment(body);
    setPending(false);
    if (result.ok) {
      setBody("");
      setFeedback({ tone: "success", text: "Your comment is posted." });
    } else if (result.needsSignIn) {
      requestSignIn("comment");
    } else {
      setFeedback({ tone: "error", text: result.error });
      textareaRef.current?.focus();
    }
  };

  const name = profile?.displayName ?? "Reader";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <UserAvatar name={name} src={profile?.avatarUrl} size={28} />
        <span className="text-sm font-medium text-tc-text">{name}</span>
      </div>
      <label htmlFor={id} className="sr-only">
        Write a comment
      </label>
      <textarea
        ref={textareaRef}
        id={id}
        value={body}
        onChange={(e) => {
          setBody(e.target.value);
          if (feedback?.tone === "success") setFeedback(null);
        }}
        placeholder="Add a comment…"
        rows={2}
        maxLength={COMMENT_MAX_LENGTH + 200}
        disabled={pending}
        aria-describedby={`${id}-count`}
        aria-invalid={overLimit || undefined}
        className="min-h-[4.5rem] w-full resize-y rounded-lg border border-tc-border-strong bg-tc-bg-card px-3.5 py-2.5 text-base leading-relaxed text-tc-text placeholder:text-tc-text-light outline-none transition-[border-color,box-shadow] duration-[var(--tc-dur)] focus:border-tc-primary focus:shadow-[0_0_0_3px_var(--tc-glow)] disabled:opacity-60 sm:text-[15px]"
      />
      <div className="flex items-center justify-between gap-3">
        <span
          id={`${id}-count`}
          className={cn("text-xs tabular-nums", overLimit ? "font-semibold text-tc-accent" : "text-tc-text-light")}
        >
          {body.length}/{COMMENT_MAX_LENGTH}
        </span>
        <button
          type="submit"
          disabled={pending || trimmedLength === 0 || overLimit}
          aria-busy={pending}
          className={cn(primaryButtonClass, "h-8 w-auto disabled:opacity-50")}
        >
          {pending ? "Posting…" : "Comment"}
        </button>
      </div>
      <div aria-live="polite" className="empty:hidden">
        {feedback && <FormMessage tone={feedback.tone}>{feedback.text}</FormMessage>}
      </div>
    </form>
  );
}

/**
 * Text-first comments section: heading with count, composer (or a sign-in
 * prompt), then a flat list separated by hairlines. Top-level only.
 */
export default function Comments() {
  const { status: authStatus } = useAuth();
  const { status, comments, commentCount, reload, requestSignIn } = useEngagement();
  const headingId = useId();

  if (status === "unavailable") return null;

  return (
    <section
      id={COMMENTS_ID}
      tabIndex={-1}
      aria-labelledby={headingId}
      className="reading-dim max-w-[720px] mb-8 scroll-mt-24 outline-none"
    >
      <h2 id={headingId} className="heading-md text-xl sm:text-[1.375rem]">
        Comments{status === "ready" && <span className="text-tc-text-light"> ({commentCount})</span>}
      </h2>

      <div className="mt-3 border-b border-tc-border pb-4">
        {authStatus === "signed-in" ? (
          <Composer />
        ) : authStatus === "signed-out" ? (
          <p className="text-[15px] text-tc-text-muted">
            <button
              type="button"
              onClick={() => requestSignIn("comment")}
              aria-haspopup="dialog"
              className={cn(textLinkClass, "font-semibold")}
            >
              Sign in to comment
            </button>{" "}
            — anyone can read the conversation.
          </p>
        ) : (
          <div className="h-6" aria-hidden="true" />
        )}
      </div>

      <div aria-busy={status === "loading"}>
        {status === "loading" && (
          <p className="flex items-center gap-2 py-4 text-sm text-tc-text-light">
            <Loader2 size={16} aria-hidden="true" className="animate-spin" />
            Loading comments…
          </p>
        )}

        {status === "error" && (
          <div className="flex flex-wrap items-center gap-3 py-4">
            <FormMessage tone="error">Couldn&apos;t load comments.</FormMessage>
            <button
              type="button"
              onClick={reload}
              className="focus-ring rounded text-sm text-tc-text-muted underline underline-offset-4 hover:text-tc-primary"
            >
              Try again
            </button>
          </div>
        )}

        {status === "ready" && comments.length === 0 && (
          <p className="py-4 text-sm text-tc-text-light">No comments yet. Start the conversation.</p>
        )}

        {status === "ready" && comments.length > 0 && (
          <ol className="divide-y divide-tc-border">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </ol>
        )}

        {status === "ready" && commentCount > comments.length && (
          <p className="pt-4 text-xs text-tc-text-light">Showing the {comments.length} most recent comments.</p>
        )}
      </div>
    </section>
  );
}
