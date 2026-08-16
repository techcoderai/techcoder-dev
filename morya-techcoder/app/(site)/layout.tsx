import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MotionProvider from "@/components/ui/MotionProvider";

/**
 * Layout for the public-facing site (home, blog, future tools). Lives in the
 * `(site)` route group so it does NOT wrap the Keystatic admin UI at
 * `/keystatic`, which needs a clean, full-screen canvas of its own.
 *
 * The `(site)` folder name is a route group — it organizes files without
 * adding a URL segment, so routes stay `/` and `/blog/...`.
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MotionProvider>
      <div className="relative flex min-h-screen flex-col">
        {/* Global ambient background. Static gradients only — see `.ambient-glow`
            in globals.css for the (desktop-only, opacity-only) motion. */}
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        >
          <div className="absolute inset-0 grid-overlay opacity-60" />
          <div className="absolute inset-0 ambient-glow" />
        </div>

        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </div>
    </MotionProvider>
  );
}
