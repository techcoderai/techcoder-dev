import type { ComponentProps, ReactNode } from "react";
import { slugify } from "@/lib/utils";
import HeadingLink from "@/components/ui/HeadingLink";
import CodeBlock from "@/components/ui/CodeBlock";
import MdxImage from "@/components/mdx/MdxImage";
import Callout from "@/components/mdx/Callout";
import YouTube from "@/components/mdx/YouTube";
import Tweet from "@/components/mdx/Tweet";
import { Steps, Step } from "@/components/mdx/Steps";
import { InfoCards, InfoCard } from "@/components/mdx/InfoCard";
import { FileTree, Folder, File } from "@/components/mdx/FileTree";
import Terminal from "@/components/mdx/Terminal";
import Badge from "@/components/mdx/Badge";
import { Tabs, Tab } from "@/components/mdx/Tabs";
import Table from "@/components/mdx/Table";
import CodeFile from "@/components/mdx/CodeFile";
import { TLDR, KeyTakeaway, ProductionInsight } from "@/components/mdx/Editorial";
import Verdict from "@/components/mdx/Verdict";
import { ProsCons, Pro, Con } from "@/components/mdx/ProsCons";
import Comparison from "@/components/mdx/Comparison";
import PullQuote from "@/components/mdx/PullQuote";
import RelatedArticles from "@/components/mdx/RelatedArticles";
import { Recommendations, Recommendation } from "@/components/mdx/Recommendations";
import { GitHubRepo, CodePen, Sandbox, LinkCard } from "@/components/mdx/Embeds";

/** Recursively pulls the plain text out of MDX heading children for slug ids. */
function getNodeText(node: ReactNode): string {
  if (node == null || node === false) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join("");
  if (typeof node === "object" && "props" in node) {
    return getNodeText(
      (node as { props?: { children?: ReactNode } }).props?.children
    );
  }
  return "";
}

/** Renders an `h2`/`h3` with a slug id and a hover "copy link" anchor. */
function heading(Tag: "h2" | "h3") {
  const Heading = ({ children }: { children?: ReactNode }) => {
    const id = slugify(getNodeText(children));
    return (
      <Tag id={id} className="group scroll-mt-28">
        {children}
        <HeadingLink id={id} />
      </Tag>
    );
  };
  Heading.displayName = `MDX${Tag}`;
  return Heading;
}

/**
 * The single map of MDX tags → React components used to render every article.
 *
 * Three groups live here:
 *   1. HTML element overrides (img, h2, h3, pre, table) — style raw markdown.
 *   2. Editorial components (TLDR, Verdict, ProsCons, …) — the blocks that give
 *      a TechCoder article its voice. Each has a specific editorial job.
 *   3. Structural components (Steps, Tabs, FileTree, …) — reusable building
 *      blocks for explaining things.
 *
 * Every key here that authors should reach for is also registered in
 * `content/keystatic-components.tsx`, so the "+" menu in the editor and this
 * map stay in step. Keeping the map in one file (instead of inside the data
 * loader) means the content pipeline stays: loader.ts = data,
 * mdx-components.tsx = presentation.
 */
export const mdxComponents = {
  // --- HTML element overrides ---
  img: (props: ComponentProps<"img">) => (
    <MdxImage
      src={typeof props.src === "string" ? props.src : ""}
      alt={props.alt}
      title={props.title}
      width={typeof props.width === "number" ? props.width : undefined}
      height={typeof props.height === "number" ? props.height : undefined}
    />
  ),
  h2: heading("h2"),
  h3: heading("h3"),
  pre: (props: ComponentProps<"pre">) => <CodeBlock {...props} />,
  // Markdown tables scroll inside a focusable region rather than being made
  // `display: block`, which would cost them their semantics.
  table: (props: ComponentProps<"table">) => (
    <div className="tc-table-scroll" role="region" tabIndex={0} aria-label="Table">
      <table {...props} />
    </div>
  ),

  // --- TechCoder editorial components ---
  TLDR,
  KeyTakeaway,
  ProductionInsight,
  Verdict,
  ProsCons,
  Pro,
  Con,
  Comparison,
  PullQuote,
  RelatedArticles,
  Recommendations,
  Recommendation,
  Callout,

  // --- Embeds ---
  YouTube,
  Tweet,
  GitHubRepo,
  CodePen,
  Sandbox,
  LinkCard,

  // --- Structural building blocks ---
  Image: MdxImage,
  Steps,
  Step,
  InfoCards,
  InfoCard,
  FileTree,
  Folder,
  File,
  Terminal,
  CodeFile,
  Badge,
  Tabs,
  Tab,
  Table,
};
