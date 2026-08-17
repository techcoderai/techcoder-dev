"use client";

import { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, ChevronLeft, List, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { categoryHref } from "@/lib/categories";
import ThemeToggle from "@/components/ui/ThemeToggle";
import NavLinks from "@/components/layout/NavLinks";
import { useReadingChrome } from "@/components/reading/ReadingChromeProvider";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Articles" },
  { href: categoryHref("Programming"), label: "Programming" },
  { href: categoryHref("AI"), label: "AI" },
  { href: categoryHref("Technology"), label: "Technology" },
  { href: categoryHref("Reviews"), label: "Reviews" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { chrome, setSheetOpen } = useReadingChrome();

  // On an article, once the hero scrolls away the mobile navbar morphs into a
  // reading toolbar: back · fading title · contents · share.
  const reading = scrolled && !!chrome;

  const shareArticle = useCallback(async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: chrome?.title, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      /* user dismissed the share sheet, or the API is unavailable */
    }
  }, [chrome]);

  /**
   * A single threshold, not a continuous calculation: the bar has exactly two
   * shapes and crosses between them once. Reading `scrollY` is deferred to rAF
   * so a fast scroll can't force a layout read per event, and `setScrolled`
   * with an unchanged boolean is a no-op in React — so this renders twice per
   * page visit at most.
   */
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      setScrolled(window.scrollY > 72);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-3 sm:px-6">
      <nav
        className={cn(
          // `backdrop-filter` is deliberately absent from the transition list —
          // animating a blur is expensive, and it's imperceptible arriving with
          // the background fade.
          "flex items-center justify-between gap-2 w-full max-w-[1180px] rounded-full transition-[height,margin,padding,background-color,border-color,box-shadow] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          // Mobile-first: a leaner bar that reclaims vertical space for content,
          // scaling back up to the roomier desktop bar at sm+.
          scrolled
            ? "nav-shell-scrolled mt-2.5 h-12 px-3 shadow-[var(--tc-shadow-md)] sm:mt-3 sm:h-14 sm:px-4"
            : "mt-3 h-14 px-4 border border-transparent sm:mt-5 sm:h-16 sm:px-5"
        )}
      >
        {/* Left group — logo, plus back + fading title in mobile reading mode */}
        <div className="flex min-w-0 flex-1 items-center gap-2 lg:flex-none">
          {/* Back — mobile reading toolbar only */}
          {reading && chrome && (
            <Link
              href={chrome.backHref}
              aria-label="Back to articles"
              className="press focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-tc-border text-tc-text hover:border-tc-primary transition-colors duration-200 lg:hidden"
            >
              <ChevronLeft size={19} />
            </Link>
          )}

          {/* Logo (scales down on scroll; hidden on mobile while reading) */}
          <div
            className={cn(
              "shrink-0 transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              scrolled && "scale-[0.94]",
              reading && "max-lg:hidden"
            )}
          >
            <Link
              href="/"
              className="nav-logo nav-logo-enter focus-ring flex items-center gap-2.5 rounded-full"
              onClick={() => setMenuOpen(false)}
            >
              <span className="relative flex items-center justify-center">
                <span className="nav-logo-halo absolute inset-0 rounded-xl bg-tc-primary/20 blur-md" />
                <Image
                  src="/icon.png"
                  alt="TechCoder"
                  width={34}
                  height={34}
                  className="nav-logo-mark relative rounded-xl"
                />
              </span>
              <span className="font-heading text-[17px] font-bold tracking-tight text-tc-text">
                Tech<span className="text-gradient nav-logo-word">Coder</span>
              </span>
            </Link>
          </div>

          {/* Article title — fades into the navbar while reading (mobile) */}
          {reading && chrome && (
            <span
              key={chrome.title}
              className="nav-title-enter min-w-0 flex-1 truncate font-heading text-[15px] font-semibold text-tc-text lg:hidden"
            >
              {chrome.title}
            </span>
          )}
        </div>

        {/* Desktop links — shared pill, magnetic hover, center underline */}
        <NavLinks links={navLinks} pathname={pathname} />

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <ThemeToggle />
          <Link
            href="/blog"
            className="btn-primary nav-cta focus-ring px-5 py-2.5 text-[13.5px]"
          >
            Read Articles
            <ArrowUpRight size={15} className="nav-cta-arrow" />
          </Link>
        </div>

        {/* Mobile controls — 44px thumb-friendly tap targets */}
        <div className="flex lg:hidden items-center gap-1 shrink-0">
          {reading ? (
            <>
              <button
                onClick={() => setSheetOpen(true)}
                aria-label="Open contents"
                className="press focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-tc-border text-tc-text hover:border-tc-primary transition-colors duration-200"
              >
                <List size={18} />
              </button>
              <button
                onClick={shareArticle}
                aria-label="Share article"
                className="press focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-tc-border text-tc-text hover:border-tc-primary transition-colors duration-200"
              >
                <Share2 size={17} />
              </button>
              <ThemeToggle />
            </>
          ) : (
            <>
              <ThemeToggle />
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="press focus-ring flex items-center justify-center w-11 h-11 rounded-full border border-tc-border text-tc-text hover:border-tc-primary transition-colors duration-200"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={19} /> : <Menu size={19} />}
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="mobile-menu-enter lg:hidden fixed inset-0 top-0 z-40 bg-tc-bg/95"
          onClick={() => setMenuOpen(false)}
        >
          <nav className="flex flex-col gap-1.5 pt-24 px-5" onClick={(e) => e.stopPropagation()}>
            {navLinks.map((link, i) => (
              <div
                key={link.href}
                className="mobile-menu-item"
                style={{ animationDelay: `${50 + i * 50}ms` }}
              >
                <Link
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className="press focus-ring flex items-center justify-between w-full py-4 px-5 text-lg font-medium text-tc-text rounded-2xl card-surface"
                >
                  {link.label}
                  <ArrowUpRight size={18} className="text-tc-text-muted" />
                </Link>
              </div>
            ))}
            <div
              className="mobile-menu-item"
              style={{ animationDelay: `${50 + navLinks.length * 50}ms` }}
            >
              <Link
                href="/blog"
                onClick={() => setMenuOpen(false)}
                className="btn-primary focus-ring mt-3 w-full py-4 text-base"
              >
                Read Articles
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
