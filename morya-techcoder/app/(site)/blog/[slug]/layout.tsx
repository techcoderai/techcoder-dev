import { JetBrains_Mono } from "next/font/google";
import ReadingLayer from "@/components/reading/ReadingLayer";
import { EngagementProvider } from "@/components/engagement/EngagementProvider";
import "./article.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

/**
 * Article route layout — scopes JetBrains Mono + immersive reading chrome
 * (progress / floating TOC) so Framer Motion never ships on home or list pages.
 * Also hosts the claps/comments island, which loads client-side so the
 * article HTML stays static.
 */
export default async function ArticleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  return (
    <div className={jetbrainsMono.variable}>
      <EngagementProvider slug={slug}>{children}</EngagementProvider>
      {/*
        Outside the article content tree so fixed chrome isn't trapped in
        main's stacking context. Self-gates on reading context.
      */}
      <ReadingLayer />
    </div>
  );
}
