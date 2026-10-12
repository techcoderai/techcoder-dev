"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useEngagement } from "@/components/engagement/EngagementProvider";
import UserAvatar from "@/components/ui/UserAvatar";
import type { CommentView } from "@/types/engagement";

const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const absolute = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" });

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["week", 604_800],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

function timeAgo(iso: string): string {
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000;
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
  }
  return "just now";
}

type Confirming = "delete" | "report" | "remove" | null;

const CONFIRM_COPY: Record<Exclude<Confirming, null>, { prompt: string; action: string; pending: string }> = {
  delete: { prompt: "Delete your response?", action: "Delete", pending: "Deleting…" },
  report: { prompt: "Report this response to the moderators?", action: "Report", pending: "Reporting…" },
  remove: { prompt: "Remove this response for everyone?", action: "Remove", pending: "Removing…" },
};

const linkButton =
  "focus-ring rounded text-xs font-medium text-tc-text-light transition-colors duration-[var(--tc-dur)] hover:text-tc-text disabled:opacity-60";

export default function CommentItem({ comment }: { comment: CommentView }) {
  const { status: authStatus } = useAuth();
  const { canModerate, removeComment, reportComment } = useEngagement();
  const [confirming, setConfirming] = useState<Confirming>(null);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<{ tone: "error" | "info"; text: string } | null>(null);
  const [reported, setReported] = useState(false);

  const signedIn = authStatus === "signed-in";
  const canDelete = comment.isOwn;
  const canRemove = !comment.isOwn && canModerate;
  const canReport = signedIn && !comment.isOwn && !reported;

  const confirm = async () => {
    if (!confirming || pending) return;
    setPending(true);
    setNotice(null);
    const result = confirming === "report" ? await reportComment(comment.id) : await removeComment(comment.id);
    setPending(false);
    // Successful delete/remove unmounts this item.
    if (!result.ok) {
      setNotice({ tone: "error", text: result.error });
    } else if (confirming === "report") {
      setReported(true);
      setNotice({ tone: "info", text: "Thanks — a moderator will take a look." });
    }
    setConfirming(null);
  };

  return (
    <li className="py-5">
      <article aria-label={`Response from ${comment.author.name}`}>
        <header className="flex items-center gap-2.5">
          <UserAvatar name={comment.author.name} src={comment.author.avatarUrl} size={28} />
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 text-sm">
            <span className="truncate font-semibold text-tc-text">{comment.author.name}</span>
            <time dateTime={comment.createdAt} title={absolute.format(new Date(comment.createdAt))} className="text-xs text-tc-text-light">
              {timeAgo(comment.createdAt)}
            </time>
          </div>
        </header>

        {/* Rendered as plain text — React escapes it; no HTML or links are interpreted. */}
        <p className="mt-2.5 whitespace-pre-line break-words text-[15px] leading-relaxed text-tc-text-muted">
          {comment.body}
        </p>

        {(canDelete || canRemove || canReport || notice) && (
          <div className="mt-2.5 flex min-h-6 flex-wrap items-center gap-x-4 gap-y-1">
            {confirming ? (
              <>
                <span className="text-xs text-tc-text-muted">{CONFIRM_COPY[confirming].prompt}</span>
                <button
                  type="button"
                  onClick={confirm}
                  disabled={pending}
                  aria-busy={pending}
                  className={`${linkButton} text-tc-accent hover:text-tc-accent`}
                >
                  {pending ? CONFIRM_COPY[confirming].pending : CONFIRM_COPY[confirming].action}
                </button>
                <button type="button" onClick={() => setConfirming(null)} disabled={pending} className={linkButton}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                {canDelete && (
                  <button type="button" onClick={() => setConfirming("delete")} className={linkButton}>
                    Delete
                  </button>
                )}
                {canRemove && (
                  <button type="button" onClick={() => setConfirming("remove")} className={linkButton}>
                    Remove
                  </button>
                )}
                {canReport && (
                  <button type="button" onClick={() => setConfirming("report")} className={linkButton}>
                    Report
                  </button>
                )}
              </>
            )}
            <span
              aria-live="polite"
              className={`text-xs empty:hidden ${notice?.tone === "error" ? "text-tc-accent" : "text-tc-text-muted"}`}
            >
              {notice?.text}
            </span>
          </div>
        )}
      </article>
    </li>
  );
}
