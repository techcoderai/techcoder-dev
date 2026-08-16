# TechCoder Engineering Phases

## Project

TechCoder is a long-term technology publication and future technology ecosystem.

Stack:
- Next.js
- React
- TypeScript
- Tailwind CSS v4
- MDX
- Keystatic
- Git-based content

Architecture principles:
- Server Components by default
- Client Components only when interaction genuinely requires them
- MDX/Git remains the content source of truth
- No database unless a future requirement justifies it
- Solo-founder maintainability
- Performance and SEO are first-class requirements
- Mobile-first UX
- Premium editorial design
- Avoid unnecessary abstractions and dependencies

## Phase 1 — COMPLETE

Phase 1 addressed:
- Keystatic production security
- Homepage hero LCP visibility
- Blog server-rendered article markup
- Tailwind CSS layer ordering
- MagicBorderCard server boundary
- PostSummary/PostDetail separation
- Reading progress using rAF + scaleX
- Centralized reduced-motion behavior
- Ambient background optimization
- Removal of fabricated testimonials/counts
- Date normalization

Verified:
- TypeScript PASS
- Next build PASS
- Articles remain SSG
- Keystatic production routes return 404
- Keystatic works in development
- Blog contains 8 server-rendered article elements
- Raw markdown body leakage reduced to 0
- Reading progress uses transform/scaleX
- Reduced motion works
- Console has 0 errors on tested routes

Known pre-existing issue:
- ThemeToggle ESLint error existed before Phase 1 and was not modified.

IMPORTANT:
These are local Lighthouse measurements and must not be treated as field data.

## Current priority

The biggest remaining performance concern is the ARTICLE route.

Priority:
1. Article JavaScript/client boundaries
2. Framer Motion loading
3. Article LCP
4. TBT
5. Scroll/reading interactions
6. Accessibility
7. Mobile UX
8. Premium motion refinement

Do NOT optimize blindly.

Measure before and after meaningful changes.

## Phase isolation rules

Every AI agent MUST:

1. Read this file first.
2. Read `ARCHITECTURE_AUDIT_REPORT.md`.
3. Work only on the explicitly requested phase.
4. Do not modify unrelated files.
5. Do not redesign the website during performance work.
6. Do not install dependencies unless explicitly justified.
7. Do not rewrite working architecture.
8. Run typecheck/build after implementation.
9. Report exact files changed.
10. Report verification results.
11. Update this file only with the phase status/results.

If a new issue is discovered outside the current phase:
- document it
- do not fix it unless it blocks the current phase

## Phase status

Phase 1: COMPLETE

Phase 2A: ARTICLE RUNTIME AUDIT — NOT STARTED

Phase 2B: ARTICLE PERFORMANCE — NOT STARTED

Phase 2C: BLOG STATIC/SEARCH ARCHITECTURE — NOT STARTED

Phase 3: MOBILE UX — NOT STARTED

Phase 4: PREMIUM MOTION SYSTEM — NOT STARTED

Phase 5: SEO/accessibility polish — NOT STARTED

Phase 6: Cleanup — NOT STARTED

## Rule

Never combine phases unless explicitly requested.
