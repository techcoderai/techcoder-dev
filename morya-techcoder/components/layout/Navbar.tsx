"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-tc-bg-card/90 backdrop-blur-xl border-b border-gray-200"
          : "bg-transparent"
      )}
    >
      <nav className="container-wide mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 h-16 md:h-[68px]">
        {/* Logo */}
        <Link href="/" className="focus-ring rounded-lg flex items-center gap-2.5 group transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0" onClick={() => setMenuOpen(false)}>
          <Image
            src="/icon.png"
            alt="TechCoder mascot"
            width={36}
            height={36}
            className="rounded-lg transition-transform duration-200 group-hover:scale-105"
          />
          <span className="font-heading text-lg font-extrabold tracking-tight text-tc-text">
            Tech<span className="text-tc-primary">Coder</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring rounded-lg relative px-4 py-2 text-[13px] font-medium text-tc-text-muted hover:text-tc-text transition-colors duration-200 after:absolute after:bottom-1 after:left-4 after:right-4 after:h-[1.5px] after:bg-tc-primary after:rounded-full after:scale-x-0 after:origin-left after:transition-transform after:duration-200 hover:after:scale-x-100"
            >
              {link.label}
            </Link>
          ))}
          <div className="ml-2 mr-3 h-5 w-px bg-tc-border" />
          <Link
            href="/blog"
            className="btn-primary focus-ring px-5 py-2.5 text-[13px]"
          >
            <Sparkles size={13} />
            Read Blog
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="focus-ring md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-tc-bg-elevated active:bg-tc-bg-elevated/60 transition-colors duration-200"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="md:hidden fixed inset-0 top-16 bg-tc-bg-card/[0.97] backdrop-blur-2xl z-40"
            onClick={() => setMenuOpen(false)}
          >
            <nav className="flex flex-col items-center gap-1 pt-8 px-6" onClick={(e) => e.stopPropagation()}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="focus-ring w-full text-center py-3.5 text-lg font-medium text-tc-text hover:text-tc-primary rounded-xl hover:bg-tc-bg-elevated active:bg-tc-bg-elevated/60 transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/blog"
                onClick={() => setMenuOpen(false)}
                className="focus-ring mt-4 w-full text-center py-3.5 text-lg font-bold text-tc-text bg-tc-primary rounded-full hover:bg-tc-primary-dark active:bg-tc-primary-dark/80 transition-all duration-200"
              >
                Read Blog
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
