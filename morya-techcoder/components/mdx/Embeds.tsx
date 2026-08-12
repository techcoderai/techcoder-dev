import { ArrowUpRight, Github, Link2 } from "lucide-react";

/**
 * Embeds that carry editorial weight: the repository an article is about, a
 * runnable sandbox of the code being explained, or a source worth crediting.
 *
 * Each renders a real link even before (or instead of) loading a third-party
 * frame, so an article stays useful if an embed provider disappears.
 */

/**
 * A card for the repository an article discusses.
 *
 * Deliberately static — fetching live star counts would either add a build-time
 * GitHub API dependency or client-side JavaScript to every article, for a
 * number that is decoration rather than information.
 *
 * MDX usage:
 *   <GitHubRepo owner="vercel" repo="next.js" description="The React framework." />
 */
export function GitHubRepo({
  owner,
  repo,
  description,
}: {
  owner?: string;
  repo?: string;
  description?: string;
}) {
  if (!owner || !repo) return null;

  return (
    <a
      href={`https://github.com/${owner}/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring group my-6 flex items-center gap-4 rounded-xl border border-tc-border bg-tc-bg-card p-4 !bg-none transition-[border-color,transform] duration-[var(--tc-dur)] hover:-translate-y-0.5 hover:border-tc-border-strong"
    >
      <Github size={22} className="shrink-0 text-tc-text" aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-sm font-semibold text-tc-text">
          {owner}/{repo}
        </span>
        {description && (
          <span className="mt-0.5 block truncate text-sm text-tc-text-muted">
            {description}
          </span>
        )}
      </span>
      <ArrowUpRight
        size={16}
        className="shrink-0 text-tc-text-light transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  );
}

/**
 * A CodePen embed, defaulting to the rendered result rather than the source —
 * readers who want the code are already reading a code block above it.
 *
 * MDX usage:
 *   <CodePen user="chriscoyier" id="XWKqLbq" title="Scroll-driven timeline" />
 */
export function CodePen({
  user,
  id,
  title = "CodePen embed",
  tab = "result",
  height = 420,
}: {
  user?: string;
  id?: string;
  title?: string;
  tab?: "result" | "html" | "css" | "js";
  height?: number;
}) {
  if (!user || !id) return null;

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-tc-border bg-tc-bg-elevated">
      <iframe
        src={`https://codepen.io/${user}/embed/${id}?default-tab=${tab}`}
        title={title}
        loading="lazy"
        style={{ height }}
        className="w-full"
        allowFullScreen
      />
    </div>
  );
}

const SANDBOX_PROVIDERS = {
  codesandbox: (id: string) => `https://codesandbox.io/embed/${id}?view=preview`,
  stackblitz: (id: string) => `https://stackblitz.com/edit/${id}?embed=1&view=preview`,
} as const;

/**
 * A runnable code sandbox — CodeSandbox or StackBlitz.
 *
 * MDX usage:
 *   <Sandbox provider="stackblitz" id="vitejs-vite-abc123" title="Vite demo" />
 */
export function Sandbox({
  provider = "codesandbox",
  id,
  title = "Interactive code sandbox",
  height = 480,
}: {
  provider?: keyof typeof SANDBOX_PROVIDERS;
  id?: string;
  title?: string;
  height?: number;
}) {
  const buildUrl = SANDBOX_PROVIDERS[provider] ?? SANDBOX_PROVIDERS.codesandbox;
  if (!id) return null;

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-tc-border bg-tc-bg-elevated">
      <iframe
        src={buildUrl(id)}
        title={title}
        loading="lazy"
        style={{ height }}
        className="w-full"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        allowFullScreen
      />
    </div>
  );
}

/**
 * A bookmark card for an external source — a spec, a paper, an announcement.
 * Use it when the link is the point; use an inline link when it isn't.
 *
 * MDX usage:
 *   <LinkCard href="https://opencontainers.org" title="Open Container Initiative"
 *             description="The spec behind portable container images." />
 */
export function LinkCard({
  href,
  title,
  description,
  site,
}: {
  href?: string;
  title?: string;
  description?: string;
  /** Publisher shown as an eyebrow, e.g. "opencontainers.org". */
  site?: string;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring group my-6 flex items-start gap-4 rounded-xl border border-tc-border bg-tc-bg-card p-4 !bg-none transition-[border-color,transform] duration-[var(--tc-dur)] hover:-translate-y-0.5 hover:border-tc-border-strong"
    >
      <Link2
        size={18}
        className="mt-1 shrink-0 text-tc-text-light"
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1">
        {site && (
          <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-tc-text-light">
            {site}
          </span>
        )}
        <span className="mt-0.5 block font-semibold text-tc-text group-hover:text-tc-primary">
          {title || href}
        </span>
        {description && (
          <span className="mt-1 block text-sm leading-relaxed text-tc-text-muted">
            {description}
          </span>
        )}
      </span>
      <ArrowUpRight
        size={16}
        className="mt-1 shrink-0 text-tc-text-light transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  );
}
