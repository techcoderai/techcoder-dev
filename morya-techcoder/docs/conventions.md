# Conventions & Coding Standards

Practical rules that keep this codebase consistent and easy to maintain solo.

## Naming

| Thing | Convention | Example |
| --- | --- | --- |
| Component files | `PascalCase.tsx` | `MagicBorderCard.tsx` |
| Hooks | `useX.ts` (camelCase) | `useReadingProgress.ts` |
| Utilities / logic | `camelCase.ts` | `posts.ts`, `categories.ts` |
| Types file | `camelCase.ts` in `types/` | `blog.ts` |
| Blog posts | `kebab-case.mdx` | `nextjs-16-tailwind-v4.mdx` |
| MDX components | `PascalCase` tags | `<Callout>`, `<YouTube>` |
| CSS tokens | `--tc-*` | `--tc-primary`, `--tc-text-muted` |

## Imports

- Always use the `@/` alias (maps to the project root), not deep relative paths:
  `import { cn } from "@/lib/utils";`
- Import shared types from `@/types/blog`.
- Import category data from `@/lib/categories` (never re-declare categories).

## Server vs client components

- **Default to Server Components.** They can read content and render MDX.
- Add `"use client"` **only** when you need state, effects, or browser APIs
  (search box, theme toggle, scroll effects).
- Never import `content/loader.ts` (it's `server-only`) into a client component.
  Instead, load data in a server component and pass it down as props.

## Styling

- Use Tailwind utilities plus the `--tc-*` design tokens from `app/globals.css`.
- **Never hardcode colors** like `bg-white` or `text-gray-500` — use tokens
  (`bg-tc-bg-card`, `text-tc-text-muted`) so light/dark themes both work.
- Merge conditional classes with `cn()` from `@/lib/utils`.

## Component guidelines

- One responsibility per component. If a component does data-shaping *and*
  rendering, move the logic to `lib/`.
- Keep components reasonably small; extract sub-sections when a file grows past
  ~200 lines.
- Put reusable article building blocks in `components/mdx/`, page sections in
  `components/sections/`, and small shared UI in `components/ui/`.

## Business logic

- Filtering, sorting, and "which posts to show" logic belongs in `lib/posts.ts`,
  not inside components. This keeps it reusable and testable.

## Adding a category

Edit **only** `lib/categories.ts`:

```ts
const CATEGORY_DEFS = {
  Programming: { /* … */ },
  AI: { /* … */ },
  Technology: { /* … */ },
  Reviews: { /* … */ },
  Guides: { /* … */ },
  DevTools: { /* …, comingSoon: true */ },
  DevOps: {                     // 👈 add here
    label: "DevOps",
    short: "DevOps",
    description: "CI/CD, infra, and deployment.",
    icon: "Server",            // a lucide name; register it in lib/category-icons.ts
    badge: "bg-tc-cat-devops-bg text-tc-cat-devops-text border border-tc-cat-devops-border",
    dot: "bg-tc-cat-devops-text",
    accent: "text-tc-cat-devops-text",
    // comingSoon: true,        // optional — announces the topic without a live link
  },
} as const satisfies Record<string, CategoryMeta>;
```

The type, blog filters, card colors, topic grid, and Keystatic dropdown update
automatically. Two follow-ups when adding a topic:

- Add matching `--tc-cat-devops-*` tokens in `app/globals.css` **and** map them in
  the `@theme inline` block so Tailwind generates the utility classes.
- Register the icon name in `lib/category-icons.ts` (keeps `lib/categories.ts`
  framework-agnostic).

## Commit hygiene

- Content commits: `post: <title>` or `content: <what changed>`.
- Code commits: short imperative summary (`fix: …`, `refactor: …`, `feat: …`).
- Never commit with `--no-verify`.
