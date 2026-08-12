import { Quote } from "lucide-react";

/**
 * An attributed pull quote — someone said this, and it carries weight.
 *
 * Distinct from a plain Markdown `>` blockquote, which stays the right tool for
 * quoting documentation, error output, or your own earlier point. Use this when
 * the source is a person and the attribution matters.
 *
 * MDX usage:
 *   <PullQuote author="Kelsey Hightower" role="Distinguished Engineer">
 *   Kubernetes is a platform for building platforms.
 *   </PullQuote>
 */
export default function PullQuote({
  author,
  role,
  children,
}: {
  author?: string;
  role?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="my-8 border-l-2 border-tc-primary pl-5 sm:pl-6">
      <Quote
        size={20}
        className="mb-2 text-tc-primary/40"
        aria-hidden="true"
      />
      <blockquote className="!m-0 !border-0 !bg-transparent !p-0">
        <div className="!text-[1.0625rem] font-medium leading-relaxed text-tc-text sm:!text-lg [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p]:!not-italic [&_p]:!text-tc-text">
          {children}
        </div>
      </blockquote>
      {author && (
        <figcaption className="mt-3 text-sm text-tc-text-light">
          <span className="font-semibold text-tc-text-muted">{author}</span>
          {role && <span> — {role}</span>}
        </figcaption>
      )}
    </figure>
  );
}
