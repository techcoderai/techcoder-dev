import React from "react";
import { fields } from "@keystatic/core";
import { wrapper, block } from "@keystatic/core/content-components";
import {
  Info,
  Youtube,
  Twitter,
  TerminalSquare,
  LayoutPanelTop,
} from "lucide-react";
import { categoryOptions } from "@/lib/categories";

/**
 * Custom components that authors can insert inside the Keystatic MDX editor.
 *
 * The KEY of each entry is the JSX tag name written into the `.mdx` file
 * (e.g. `Callout` -> `<Callout ...>`). Those same names are mapped back to
 * real React components for rendering in `content/mdx-components.tsx`, so what
 * you insert in the editor is exactly what renders on the site.
 *
 * `categoryOptions` is imported only to keep the reference used; it documents
 * that category lives in the frontmatter schema, not inside the body.
 */
void categoryOptions;

export const mdxEditorComponents = {
  Callout: wrapper({
    label: "Callout",
    description: "Colored note / tip / warning / danger box.",
    icon: <Info />,
    schema: {
      type: fields.select({
        label: "Type",
        options: [
          { label: "Note", value: "note" },
          { label: "Tip", value: "tip" },
          { label: "Warning", value: "warning" },
          { label: "Danger", value: "danger" },
        ],
        defaultValue: "note",
      }),
      title: fields.text({ label: "Title (optional)" }),
    },
    ContentView: ({ children }) => (
      <div
        style={{
          borderLeft: "3px solid #F97316",
          background: "rgba(249,115,22,0.06)",
          padding: "8px 12px",
          borderRadius: 8,
        }}
      >
        {children}
      </div>
    ),
  }),

  Terminal: wrapper({
    label: "Terminal",
    description: "Terminal window. Prefix command lines with `$ `.",
    icon: <TerminalSquare />,
    schema: {
      title: fields.text({ label: "Title", defaultValue: "bash" }),
    },
    ContentView: ({ children }) => (
      <div
        style={{
          background: "#0B0B0D",
          color: "#e5e5e5",
          padding: 12,
          borderRadius: 8,
          fontFamily: "monospace",
          fontSize: 13,
        }}
      >
        {children}
      </div>
    ),
  }),

  InfoCard: wrapper({
    label: "Info card",
    description: "Highlight card with a title and optional icon / link.",
    icon: <LayoutPanelTop />,
    schema: {
      title: fields.text({ label: "Title" }),
      icon: fields.text({
        label: "Icon (lucide name, optional)",
        description: 'e.g. "Zap", "BookOpen"',
      }),
      href: fields.text({ label: "Link URL (optional)" }),
    },
    ContentView: ({ value, children }) => (
      <div style={{ border: "1px solid #e5e5e5", padding: 12, borderRadius: 10 }}>
        <strong>{value.title}</strong>
        <div>{children}</div>
      </div>
    ),
  }),

  YouTube: block({
    label: "YouTube",
    description: "Embed a YouTube video by its ID.",
    icon: <Youtube />,
    schema: {
      id: fields.text({ label: "Video ID", description: "The part after watch?v=" }),
      title: fields.text({ label: "Title (optional)" }),
    },
    ContentView: ({ value }) => (
      <div style={{ padding: 12, background: "#f4f4f5", borderRadius: 8 }}>
        ▶ YouTube: {value.id || "(no id)"}
      </div>
    ),
  }),

  Tweet: block({
    label: "Tweet / X",
    description: "Embed a tweet by its numeric ID.",
    icon: <Twitter />,
    schema: {
      id: fields.text({ label: "Tweet ID", description: "Number at the end of the URL" }),
    },
    ContentView: ({ value }) => (
      <div style={{ padding: 12, background: "#f4f4f5", borderRadius: 8 }}>
        𝕏 Tweet: {value.id || "(no id)"}
      </div>
    ),
  }),
};
