# MDX Components Reference

These components can be used in any `.mdx` post. They are defined in
`components/mdx/` and registered for rendering in `content/mdx-components.tsx`.
Components marked **(editor)** can also be inserted from the Keystatic **+**
menu; the rest are best written by hand in your code editor.

Standard Markdown works everywhere too: headings, **bold**, _italic_, lists,
`inline code`, links, blockquotes, images, and tables are all styled for you.

---

## Callout **(editor)**

Colored box for notes, tips, warnings, and danger alerts.

```mdx
<Callout type="tip" title="Pro tip">
Use the `cn()` helper to merge Tailwind classes safely.
</Callout>
```

- `type`: `"note"` | `"tip"` | `"warning"` | `"danger"` (default `note`)
- `title`: optional; defaults to the type label.

---

## Image **(editor: use the + → Image menu)**

Optimized image via `next/image`, with an optional caption. Plain Markdown
images (`![alt](/path)`) also work and render through this component.

```mdx
<Image src="/content/blog/diagram.png" alt="System diagram" caption="Fig 1. The data flow." />
```

Store images in `public/content/blog/` and reference them as `/content/blog/...`.

---

## CodeBlock

You don't call this directly — every fenced code block becomes a `CodeBlock`
automatically (with a copy button and expand-on-tall). Just write:

````mdx
```ts
export function add(a: number, b: number) {
  return a + b;
}
```
````

Always add the language after the opening backticks for correct formatting.

---

## Terminal **(editor)**

A terminal window. Prefix command lines with `$ ` to get a green prompt.

```mdx
<Terminal title="bash">
$ npm install
added 242 packages in 2s
</Terminal>
```

---

## YouTube **(editor)**

Responsive, privacy-friendly YouTube embed.

```mdx
<YouTube id="dQw4w9WgXcQ" title="Intro to Next.js" />
```

`id` is the part after `watch?v=` in the URL.

---

## Tweet / X **(editor)**

Server-rendered tweet (no client script needed).

```mdx
<Tweet id="1799212345678901234" />
```

`id` is the number at the end of a tweet URL:
`https://x.com/vercel/status/1799212345678901234`.

---

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

## Info cards **(InfoCard is available in the editor)**

A grid of highlight cards. Wrap multiple `<InfoCard>`s in `<InfoCards>`.

```mdx
<InfoCards>
<InfoCard title="Fast" icon="Zap">Ships static HTML.</InfoCard>
<InfoCard title="Docs" icon="BookOpen" href="/docs">Read the guide.</InfoCard>
</InfoCards>
```

- `icon`: any [lucide-react](https://lucide.dev/icons) icon name (optional).
- `href`: makes the card a link (optional).

---

## File tree

Visualize a folder structure with `<Folder>` and `<File>`.

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

## Tabs

Tabbed content (e.g. npm vs pnpm).

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
```

- `variant`: `"default"` | `"primary"` | `"success"` | `"warning"` | `"danger"`

---

## Table

Native Markdown tables are already styled — just write them:

```mdx
| Feature | Support |
| ------- | ------- |
| MDX     | Yes     |
| Tables  | Yes     |
```

Wrap a wide table in `<Table>…</Table>` only if you want an explicit horizontal
scroll container.

---

## Adding your own component

1. Create it in `components/mdx/MyThing.tsx`.
2. Import and add it to the map in `content/mdx-components.tsx`:
   ```ts
   import MyThing from "@/components/mdx/MyThing";
   export const mdxComponents = { /* … */, MyThing };
   ```
3. (Optional) To make it insertable in the Keystatic editor, add a definition
   in `content/keystatic-components.tsx` using `wrapper`/`block` from
   `@keystatic/core/content-components`.
4. Use `<MyThing />` in any post.
