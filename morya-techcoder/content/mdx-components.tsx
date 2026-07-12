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
 * Two groups live here:
 *   1. HTML element overrides (img, h2, h3, pre) — style raw markdown output.
 *   2. Custom components (Callout, YouTube, …) — the reusable building blocks
 *      authors insert from the Keystatic editor or type by hand in MDX.
 *
 * Keeping this in one file (instead of inside the data loader) means the
 * content pipeline is: loader.ts = data, mdx-components.tsx = presentation.
 */
export const mdxComponents = {
  // --- HTML element overrides ---
  img: (props: ComponentProps<"img">) => (
    <MdxImage src={typeof props.src === "string" ? props.src : ""} alt={props.alt} />
  ),
  h2: heading("h2"),
  h3: heading("h3"),
  pre: ({ children }: { children?: ReactNode }) => <CodeBlock>{children}</CodeBlock>,

  // --- Custom reusable components ---
  Callout,
  Image: MdxImage,
  YouTube,
  Tweet,
  Steps,
  Step,
  InfoCards,
  InfoCard,
  FileTree,
  Folder,
  File,
  Terminal,
  Badge,
  Tabs,
  Tab,
  Table,
};
