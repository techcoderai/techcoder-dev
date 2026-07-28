import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import SpotlightCursor from "@/components/ui/SpotlightCursor";
import { ReadingChromeProvider } from "@/components/reading/ReadingChromeProvider";

/**
 * Layout for the public-facing site (home, blog, future tools). Lives in the
 * `(site)` route group so it does NOT wrap the Keystatic admin UI at
 * `/keystatic`, which needs a clean, full-screen canvas of its own.
 *
 * The `(site)` folder name is a route group — it organizes files without
 * adding a URL segment, so routes stay `/` and `/blog/...`.
 *
 * ReadingLayer (Framer Motion) is intentionally NOT here — it mounts only from
 * `blog/[slug]/layout.tsx` so homepage/list routes never download that chunk.
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReadingChromeProvider>
      <div className="relative flex min-h-screen flex-col">
        {/* Global ambient background */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 grid-overlay opacity-60" />
          <div className="ambient-orb ambient-orb-primary absolute -top-40 right-[-10%] h-[640px] w-[640px] opacity-50 animate-pulse-glow" />
          <div className="ambient-orb ambient-orb-soft absolute top-[40%] left-[-15%] h-[520px] w-[520px] opacity-35 animate-float-slow" />
        </div>

        <SpotlightCursor />
        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </div>

      <ScrollToTop />
    </ReadingChromeProvider>
  );
}
