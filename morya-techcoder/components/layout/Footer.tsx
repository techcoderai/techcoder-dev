import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { categoryHref } from "@/lib/categories";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/", label: "Home" },
      { href: "/blog", label: "All Articles" },
      { href: categoryHref("Programming"), label: "Programming" },
      { href: categoryHref("AI"), label: "Artificial Intelligence" },
      { href: categoryHref("Technology"), label: "Technology" },
    ],
  },
  {
    title: "Discover",
    links: [
      { href: categoryHref("Reviews"), label: "Reviews" },
      { href: categoryHref("Guides"), label: "Buying Guides" },
      { href: "/#topics", label: "All Topics" },
      { href: "/#newsletter", label: "Newsletter" },
    ],
  },
  {
    title: "Team TechCoder",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
];

/**
 * Always-dark footer band (independent of the light/dark theme toggle) — a
 * soft charcoal rather than true black, so it reads as premium, not harsh.
 * The closing CTA (`FinalCTA`) floats a card over its top edge via a
 * negative bottom margin, so the padding-top here clears that overlap.
 */
export default function Footer() {
  return (
    <footer className="relative z-0 border-t border-white/[0.06] bg-[#18181B] pt-20 sm:pt-28 md:pt-36 text-white">
      <div className="container-wide mx-auto px-4 sm:px-6 md:px-8 pb-10 md:pb-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2 max-w-sm">
            <Link href="/" className="focus-ring rounded-lg inline-flex items-center gap-2.5 mb-5 group">
              <Image src="/icon.png" alt="TechCoder" width={34} height={34} className="rounded-xl" />
              <span className="font-heading text-lg font-bold tracking-tight text-white">
                Tech<span className="text-tc-primary">Coder</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/50 max-w-xs">
              A technology publication with in-depth articles, hands-on guides, and honest
              reviews across programming, AI, and the gadgets you use every day.
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35 mb-4">
                {col.title}
              </h4>
              <nav className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="focus-ring group inline-flex items-center gap-1 text-sm text-white/65 hover:text-tc-primary-light transition-colors duration-200 w-fit"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-[opacity,transform] duration-[var(--tc-dur)]"
                    />
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-3">
          <p className="text-xs text-white/35">
            Copyright &copy; {new Date().getFullYear()} techcoder.tech | All rights reserved.
          </p>
          <nav className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="focus-ring rounded text-xs text-white/45 hover:text-tc-primary-light transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="focus-ring rounded text-xs text-white/45 hover:text-tc-primary-light transition-colors duration-200"
            >
              Terms & Conditions
            </Link>
          </nav>
          <p className="text-xs text-white/35 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            New articles every week
          </p>
        </div>
      </div>
    </footer>
  );
}

