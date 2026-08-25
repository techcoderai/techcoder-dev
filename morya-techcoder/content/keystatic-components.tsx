import React from "react";
import { fields } from "@keystatic/core";
import { wrapper, block, repeating, inline } from "@keystatic/core/content-components";
import {
  Info,
  Youtube,
  Twitter,
  TerminalSquare,
  LayoutPanelTop,
  Zap,
  Key,
  ServerCog,
  Award,
  Scale,
  Quote,
  Newspaper,
  Trophy,
  Github,
  Codepen,
  Boxes,
  Link2,
  ListOrdered,
  Columns2,
  FileCode2,
  Tag,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

/**
 * Custom components authors can insert inside the Keystatic MDX editor.
 *
 * The KEY of each entry is the JSX tag name written into the `.mdx` file
 * (e.g. `Callout` -> `<Callout ...>`). Those same names are mapped back to real
 * React components in `content/mdx-components.tsx`, so what you insert in the
 * editor is exactly what renders on the site. Adding a component means touching
 * both files — the map there is the render contract, this file is the authoring
 * contract.
 *
 * Three kinds are used below:
 *   - `wrapper`   — has rich editable content inside it (a Callout's body).
 *   - `block`     — configured entirely by fields (a YouTube embed).
 *   - `repeating` — a parent whose children are a fixed set of components
 *                   (Steps → Step), which is what lets the editor offer
 *                   "add another step" instead of asking for raw MDX.
 *
 * `ContentView` is only the *editor* preview. It is intentionally plain inline
 * CSS: the editor runs outside the site's Tailwind build, and a preview that
 * pretends to be pixel-perfect ages badly. The real rendering lives in
 * `components/mdx/`.
 */

/** Shared editor-preview styling, so previews read consistently in the CMS. */
const previewPanel = (accent: string): React.CSSProperties => ({
  borderLeft: `3px solid ${accent}`,
  background: `${accent}12`,
  padding: "10px 14px",
  borderRadius: 10,
});

const previewLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  opacity: 0.7,
  marginBottom: 4,
};

const previewCard: React.CSSProperties = {
  border: "1px solid #e4e4e7",
  borderRadius: 10,
  padding: "10px 14px",
  fontSize: 13,
};

const ORANGE = "#F97316";
const BLUE = "#3B82F6";
const VIOLET = "#8B5CF6";
const SLATE = "#64748B";

/** Renders an editor preview with a fixed editorial label above the content. */
function LabelledPreview({
  label,
  accent,
  title,
  children,
}: {
  label: string;
  accent: string;
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <div style={previewPanel(accent)}>
      <div style={{ ...previewLabel, color: accent }}>{label}</div>
      {title && <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>}
      {children}
    </div>
  );
}

export const mdxEditorComponents = {
  // ---------------------------------------------------------------------
  // Editorial blocks — each has a specific job in a TechCoder article.
  // ---------------------------------------------------------------------

  TLDR: wrapper({
    label: "TL;DR",
    description: "Skimmable summary of the article. Put it under the intro.",
    icon: <Zap />,
    schema: {},
    ContentView: ({ children }) => (
      <LabelledPreview label="TL;DR" accent={ORANGE}>
        {children}
      </LabelledPreview>
    ),
  }),

  KeyTakeaway: wrapper({
    label: "Key takeaway",
    description: "The one idea a reader should leave this section with.",
    icon: <Key />,
    schema: {
      title: fields.text({
        label: "Headline",
        description: "Optional. A short statement of the takeaway.",
      }),
    },
    ContentView: ({ value, children }) => (
      <LabelledPreview label="Key takeaway" accent={BLUE} title={value.title}>
        {children}
      </LabelledPreview>
    ),
  }),

  ProductionInsight: wrapper({
    label: "Production insight",
    description: "What this actually behaves like at scale — cost, limits, gotchas.",
    icon: <ServerCog />,
    schema: {
      title: fields.text({ label: "Headline", description: "Optional." }),
    },
    ContentView: ({ value, children }) => (
      <LabelledPreview label="Production insight" accent={SLATE} title={value.title}>
        {children}
      </LabelledPreview>
    ),
  }),

  Verdict: wrapper({
    label: "TechCoder verdict",
    description: "The closing judgement of a review. One per article, at the end.",
    icon: <Award />,
    schema: {
      product: fields.text({
        label: "Product",
        description: "What is being judged, e.g. “Framework 13”.",
      }),
      bestFor: fields.text({
        label: "Best for",
        description: "Who should buy it, in a few words.",
      }),
      avoidIf: fields.text({
        label: "Avoid if",
        description: "The dealbreaker, in a few words.",
      }),
    },
    ContentView: ({ value, children }) => (
      <LabelledPreview
        label="TechCoder verdict"
        accent={VIOLET}
        title={value.product || undefined}
      >
        {children}
      </LabelledPreview>
    ),
  }),

  ProsCons: repeating({
    label: "Pros / Cons",
    description: "Balanced strengths and weaknesses. Add Pro and Con items inside.",
    icon: <Columns2 />,
    children: ["Pro", "Con"],
    schema: {},
    ContentView: ({ children }) => (
      <div style={previewCard}>
        <div style={{ ...previewLabel, color: SLATE }}>Pros / Cons</div>
        {children}
      </div>
    ),
  }),

  Pro: wrapper({
    label: "Pro",
    description: "A single strength.",
    icon: <ThumbsUp />,
    forSpecificLocations: true,
    schema: {},
    ContentView: ({ children }) => (
      <div style={{ borderLeft: `3px solid #10B981`, paddingLeft: 10 }}>
        {children}
      </div>
    ),
  }),

  Con: wrapper({
    label: "Con",
    description: "A single weakness.",
    icon: <ThumbsDown />,
    forSpecificLocations: true,
    schema: {},
    ContentView: ({ children }) => (
      <div style={{ borderLeft: `3px solid #F43F5E`, paddingLeft: 10 }}>
        {children}
      </div>
    ),
  }),

  Comparison: block({
    label: "Comparison table",
    description:
      "Structured side-by-side table. Use a Markdown table instead when cells contain prose.",
    icon: <Scale />,
    schema: {
      label: fields.text({
        label: "First column heading",
        description: "Names the attribute column, e.g. “Feature”.",
        defaultValue: "Feature",
      }),
      columns: fields.array(fields.text({ label: "Column heading" }), {
        label: "Columns",
        description: "The things being compared, e.g. “Next.js”, “Remix”.",
        itemLabel: (props) => props.value || "Column",
        validation: { length: { min: 1 } },
      }),
      rows: fields.array(
        fields.object({
          label: fields.text({ label: "Attribute" }),
          values: fields.array(fields.text({ label: "Value" }), {
            label: "Values",
            description: "One per column, in the same order as the columns above.",
            itemLabel: (props) => props.value || "Value",
          }),
        }),
        {
          label: "Rows",
          itemLabel: (props) => props.fields.label.value || "Row",
          validation: { length: { min: 1 } },
        }
      ),
      caption: fields.text({ label: "Caption", description: "Optional." }),
    },
    ContentView: ({ value }) => (
      <div style={previewCard}>
        <div style={{ ...previewLabel, color: SLATE }}>Comparison</div>
        {value.columns.join(" · ") || "No columns yet"}
        <div style={{ opacity: 0.6, marginTop: 4 }}>
          {value.rows.length} row{value.rows.length === 1 ? "" : "s"}
        </div>
      </div>
    ),
  }),

  PullQuote: wrapper({
    label: "Pull quote",
    description: "An attributed quote from a person. Use “>” for plain quotations.",
    icon: <Quote />,
    schema: {
      author: fields.text({ label: "Author" }),
      role: fields.text({ label: "Role / affiliation", description: "Optional." }),
    },
    ContentView: ({ value, children }) => (
      <div style={{ borderLeft: `3px solid ${ORANGE}`, paddingLeft: 14 }}>
        <div style={{ fontStyle: "italic" }}>{children}</div>
        {value.author && (
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
            — {value.author}
            {value.role ? `, ${value.role}` : ""}
          </div>
        )}
      </div>
    ),
  }),

  RelatedArticles: block({
    label: "Related articles",
    description: "Hand-picked further reading. Titles are pulled in automatically.",
    icon: <Newspaper />,
    schema: {
      title: fields.text({ label: "Heading", defaultValue: "Related reading" }),
      slugs: fields.array(
        fields.relationship({ label: "Article", collection: "posts" }),
        {
          label: "Articles",
          itemLabel: (props) => props.value || "Article",
          validation: { length: { min: 1 } },
        }
      ),
    },
    ContentView: ({ value }) => (
      <div style={previewCard}>
        <div style={{ ...previewLabel, color: SLATE }}>
          {value.title || "Related reading"}
        </div>
        {value.slugs.filter(Boolean).join(", ") || "No articles selected"}
      </div>
    ),
  }),

  Recommendations: repeating({
    label: "Buying guide picks",
    description: "The awarded picks in a buying guide. Add a Recommendation for each.",
    icon: <Trophy />,
    children: ["Recommendation"],
    schema: {},
    ContentView: ({ children }) => (
      <div style={previewCard}>
        <div style={{ ...previewLabel, color: ORANGE }}>Buying guide picks</div>
        {children}
      </div>
    ),
  }),

  Recommendation: wrapper({
    label: "Recommendation",
    description: "One awarded pick. Explain why it won inside.",
    icon: <Trophy />,
    forSpecificLocations: true,
    schema: {
      award: fields.text({
        label: "Award",
        description: "e.g. “Best overall”, “Best budget”, “Best for developers”.",
      }),
      product: fields.text({ label: "Product" }),
      price: fields.text({ label: "Price", description: "As displayed, e.g. “$1,049”." }),
      href: fields.url({ label: "Product link", description: "Optional." }),
      image: fields.image({
        label: "Product image",
        description: "Optional. Square images look best.",
        directory: "public/content/blog",
        publicPath: "/content/blog",
      }),
    },
    ContentView: ({ value, children }) => (
      <div style={{ borderLeft: `3px solid ${ORANGE}`, paddingLeft: 10 }}>
        <strong>
          {value.award ? `${value.award}: ` : ""}
          {value.product}
        </strong>
        {value.price ? ` (${value.price})` : ""}
        <div>{children}</div>
      </div>
    ),
  }),

  Callout: wrapper({
    label: "Callout",
    description: "Note, tip, warning, or danger box.",
    icon: <Info />,
    schema: {
      type: fields.select({
        label: "Type",
        options: [
          { label: "Note — neutral aside", value: "note" },
          { label: "Tip — do it this way", value: "tip" },
          { label: "Warning — easy to get wrong", value: "warning" },
          { label: "Danger — destructive or unsafe", value: "danger" },
        ],
        defaultValue: "note",
      }),
      title: fields.text({
        label: "Title",
        description: "Optional. Defaults to the type name.",
      }),
    },
    ContentView: ({ value, children }) => (
      <LabelledPreview label={value.type} accent={ORANGE} title={value.title}>
        {children}
      </LabelledPreview>
    ),
  }),

  // ---------------------------------------------------------------------
  // Embeds
  // ---------------------------------------------------------------------

  YouTube: block({
    label: "YouTube",
    description: "Embed a YouTube video by its ID.",
    icon: <Youtube />,
    schema: {
      id: fields.text({
        label: "Video ID",
        description: "The part after watch?v= — not the whole URL.",
        validation: { length: { min: 1 } },
      }),
      title: fields.text({
        label: "Title",
        description: "Optional, but improves accessibility.",
      }),
    },
    ContentView: ({ value }) => (
      <div style={previewCard}>▶ YouTube: {value.id || "(no id)"}</div>
    ),
  }),

  Tweet: block({
    label: "Post on X",
    description: "Embed a post by its numeric ID.",
    icon: <Twitter />,
    schema: {
      id: fields.text({
        label: "Post ID",
        description: "The number at the end of the URL.",
        validation: { length: { min: 1 } },
      }),
    },
    ContentView: ({ value }) => (
      <div style={previewCard}>𝕏 Post: {value.id || "(no id)"}</div>
    ),
  }),

  GitHubRepo: block({
    label: "GitHub repository",
    description: "A card linking to the repository this article discusses.",
    icon: <Github />,
    schema: {
      owner: fields.text({
        label: "Owner",
        description: "The user or org, e.g. “vercel”.",
        validation: { length: { min: 1 } },
      }),
      repo: fields.text({
        label: "Repository",
        description: "e.g. “next.js”.",
        validation: { length: { min: 1 } },
      }),
      description: fields.text({ label: "Description", description: "Optional." }),
    },
    ContentView: ({ value }) => (
      <div style={previewCard}>
        {value.owner || "owner"}/{value.repo || "repo"}
      </div>
    ),
  }),

  CodePen: block({
    label: "CodePen",
    description: "Embed a pen, showing the rendered result by default.",
    icon: <Codepen />,
    schema: {
      user: fields.text({ label: "Author username", validation: { length: { min: 1 } } }),
      id: fields.text({ label: "Pen ID", validation: { length: { min: 1 } } }),
      title: fields.text({ label: "Title", description: "Optional." }),
      tab: fields.select({
        label: "Default tab",
        options: [
          { label: "Result", value: "result" },
          { label: "HTML", value: "html" },
          { label: "CSS", value: "css" },
          { label: "JavaScript", value: "js" },
        ],
        defaultValue: "result",
      }),
    },
    ContentView: ({ value }) => (
      <div style={previewCard}>CodePen: {value.id || "(no id)"}</div>
    ),
  }),

  Sandbox: block({
    label: "Code sandbox",
    description: "An editable, runnable project on CodeSandbox or StackBlitz.",
    icon: <Boxes />,
    schema: {
      provider: fields.select({
        label: "Provider",
        options: [
          { label: "CodeSandbox", value: "codesandbox" },
          { label: "StackBlitz", value: "stackblitz" },
        ],
        defaultValue: "codesandbox",
      }),
      id: fields.text({
        label: "Sandbox ID",
        description: "The identifier in the sandbox URL.",
        validation: { length: { min: 1 } },
      }),
      title: fields.text({ label: "Title", description: "Optional." }),
    },
    ContentView: ({ value }) => (
      <div style={previewCard}>
        {value.provider}: {value.id || "(no id)"}
      </div>
    ),
  }),

  LinkCard: block({
    label: "Link card",
    description: "A bookmark card for a source worth crediting — a spec, paper, or post.",
    icon: <Link2 />,
    schema: {
      href: fields.url({ label: "URL", validation: { isRequired: true } }),
      title: fields.text({ label: "Title" }),
      description: fields.text({ label: "Description", multiline: true }),
      site: fields.text({
        label: "Publisher",
        description: "Optional, e.g. “opencontainers.org”.",
      }),
    },
    ContentView: ({ value }) => (
      <div style={previewCard}>{value.title || value.href || "Link"}</div>
    ),
  }),

  // ---------------------------------------------------------------------
  // Structural building blocks
  // ---------------------------------------------------------------------

  Steps: repeating({
    label: "Steps",
    description: "A numbered walkthrough. Add a Step for each instruction.",
    icon: <ListOrdered />,
    children: ["Step"],
    schema: {},
    ContentView: ({ children }) => (
      <div style={previewCard}>
        <div style={{ ...previewLabel, color: SLATE }}>Steps</div>
        {children}
      </div>
    ),
  }),

  Step: wrapper({
    label: "Step",
    description: "One instruction in a walkthrough.",
    icon: <ListOrdered />,
    forSpecificLocations: true,
    schema: {
      title: fields.text({ label: "Step title" }),
    },
    ContentView: ({ value, children }) => (
      <div style={{ borderLeft: `3px solid ${ORANGE}`, paddingLeft: 10 }}>
        <strong>{value.title}</strong>
        <div>{children}</div>
      </div>
    ),
  }),

  Tabs: repeating({
    label: "Tabs",
    description: "Alternative versions of the same thing, e.g. npm vs pnpm.",
    icon: <Columns2 />,
    children: ["Tab"],
    schema: {},
    ContentView: ({ children }) => (
      <div style={previewCard}>
        <div style={{ ...previewLabel, color: SLATE }}>Tabs</div>
        {children}
      </div>
    ),
  }),

  Tab: wrapper({
    label: "Tab",
    description: "One tab. The label is what the reader clicks.",
    icon: <Columns2 />,
    forSpecificLocations: true,
    schema: {
      label: fields.text({
        label: "Tab label",
        validation: { length: { min: 1 } },
      }),
    },
    ContentView: ({ value, children }) => (
      <div style={previewCard}>
        <strong>{value.label}</strong>
        <div>{children}</div>
      </div>
    ),
  }),

  InfoCards: repeating({
    label: "Info cards",
    description: "A two-column grid of short highlights.",
    icon: <LayoutPanelTop />,
    children: ["InfoCard"],
    schema: {},
    ContentView: ({ children }) => (
      <div style={previewCard}>
        <div style={{ ...previewLabel, color: SLATE }}>Info cards</div>
        {children}
      </div>
    ),
  }),

  InfoCard: wrapper({
    label: "Info card",
    description: "One highlight card.",
    icon: <LayoutPanelTop />,
    forSpecificLocations: true,
    schema: {
      title: fields.text({ label: "Title" }),
      icon: fields.text({
        label: "Icon",
        description: "A lucide icon name, e.g. “Zap” or “BookOpen”. Optional.",
      }),
      href: fields.text({ label: "Link URL", description: "Optional." }),
    },
    ContentView: ({ value, children }) => (
      <div style={previewCard}>
        <strong>{value.title}</strong>
        <div>{children}</div>
      </div>
    ),
  }),

  Terminal: wrapper({
    label: "Terminal",
    description: "A terminal window. Prefix command lines with “$ ”.",
    icon: <TerminalSquare />,
    schema: {
      title: fields.text({ label: "Window title", defaultValue: "bash" }),
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

  CodeFile: wrapper({
    label: "Code with filename",
    description: "Adds a filename bar above a code block. Insert the code inside.",
    icon: <FileCode2 />,
    schema: {
      name: fields.text({
        label: "File path",
        description: "e.g. “app/page.tsx”.",
        validation: { length: { min: 1 } },
      }),
    },
    ContentView: ({ value, children }) => (
      <div style={previewCard}>
        <div style={{ fontFamily: "monospace", opacity: 0.7, marginBottom: 6 }}>
          {value.name}
        </div>
        {children}
      </div>
    ),
  }),

  Badge: inline({
    label: "Badge",
    description: "A small inline label, e.g. “Beta”.",
    icon: <Tag />,
    schema: {
      text: fields.text({ label: "Label", validation: { length: { min: 1 } } }),
      variant: fields.select({
        label: "Style",
        options: [
          { label: "Default", value: "default" },
          { label: "Primary", value: "primary" },
          { label: "Success", value: "success" },
          { label: "Warning", value: "warning" },
          { label: "Danger", value: "danger" },
        ],
        defaultValue: "default",
      }),
    },
    ContentView: ({ value }) => (
      <span
        style={{
          border: "1px solid #e4e4e7",
          borderRadius: 999,
          padding: "1px 8px",
          fontSize: 12,
        }}
      >
        {value.text}
      </span>
    ),
  }),

  // Not registered on purpose: FileTree (arbitrarily nested folders don't map
  // to Keystatic's flat children model) and Table (Markdown tables now render
  // natively — see content/compile.ts). Both stay available in hand-written
  // MDX; see docs/mdx-components.md.
};
