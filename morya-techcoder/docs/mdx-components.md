# MDX Components Reference

These components can be used in any `.mdx` post. They are defined in
`components/mdx/` and registered for rendering in `content/mdx-components.tsx`.
Almost all of them are also insertable from the Keystatic **+** menu — the few
that aren't are marked **(code only)**.

Standard Markdown works everywhere: headings, **bold**, _italic_, ~~strikethrough~~,
lists, `inline code`, links, blockquotes, images, horizontal rules, and tables
are all styled for you. Tables, strikethrough, and task lists come from
`remark-gfm` (see `content/compile.ts`).

## Choosing a component

Every component here has an editorial job. If you only want text to *look*
different, use Markdown and CSS instead — a component that means nothing makes
articles harder to read, not easier.

| You want to… | Use |
| --- | --- |
| Summarise the article up front | `TLDR` |
| State the one idea of a section | `KeyTakeaway` |
| Share what happens at scale | `ProductionInsight` |
| Close a review with a judgement | `Verdict` |
| Weigh something up | `ProsCons` |
| Put options side by side | `Comparison`, or a Markdown table |
| Recommend products in a guide | `Recommendations` |
| Quote a person | `PullQuote` |
| Warn, tip, or note something | `Callout` |
| Point at further reading | `RelatedArticles` |

---

# Editorial components

## TLDR

Skimmable summary of the article. Place it directly under the intro.

```mdx
<TLDR>
- Container runtimes are standardised by the OCI, not by Docker.
- Kubernetes talks to containerd directly.
</TLDR>
```

---

## KeyTakeaway

The single idea a reader should leave a section with. One or two per article —
more than that and it stops meaning anything.

```mdx
<KeyTakeaway title="Standards outlive tools">
Betting on the OCI spec rather than one vendor's CLI is what keeps images
portable across runtimes.
</KeyTakeaway>
```

- `title`: optional headline.

---

## ProductionInsight

What the subject actually behaves like in production — the gotcha, the cost, the
scaling limit that a getting-started guide skips.

```mdx
<ProductionInsight title="Cold starts dominate at low traffic">
Below roughly ten requests a minute, most of the latency you measure is the
runtime waking up, not your code.
</ProductionInsight>
```

---

## Verdict

The closing judgement of a review. One per article, at the end.

```mdx
<Verdict product="Framework 13" bestFor="Tinkerers" avoidIf="You need all-day battery">
The most repairable laptop you can buy, and it no longer asks you to sacrifice
much to get there.
</Verdict>
```

- `product`, `bestFor`, `avoidIf`: all optional.

The numeric **score is not a prop here** — it lives in the `review` frontmatter
block, because the article sidebar and the review structured data need it too.
See [blog-system.md](./blog-system.md#reviews).

---

## ProsCons

Strengths and weaknesses, sorted into two columns automatically. Order doesn't
matter.

```mdx
<ProsCons>
<Pro>Genuinely repairable — every part has a QR code to its spare.</Pro>
<Con>Battery life still trails the competition by two hours.</Con>
</ProsCons>
```

---

## Comparison

A structured comparison table: the things being compared across the columns, the
attributes down the rows.

```mdx
<Comparison
  label="Capability"
  columns={["Next.js", "Remix"]}
  rows={[
    { label: "Routing", values: ["App Router", "Nested routes"] },
    { label: "Data loading", values: ["Server Components", "Loaders"] }
  ]}
  caption="As of Next.js 16."
/>
```

Reach for a plain Markdown table instead when cells contain prose. Use this when
the content is a grid of short values you might want to restyle later without
touching the article.

Rows with fewer values than columns are padded with `—`, so a half-filled table
still lines up with its headers.

---

## Recommendations

The backbone of a buying guide: awarded picks with a price and a reason.

```mdx
<Recommendations>
<Recommendation award="Best overall" product="Framework 13" price="$1,049" href="https://frame.work">
The only laptop here you can still repair in five years.
</Recommendation>
</Recommendations>
```

- `award`: the superlative it won, e.g. "Best budget".
- `image`: optional product shot, uploaded through the editor.

---

## PullQuote

An attributed quote from a person.

```mdx
<PullQuote author="Kelsey Hightower" role="Distinguished Engineer">
Kubernetes is a platform for building platforms.
</PullQuote>
```

Use a plain Markdown `>` blockquote for quoting documentation, error output, or
your own earlier point — this one is for when the *source* matters.

---

## RelatedArticles

Hand-picked further reading, mid-article.

```mdx
<RelatedArticles slugs={["hello-world", "css-container-queries-guide"]} />
```

Only the slugs are stored. Titles, categories, and reading times are resolved
from the content loader at build time, so retitling an article never leaves a
stale label behind, and a slug that stops resolving is silently dropped rather
than rendered as a dead link.

This complements the automatic "Keep reading" rail at the end of every article,
which is same-category and algorithmic.

---

## Callout

Colored box for notes, tips, warnings, and danger alerts.

```mdx
<Callout type="tip" title="Pro tip">
Use the `cn()` helper to merge Tailwind classes safely.
</Callout>
```

- `type`: `"note"` | `"tip"` | `"warning"` | `"danger"` (default `note`)
- `title`: optional; defaults to the type label.

---

# Media and embeds

## Image

Optimized image via `next/image`. Plain Markdown images render through this same
component, so both forms behave identically.

```mdx
![System diagram](/content/blog/diagram.png "Fig 1. The data flow.")
<Image src="/content/blog/diagram.png" alt="System diagram" caption="Fig 1." />
```

The Markdown *title* — the quoted string after the URL — becomes the caption.
That's what the editor's image dialog writes, so a caption added in Keystatic
renders here without a second syntax.

Intrinsic width and height are read from the file at compile time
(`content/rehype-image-size.ts`), so images reserve the right space and don't
shift the page as they load. You never set dimensions by hand.

Store images in `public/content/blog/`. The editor puts them there for you.

---

## YouTube

```mdx
<YouTube id="dQw4w9WgXcQ" title="Intro to Next.js" />
```

`id` is the part after `watch?v=` in the URL.

---

## Tweet / X

Server-rendered, so no client script is needed.

```mdx
<Tweet id="1799212345678901234" />
```

`id` is the number at the end of the URL:
`https://x.com/vercel/status/1799212345678901234`.

---

## GitHubRepo

A card for the repository an article discusses.

```mdx
<GitHubRepo owner="vercel" repo="next.js" description="The React framework." />
```

Deliberately static. Fetching live star counts would mean either a build-time
GitHub API dependency or client-side JavaScript on every article, for a number
that is decoration rather than information.

---

## CodePen

```mdx
<CodePen user="chriscoyier" id="XWKqLbq" title="Scroll-driven timeline" />
```

- `tab`: `"result"` (default) | `"html"` | `"css"` | `"js"`

---

## Sandbox

A runnable project on CodeSandbox or StackBlitz.

```mdx
<Sandbox provider="stackblitz" id="vitejs-vite-abc123" title="Vite demo" />
```

- `provider`: `"codesandbox"` (default) | `"stackblitz"`

---

## LinkCard

A bookmark card for a source worth crediting — a spec, a paper, an announcement.

```mdx
<LinkCard
  href="https://opencontainers.org"
  title="Open Container Initiative"
  site="opencontainers.org"
  description="The spec behind portable container images."
/>
```

Use an inline link when the link isn't the point.

---

# Code

## Fenced code blocks

Every fenced block is highlighted with Shiki at build time and gets a copy
button, a language label, and auto-collapse when it's very tall. Just write:

````mdx
```ts
export function add(a: number, b: number) {
  return a + b;
}
```
````

Always set the language — it drives both the highlighting and the label.

**Line highlighting and inline filenames** work in hand-written MDX through the
fence's meta string:

````mdx
```ts title="lib/utils.ts" {2,5-7}
```
````

Keystatic's code block only stores a language, so use `CodeFile` (below) when
authoring in the editor.

---

## CodeFile

Puts a filename bar above a code block, so a reader knows *where* the snippet
goes. This is how you add a filename from the Keystatic editor.

````mdx
<CodeFile name="app/page.tsx">
```tsx
export default function Page() {
  return <h1>Hi</h1>;
}
```
</CodeFile>
````

---

## Terminal

A terminal window. Prefix command lines with `$ ` to get a green prompt.

```mdx
<Terminal title="bash">
$ npm install
added 242 packages in 2s
</Terminal>
```

---

# Structural components

## Steps

A numbered, step-by-step guide.

```mdx
<Steps>
<Step title="Install dependencies">
Run `npm install`.
</Step>
<Step title="Start the dev server">
Run `npm run dev`.
</Step>
</Steps>
```

---

## InfoCards

A grid of highlight cards.

```mdx
<InfoCards>
<InfoCard title="Fast" icon="Zap">Ships static HTML.</InfoCard>
<InfoCard title="Docs" icon="BookOpen" href="/blog">Read the guide.</InfoCard>
</InfoCards>
```

- `icon`: any [lucide-react](https://lucide.dev/icons) icon name (optional).
- `href`: makes the card a link (optional).

---

## Tabs

Alternative versions of the same thing.

````mdx
<Tabs>
<Tab label="npm">
```bash
npm install
```
</Tab>
<Tab label="pnpm">
```bash
pnpm add
```
</Tab>
</Tabs>
````

---

## Badge

A small inline label.

```mdx
Status: <Badge variant="success">Stable</Badge>
Status: <Badge variant="success" text="Stable" />
```

- `variant`: `"default"` | `"primary"` | `"success"` | `"warning"` | `"danger"`

The editor writes the `text` form, because inline components there carry fields
rather than nested content. Both render identically.

---

## Tables

Write them as Markdown — they're wrapped in a horizontally scrollable, focusable
region automatically, so they stay readable on a phone and keep their semantics
for screen readers:

```mdx
| Feature | Support |
| ------- | ------- |
| MDX     | Yes     |
| Tables  | Yes     |
```

For a grid of short values you may want to restyle later, use
[`Comparison`](#comparison) instead.

---

## FileTree **(code only)**

Visualize a folder structure. Not in the editor's insert menu, because
arbitrarily nested folders don't map to Keystatic's flat children model.

```mdx
<FileTree>
<Folder name="app">
<File name="page.tsx" />
<Folder name="blog">
<File name="page.tsx" />
</Folder>
</Folder>
</FileTree>
```

---

## Table **(code only)**

An explicit scroll container. Rarely needed now that Markdown tables get one
automatically; kept for hand-written MDX that wraps unusual content.

---

## Adding your own component

Before you do: does it have an editorial job that Markdown can't express? If it
only changes appearance, style it in `article.css` instead.

1. Create it in `components/mdx/MyThing.tsx`.
2. Import and add it to the map in `content/mdx-components.tsx`:
   ```ts
   import MyThing from "@/components/mdx/MyThing";
   export const mdxComponents = { /* … */, MyThing };
   ```
3. Make it insertable by adding a definition in
   `content/keystatic-components.tsx` using `wrapper` / `block` / `repeating` /
   `inline` from `@keystatic/core/content-components`. The key must match the
   name used in step 2.
4. Document it here.

**Non-string props are supported** — numbers, arrays, and objects are written by
Keystatic as JSX expressions (`rows={[…]}`). This only works because
`content/compile.ts` sets `blockJS: false`; `next-mdx-remote` otherwise strips
every attribute expression and your props arrive `undefined`.
