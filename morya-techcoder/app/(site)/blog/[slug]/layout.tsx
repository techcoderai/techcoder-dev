import { JetBrains_Mono } from "next/font/google";
import ReadingLayer from "@/components/reading/ReadingLayer";
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
 */
export default function ArticleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={jetbrainsMono.variable}>
      {children}
      {/*
        Outside the article content tree so fixed chrome isn't trapped in
        main's stacking context. Self-gates on reading context.
      */}
      <ReadingLayer />
    </div>
  );
}
