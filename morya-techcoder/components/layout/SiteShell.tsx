import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import SpotlightCursor from "@/components/ui/SpotlightCursor";
import { ReadingChromeProvider } from "@/components/reading/ReadingChromeProvider";

/**
 * Public-site chrome: ambient background, Navbar, Footer, and scroll helpers.
 *
 * Shared by `app/(site)/layout.tsx` and `app/not-found.tsx`. The root 404
 * renders under the root layout only (outside the `(site)` group), so it
 * wraps itself in this shell to keep the site navigation.
 *
 * ReadingLayer (Framer Motion) is intentionally NOT here — it mounts only from
 * `blog/[slug]/layout.tsx` so homepage/list routes never download that chunk.
 */
export default function SiteShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReadingChromeProvider>
      <div className="relative flex min-h-screen flex-col overflow-x-clip">
        {/* Global ambient background */}
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        >
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
