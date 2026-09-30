# Contributing — Branches, PRs, and CI

## Repository layout

The Git repository root is `techcoder-dev/`. The Next.js app lives in the
`morya-techcoder/` subfolder, so run every `npm` command from there. CI config
lives at the repo root in `.github/workflows/`.

## Workflow

1. Update `main`: `git checkout main && git pull`.
2. Create a branch named `techcoder-<short-topic>`, matching existing branches
   (`techcoder-mobile-ui-improvements`, `techcoder-documentation`):
   ```bash
   git checkout -b techcoder-newsletter-unsubscribe
   ```
3. Make your change. Keep one topic per branch.
4. Run the checks locally (from `morya-techcoder/`):
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```
5. Push and open a Pull Request against `main` on GitHub.
6. CI must pass and the PR must be reviewed before merging.

Never push directly to `main`.

## What CI checks

`.github/workflows/ci.yml` runs on every PR and every push to `main`:

| Step | Command | Catches |
| --- | --- | --- |
| Lint | `npm run lint` | ESLint errors (warnings don't fail the build) |
| Typecheck | `npm run typecheck` | TypeScript errors, including route param types |
| Build | `npm run build` | Broken MDX, bad frontmatter that crashes rendering, failing static pages |

The build step is the important one. A post with broken MDX only fails when
it is compiled, and that happens during `next build`.

There are no automated tests yet. Say in the PR how you checked your change
by hand (pages visited, light/dark mode, mobile width).

## PR checklist

- [ ] `lint`, `typecheck`, and `build` pass locally.
- [ ] Checked on a phone-width viewport. The UI is mobile-first; see [mobile-first.md](./mobile-first.md).
- [ ] Checked in both light and dark theme.
- [ ] No hardcoded colors, categories, or site URLs.
- [ ] New images use `/content/blog/<post-slug>/<file>` paths.
- [ ] Docs updated if you changed behavior, structure, or conventions.
- [ ] New env vars added to `.env.example` with a comment.
- [ ] New third-party embed? Its origin is added to the CSP in `next.config.ts`.

## Commit messages

See [conventions.md](./conventions.md#commit-hygiene).
