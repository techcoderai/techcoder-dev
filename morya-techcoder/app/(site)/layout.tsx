import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
    <div className="relative flex min-h-screen flex-col">
      {/* Global ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-60" />
        <div
          className="absolute -top-40 right-[-10%] w-[640px] h-[640px] rounded-full opacity-50 blur-[130px] animate-pulse-glow"
          style={{ background: "var(--tc-glow)" }}
        />
        <div
          className="absolute top-[40%] left-[-15%] w-[520px] h-[520px] rounded-full opacity-35 blur-[140px] animate-float-slow"
          style={{ background: "var(--tc-glow-soft)" }}
        />
      </div>

      <Navbar />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
