import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Supabase Auth is called from the browser (sign-in, session refresh).
const supabaseOrigin = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin : "";
  } catch {
    return "";
  }
})();

/**
 * Static (nonce-free) CSP. A nonce-based policy would force every page into
 * dynamic rendering and give up SSG, so inline scripts (theme bootstrap,
 * JSON-LD, Next's own bootstrap) are allowed via 'unsafe-inline' instead.
 *
 * Third-party origins, and what needs them:
 *   frame-src  — YouTube / CodePen / CodeSandbox / StackBlitz embeds (components/mdx)
 *   img-src    — https: for react-tweet media (pbs.twimg.com) and remote MDX images
 *   media-src  — video.twimg.com for tweet videos
 *   script-src — va.vercel-scripts.com serves the Vercel Analytics debug script in dev
 *   connect-src — the Supabase project (NEXT_PUBLIC_SUPABASE_URL) for reader auth
 *
 * Only applied in production: dev needs 'unsafe-eval' and HMR websockets, and
 * the Keystatic editor (dev only) loads its own resources.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "media-src 'self' https://video.twimg.com",
  `connect-src 'self'${supabaseOrigin ? ` ${supabaseOrigin}` : ""}`,
  "frame-src https://www.youtube-nocookie.com https://codepen.io https://codesandbox.io https://stackblitz.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  ...(isDev ? [] : [{ key: "Content-Security-Policy", value: contentSecurityPolicy }]),
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  poweredByHeader: false,
  // Engagement API routes validate slugs against content/loader.ts at runtime.
  outputFileTracingIncludes: {
    "/api/articles/**": ["./content/posts/**/*", "./content/authors/**/*"],
  },
  images: {
    formats: ["image/webp"],
    qualities: [75],
    minimumCacheTTL: 604800,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
