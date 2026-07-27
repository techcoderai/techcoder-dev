"use client";

import { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X, ArrowUpRight, ChevronLeft, List, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { categoryHref } from "@/lib/categories";
import ThemeToggle from "@/components/ui/ThemeToggle";
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
  const reduceMotion = useReducedMotion();
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
          "flex items-center justify-between gap-2 w-full max-w-[1180px] rounded-full transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
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
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={cn(
              "shrink-0 transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              scrolled && "scale-[0.94]",
              reading && "max-lg:hidden"
            )}
          >
            <Link
              href="/"
              className="focus-ring group flex items-center gap-2.5 rounded-full"
              onClick={() => setMenuOpen(false)}
            >
              <span className="relative flex items-center justify-center">
                <span className="absolute inset-0 rounded-xl bg-tc-primary/25 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Image
                  src="/icon.png"
                  alt="TechCoder"
                  width={34}
                  height={34}
                  className="relative rounded-xl transition-transform duration-300 group-hover:scale-105"
                />
              </span>
              <span className="font-heading text-[17px] font-bold tracking-tight text-tc-text">
                Tech<span className="text-gradient">Coder</span>
              </span>
            </Link>
          </motion.div>

          {/* Article title — fades into the navbar while reading (mobile) */}
          {reading && chrome && (
            <motion.span
              key={chrome.title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="min-w-0 flex-1 truncate font-heading text-[15px] font-semibold text-tc-text lg:hidden"
            >
              {chrome.title}
            </motion.span>
          )}
        </div>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-0.5 mx-auto">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "focus-ring relative rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors duration-200",
                  active ? "text-tc-text" : "text-tc-text-muted hover:text-tc-text"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute left-4 right-4 -bottom-0.5 h-px bg-gradient-to-r from-tc-primary to-tc-primary-light rounded-full origin-left transition-transform duration-300",
                    active ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <ThemeToggle />
          <Link href="/blog" className="btn-primary focus-ring px-5 py-2.5 text-[13.5px]">
            Read Articles
            <ArrowUpRight size={15} />
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
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 top-0 z-40 bg-tc-bg/95 backdrop-blur-2xl"
            onClick={() => setMenuOpen(false)}
          >
            <nav className="flex flex-col gap-1.5 pt-24 px-5" onClick={(e) => e.stopPropagation()}>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="press focus-ring flex items-center justify-between w-full py-4 px-5 text-lg font-medium text-tc-text rounded-2xl card-surface"
                  >
                    {link.label}
                    <ArrowUpRight size={18} className="text-tc-text-muted" />
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + navLinks.length * 0.05 }}
              >
                <Link
                  href="/blog"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary focus-ring mt-3 w-full py-4 text-base"
                >
                  Read Articles
                  <ArrowUpRight size={17} />
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
