"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { categoryHref } from "@/lib/categories";
import ThemeToggle from "@/components/ui/ThemeToggle";

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
          "flex items-center justify-between gap-2 w-full max-w-[1180px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled
            ? "mt-3 h-14 px-3 sm:px-4 glass-strong"
            : "mt-5 h-16 px-4 sm:px-5 border border-transparent"
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="focus-ring rounded-full flex items-center gap-2.5 group shrink-0"
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

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center gap-1.5">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus-ring flex items-center justify-center w-9 h-9 rounded-full border border-tc-border text-tc-text hover:border-tc-primary transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
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
            <nav className="flex flex-col gap-1.5 pt-28 px-6" onClick={(e) => e.stopPropagation()}>
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
                    className="focus-ring flex items-center justify-between w-full py-4 px-5 text-lg font-medium text-tc-text rounded-2xl card-surface"
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
