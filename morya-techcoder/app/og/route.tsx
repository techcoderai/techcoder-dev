import { renderOgCard } from "./og-card";

/** Site-wide default share image. Rendered once at build time. */
export const dynamic = "force-static";

export async function GET() {
  return renderOgCard({
    eyebrow: "Technology publication",
    title: "Technology knowledge you can trust.",
    description:
      "In-depth articles, hands-on guides, and honest reviews across programming, AI, technology, and gadgets.",
    meta: ["Programming", "AI", "Technology", "Gadgets"],
  });
}
