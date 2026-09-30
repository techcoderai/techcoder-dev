import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Shared renderer for generated social preview images (`/og`, `/og/blog/[slug]`).
 *
 * Rendered by Satori, which supports a subset of CSS: every element with more
 * than one child needs `display: flex`, and fonts must be TTF/OTF/WOFF (not
 * WOFF2), hence the `.woff` files in `assets/fonts/`.
 */

export const OG_SIZE = { width: 1200, height: 630 };

/** Brand tokens, mirrored from the dark theme in `app/globals.css`. */
const COLORS = {
  bg: "#090909",
  surface: "#121212",
  primary: "#F97316",
  accent: "#FB7185",
  text: "#FFFFFF",
  muted: "rgba(255, 255, 255, 0.62)",
  border: "rgba(255, 255, 255, 0.12)",
};

const FONT_DIR = join(process.cwd(), "assets", "fonts");

async function loadFonts() {
  const [heading, body, bodyMedium] = await Promise.all([
    readFile(join(FONT_DIR, "montserrat-latin-700-normal.woff")),
    readFile(join(FONT_DIR, "dm-sans-latin-400-normal.woff")),
    readFile(join(FONT_DIR, "dm-sans-latin-500-normal.woff")),
  ]);
  return [
    { name: "Montserrat", data: heading, weight: 700 as const, style: "normal" as const },
    { name: "DM Sans", data: body, weight: 400 as const, style: "normal" as const },
    { name: "DM Sans", data: bodyMedium, weight: 500 as const, style: "normal" as const },
  ];
}

/** Shrinks long titles so they stay within three lines. */
function titleSize(title: string): number {
  if (title.length > 90) return 52;
  if (title.length > 60) return 60;
  return 70;
}

export type OgCardProps = {
  /** Small uppercase label above the title (category, "Technology publication"). */
  eyebrow: string;
  title: string;
  /** Secondary line under the title (excerpt / tagline). Optional. */
  description?: string;
  /** Items in the footer row, e.g. author, date, reading time. */
  meta?: string[];
};

export async function renderOgCard({ eyebrow, title, description, meta = [] }: OgCardProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: COLORS.bg,
          backgroundImage: `radial-gradient(circle at 88% 8%, rgba(249, 115, 22, 0.35), transparent 45%), radial-gradient(circle at 0% 100%, rgba(251, 113, 133, 0.18), transparent 40%)`,
          fontFamily: "DM Sans",
          color: COLORS.text,
        }}
      >
        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
              fontFamily: "Montserrat",
              fontSize: 26,
              color: COLORS.text,
            }}
          >
            T
          </div>
          <div style={{ fontFamily: "Montserrat", fontSize: 30, letterSpacing: -0.5 }}>
            TechCoder
          </div>
        </div>

        {/* Headline block */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: COLORS.primary,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Montserrat",
              fontSize: titleSize(title),
              lineHeight: 1.12,
              letterSpacing: -1.5,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                display: "flex",
                fontSize: 28,
                lineHeight: 1.4,
                color: COLORS.muted,
                maxWidth: 940,
                // Satori honours line clamping via these two properties.
                overflow: "hidden",
                lineClamp: 2,
              }}
            >
              {description}
            </div>
          )}
        </div>

        {/* Meta row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            paddingTop: 28,
            borderTop: `1px solid ${COLORS.border}`,
            fontSize: 24,
            fontWeight: 500,
            color: COLORS.muted,
          }}
        >
          {meta.map((item, i) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 18 }}>
              {i > 0 && (
                <div style={{ width: 6, height: 6, borderRadius: 3, background: COLORS.primary }} />
              )}
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await loadFonts() }
  );
}
