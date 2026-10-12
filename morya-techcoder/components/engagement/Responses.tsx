"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import { signInHref } from "@/components/auth/AccountMenu";
import { FormMessage } from "@/components/auth/AuthUi";
import { useEngagement } from "@/components/engagement/EngagementProvider";
import CommentItem from "@/components/engagement/CommentItem";
import UserAvatar from "@/components/ui/UserAvatar";
import { COMMENT_MAX_LENGTH } from "@/lib/engagement/validation";

function Composer() {
  const { profile } = useAuth();
  const { addComment } = useEngagement();
  const pathname = usePathname();
  const id = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [body, setBody] = useState("");
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "error" | "success"; text: string; signIn?: boolean } | null>(null);

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
      setFeedback({ tone: "success", text: "Your response is published." });
    } else {
      setFeedback({ tone: "error", text: result.error, signIn: result.needsSignIn });
      textareaRef.current?.focus();
    }
  };

  const name = profile?.displayName ?? "Reader";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <UserAvatar name={name} src={profile?.avatarUrl} size={28} />
        <span className="text-sm font-medium text-tc-text">{name}</span>
      </div>
      <label htmlFor={id} className="sr-only">
        Write a response
      </label>
      <textarea
        ref={textareaRef}
        id={id}
        value={body}
        onChange={(e) => {
          setBody(e.target.value);
          if (feedback?.tone === "success") setFeedback(null);
        }}
        placeholder="What are your thoughts?"
        rows={3}
        maxLength={COMMENT_MAX_LENGTH + 200}
        disabled={pending}
        aria-describedby={`${id}-count`}
        aria-invalid={overLimit || undefined}
        className="focus-ring min-h-24 w-full resize-y rounded-xl border border-tc-border bg-tc-bg-card px-3.5 py-3 text-[15px] leading-relaxed text-tc-text placeholder:text-tc-text-light outline-none transition-[border-color,box-shadow] duration-[var(--tc-dur)] hover:border-tc-border-strong focus:border-tc-primary focus:shadow-[0_0_0_3px_var(--tc-glow-soft)] disabled:opacity-60"
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
          className="btn-primary focus-ring px-5 py-2 text-sm disabled:pointer-events-none disabled:opacity-50"
        >
          {pending ? "Publishing…" : "Respond"}
        </button>
      </div>
      <div aria-live="polite" className="empty:hidden">
        {feedback && (
          <FormMessage tone={feedback.tone}>
            {feedback.text}{" "}
            {feedback.signIn && (
              <Link href={signInHref(pathname, "#responses")} className="font-semibold underline underline-offset-4">
                Sign in
              </Link>
            )}
          </FormMessage>
        )}
      </div>
    </form>
  );
}

/**
 * Text-first responses section: heading with count, composer (or a sign-in
 * prompt), then a flat list separated by hairlines. Top-level only.
 */
export default function Responses() {
  const { status: authStatus } = useAuth();
  const { status, comments, commentCount, reload } = useEngagement();
  const pathname = usePathname();
  const headingId = useId();

  if (status === "unavailable") return null;

  return (
    <section
      id="responses"
      tabIndex={-1}
      aria-labelledby={headingId}
      className="reading-dim max-w-[720px] mb-12 scroll-mt-24 outline-none"
    >
      <h2 id={headingId} className="heading-md text-xl sm:text-[1.375rem]">
        Responses{status === "ready" && <span className="text-tc-text-light"> ({commentCount})</span>}
      </h2>

      <div className="mt-5 border-b border-tc-border pb-6">
        {authStatus === "signed-in" ? (
          <Composer />
        ) : authStatus === "signed-out" ? (
          <p className="text-[15px] text-tc-text-muted">
            <Link
              href={signInHref(pathname, "#responses")}
              className="focus-ring rounded font-semibold text-tc-text underline decoration-tc-border-strong underline-offset-4 hover:text-tc-primary hover:decoration-tc-primary"
            >
              Sign in to respond
            </Link>{" "}
            — reading responses is open to everyone.
          </p>
        ) : (
          <div className="h-6" aria-hidden="true" />
        )}
      </div>

      <div aria-busy={status === "loading"}>
        {status === "loading" && (
          <p className="flex items-center gap-2 py-6 text-sm text-tc-text-light">
            <Loader2 size={16} aria-hidden="true" className="animate-spin" />
            Loading responses…
          </p>
        )}

        {status === "error" && (
          <div className="flex flex-wrap items-center gap-3 py-6">
            <FormMessage tone="error">Couldn&apos;t load responses.</FormMessage>
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
          <p className="py-6 text-sm text-tc-text-light">No responses yet. Start the conversation.</p>
        )}

        {status === "ready" && comments.length > 0 && (
          <ol className="divide-y divide-tc-border">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </ol>
        )}

        {status === "ready" && commentCount > comments.length && (
          <p className="pt-4 text-xs text-tc-text-light">Showing the {comments.length} most recent responses.</p>
        )}
      </div>
    </section>
  );
}
